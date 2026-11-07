import { strFromU8, Unzip, UnzipInflate } from 'fflate';
import { load } from 'js-yaml';

const MiB = 1024 * 1024;
const maxTotal = 16 * MiB;
const imageType: Record<string, string> = { png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', webp: 'image/webp' };

const crcTable = Uint32Array.from({ length: 256 }, (_, index) => {
  let value = index;
  for (let bit = 0; bit < 8; bit++) value = (value >>> 1) ^ ((value & 1) ? 0xedb88320 : 0);
  return value >>> 0;
});

function archiveRecords(bytes: Uint8Array) {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  let end = bytes.length - 22;
  for (; end >= Math.max(0, bytes.length - 65557); end--) {
    if (view.getUint32(end, true) === 0x06054b50 && end + 22 + view.getUint16(end + 20, true) === bytes.length) break;
  }
  if (end < 0 || view.getUint32(end, true) !== 0x06054b50 ||
      view.getUint16(end + 4, true) !== 0 || view.getUint16(end + 6, true) !== 0 ||
      view.getUint16(end + 8, true) !== view.getUint16(end + 10, true)) {
    throw new Error('ZIP 파일이 끊겼거나 지원하지 않는 분할 형식입니다.');
  }
  const count = view.getUint16(end + 10, true);
  let offset = view.getUint32(end + 16, true);
  const centralSize = view.getUint32(end + 12, true);
  if (!count || count > 100 || offset + centralSize !== end) throw new Error('ZIP 파일 목록을 확인해 주세요.');
  const records = new Map<string, { crc: number; size: number }>();
  let total = 0;
  for (let i = 0; i < count; i++) {
    if (offset + 46 > end || view.getUint32(offset, true) !== 0x02014b50 ||
        (view.getUint16(offset + 8, true) & 1)) throw new Error('ZIP 파일 목록이 손상됐거나 암호화되어 있습니다.');
    const nameLength = view.getUint16(offset + 28, true);
    const next = offset + 46 + nameLength + view.getUint16(offset + 30, true) + view.getUint16(offset + 32, true);
    if (next > end) throw new Error('ZIP 파일 목록이 끊겼습니다.');
    const name = strFromU8(bytes.subarray(offset + 46, offset + 46 + nameLength), !(view.getUint16(offset + 8, true) & 2048));
    const size = view.getUint32(offset + 24, true);
    total += size;
    if (records.has(name) || total > maxTotal) throw new Error('ZIP 파일이 중복되거나 압축 해제 크기가 너무 큽니다.');
    records.set(name, { crc: view.getUint32(offset + 16, true), size });
    offset = next;
  }
  if (offset !== end) throw new Error('ZIP 파일 목록 크기가 맞지 않습니다.');
  return records;
}

export async function readPackage(zip: File) {
  if (!/\.zip$/i.test(zip.name) || !zip.size || zip.size > maxTotal) {
    throw new Error('16 MiB 이하의 ZIP 파일을 선택해 주세요.');
  }
  const bytes = new Uint8Array(await zip.arrayBuffer());
  if (bytes[0] !== 80 || bytes[1] !== 75) throw new Error('ZIP 형식을 확인해 주세요.');
  const records = archiveRecords(bytes);
  const files = new Map<string, Uint8Array<ArrayBuffer>>();
  const names = new Set<string>();
  let entries = 0;
  let completed = 0;
  let started = 0;
  let total = 0;
  const unzip = new Unzip(file => {
    entries++;
    const record = records.get(file.name);
    if (!record) throw new Error('ZIP 내부 파일과 목록이 일치하지 않습니다.');
    if (entries > 100 || /\\|^\/|^[a-z]:|(^|\/)\.\.?($|\/)/i.test(file.name) || names.has(file.name)) {
      throw new Error('ZIP 안의 파일 이름 또는 파일 개수를 확인해 주세요.');
    }
    names.add(file.name);
    if (file.name.startsWith('__MACOSX/') || file.name.split('/').some(part => part.startsWith('.')) ||
        !/\.(md|png|jpe?g|webp)$/i.test(file.name)) return;
    const limit = /\.md$/i.test(file.name) ? 256 * 1024 : 4 * MiB;
    if ((file.originalSize ?? 0) > limit) throw new Error(`${file.name} 파일이 허용 크기를 넘습니다.`);
    started++;
    let size = 0;
    let crc = 0xffffffff;
    const chunks: Uint8Array<ArrayBuffer>[] = [];
    file.ondata = (error, data, final) => {
      if (error) throw new Error('ZIP 압축을 풀지 못했습니다.');
      size += data.length;
      total += data.length;
      if (size > limit || total > maxTotal) {
        file.terminate();
        throw new Error('ZIP을 푼 파일 크기가 허용 범위를 넘습니다.');
      }
      for (const byte of data) crc = crcTable[(crc ^ byte) & 255] ^ (crc >>> 8);
      chunks.push(new Uint8Array(data));
      if (final) {
        if (size !== record.size || ((crc ^ 0xffffffff) >>> 0) !== record.crc) {
          throw new Error('ZIP 내부 파일의 무결성 검사를 통과하지 못했습니다.');
        }
        const combined = new Uint8Array(size);
        let offset = 0;
        for (const chunk of chunks) {
          combined.set(chunk, offset);
          offset += chunk.length;
        }
        files.set(file.name, combined);
        completed++;
      }
    };
    file.start();
  });
  unzip.register(UnzipInflate);
  for (let i = 0; i < bytes.length; i += 1024) {
    unzip.push(bytes.subarray(i, i + 1024), i + 1024 >= bytes.length);
    if (i % (256 * 1024) === 0) await new Promise<void>(resolve => setTimeout(resolve, 0));
  }
  if (entries !== records.size || completed !== started) throw new Error('ZIP 파일이 중간에 끊겼습니다.');
  const manuscripts = [...files.keys()].filter(name => /\/\d{4}-\d{2}-\d{2}-.+\.md$|^\d{4}-\d{2}-\d{2}-.+\.md$/i.test(name));
  if (manuscripts.length !== 1) throw new Error('ZIP에는 날짜로 시작하는 발행용 원고(.md)가 정확히 1개 있어야 합니다.');
  const name = manuscripts[0].split('/').at(-1)!;
  const slug = name.slice(0, -3);
  const date = slug.slice(0, 10);
  let source = new TextDecoder('utf-8', { fatal: true }).decode(files.get(manuscripts[0]));
  const header = source.match(/^---[ \t]*\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n|$)/);
  if (!header) throw new Error('원고 상단에 YAML 메타데이터가 필요합니다.');
  const data = load(header[1]) as { images?: unknown } | null;
  if (!Array.isArray(data?.images) || data.images.length !== 7 ||
      !data.images.every(path => typeof path === 'string') || new Set(data.images).size !== 7) {
    throw new Error('원고의 images 목록에 대표 1장과 본문 6장 경로를 지정해 주세요.');
  }
  const used = new Set<string>();
  const replacements: [string, string][] = [];
  const images = data.images.map((imagePath: string, index: number) => {
    const basename = imagePath.split('/').at(-1);
    const matches = [...files.keys()].filter(path => path === imagePath.replace(/^\//, '') ||
      path.endsWith('/' + imagePath.replace(/^\//, '')));
    const candidates = matches.length ? matches : [...files.keys()].filter(path => path.split('/').at(-1) === basename);
    if (candidates.length !== 1 || used.has(candidates[0])) throw new Error(`${index + 1}번째 이미지 파일을 유일하게 연결할 수 없습니다.`);
    used.add(candidates[0]);
    const extension = candidates[0].split('.').at(-1)!.toLowerCase();
    if (!imageType[extension]) throw new Error('PNG, JPEG, WebP 이미지를 사용해 주세요.');
    const filename = `${slug}-0${index}.${extension}`;
    replacements.push([imagePath, `/images/info/${date}/${filename}`]);
    return new File([files.get(candidates[0])!], filename, { type: imageType[extension] });
  });
  const escaped = replacements.map(([oldPath]) => oldPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const mapping = new Map(replacements);
  source = source.replace(new RegExp(escaped.join('|'), 'g'), path => mapping.get(path)!);
  return { manuscript: new File([source], name, { type: 'text/markdown' }), images };
}

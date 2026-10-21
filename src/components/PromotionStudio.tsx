"use client";

import { useEffect, useMemo, useState } from "react";

type Channel = "naver" | "instagram" | "carrot" | "community" | "press";

type Draft = {
  id: string;
  createdAt: string;
  title: string;
  channel: Channel;
  text: string;
};

const CHANNEL_LABELS: Record<Channel, string> = {
  naver: "네이버 블로그",
  instagram: "인스타그램",
  carrot: "당근",
  community: "지역 커뮤니티",
  press: "언론 제보/보도자료",
};

const STORAGE_KEY = "ulsan365-promotion-studio-drafts-v1";

export default function PromotionStudio() {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [url, setUrl] = useState("");
  const [target, setTarget] = useState("울산 시민");
  const [deadline, setDeadline] = useState("");
  const [benefit, setBenefit] = useState("");
  const [channel, setChannel] = useState<Channel>("naver");
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setDrafts(JSON.parse(saved));
    } catch {
      // local-only prototype: ignore malformed cache
    }
  }, []);

  const generated = useMemo(() => {
    const safeTitle = title.trim() || "울산 생활정보";
    const safeSummary = summary.trim() || "울산365에서 공식 확인처와 핵심 내용을 정리했습니다.";
    const safeTarget = target.trim() || "울산 시민";
    const safeBenefit = benefit.trim();
    const safeDeadline = deadline.trim();
    const safeUrl = url.trim();
    const facts = [safeBenefit && `핵심: ${safeBenefit}`, safeDeadline && `기간/마감: ${safeDeadline}`]
      .filter(Boolean)
      .join("\n");
    const link = safeUrl ? `\n자세히 보기: ${safeUrl}` : "";

    if (channel === "instagram") {
      return `📌 ${safeTitle}\n\n${safeSummary}\n${facts ? `\n${facts}` : ""}\n\n${safeTarget}이라면 확인해 보세요.${link}\n\n#울산365 #울산정보 #울산생활 #울산행사 #울산복지`;
    }

    if (channel === "carrot") {
      return `${safeTitle}\n\n${safeSummary}\n${facts ? `\n${facts}\n` : "\n"}${safeTarget}에게 도움이 될 수 있는 정보입니다. 신청·방문 전에는 해당 기관의 최신 안내를 꼭 확인하세요.${link}\n\n울산365는 공식출처를 확인해 울산 생활정보를 정리합니다.`;
    }

    if (channel === "community") {
      return `${safeTitle}\n\n${safeSummary}\n${facts ? `\n${facts}\n` : "\n"}필요하신 분 참고하세요. 공식 확인처까지 함께 정리돼 있습니다.${link}`;
    }

    if (channel === "press") {
      return `[기사제보/지역정보] ${safeTitle}\n\n울산 지역 생활정보 포털 울산365가 관련 정보를 정리해 안내합니다. ${safeSummary}\n${facts ? `\n${facts}\n` : "\n"}대상: ${safeTarget}\n울산365는 복지·경제·생활·행사·관광 정보를 공식출처와 함께 제공하고 있습니다.${link}\n\n문의: help@ulsan365.com`;
    }

    return `${safeTitle}\n\n${safeSummary}\n\n${facts ? `${facts}\n\n` : ""}${safeTarget}에게 필요한 내용을 중심으로 정리했습니다. 일정, 신청 조건, 모집 상황은 변경될 수 있으므로 실제 이용 전 공식기관의 최신 공지를 확인해 주세요.${link}\n\n울산에서 필요한 정보, 신뢰 있게 바로 찾으세요.\nULSAN365 · ULSAN PORTAL INFO`;
  }, [title, summary, url, target, deadline, benefit, channel]);

  function saveDraft() {
    const item: Draft = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      title: title.trim() || "울산 생활정보",
      channel,
      text: generated,
    };
    const next = [item, ...drafts].slice(0, 30);
    setDrafts(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  async function copyGenerated() {
    await navigator.clipboard.writeText(generated);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  }

  function removeDraft(id: string) {
    const next = drafts.filter((draft) => draft.id !== id);
    setDrafts(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-8 md:py-10">
        <header className="mb-6 flex flex-col gap-2 border-b border-slate-200 pb-5">
          <span className="text-sm font-bold tracking-wide text-blue-700">ULSAN365 ADMIN STUDIO</span>
          <h1 className="text-3xl font-black md:text-4xl">홍보글 자동화</h1>
          <p className="max-w-3xl text-sm leading-6 text-slate-600 md:text-base">
            울산365 원문 한 건을 입력하면 채널별 홍보문을 자동 생성합니다. 현재 v0.1은 외부 자동게시 없이 생성·복사·임시저장만 제공합니다.
          </p>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
            <h2 className="mb-5 text-lg font-extrabold">1. 원문 정보</h2>
            <div className="space-y-4">
              <Field label="제목" value={title} onChange={setTitle} placeholder="예: 울산 청년 문화패스 신청 안내" />
              <TextArea label="핵심 요약" value={summary} onChange={setSummary} placeholder="누가, 무엇을, 왜 확인해야 하는지 2~3문장" />
              <Field label="대상" value={target} onChange={setTarget} placeholder="예: 울산 거주 19~39세" />
              <Field label="혜택/핵심" value={benefit} onChange={setBenefit} placeholder="예: 스포츠·문화 이용 지원" />
              <Field label="기간/마감" value={deadline} onChange={setDeadline} placeholder="예: 11월 30일까지 · 선착순" />
              <Field label="울산365 상세 URL" value={url} onChange={setUrl} placeholder="https://ulsan365.com/..." />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
            <h2 className="mb-4 text-lg font-extrabold">2. 채널별 자동 생성</h2>
            <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {(Object.keys(CHANNEL_LABELS) as Channel[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setChannel(key)}
                  className={`rounded-xl border px-3 py-2 text-sm font-bold transition ${
                    channel === key
                      ? "border-blue-700 bg-blue-700 text-white"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {CHANNEL_LABELS[key]}
                </button>
              ))}
            </div>

            <div className="min-h-80 whitespace-pre-wrap rounded-xl bg-slate-950 p-4 text-sm leading-6 text-slate-100">
              {generated}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <button onClick={copyGenerated} className="rounded-xl bg-blue-700 px-4 py-2.5 text-sm font-extrabold text-white">
                {copied ? "복사 완료" : "문구 복사"}
              </button>
              <button onClick={saveDraft} className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-extrabold">
                임시저장
              </button>
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-extrabold">3. 최근 임시저장</h2>
              <p className="mt-1 text-sm text-slate-500">이 브라우저에만 최대 30건 저장됩니다.</p>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">{drafts.length}건</span>
          </div>

          {drafts.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">저장된 홍보글이 없습니다.</div>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {drafts.map((draft) => (
                <article key={draft.id} className="rounded-xl border border-slate-200 p-4">
                  <div className="mb-2 flex items-start justify-between gap-3">
                    <div>
                      <span className="text-xs font-bold text-blue-700">{CHANNEL_LABELS[draft.channel]}</span>
                      <h3 className="mt-1 font-extrabold">{draft.title}</h3>
                    </div>
                    <button onClick={() => removeDraft(draft.id)} className="text-xs font-bold text-slate-400 hover:text-red-600">삭제</button>
                  </div>
                  <p className="line-clamp-4 whitespace-pre-wrap text-sm leading-6 text-slate-600">{draft.text}</p>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (value: string) => void; placeholder: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-bold text-slate-700">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-3 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
      />
    </label>
  );
}

function TextArea({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (value: string) => void; placeholder: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-bold text-slate-700">{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={5}
        className="w-full resize-y rounded-xl border border-slate-300 bg-white px-3.5 py-3 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
      />
    </label>
  );
}

import type { PostMeta } from './posts';

export type ApplicationStatus = {
  label: '접수 예정' | '접수 중' | '오늘 마감' | '접수 마감';
  className: string;
};

const KST_OFFSET_MS = 9 * 60 * 60 * 1000;

function getKoreanDateKey(date: Date) {
  return new Date(date.getTime() + KST_OFFSET_MS).toISOString().slice(0, 10);
}

export function getApplicationStatus(
  post: Pick<PostMeta, 'applicationStart' | 'applicationEnd'>,
  now = new Date(),
): ApplicationStatus | null {
  if (!post.applicationStart && !post.applicationEnd) return null;

  const start = post.applicationStart ? new Date(post.applicationStart) : null;
  const end = post.applicationEnd ? new Date(post.applicationEnd) : null;

  if (start && Number.isNaN(start.getTime())) return null;
  if (end && Number.isNaN(end.getTime())) return null;

  if (start && now < start) {
    return {
      label: '접수 예정',
      className: 'border-sky-200 bg-sky-50 text-sky-700',
    };
  }

  if (end && now <= end && getKoreanDateKey(now) === getKoreanDateKey(end)) {
    return {
      label: '오늘 마감',
      className: 'border-amber-200 bg-amber-50 text-amber-800',
    };
  }

  if (!end || now <= end) {
    return {
      label: '접수 중',
      className: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    };
  }

  return {
    label: '접수 마감',
    className: 'border-slate-200 bg-slate-100 text-slate-600',
  };
}

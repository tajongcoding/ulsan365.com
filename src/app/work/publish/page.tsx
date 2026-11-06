import type { Metadata } from 'next';
import PublishForm from './publish-form';

export const metadata: Metadata = {
  title: '울산365 간단 발행',
  robots: { index: false, follow: false },
};

export default function PublishPage() {
  return <PublishForm />;
}

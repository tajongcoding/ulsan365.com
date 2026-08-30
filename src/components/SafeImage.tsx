'use client';

import { useMemo, useState } from 'react';

type SafeImageProps = {
  src?: string | null;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  loading?: 'lazy' | 'eager';
};

export default function SafeImage({ src, alt, className = '', fallbackSrc, loading = 'lazy' }: SafeImageProps) {
  const initialSrc = useMemo(() => src || fallbackSrc || '', [src, fallbackSrc]);
  const [currentSrc, setCurrentSrc] = useState(initialSrc);
  const [hasFailed, setHasFailed] = useState(false);

  if (!currentSrc || hasFailed) {
    return <div aria-label={alt} className={`${className} bg-slate-200`} />;
  }

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      loading={loading}
      onError={() => {
        if (fallbackSrc && currentSrc !== fallbackSrc) {
          setCurrentSrc(fallbackSrc);
          return;
        }

        setHasFailed(true);
      }}
    />
  );
}

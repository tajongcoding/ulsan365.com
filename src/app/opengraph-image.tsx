import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = '아시나요 울산 | 복지·지원금·행사·생활정보 포털';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          backgroundColor: '#0F1A2B',
          padding: '72px',
          position: 'relative',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#1F2937',
            border: '1.5px solid rgba(201,168,87,0.5)',
            borderRadius: '24px',
            padding: '10px 24px',
            width: 'fit-content',
            marginBottom: '32px',
          }}
        >
          <span style={{ color: '#C9A857', fontSize: '22px', fontWeight: 700 }}>
            울산 생활정보 포털
          </span>
        </div>

        <div style={{ color: 'white', fontSize: '72px', fontWeight: 800, lineHeight: 1.1, marginBottom: '20px' }}>
          아시나요 울산
        </div>

        <div style={{ color: '#E5E7EB', fontSize: '36px', fontWeight: 500, marginBottom: '16px' }}>
          복지 · 지원금 · 생활정보 · 행사 · 관광
        </div>

        <div style={{ color: '#D1D5DB', fontSize: '24px', marginBottom: '48px' }}>
          울산 시민에게 꼭 필요한 정보를 쉽고 빠르게 정리합니다.
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#C9A857',
            borderRadius: '18px',
            padding: '16px 40px',
            width: 'fit-content',
          }}
        >
          <span style={{ color: '#0F1A2B', fontSize: '30px', fontWeight: 800 }}>
            ulsan365.com
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}

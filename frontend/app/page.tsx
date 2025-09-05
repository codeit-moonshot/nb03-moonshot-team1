'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-toastify';

export default function HomePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Google 로그인 성공 시 토스트 표시
    if (searchParams.get('google_login_success') === 'true') {
      toast.success('Google 로그인에 성공했습니다.');

      // URL에서 파라미터 제거하고 기본 페이지로 이동
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('google_login_success');
      window.history.replaceState({}, '', newUrl.toString());

      // 기본 페이지로 이동 (tasks 페이지로)
      router.push('/tasks');
    } else {
      // 일반적인 경우 기본 페이지로 이동
      router.push('/tasks');
    }
  }, [router, searchParams]);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column',
        gap: '20px',
      }}
    >
      <div>로딩 중...</div>
      <div
        style={{
          width: '40px',
          height: '40px',
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #3498db',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }}
      />
      <style jsx>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}

import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Providers from './providers';
import Script from 'next/script';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'AI 여행 플래너',
  description: 'AI가 추천하는 맞춤형 여행 일정',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning>
      <head>
        {/* 카카오맵 SDK 로드 */}
        <Script
          strategy="beforeInteractive"
          src="//dapi.kakao.com/v2/maps/sdk.js?appkey=62801e528eb39f2e251cc2d723564703&libraries=services,clusterer,drawing&autoload=false"
          id="kakao-maps-sdk"
        />
        
        {/* 카카오맵 초기화 스크립트 */}
        <Script
          id="kakao-map-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              console.log('🔧 카카오맵 초기화 스크립트 로드');
              
              window.kakaoMapReady = false;
              window.kakaoMapInitialized = false;
              
              function waitForKakaoAndInit() {
                console.log('🔍 카카오 SDK 체크 중...');
                
                if (typeof window.kakao !== 'undefined' && window.kakao.maps) {
                  if (window.kakao.maps.Map) {
                    // 이미 완전히 로드됨
                    console.log('✅ 카카오맵 SDK 이미 로드 완료');
                    window.kakaoMapReady = true;
                    window.kakaoMapInitialized = true;
                    window.dispatchEvent(new CustomEvent('kakaoMapReady'));
                  } else {
                    // SDK는 있지만 maps가 완전히 로드되지 않음
                    console.log('🔄 카카오맵 SDK 수동 로드 실행...');
                    
                    try {
                      window.kakao.maps.load(function() {
                        console.log('🎉 카카오맵 SDK 수동 로드 성공!');
                        console.log('📍 Map 클래스 사용 가능:', typeof window.kakao.maps.Map);
                        
                        window.kakaoMapReady = true;
                        window.kakaoMapInitialized = true;
                        window.dispatchEvent(new CustomEvent('kakaoMapReady'));
                      });
                    } catch (error) {
                      console.error('❌ 카카오맵 수동 로드 실패:', error);
                      setTimeout(waitForKakaoAndInit, 1000);
                    }
                  }
                } else {
                  console.log('⏳ 카카오 SDK 아직 로드 중... 재시도');
                  setTimeout(waitForKakaoAndInit, 500);
                }
              }
              
              // 즉시 시작
              waitForKakaoAndInit();
              
              // 10초 타임아웃
              setTimeout(function() {
                if (!window.kakaoMapInitialized) {
                  console.error('❌ 카카오맵 초기화 타임아웃 (10초)');
                  console.error('🔧 문제해결 가이드:');
                  console.error('1. 카카오 개발자 콘솔 → 앱 설정 → 플랫폼 → Web');
                  console.error('2. 사이트 도메인에 http://localhost:3000 추가');
                  console.error('3. JavaScript 키 확인: 62801e528eb39f2e251cc2d723564703');
                  console.error('4. 브라우저 캐시 삭제 후 새로고침');
                }
              }, 10000);
            `
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

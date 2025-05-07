// pages/_app.js
import '../styles/globals.css';
import Script from 'next/script';

function MyApp({ Component, pageProps }) {
  return (
    <>
      {/* 카카오 SDK 한 번만 로드 & 초기화 */}
      <Script
        src="https://developers.kakao.com/sdk/js/kakao.min.js"
        strategy="afterInteractive"
        onLoad={() => {
          if (window.Kakao && !window.Kakao.isInitialized()) {
            // 하드코딩된 JS 키로 초기화 (테스트용)
            window.Kakao.init('f5b4cfb16c5b2f8e213a1549a009307a');
            console.log('✅ Kakao SDK initialized');
          }
        }}
      />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;

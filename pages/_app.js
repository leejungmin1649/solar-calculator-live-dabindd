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
            window.Kakao.init('a02ad11689f9d4b1ffd2a081c08d5270');
            console.log('✅ Kakao SDK initialized');
          }
        }}
      />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;

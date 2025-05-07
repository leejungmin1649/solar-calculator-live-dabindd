// pages/_app.js
import '../styles/globals.css';
import Script from 'next/script';

function MyApp({ Component, pageProps }) {
  return (
    <>
      {/* Kakao SDK를 한 번만 로드하고 즉시 초기화 */}
      <Script
        src="https://developers.kakao.com/sdk/js/kakao.min.js"
        strategy="afterInteractive"
        onLoad={() => {
          if (window.Kakao && !window.Kakao.isInitialized()) {
            // 직접 발급받은 JS 키를 여기에 하드코딩
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

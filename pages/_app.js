// pages/_app.js
import '../styles/globals.css';
import Script from 'next/script';

function MyApp({ Component, pageProps }) {
  return (
    <>
      {/* Kakao SDK 로드: 페이지가 인터랙티브해진 후 한 번만 */}
      <Script
        src="https://developers.kakao.com/sdk/js/kakao.min.js"
        strategy="afterInteractive"
        onLoad={() => {
          if (window.Kakao && !window.Kakao.isInitialized()) {
            // 직접 키를 하드코딩
            window.Kakao.init('f5b4cfb16c5b2f8e213a1549a009307a');
            console.log('✅ Kakao SDK initialized with key:', 'f5b4cfb16c5b2f8e213a1549a009307a');
          }
        }}
      />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;

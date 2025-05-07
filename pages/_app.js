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
            window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_KEY);
            console.log('Kakao SDK initialized with key:', process.env.NEXT_PUBLIC_KAKAO_KEY);
          }
        }}
      />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;

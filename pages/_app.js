import '../styles/globals.css';
import Script from 'next/script';

function MyApp({ Component, pageProps }) {
  return (
    <>
      {/* Kakao SDK 로드: 페이지가 인터랙티브해진 후 */}
      <Script
        src="https://developers.kakao.com/sdk/js/kakao.min.js"
        strategy="afterInteractive"
      />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;

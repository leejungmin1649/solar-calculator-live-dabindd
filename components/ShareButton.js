// components/ShareButton.js
import { useEffect, useState } from 'react';
import Script from 'next/script';
import { compressToEncodedURIComponent } from 'lz-string';
import PropTypes from 'prop-types';

export default function ShareButton({ summary, chartData, projectName, date, contractAmount, contractCapacity }) {
  const [shareUrl, setShareUrl] = useState('');
  const btnRef = useRef(null);

  // 데이터 인코딩
  useEffect(() => {
    if (!summary) return;
    const payload = { summary, chartData, projectName, date, contractAmount, contractCapacity };
    const encoded = compressToEncodedURIComponent(JSON.stringify(payload));
    setShareUrl(`${window.location.origin}?data=${encoded}`);
  }, [summary, chartData, projectName, date, contractAmount, contractCapacity]);

  // SDK 초기화
  const handleScriptLoad = () => {
    if (window.Kakao && !window.Kakao.isInitialized()) {
      window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_KEY);
      console.log('Kakao SDK initialized');
    }
  };

  // createDefaultButton 사용해 공유 버튼 설정
  useEffect(() => {
    if (!btnRef.current || !window.Kakao || !window.Kakao.isInitialized()) return;
    window.Kakao.Link.createDefaultButton({
      container: btnRef.current,
      objectType: 'feed',
      content: {
        title: projectName || '태양광 수익성 결과',
        description: [
          `📌 예상 발전량: ${summary.yearlyGen.toLocaleString()} kWh`,
          `💰 총 수익: ${summary.revenue.toLocaleString()}원`,
          `🛠️ 운영비: ${summary.operationCost.toLocaleString()}원`,
          `🏦 원리금 상환: ${summary.yearlyRepayment.toLocaleString()}원`,
          `📈 순수익: ${Math.round(summary.netProfit).toLocaleString()}원`,
          summary.roi !== '-' ? `📊 ROI: ${Math.round(summary.roi)}%` : null,
          `⏱️ 회수기간: ${summary.payback}년`,
        ].filter(Boolean).join('
'),
        imageUrl: `${window.location.origin}/logo-dabin.png`,
        link: { mobileWebUrl: shareUrl, webUrl: shareUrl },
      },
      buttons: [{ title: '결과 확인', link: { mobileWebUrl: shareUrl, webUrl: shareUrl } }],
    });
  }, [shareUrl]);

  const copyToClipboard = () => {
    if (navigator.clipboard && shareUrl) {
      navigator.clipboard.writeText(shareUrl).then(() => alert('🔗 URL 복사완료!'));
    }
  };

  if (!summary) return null;

  return (
    <>
      <Script
        src="https://developers.kakao.com/sdk/js/kakao.min.js"
        strategy="afterInteractive"
        onLoad={handleScriptLoad}
      />
      <div className="mt-4 flex justify-center space-x-2">
        <button
          onClick={copyToClipboard}
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-full shadow"
        >
          🔗 URL 복사하기
        </button>
        <button
          ref={btnRef}
          className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded-full shadow"
        >
          💬 카카오톡 공유
        </button>
      </div>
    </>
  );
}

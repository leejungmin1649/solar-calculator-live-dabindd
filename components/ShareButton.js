// components/ShareButton.js
import { useEffect, useState } from 'react';
import Script from 'next/script';
import { compressToEncodedURIComponent } from 'lz-string';
import PropTypes from 'prop-types';

export default function ShareButton({ summary, chartData, projectName, date, contractAmount, contractCapacity }) {
  const [shareUrl, setShareUrl] = useState('');
  const [kakaoReady, setKakaoReady] = useState(false);

  // 데이터 인코딩
  useEffect(() => {
    if (!summary) return;
    const payload = { summary, chartData, projectName, date, contractAmount, contractCapacity };
    const encoded = compressToEncodedURIComponent(JSON.stringify(payload));
    setShareUrl(`${window.location.origin}?data=${encoded}`);
  }, [summary, chartData, projectName, date, contractAmount, contractCapacity]);

  // 카카오 SDK 초기화(onLoad에서 처리)
  const handleScriptLoad = () => {
    if (window.Kakao && !window.Kakao.isInitialized()) {
      window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_KEY);
      console.log('Kakao SDK initialized');
    }
    setKakaoReady(true);
  };

  const copyToClipboard = () => {
    if (navigator.clipboard && shareUrl) {
      navigator.clipboard.writeText(shareUrl).then(() => alert('🔗 결과 URL이 복사되었습니다!'));
    }
  };

  const handleKakaoShare = () => {
    if (!kakaoReady) {
      alert('카카오톡 공유 준비 중입니다. 잠시만 기다려주세요.');
      return;
    }
    window.Kakao.Link.sendDefault({
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
        ].filter(Boolean).join('\n'),
        imageUrl: `${window.location.origin}/logo-dabin.png`,
        link: { mobileWebUrl: shareUrl, webUrl: shareUrl },
      },
      buttons: [
        {
          title: '결과 확인하기',
          link: { mobileWebUrl: shareUrl, webUrl: shareUrl },
        },
      ],
      installTalk: true,
    });
  };

  if (!summary) return null;

  return (
    <>
      {/* SDK 로드 및 초기화 */}
      <Script
        src="https://developers.kakao.com/sdk/js/kakao.min.js"
        strategy="afterInteractive"
        onLoad={handleScriptLoad}
      />

      <div className="mt-4 text-center space-x-2">
        <button
          onClick={copyToClipboard}
          disabled={!shareUrl}
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-full shadow transition disabled:opacity-50"
        >
          🔗 URL 복사하기
        </button>
        <button
          onClick={handleKakaoShare}
          disabled={!kakaoReady}
          className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded-full shadow transition disabled:opacity-50"
        >
          💬 카카오톡 공유
        </button>
      </div>
    </>
  );
}

ShareButton.propTypes = {
  summary: PropTypes.object.isRequired,
  chartData: PropTypes.array.isRequired,
  projectName: PropTypes.string,
  date: PropTypes.string,
  contractAmount: PropTypes.string,
  contractCapacity: PropTypes.string,
};

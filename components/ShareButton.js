import { useEffect, useState } from 'react';
import { compressToEncodedURIComponent } from 'lz-string';
import PropTypes from 'prop-types';

export default function ShareButton({ summary, chartData, projectName, date, contractAmount, contractCapacity }) {
  const [shareUrl, setShareUrl] = useState('');

  // 결과 데이터를 URL로 인코딩
  useEffect(() => {
    if (!summary) return;
    const data = { summary, chartData, projectName, date, contractAmount, contractCapacity };
    const encoded = compressToEncodedURIComponent(JSON.stringify(data));
    const base = window.location.origin;
    setShareUrl(`${base}?data=${encoded}`);
  }, [summary, chartData, projectName, date, contractAmount, contractCapacity]);

  // URL 복사 핸들러
  const copyToClipboard = () => {
    if (navigator.clipboard && shareUrl) {
      navigator.clipboard.writeText(shareUrl)
        .then(() => alert('🔗 결과 URL이 복사되었습니다!'))
        .catch(err => console.error('Clipboard write failed:', err));
    }
  };

  // 카카오톡 공유 핸들러
  const handleKakaoShare = () => {
    if (!(typeof window !== 'undefined' && window.Kakao && window.Kakao.isInitialized())) {
      alert('카카오톡 공유 준비 중입니다. 잠시만 기다려주세요.');
      return;
    }
    try {
      window.Kakao.Link.sendDefault({
        objectType: 'feed',
        content: {
          title: projectName || '태양광 수익성 결과',
          description: [
            `📌 예상 발전량: ${summary.yearlyGen.toLocaleString()} kWh`,
            `💰 총 수익: ${summary.revenue.toLocaleString()}원`,
            `🧰 운영비: ${summary.operationCost.toLocaleString()}원`,
            `🏦 연간 원리금 상환: ${summary.yearlyRepayment.toLocaleString()}원`,
            `📈 순수익: ${Math.round(summary.netProfit).toLocaleString()}원`,
            summary.roi !== '-' ? `📊 자기자본 수익률: ${Math.round(summary.roi)}%` : null,
            `⏱️ 회수기간: ${summary.payback}년`,
          ].filter(Boolean).join('\n'),
          imageUrl: `${window.location.origin}/logo-dabin.png`,
          link: { mobileWebUrl: shareUrl, webUrl: shareUrl },
        },
        buttons: [
          {
            title: '결과 보기',
            link: { mobileWebUrl: shareUrl, webUrl: shareUrl },
          },
        ],
        installTalk: true,
      });
    } catch (e) {
      console.error('Kakao share failed:', e);
      window.open(shareUrl, '_blank');
    }
  };

  if (!summary) return null;

  return (
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
        className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded-full shadow transition"
      >
        💬 카카오톡 공유
      </button>
    </div>
  );
}

ShareButton.propTypes = {
  summary: PropTypes.shape({
    yearlyGen: PropTypes.number,
    revenue: PropTypes.number,
    operationCost: PropTypes.number,
    yearlyRepayment: PropTypes.number,
    netProfit: PropTypes.number,
    roi: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    payback: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  }).isRequired,
  chartData: PropTypes.array.isRequired,
  projectName: PropTypes.string,
  date: PropTypes.string,
  contractAmount: PropTypes.string,
  contractCapacity: PropTypes.string,
};

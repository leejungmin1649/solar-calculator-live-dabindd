// components/ShareButton.js
import { useRouter } from 'next/router';
import { compressToEncodedURIComponent } from 'lz-string';
import PropTypes from 'prop-types';

const KAKAO_KEY = 'a02ad11689f9d4b1ffd2a081c08d5270';

export default function ShareButton({
  summary,
  chartData,
  projectName,
  date,
  contractAmount,
  contractCapacity,
  className = '',
}) {
  const router = useRouter();

  // 데이터 압축 및 공유 URL 생성
  const payload = { summary, chartData, projectName, date, contractAmount, contractCapacity };
  const encoded = summary
    ? compressToEncodedURIComponent(JSON.stringify(payload))
    : '';
  const basePath = router.asPath.split('?')[0];
  const shareUrl =
    typeof window !== 'undefined' && encoded
      ? `${window.location.origin}${basePath}?data=${encoded}`
      : '';

  // 카카오 SDK 초기화 및 공유
  const handleShare = () => {
    if (typeof window === 'undefined' || !window.Kakao) return;
    if (!window.Kakao.isInitialized()) {
      window.Kakao.init(KAKAO_KEY);
    }
    window.Kakao.Link.sendDefault({
      objectType: 'feed',
      content: {
        title: projectName || '태양광 수익성 결과',
        description:
          `총 수익: ${summary.revenue.toLocaleString()}원\n` +
          `순수익: ${Math.round(summary.netProfit).toLocaleString()}원`,
        imageUrl: `${window.location.origin}/logo-dabin.png`,
        link: { mobileWebUrl: shareUrl, webUrl: shareUrl },
      },
      buttons: [
        {
          title: '결과 확인하기',
          link: { mobileWebUrl: shareUrl, webUrl: shareUrl },
        },
      ],
    });
  };

  // 클립보드 복사
  const handleCopy = async () => {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      alert('💾 링크가 복사되었습니다!');
    } catch (err) {
      console.error('링크 복사 실패:', err);
    }
  };

  if (!summary) return null;
  return (
    <div className={`flex flex-col sm:flex-row sm:justify-center gap-2 ${className}`}>      
      <button
        type="button"
        onClick={handleShare}
        className="bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-2 rounded w-full sm:w-auto text-center"
      >
        💬 카카오톡으로 공유
      </button>
      <button
        type="button"
        onClick={handleCopy}
        className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded w-full sm:w-auto text-center"
      >
        🔗 링크 복사
      </button>
    </div>
  );
}

ShareButton.propTypes = {
  summary: PropTypes.object.isRequired,
  chartData: PropTypes.array.isRequired,
  projectName: PropTypes.string,
  date: PropTypes.string,
  contractAmount: PropTypes.string,
  contractCapacity: PropTypes.string,
  className: PropTypes.string,
};

import { useEffect, useState, useRef } from 'react';
import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from 'lz-string';
import PropTypes from 'prop-types';

export default function ShareButton({
  summary,
  chartData,
  projectName,
  date,
  contractAmount,
  contractCapacity,
}) {
  const [shareUrl, setShareUrl] = useState('');
  const kakaoBtnRef = useRef(null);

  // URL 압축·인코딩
  useEffect(() => {
    if (!summary) return;
    const payload = { summary, chartData, projectName, date, contractAmount, contractCapacity };
    const encoded = compressToEncodedURIComponent(JSON.stringify(payload));
    setShareUrl(`${window.location.origin}?data=${encoded}`);
  }, [summary, chartData, projectName, date, contractAmount, contractCapacity]);

  // 카카오 SDK 초기화
  useEffect(() => {
    if (window.Kakao && !window.Kakao.isInitialized()) {
      window.Kakao.init('f5b4cfb16c5b2f8e213a1549a009307a');
    }
  }, []);

  // 모바일 카카오 공유 버튼 바인딩
  useEffect(() => {
    if (window.Kakao && kakaoBtnRef.current && shareUrl) {
      window.Kakao.Link.createDefaultButton({
        container: kakaoBtnRef.current,
        objectType: 'feed',
        content: {
          title: projectName || '태양광 수익성 결과',
          description: `총 수익: ${summary.revenue.toLocaleString()}원\n순수익: ${Math.round(summary.netProfit).toLocaleString()}원`,
          imageUrl: `${window.location.origin}/logo-dabin.png`,
          link: {
            mobileWebUrl: shareUrl,
            webUrl: shareUrl,
          },
        },
        buttons: [
          {
            title: '결과 확인하기',
            link: {
              mobileWebUrl: shareUrl,
              webUrl: shareUrl,
            },
          },
        ],
      });
    }
  }, [shareUrl, projectName, summary]);

  // 클립보드 복사
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      alert('🔗 URL 복사 완료!');
    } catch {
      alert('❌ 복사 실패');
    }
  };

  // Web Share API (모바일 대응)
  const handleWebShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: projectName || '태양광 수익성 결과',
          text: `총 수익: ${summary.revenue.toLocaleString()}원, 순수익: ${Math.round(summary.netProfit).toLocaleString()}원`,
          url: shareUrl,
        });
      } catch (err) {
        console.error('Web Share failed:', err);
      }
    } else {
      copyToClipboard();
    }
  };

  if (!summary) return null;

  return (
    <div className="mt-4 flex justify-center space-x-2">
      <button
        onClick={copyToClipboard}
        className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-full shadow"
      >
        🔗 URL 복사
      </button>

      <button
        onClick={handleWebShare}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full shadow"
      >
        📤 공유하기
      </button>

      <button
        ref={kakaoBtnRef}
        disabled={!shareUrl}
        className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded-full shadow disabled:opacity-50"
      >
        💬 카카오톡
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
};

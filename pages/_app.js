import { useEffect, useState } from 'react';
import { compressToEncodedURIComponent } from 'lz-string';
import PropTypes from 'prop-types';

export default function ShareButton({ summary, chartData, projectName, date, contractAmount, contractCapacity }) {
  const [shareUrl, setShareUrl] = useState('');
  const [kakaoReady, setKakaoReady] = useState(false);

  // 결과 데이터를 URL로 인코딩
  useEffect(() => {
    if (!summary) return;
    const data = { summary, chartData, projectName, date, contractAmount, contractCapacity };
    const encoded = compressToEncodedURIComponent(JSON.stringify(data));
    const base = typeof window !== 'undefined' ? window.location.origin : '';
    setShareUrl(`${base}?data=${encoded}`);
  }, [summary, chartData, projectName, date, contractAmount, contractCapacity]);

  // Kakao SDK 초기화 완료 대기
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const timer = setInterval(() => {
      if (window.Kakao && window.Kakao.Link) {
        if (!window.Kakao.isInitialized()) {
          window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_KEY);
          console.log('Kakao SDK initialized');
        }
        setKakaoReady(true);
        clearInterval(timer);
      }
    }, 100);
    return () => clearInterval(timer);
  }, []);

  // URL 복사 핸들러
  const copyToClipboard = () => {
    console.log('Copy click, shareUrl:', shareUrl);
    if (navigator.clipboard && shareUrl) {
      navigator.clipboard.writeText(shareUrl).then(() => {
        alert('🔗 결과 URL이 복사되었습니다!');
      }).catch(err => console.error('Clipboard write failed:', err));
    }
  };

  // 카카오톡 공유 핸들러
  const handleKakaoShare = () => {
    console.log('Kakao share click, ready:', kakaoReady);
    if (!kakaoReady) {
      alert('카카오톡 공유 준비 중입니다. 잠시만 기다려주세요.');
      return;
    }
    window.Kakao.Link.sendDefault({
      objectType: 'feed',
      content: {
        title: projectName || '태양광 수익성 결과',
        description: `총 수익: ${contractAmount}원, 용량: ${contractCapacity}kW`,
        imageUrl: `${window.location.origin}/logo-dabin.png`,
        link: { mobileWebUrl: shareUrl, webUrl: shareUrl },
      },
      buttons: [
        {
          title: '결과 보기',
          link: { mobileWebUrl: shareUrl, webUrl: shareUrl },
        },
      ],
    });
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
        disabled={!kakaoReady}
        className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded-full shadow transition disabled:opacity-50"
      >
        💬 카카오톡 공유
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

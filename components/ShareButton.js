// components/ShareButton.js
import { useEffect, useState } from 'react';
import { compressToEncodedURIComponent } from 'lz-string';
import PropTypes from 'prop-types';

export default function ShareButton({
  summary, chartData, projectName, date, contractAmount, contractCapacity
}) {
  const [shareUrl, setShareUrl] = useState('');

  // 1) 결과 데이터를 URL로 인코딩
  useEffect(() => {
    if (!summary) return;
    const data = { summary, chartData, projectName, date, contractAmount, contractCapacity };
    const encoded = compressToEncodedURIComponent(JSON.stringify(data));
    const base = typeof window !== 'undefined' ? window.location.origin : '';
    setShareUrl(`${base}?data=${encoded}`);
  }, [summary, chartData, projectName, date, contractAmount, contractCapacity]);

  // 2) Kakao SDK 초기화
  useEffect(() => {
    if (typeof window !== 'undefined' && window.Kakao) {
      const key = process.env.NEXT_PUBLIC_KAKAO_KEY;
      if (!window.Kakao.isInitialized()) {
        window.Kakao.init(key);
        console.log('Kakao init with key:', key);
      }
    }
  }, []);

  // 3) 카카오톡 공유
  const handleKakaoShare = () => {
    if (!window.Kakao || !window.Kakao.isInitialized()) {
      console.error('Kakao SDK 초기화되지 않음');
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

  // 4) URL 복사
  const copyToClipboard = () => {
    if (navigator.clipboard && shareUrl) {
      navigator.clipboard.writeText(shareUrl).then(() => {
        alert('🔗 결과 URL이 복사되었습니다!');
      });
    }
  };

  return (
    <div className="mt-4 text-center space-x-2">
      <button
        onClick={copyToClipboard}
        className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-full shadow transition"
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
  summary: PropTypes.object.isRequired,
  chartData: PropTypes.array.isRequired,
  projectName: PropTypes.string,
  date: PropTypes.string,
  contractAmount: PropTypes.string,
  contractCapacity: PropTypes.string,
};

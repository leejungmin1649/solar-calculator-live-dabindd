// components/ShareButton.js
import { useEffect, useState, useRef } from 'react';
import { compressToEncodedURIComponent } from 'lz-string';
import PropTypes from 'prop-types';

export default function ShareButton({
  summary,
  chartData,
  projectName,
  date,
  contractAmount,
  contractCapacity,
}) {
  const kakaoBtnRef = useRef(null);
  const [shareUrl, setShareUrl] = useState('');

  // 1) 공유할 URL 생성
  useEffect(() => {
    if (!summary) return;
    const payload = { summary, chartData, projectName, date, contractAmount, contractCapacity };
    const encoded = compressToEncodedURIComponent(JSON.stringify(payload));
    setShareUrl(`${window.location.origin}?data=${encoded}`);
  }, [summary, chartData, projectName, date, contractAmount, contractCapacity]);

  // 2) 카카오 초기화 & 버튼 바인딩
  useEffect(() => {
    if (!shareUrl) return;
    if (!window.Kakao) {
      console.warn('Kakao SDK가 로드되지 않았습니다.');
      return;
    }
    // init 키는 페이지의 <Script> onLoad와 동일해야 합니다
    if (!window.Kakao.isInitialized()) {
      window.Kakao.init('a02ad11689f9d4b1ffd2a081c08d5270');
    }
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
  }, [shareUrl, projectName, summary]);

  if (!summary) return null;

  return (
    <button
      ref={kakaoBtnRef}
      disabled={!shareUrl}
      className="bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-2 rounded"
    >
      💬 카카오톡으로 공유
    </button>
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

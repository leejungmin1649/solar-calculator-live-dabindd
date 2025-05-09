// components/ShareButton.js
import { useEffect, useState, useRef } from 'react';
import { compressToEncodedURIComponent } from 'lz-string';
import PropTypes from 'prop-types';

const KAKAO_KEY = 'f5b4cfb16c5b2f8e213a1549a009307a';

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

  // 1) 공유 URL 생성
  useEffect(() => {
    if (!summary) return;
    const payload = { summary, chartData, projectName, date, contractAmount, contractCapacity };
    const encoded = compressToEncodedURIComponent(JSON.stringify(payload));
    // 현재 전체 URL(경로+쿼리)을 가져와 ?data= 붙임
    const base = window.location.href.split('?')[0];
    const finalUrl = `${base}?data=${encoded}`;
    console.log('▶️ 공유할 URL:', finalUrl);
    setShareUrl(finalUrl);
  }, [summary, chartData, projectName, date, contractAmount, contractCapacity]);

  // 2) 카카오 SDK 바인딩 (init 보장)
  useEffect(() => {
    if (!shareUrl || !window.Kakao) return;
    // SDK 초기화가 안됐으면 초기화
    if (!window.Kakao.isInitialized()) {
      window.Kakao.init(KAKAO_KEY);
      console.log('🔧 Kakao SDK re-init in ShareButton');
    }

    window.Kakao.Link.createDefaultButton({
      container: kakaoBtnRef.current,
      objectType: 'feed',
      content: {
        title: projectName || '태양광 수익성 결과',
        description: `총 수익: ${summary.revenue.toLocaleString()}원\n순수익: ${Math.round(
          summary.netProfit
        ).toLocaleString()}원`,
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
    console.log('✅ Kakao link button created');
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

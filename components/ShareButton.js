// components/ShareButton.js
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
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
  const router = useRouter();
  const kakaoBtnRef = useRef(null);

  useEffect(() => {
    // 1) 라우터/요약 데이터 준비 확인
    if (!router.isReady || !summary) return;
    // 2) SDK 준비 확인
    if (!window.Kakao) {
      console.error('❌ Kakao SDK 로드 실패');
      return;
    }
    if (!window.Kakao.isInitialized()) {
      window.Kakao.init(KAKAO_KEY);
      console.log('🔧 Kakao SDK init in ShareButton');
    }

    // 3) 공유 URL 생성
    const payload = { summary, chartData, projectName, date, contractAmount, contractCapacity };
    const encoded = compressToEncodedURIComponent(JSON.stringify(payload));
    // router.asPath 에는 쿼리가 포함되므로 제거
    const basePath = router.asPath.split('?')[0];
    const shareUrl = `${window.location.origin}${basePath}?data=${encoded}`;
    console.log('▶️ 공유할 URL:', shareUrl);

    // 4) 버튼 바인딩
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
    console.log('✅ Kakao link button created');
  }, [
    router.isReady,
    router.asPath,
    summary,
    chartData,
    projectName,
    date,
    contractAmount,
    contractCapacity,
  ]);

  if (!summary) return null;
  return (
    <button
      ref={kakaoBtnRef}
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

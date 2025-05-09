// components/ShareButton.js
import { useEffect, useRef } from 'react';
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
}) {
  const router = useRouter();
  const kakaoBtnRef = useRef(null);

  useEffect(() => {
    if (!router.isReady || !summary) return;

    // 1) 공유 URL 생성
    const payload = { summary, chartData, projectName, date, contractAmount, contractCapacity };
    const encoded = compressToEncodedURIComponent(JSON.stringify(payload));
    const basePath = router.asPath.split('?')[0];
    const shareUrl = `${window.location.origin}${basePath}?data=${encoded}`;
    console.log('▶️ 공유할 URL:', shareUrl);

    // 2) SDK & 버튼 바인딩 재시도 함수
    const bindKakao = () => {
      if (window.Kakao && window.Kakao.isInitialized()) {
        window.Kakao.Link.createDefaultButton({
          container: kakaoBtnRef.current,
          objectType: 'feed',
          content: {
            title: projectName || '태양광 수익성 결과',
            description: `총 수익: ${summary.revenue.toLocaleString()}원\n순수익: ${Math.round(summary.netProfit).toLocaleString()}원`,
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
        console.log('✅ Kakao link button created');
      } else {
        // 아직 SDK 준비 전이면 100ms 뒤에 재시도
        setTimeout(bindKakao, 100);
      }
    };

    // SDK 초기화 보장
    if (window.Kakao && !window.Kakao.isInitialized()) {
      window.Kakao.init(KAKAO_KEY);
      console.log('🔧 Kakao SDK init in ShareButton');
    }

    bindKakao();
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
    <a
      ref={kakaoBtnRef}
      role="button"
      className="bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-2 rounded w-full sm:w-auto text-center cursor-pointer select-none"
    >
      💬 카카오톡으로 공유
    </a>
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

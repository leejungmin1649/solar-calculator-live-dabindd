import { useRouter } from 'next/router';
import { compressToEncodedURIComponent } from 'lz-string';
import PropTypes from 'prop-types';
import Script from 'next/script';

const KAKAO_KEY = 'a02ad11689f9d4b1ffd2a081c08d5270';

export default function ShareButton({
  summary,
  chartData,
  projectName,
  date,
  contractAmount,
  contractCapacity,
  className
}) {
  const router = useRouter();

  const handleShare = () => {
    if (typeof window === 'undefined' || !window.Kakao) return;
    if (!window.Kakao.isInitialized()) window.Kakao.init('a02ad11689f9d4b1ffd2a081c08d5270');

    const payload = { summary, chartData, projectName, date, contractAmount, contractCapacity };
    const encoded = compressToEncodedURIComponent(JSON.stringify(payload));
    const base = router.asPath.split('?')[0];
    const shareUrl = `${window.location.origin}${base}?data=${encoded}`;

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
      buttons: [{ title: '결과 확인하기', link: { mobileWebUrl: shareUrl, webUrl: shareUrl } }],
    });
  };

  if (!summary) return null;
  return (
    <>
      <Script
        src="https://developers.kakao.com/sdk/js/kakao.min.js"
        strategy="beforeInteractive"
        onLoad={() => {
          if (window.Kakao && !window.Kakao.isInitialized()) window.Kakao.init(KAKAO_KEY);
        }}
      />
      <button type="button" onClick={handleShare} className={className}>
        💬 카카오톡으로 공유
      </button>
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
  className: PropTypes.string,
};

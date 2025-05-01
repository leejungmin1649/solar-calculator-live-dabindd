import { useEffect, useState } from 'react';

export default function ShareButton({ summary, chartData, projectName, date, contractAmount, contractCapacity }) {
  const [shareUrl, setShareUrl] = useState('');

  useEffect(() => {
    if (!summary) return;

    const encoded = encodeURIComponent(JSON.stringify({
      summary,
      chartData,
      projectName,
      date,
      contractAmount,
      contractCapacity,
    }));

    const base = typeof window !== 'undefined' ? window.location.origin : '';
    const url = `${base}?data=${encoded}`;
    setShareUrl(url);
  }, [summary, chartData, projectName, date, contractAmount, contractCapacity]);

  const copyToClipboard = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl).then(() => {
        alert('🔗 링크가 복사되었습니다!');
      });
    }
  };

  return (
    <div className="mt-4 text-center">
      <button
        onClick={copyToClipboard}
        className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-full shadow transition"
      >
        🔗 결과 URL 복사하기
      </button>
      {shareUrl && (
        <div className="mt-2 text-xs text-gray-400 break-all">{shareUrl}</div>
      )}
    </div>
  );
}
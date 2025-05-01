import Head from 'next/head';
import { useState, useEffect } from 'react';
import CalculatorForm from '../components/CalculatorForm';
import ProfitChart from '../components/ProfitChart';
import ExcelExport from '../components/ExcelExport';
import ThemeToggle from '../components/ThemeToggle';

export default function Home() {
  const [chartData, setChartData] = useState([]);
  const [breakEvenYear, setBreakEvenYear] = useState(null);
  const [summary, setSummary] = useState(null);

  // 공유를 위한 입력값 상태
  const [projectName, setProjectName] = useState('');
  const [date, setDate] = useState('');
  const [contractAmount, setContractAmount] = useState('');
  const [contractCapacity, setContractCapacity] = useState('');
  const [rows, setRows] = useState([]);

  // ✅ URL 복원 기능
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const data = urlParams.get('data');
    if (data) {
      try {
        const decoded = JSON.parse(decodeURIComponent(data));
        setProjectName(decoded.projectName || '');
        setDate(decoded.date || '');
        setContractAmount(decoded.contractAmount || '');
        setContractCapacity(decoded.contractCapacity || '');
        setRows(decoded.rows || []);
      } catch (err) {
        console.error('복원 오류:', err);
      }
    }
  }, []);

  // ✅ 공유 URL 복사
  const handleCopyUrl = () => {
    const data = {
      projectName,
      date,
      contractAmount,
      contractCapacity,
      rows,
    };
    const shareUrl = `${window.location.origin}?data=${encodeURIComponent(JSON.stringify(data))}`;
    navigator.clipboard.writeText(shareUrl)
      .then(() => alert('📋 공유 링크가 복사되었습니다!'))
      .catch(() => alert('❌ 링크 복사 실패'));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <Head>
        <title>태양광 수익성 계산기</title>
      </Head>

      <header className="text-center py-10 border-b border-gray-700">
        <a href="http://www.dabinenc.com" target="_blank" rel="noopener noreferrer">
          <img src="/logo-dabin.png" alt="다빈이앤씨 로고" className="mx-auto w-32 h-auto mb-2" />
        </a>
        <h1 className="text-3xl font-bold tracking-tight text-emerald-400">☀️ 태양광 수익성 계산기</h1>
        <p className="text-gray-400 mt-1 text-sm">실시간 수익 분석 & Excel 보고서 제공</p>
        <p className="text-gray-300 mt-1 text-sm">
          📞 <a href="tel:0424841108" className="underline hover:text-emerald-400">042-484-1108</a> (태양광 투자, 토지개발, 유통, 공사, 금융, RE100 문의)
        </p>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-10">
        <ThemeToggle />

        <div className="bg-gray-800 rounded-2xl shadow-xl p-6">
          <h2 className="text-xl font-semibold text-emerald-300 mb-4">🔧 기본 정보 입력</h2>
          <CalculatorForm
            projectName={projectName}
            setProjectName={setProjectName}
            date={date}
            setDate={setDate}
            contractAmount={contractAmount}
            setContractAmount={setContractAmount}
            contractCapacity={contractCapacity}
            setContractCapacity={setContractCapacity}
            rows={rows}
            setRows={setRows}
            onDataChange={(data, year, summaryData) => {
              setChartData(data);
              setBreakEvenYear(year);
              setSummary(summaryData);
            }}
          />
          <div className="mt-4 text-right">
            <button
              onClick={handleCopyUrl}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm"
            >
              📤 공유 링크 복사
            </button>
          </div>
        </div>

        <div className="mt-10">
          <h2 className="text-xl font-semibold text-emerald-300 mb-4">📈 연간 수익 분석</h2>
          <div className="bg-white text-black rounded-xl p-4">
            <ProfitChart data={chartData} breakEvenYear={breakEvenYear} />
          </div>
        </div>

        {summary && (
          <>
            <div className="mt-10 space-y-1 text-sm text-white bg-gray-700 p-4 rounded-lg shadow">
              <h2 className="text-lg font-semibold text-emerald-400 mb-2">📊 결과 요약</h2>
              <div>📌 예상 발전량: {summary.yearlyGen.toLocaleString()} kWh</div>
              <div>💰 총 수익: {summary.revenue.toLocaleString()} 원</div>
              <div>🧰 운영비: {summary.operationCost.toLocaleString()} 원</div>
              <div>🏦 연간 원리금 상환: {summary.yearlyRepayment.toLocaleString()} 원</div>
              <div>📈 순수익: {Math.round(summary.netProfit).toLocaleString()} 원</div>
              {Number(summary.equity) > 0 && (
                <div>📊 자기자본 수익률: {summary.roi !== '-' ? `${Math.round(summary.roi)}%` : '-'}</div>
              )}
              {Number(summary.loan) > 0 && Number(summary.equity) <= 0 && (
                <div>📊 대출금 수익률: {summary.loanRoi !== '-' ? `${Math.round(summary.loanRoi)}%` : '-'}</div>
              )}
              <div>⏱️ 회수기간: {typeof summary.payback === 'number' ? `${summary.payback} 년` : '-'}</div>
            </div>

            <div className="mt-6 text-center">
              <ExcelExport summary={summary} chartData={chartData} />
            </div>
          </>
        )}

        <div className="mt-12 text-sm text-gray-300 space-y-2 border-t border-gray-700 pt-6">
          <p className="font-semibold">📌 결과 요약 안내</p>
          <ul className="list-disc list-inside space-y-1">
            <li>🔋 예상 발전량은 설치용량과 일일 발전시간을 기준으로 추정한 연간 발전량입니다.</li>
            <li>💸 총 수익은 SMP + REC 기준 수익을 반영합니다.</li>
            <li>🛠️ 순수익은 운영비용, 대출 원리금 상환을 제외한 실제 수익입니다.</li>
            <li>📊 자기자본 수익률은 연간 순수익 ÷ 자기자본 × 100 입니다.</li>
            <li>📊 대출금 수익률은 연간 순수익 ÷ 대출금 × 100 입니다.</li>
            <li>⏱️ 회수기간은 투자금 회수까지 예상되는 연도 수입니다.</li>
          </ul>
          <p className="mt-3 text-xs text-gray-500">
            ※ 본 계산기는 추정치를 기초로 작성된 자료로, 실제 수익과 차이가 발생할 수 있습니다. 해당 자료는 참고용이며, 법적 효력이 없습니다.
          </p>
        </div>
      </main>
    </div>
  );
}

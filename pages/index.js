// pages/index.js
import Head from 'next/head';
import Script from 'next/script';
import { useState, useEffect } from 'react';
import { decompressFromEncodedURIComponent } from 'lz-string';
import CalculatorForm from '../components/CalculatorForm';
import ProfitChart from '../components/ProfitChart';
import ExcelExport from '../components/ExcelExport';
import ThemeToggle from '../components/ThemeToggle';
import ShareButton from '../components/ShareButton';

const KAKAO_KEY = 'a02ad11689f9d4b1ffd2a081c08d5270';

export default function Home() {
  const [chartData, setChartData] = useState([]);
  const [breakEvenYear, setBreakEvenYear] = useState(null);
  const [summary, setSummary] = useState(null);
  const [projectName, setProjectName] = useState('태양광 수익성 계산기');
  const [date, setDate] = useState('');
  const [contractAmount, setContractAmount] = useState('');
  const [contractCapacity, setContractCapacity] = useState('');

  // Kakao SDK 초기화
  const initKakao = () => {
    if (typeof window !== 'undefined' && window.Kakao && !window.Kakao.isInitialized()) {
      window.Kakao.init('a02ad11689f9d4b1ffd2a081c08d5270');
      console.log('✅ Kakao SDK initialized');
    }
  };

  // URL 복원 함수
  const restoreFromUrl = () => {
    const raw = new URLSearchParams(window.location.search).get('data');
    if (!raw) return;
    try {
      const decoded = JSON.parse(decompressFromEncodedURIComponent(raw));
      setProjectName(decoded.projectName || '태양광 수익성 계산기');
      setDate(decoded.date || '');
      setContractAmount(decoded.contractAmount || '');
      setContractCapacity(decoded.contractCapacity || '');
      setSummary(decoded.summary || null);
      setChartData(decoded.chartData || []);
      setBreakEvenYear(decoded.breakEvenYear ?? null);
    } catch (e) {
      console.error('URL 복원 오류:', e);
    }
  };

  // 페이지 로드 시 init & 복원
  useEffect(() => {
    if (typeof window === 'undefined') return;
    initKakao();
    restoreFromUrl();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <Head>
        <title>태양광 수익성 계산기</title>
      </Head>

      {/* Kakao SDK */}
      <Script
        src="https://developers.kakao.com/sdk/js/kakao.min.js"
        strategy="afterInteractive"
        onLoad={initKakao}
      />

      {/* 헤더 */}
      <header className="text-center py-10 border-b border-gray-700">
        <a href="http://www.dabinenc.com" target="_blank" rel="noopener noreferrer">
          <img src="/logo-dabin.png" alt="다빈이앤씨 로고" className="mx-auto w-32 h-auto mb-2" />
        </a>
        <h1 className="text-3xl font-bold text-emerald-400">☀️ 태양광 수익성 계산기</h1>
        <p className="text-gray-400 mt-1 text-sm">실시간 수익 분석 & Excel 보고서 제공</p>
      </header>

      {/* 메인 */}
      <main className="max-w-5xl mx-auto px-4 py-10">
        <ThemeToggle />

        {/* 입력 섹션 */}
        <section className="bg-gray-800 rounded-2xl shadow-xl p-6">
          <h2 className="text-xl font-semibold text-emerald-300 mb-4">🔧 기본 정보 입력</h2>
          <CalculatorForm
            onDataChange={(data, year, summaryData) => {
              setChartData(data);
              setBreakEvenYear(year);
              setSummary(summaryData);
            }}
            onMetaChange={(meta) => {
              setProjectName(meta.projectName);
              setDate(meta.date);
              setContractAmount(meta.contractAmount);
              setContractCapacity(meta.contractCapacity);
            }}
          />
        </section>

        {/* 그래프 섹션 */}
        <section className="mt-10">
          <h2 className="text-xl font-semibold text-emerald-300 mb-4">📈 연간 수익 분석</h2>
          <div className="bg-white text-black rounded-xl p-4">
            <ProfitChart data={chartData} breakEvenYear={breakEvenYear} />
          </div>
        </section>

        {/* 결과 요약 & 버튼 */}
        {summary && (
          <>
            <section className="mt-10 bg-gray-700 p-4 rounded-lg shadow text-sm space-y-1">
              <h2 className="text-lg font-semibold text-emerald-400 mb-2">📊 결과 요약</h2>
              <div>📌 예상 발전량: {summary.yearlyGen.toLocaleString()} kWh</div>
              <div>💰 총 수익: {summary.revenue.toLocaleString()} 원</div>
              <div>🧰 운영비: {summary.operationCost.toLocaleString()} 원</div>
              <div>🏦 연간 원리금 상환: {summary.yearlyRepayment.toLocaleString()} 원</div>
              <div>📈 순수익: {Math.round(summary.netProfit).toLocaleString()} 원</div>
              {Number(summary.equity) > 0 ? (
                <div>📊 자기자본 수익률: {summary.roi !== '-' ? `${Math.round(summary.roi)}%` : '-'}</div>
              ) : Number(summary.loan) > 0 ? (
                <div>📊 대출금 수익률: {summary.loanRoi !== '-' ? `${Math.round(summary.loanRoi)}%` : '-'}</div>
              ) : null}
              <div>⏱️ 회수기간: {typeof summary.payback === 'number' ? `${summary.payback} 년` : '-'}</div>
            </section>

            <div className="my-8 flex flex-col sm:flex-row sm:justify-center gap-4">
              <ExcelExport
                className="inline-flex items-center justify-center w-full sm:w-48 h-10 leading-10 text-sm rounded px-4 flex-1 bg-yellow-500 hover:bg-yellow-600 text-black"
                summary={summary}
                chartData={chartData}
              />
              <ShareButton
                className="inline-flex items-center justify-center w-full sm:w-48 h-10 leading-10 text-sm rounded px-4 flex-1 bg-yellow-400 hover:bg-yellow-500 text-black"
                summary={summary}
                chartData={chartData}
                projectName={projectName}
                date={date}
                contractAmount={contractAmount}
                contractCapacity={contractCapacity}
              />
              <button
                type="button"
                onClick={restoreFromUrl}
                className="inline-flex items-center justify-center w-full sm:w-48 h-10 leading-10 text-sm rounded px-4 flex-1 bg-gray-600 hover:bg-gray-700 text-white"
              >
                🔄 URL 복원
              </button>
            </div>

            {/* 안내문구 */}
            <section className="mt-12 text-sm text-gray-300 space-y-2 border-t border-gray-700 pt-6">
              <p className="font-semibold">📌 결과 요약 안내</p>
              <ul className="list-disc list-inside space-y-1">
                <li>🔋 예상 발전량은 설치용량과 일일 발전시간을 기준으로 추정된 연간 발전량입니다。</li>
                <li>💸 총 수익은 SMP + REC 기준 수익을 반영합니다。</li>
                <li>🛠️ 순수익은 운영비용, 대출 원리금 상환을 제외한 실제 수익입니다。</li>
                <li>📊 자기자본 수익률은 연간 순수익 ÷ 자기자본 × 100 입니다。</li>
                <li>📊 대출금 수익률은 연간 순수익 ÷ 대출금 × 100 입니다。</li>
                <li>⏱️ 회수기간은 투자금 회수까지 예상되는 연도 수입니다。</li>
              </ul>
              <p className="mt-3 text-xs text-gray-500">
                ※ 본 계산기는 추정치를 기초로 작성된 자료로、실제 수익과 차이가 발생할 수 있습니다。해당 자료는 참고용이며、법적 효력이 없습니다。
              </p>
            </section>
          </>
        )}
      </main>
    </div>
  );
}

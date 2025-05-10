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
  const [contractCapacity, setContractCapacity] = useState('');
  const [metaAmount, setMetaAmount] = useState('');

  // 총투자금 = 자기자본(equity) + 대출금(summary.loan)
  const totalInvestment = summary
    ? Number(summary.equity || 0) + Number(summary.loan || 0)
    : 0;

  // Kakao SDK 초기화
  const initKakao = () => {
    if (
      typeof window !== 'undefined' &&
      window.Kakao &&
      !window.Kakao.isInitialized()
    ) {
      window.Kakao.init('a02ad11689f9d4b1ffd2a081c08d5270');
    }
  };

  // URL 파라미터에서 data 복원
  const restoreFromUrl = () => {
    const raw = new URLSearchParams(window.location.search).get('data');
    if (!raw) return;
    try {
      const decoded = JSON.parse(decompressFromEncodedURIComponent(raw));
      setProjectName(decoded.projectName || projectName);
      setDate(decoded.date || date);
      setMetaAmount(decoded.contractAmount || metaAmount);
      setContractCapacity(decoded.contractCapacity || contractCapacity);
      setSummary(decoded.summary || null);
      setChartData(decoded.chartData || []);
      setBreakEvenYear(decoded.breakEvenYear ?? null);
    } catch {
      console.error('URL 복원 오류');
    }
  };

  // 현재 URL 클립보드 복사
  const copyUrlToClipboard = () => {
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(window.location.href)
        .then(() => alert('현재 URL이 클립보드에 복사되었습니다.'))
        .catch(() => alert('URL 복사에 실패했습니다.'));
    }
  };

  useEffect(() => {
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
          <img src="/logo-dabin.png" alt="로고" className="mx-auto w-32 mb-2" />
        </a>
        <h1 className="text-3xl font-bold text-emerald-400">
          ☀️ 태양광 수익성 계산기
        </h1>
        <p className="text-gray-400 mt-1 text-sm">
          실시간 수익 분석 & Excel 보고서 제공
        </p>
        <p className="text-gray-300 mt-1 text-sm">
          📖{' '}
          <a
            href="https://blog.naver.com/dabincoltd2025"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-emerald-400"
          >
            다빈이앤씨 블로그
          </a>
        </p>
      </header>

      {/* 메인 */}
      <main className="max-w-5xl mx-auto px-4 py-10">
        <ThemeToggle />

        {/* 입력 섹션 */}
        <section className="bg-gray-800 rounded-2xl shadow-xl p-6">
          <h2 className="text-xl font-semibold text-emerald-300 mb-4">
            🔧 기본 정보 입력
          </h2>
          <CalculatorForm
            onDataChange={(data, year, summaryData) => {
              setChartData(data);
              setBreakEvenYear(year);
              setSummary(summaryData);
            }}
            onMetaChange={(meta) => {
              setProjectName(meta.projectName);
              setDate(meta.date);
              setMetaAmount(meta.contractAmount);
              setContractCapacity(meta.contractCapacity);
            }}
          />
        </section>

        {/* 차트 섹션 */}
        <section className="mt-10">
          <h2 className="text-xl font-semibold text-emerald-300 mb-4">
            📈 연간 수익 분석
          </h2>
          <div className="bg-white text-black rounded-xl p-4">
            <ProfitChart data={chartData} breakEvenYear={breakEvenYear} />
          </div>
        </section>

        {/* 결과 요약 & 버튼 */}
        {summary && (
          <>
            <section className="mt-10 bg-gray-700 p-4 rounded-lg shadow text-sm space-y-1">
              <h2 className="text-lg font-semibold text-emerald-400 mb-2">
                📊 결과 요약
              </h2>
              <div>
                🔋 설치 용량:{' '}
                {contractCapacity ? `${contractCapacity} kW` : '- kW'}
              </div>
              <div>
                💳 총 투자금:{' '}
                {totalInvestment
                  ? `${totalInvestment.toLocaleString()} 원`
                  : '- 원'}
              </div>
              <div>
                📌 예상 발전량:{' '}
                {summary.yearlyGen.toLocaleString()} kWh
              </div>
              <div>
                💰 총 수익:{' '}
                {summary.revenue.toLocaleString()} 원
              </div>
              <div>
                🧰 운영비용:{' '}
                {summary.operationCost.toLocaleString()} 원
              </div>
              <div>
                🏦 연간 원리금 상환:{' '}
                {summary.yearlyRepayment.toLocaleString()} 원
              </div>
              <div>
                📈 순수익:{' '}
                {Math.round(summary.netProfit).toLocaleString()} 원
              </div>
              {Number(summary.equity) > 0 && (
                <div>
                  📊 자기자본 수익률:{' '}
                  {summary.roi !== '-' ? `${Math.round(summary.roi)}%` : '-'}
                </div>
              )}
              {Number(summary.loan) > 0 && (
                <div>
                  📊 대출금 수익률:{' '}
                  {summary.loanRoi !== '-' ? `${Math.round(summary.loanRoi)}%` : '-'}
                </div>
              )}
              <div>
                ⏱️ 회수기간:{' '}
                {typeof summary.payback === 'number'
                  ? `${summary.payback} 년`
                  : '-'}
              </div>
            </section>

            <div className="my-8 flex flex-wrap justify-center gap-4">
              <ExcelExport
                className="inline-flex items-center justify-center w-full sm:w-48 h-10 leading-10 text-sm rounded px-4 bg-yellow-500 hover:bg-yellow-600 text-white shadow"
                summary={summary}
                chartData={chartData}
                contractCapacity={contractCapacity}
                totalInvestment={totalInvestment}
              />
              <ShareButton
                className="inline-flex items-center justify-center w-full sm:w-48 h-10 leading-10 text-sm rounded px-4 bg-yellow-400 hover:bg-yellow-500 text-black"
                summary={summary}
                chartData={chartData}
                projectName={projectName}
                date={date}
                contractAmount={totalInvestment.toString()}
                contractCapacity={contractCapacity}
              />
              <button
                type="button"
                onClick={copyUrlToClipboard}
                className="inline-flex items-center justify-center w-full sm:w-48 h-10 leading-10 text-sm rounded px-4 bg-gray-600 hover:bg-gray-700 text-white"
              >
                🔗 URL 복사
              </button>
            </div>

            {/* 안내문구 */}
            <section className="mt-12 text-sm text-gray-300 space-y-2 border-t border-gray-700 pt-6">
              <p className="font-semibold">📌 결과 요약 안내</p>
              <ul className="list-disc list-inside space-y-1">
                <li>🔋 설치 용량: 태양광 패널 총 설치 용량 (kW)</li>
                <li>💳 총 투자금: 자기자본 + 대출금액 (원)</li>
                <li>🔋 예상 발전량: 설치 용량과 일일 발전시간 기반 예측 연간 발전량 (kWh)</li>
                <li>💸 총 수익: SMP + REC 합산 예상 연간 수익 (원)</li>
                <li>🛠️ 운영비용: 설비 유지·관리 비용 (원)</li>
                <li>🏦 연간 원리금 상환: 대출 상환 분할액 연간 합계 (원)</li>
                <li>📈 순수익: 총 수익 – 운영비용 – 상환액 (원)</li>
                <li>📊 자기자본 수익률: 순수익 ÷ 자기자본 × 100 (%)</li>
                <li>📊 대출금 수익률: 순수익 ÷ 대출금 × 100 (%)</li>
                <li>⏱️ 회수기간: 투자금 회수까지 예상 연수 (년)</li>
              </ul>
            </section>
          </>
        )}
      </main>
    </div>
  );
}

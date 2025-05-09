// pages/index.js
import Head from 'next/head';
import Script from 'next/script';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import CalculatorForm from '../components/CalculatorForm';
import ProfitChart from '../components/ProfitChart';
import ExcelExport from '../components/ExcelExport';
import ThemeToggle from '../components/ThemeToggle';
import ShareButton from '../components/ShareButton';
import { decompressFromEncodedURIComponent } from 'lz-string';

export default function Home() {
  const router = useRouter();
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

  // URL 파라미터 복원 및 SDK 초기화
  useEffect(() => {
    if (typeof window === 'undefined') return;
    initKakao();
    const params = new URLSearchParams(window.location.search);
    const raw = params.get('data');
    if (raw) {
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
        console.error('복원 오류:', e);
      }
    }
  }, [router.isReady]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <Head>
        <title>태양광 수익성 계산기</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* Kakao SDK 로드 */}
      <Script
        src="https://developers.kakao.com/sdk/js/kakao.min.js"
        strategy="afterInteractive"
        onLoad={initKakao}
      />

      {/* 헤더 */}
      <header className="text-center py-6 px-4 sm:py-10 sm:px-6 border-b border-gray-700">
        <a href="http://www.dabinenc.com" target="_blank" rel="noopener noreferrer" className="inline-block">
          <img src="/logo-dabin.png" alt="다빈이앤씨 로고" className="mx-auto w-24 sm:w-32 mb-2" />
        </a>
        <h1 className="text-2xl sm:text-3xl font-bold text-emerald-400">☀️ 태양광 수익성 계산기</h1>
        <p className="text-gray-400 mt-1 text-xs sm:text-sm">실시간 수익 분석 & Excel 보고서 제공</p>
        <div className="mt-2 space-y-1 text-xs sm:text-sm text-gray-300">
          <p className="flex justify-center items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-1 text-emerald-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.11-.21 11.36 11.36 0 003.55.57 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1 11.36 11.36 0 00.57 3.55 1 1 0 01-.21 1.11l-2.24 2.13z" />
            </svg>
            <a href="tel:042-484-1108" className="underline hover:text-emerald-400">042-484-1108</a>
            <span className="ml-1">(태양광 투자, 토지개발, 유통, 공사, 금융 문의)</span>
          </p>
          <p className="flex justify-center items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-1 text-emerald-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M4.18 15.82a2.18 2.18 0 102.18 2.18 2.18 2.18 0 00-2.18-2.18zM2 5.5v3a11.5 11.5 0 0111.5 11.5h-3A8.5 8.5 0 002 8.5zm0 6v3a5.5 5.5 0 015.5 5.5h3a8.5 8.5 0 00-8.5-8.5z" />
            </svg>
            <a href="https://blog.naver.com/dabincoltd2025" target="_blank" rel="noopener noreferrer" className="underline hover:text-emerald-400">
              다빈이앤씨 블로그
            </a>
          </p>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <ThemeToggle />

        {/* 기본 정보 입력 */}
        <section className="bg-gray-800 rounded-2xl shadow-xl p-4 sm:p-6 mb-8">
          <h2 className="text-lg sm:text-xl font-semibold text-emerald-300 mb-4">🔧 기본 정보 입력</h2>
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

        {/* 연간 수익 분석 차트 */}
        <section className="mb-8">
          <h2 className="text-lg sm:text-xl font-semibold text-emerald-300 mb-4">📈 연간 수익 분석</h2>
          <div className="bg-white text-black rounded-xl p-2 sm:p-4 h-64 sm:h-80">
            <ProfitChart data={chartData} breakEvenYear={breakEvenYear} />
          </div>
        </section>

        {/* 결과 요약 및 공유 */}
        {summary && (
          <section className="mb-8 space-y-6">
            <div className="bg-gray-700 rounded-lg p-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm sm:text-base">
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
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-center gap-4">
              <ExcelExport className="w-full sm:w-auto" summary={summary} chartData={chartData} />
              <ShareButton
                className="w-full sm:w-auto"
                summary={summary}
                chartData={chartData}
                projectName={projectName}
                date={date}
                contractAmount={contractAmount}
                contractCapacity={contractCapacity}
              />
            </div>
          </section>
        )}

        {/* 결과 요약 안내 */}
        <section className="mt-12 text-sm sm:text-base text-gray-300 space-y-2 border-t border-gray-700 pt-6">
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
            ※ 본 계산기는 추정치를 기초로 작성된 자료로、실제 수익과 차이가 발생할 수 있습니다。
            해당 자료는 참고용이며、법적 효력이 없습니다。
          </p>
        </section>
      </main>
    </div>
  );
}

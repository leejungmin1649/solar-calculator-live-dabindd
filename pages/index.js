import Head from 'next/head';
import Script from 'next/script';
import { useState, useEffect } from 'react';
import CalculatorForm from '../components/CalculatorForm';
import ProfitChart from '../components/ProfitChart';
import ExcelExport from '../components/ExcelExport';
import ThemeToggle from '../components/ThemeToggle';
import ShareButton from '../components/ShareButton';
import { decompressFromEncodedURIComponent } from 'lz-string';

export default function Home() {
  // 상태 선언
  const [chartData, setChartData] = useState([]);               // 차트 데이터
  const [breakEvenYear, setBreakEvenYear] = useState(null);     // 손익분기점 연도
  const [summary, setSummary] = useState(null);                 // 결과 요약
  const [projectName, setProjectName] = useState('');           // 프로젝트명
  const [date, setDate] = useState('');                         // 작성일자
  const [contractAmount, setContractAmount] = useState('');     // 계약 금액
  const [contractCapacity, setContractCapacity] = useState(''); // 계약 용량

  // 공유된 URL(data=…)로 상태 복원
  useEffect(() => {
    const raw = new URLSearchParams(window.location.search).get('data');
    if (!raw) return;
    try {
      const decoded = JSON.parse(decompressFromEncodedURIComponent(raw));
      setProjectName(decoded.projectName || '');
      setDate(decoded.date || '');
      setContractAmount(decoded.contractAmount || '');
      setContractCapacity(decoded.contractCapacity || '');
      setSummary(decoded.summary || null);
      setChartData(decoded.chartData || []);
    } catch (e) {
      console.error('⚠️ 데이터 복원 오류:', e);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      {/* 카카오 SDK 로드 및 초기화 */}
      <Script
        src="https://developers.kakao.com/sdk/js/kakao.min.js"
        strategy="afterInteractive"
        onLoad={() => {
          if (window.Kakao && !window.Kakao.isInitialized()) {
            window.Kakao.init('f5b4cfb16c5b2f8e213a1549a009307a');
            console.log('✅ Kakao SDK 초기화 완료');
          }
        }}
      />
      <Head>
        <title>태양광 수익성 계산기</title>
      </Head>

      <header className="text-center py-10 border-b border-gray-700">
        {/* 로고 */}
        <a href="http://www.dabinenc.com" target="_blank" rel="noopener noreferrer">
          <img src="/logo-dabin.png" alt="다빈이앤씨 로고" className="mx-auto w-32 h-auto mb-2" />
        </a>
        {/* 타이틀 */}
        <h1 className="text-3xl font-bold text-emerald-400">☀️ 태양광 수익성 계산기</h1>
        <p className="text-gray-400 mt-1 text-sm">실시간 수익 분석 & Excel 보고서 제공</p>
        {/* 전화 문의 */}
        <p className="text-gray-300 mt-2 text-sm flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-1 text-emerald-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.11-.21 11.36 11.36 0 003.55.57 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1 11.36 11.36 0 00.57 3.55 1 1 0 01-.21 1.11l-2.24 2.13z" />
          </svg>
          <a href="tel:0424841108" className="underline hover:text-emerald-400">042-484-1108</a>
          <span className="ml-2">(태양광 투자·토지개발·유통·공사·금융·RE100 문의)</span>
        </p>
        {/* 블로그 */}
        <p className="text-gray-300 mt-1 text-sm flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-1 text-emerald-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M4.18 15.82a2.18 2.18 0 102.18 2.18 2.18 2.18 0 00-2.18-2.18zM2 5.5v3a11.5 11.5 0 0111.5 11.5h-3A8.5 8.5 0 002 8.5zm0 6v3a5.5 5.5 0 015.5 5.5h3a8.5 8.5 0 00-8.5-8.5z" />
          </svg>
          <a href="https://blog.naver.com/dabincoltd2025" target="_blank" rel="noopener noreferrer" className="underline hover:text-emerald-400">
            다빈이앤씨 블로그
          </a>
        </p>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-10">
        <ThemeToggle />

        {/* 입력 폼 */}
        <section className="bg-gray-800 rounded-2xl shadow-xl p-6">
          <h2 className="text-xl font-semibold text-emerald-300 mb-4">🔧 기본 정보 입력</h2>
          <CalculatorForm
            onDataChange={(data, year, summaryData) => {
              setChartData(data);
              setBreakEvenYear(year);
              setSummary(summaryData);
            }}
            onMetaChange={({ projectName, date, contractAmount, contractCapacity }) => {
              setProjectName(projectName);
              setDate(date);
              setContractAmount(contractAmount);
              setContractCapacity(contractCapacity);
            }}
          />
        </section>

        {/* 결과 요약 */}
        {summary && (
          <>
            <section className="mt-10 space-y-1 text-sm text-white bg-gray-700 p-4 rounded-lg shadow">
              <h2 className="text-lg font-semibold text-emerald-400 mb-2">📊 결과 요약</h2>
              <div>📌 예상 발전량: {summary.yearlyGen.toLocaleString()} kWh</div>
              <div>💰 총 수익: {summary.revenue.toLocaleString()} 원</div>
              <div>🧰 운영비: {summary.operationCost.toLocaleString()} 원</div>
              <div>🏦 원리금 상환: {summary.yearlyRepayment.toLocaleString()} 원</div>
              <div>📈 순수익: {Math.round(summary.netProfit).toLocaleString()} 원</div>
              {Number(summary.equity) > 0 && <div>📊 자기자본 수익률: {Math.round(summary.roi)}%</div>}
              <div>⏱️ 회수기간: {summary.payback} 년</div>
            </section>

            {/* 공유 & 엑셀 */}
            <div className="mt-6 text-center">
              <ExcelExport summary={summary} chartData={chartData} />
              <ShareButton
                summary={summary}
                chartData={chartData}
                projectName={projectName}
                date={date}
                contractAmount={contractAmount}
                contractCapacity={contractCapacity}
              />
            </div>
          </>
        )}
      </main>

      <footer className="text-center text-gray-400 text-xs py-4">
        ※ 본 계산기는 추정치 기반 자료로, 실제와 차이가 있을 수 있습니다. 참고용이며 법적 효력 없음.
      </footer>
    </div>
  );
}

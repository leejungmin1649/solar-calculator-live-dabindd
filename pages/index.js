import Head from 'next/head';
import { useState } from 'react';
import CalculatorForm from '../components/CalculatorForm';
import ProfitChart from '../components/ProfitChart';
import ExcelExport from '../components/ExcelExport';
import ThemeToggle from '../components/ThemeToggle';

export default function Home() {
  const [chartData, setChartData] = useState([]);
  const [breakEvenYear, setBreakEvenYear] = useState(null);
  const [summary, setSummary] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <Head>
        <title>태양광 수익성 계산기</title>
      </Head>

      <header className="text-center py-10 border-b border-gray-700">
        <a href="http://www.dabinenc.com" target="_blank" rel="noopener noreferrer">
          <img src="/logo-dabin.png" alt="다빈이앤씨 로고" className="mx-auto w-32 h-auto mb-2" />
        </a>
        <h1 className="text-3xl font-bold tracking-tight text-emerald-400">
          ☀️ 태양광 수익성 계산기
        </h1>
        <p className="text-gray-400 mt-1 text-sm">실시간 수익 분석 & Excel 보고서 제공</p>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-10">
        <ThemeToggle />

        <div className="bg-gray-800 rounded-2xl shadow-xl p-6">
          <h2 className="text-xl font-semibold text-emerald-300 mb-4">🔧 기본 정보 입력</h2>
          <CalculatorForm
            onDataChange={(data, year, summaryData) => {
              setChartData(data);
              setBreakEvenYear(year);
              setSummary(summaryData);
            }}
          />
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
              <div>📈 순수익: {summary.netProfit.toLocaleString()} 원</div>
              <div>📊 자기자본 수익률: {summary.roi}%</div>
              <div>📊 대출금 수익률: {summary.loanRoi}%</div> {/* 추가된 부분 */}
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
            <li>📊 대출금 수익률은 연간 순수익 ÷ 대출금 × 100 입니다.</li> {/* 안내 추가 */}
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
import Head from 'next/head';
import { useState } from 'react';
import CalculatorForm from '../components/CalculatorForm';
import ProfitChart from '../components/ProfitChart';
import ExcelExport from '../components/ExcelExport'; // ✅ 변경
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
              <div>⏱️ 회수기간: {typeof summary.payback === 'number' ? `${summary.payback} 년` : '-'}</div>
            </div>

            <div className="mt-6 text-center">
              <ExcelExport summary={summary} chartData={chartData} /> {/* ✅ 변경된 부분 */}
            </div>
          </>
        )}

        <div className="mt-12 text-sm text-gray-300 space-y-2 border-t border-gray-700 pt-6">
          <p className="font-semibold">📌 결과 요약 안내</p>
          <ul className="list-disc list-inside space-y-1">
            <li

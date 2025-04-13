import Head from 'next/head';
import { useState } from 'react';
import { CalculatorForm } from '../components/CalculatorForm';
import { ProfitChart } from '../components/ProfitChart';

export default function Home() {
  const [chartData, setChartData] = useState([]);
  const [breakEvenYear, setBreakEvenYear] = useState(null);

  return (
    <div className="bg-gray-900 min-h-screen text-white p-4 sm:p-8">
      <Head>
        <title>태양광 수익성 계산기</title>
      </Head>
      <header className="text-center mb-6">
        <a href="http://www.dabinenc.com" className="text-sm text-blue-400 underline">www.dabinenc.com</a>
        <h1 className="text-2xl font-bold mt-2">태양광 수익성 계산기</h1>
      </header>
      <CalculatorForm onDataChange={(data, year) => {
        setChartData(data);
        setBreakEvenYear(year);
      }} />
      <div className="mt-8">
        <ProfitChart data={chartData} breakEvenYear={breakEvenYear} />
      </div>
      <footer className="mt-6 text-xs text-center text-gray-400">
        ※ 본 수지분석표는 주정차를 기초로 작성된 자료로 실제 수익과 차이가 발생할 수 있습니다. 해당 자료는 참고용이며, 법적 효력이 없음을 안내드립니다.
      </footer>
    </div>
  );
}
import Head from 'next/head';
import { useState } from 'react';
import { CalculatorForm } from '../components/CalculatorForm';
import { ProfitChart } from '../components/ProfitChart';
import PdfExport from '../components/PdfExport';

export default function Home() {
  const [chartData, setChartData] = useState([]);
  const [breakEvenYear, setBreakEvenYear] = useState(null);
  const [summary, setSummary] = useState(null);

  return (
    <div className="bg-gray-900 min-h-screen text-white p-4 sm:p-8">
      <Head>
        <title>태양광 수익성 계산기</title>
      </Head>

      <header className="text-center mb-6">
        <a href="http://www.dabinenc.com" target="_blank" rel="noopener noreferrer">
          <img
            src="/logo-dabin.png"
            alt="다빈이앤씨 로고"
            className="mx-auto w-40 h-auto mb-2"
          />
        </a>
        <h1 className="text-2xl font-bold">태양광 수익성 계산기</h1>
      </header>

      <CalculatorForm onDataChange={(data, year, summaryData) => {
        setChartData(data);
        setBreakEvenYear(year);
        setSummary(summaryData);
      }} />

      <div className="mt-8">
        <ProfitChart data={chartData} breakEvenYear={breakEvenYear} />
      </div>

      <div className="flex justify-center mt-6">
        {summary && <PdfExport summary={summary} />}
      </div>

      <div className="mt-10 text-sm text-gray-300 space-y-2">
        <p className="font-semibold">📌 결과 요약 안내</p>
        <ul className="list-disc list-inside space-y-1">
          <li>예상 발전량은 설치용량과 일일 발전시간을 기준으로 연간 발전량을 추정한 값입니다.</li>
          <li>총 수익은 SMP와 REC 단가를 기반으로 연간 수익을 계산한 결과입니다.</li>
          <li>순수익은 연간 운영비용과 대출 원리금 상환을 제외한 실제 수익을 의미합니다.</li>
          <li>자기자본 수익률은 연간 순수익을 자기자본으로 나눈 비율로, 투자 대비 수익성을 나타냅니다.</li>
          <li>회수기간은 순수익을 기준으로 자기자본이 회수되는 데 걸리는 예상 연도 수입니다.</li>
        </ul>
        <p className="mt-3 text-sm text-gray-400">
          ※ 위 계산 결과는 설치용량 100kW, 일일 발전시간 3.5시간, SMP 140원, REC 70원, 자기자본 7천만 원, 대출 1억5천만 원, 이자율 5.8%, 상환기간 10년을 기준으로 추정한 예시입니다.
        </p>
        <p className="text-sm text-gray-400">
          ※ 본 계산기는 추정치를 기초로 작성된 자료로 실제 수익과 차이가 발생할 수 있습니다. 해당 자료는 참고용이며, 법적 효력이 없음을 안내드립니다.
        </p>
      </div>
    </div>
  );
}

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

  // URL 복원 로직 (페이지 로드 시 자동 실행)
  useEffect(() => {
    if (typeof window === 'undefined') return;
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
  }, []); // 빈 배열로 한 번만 실행

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <Head>
        <title>태양광 수익성 계산기</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* Kakao SDK를 페이지 로드 전에 미리 로드 */}
      <Script
        src="https://developers.kakao.com/sdk/js/kakao.min.js"
        strategy="beforeInteractive"
      />

      <header className="text-center py-6 px-4 sm:py-10 sm:px-6 border-b border-gray-700">
        {/* ...헤더 생략... */}
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <ThemeToggle />

        {/* 입력 섹션 */}
        <section className="bg-gray-800 rounded-2xl shadow-xl p-4 sm:p-6 mb-8">
          {/* ...CalculatorForm... */}
        </section>

        {/* 차트 섹션 */}
        <section className="mb-8">
          {/* ...ProfitChart... */}
        </section>

        {/* 결과 요약 및 공유 */}
        {summary && (
          <section className="mb-8 space-y-6">
            <div className="bg-gray-700 rounded-lg p-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm sm:text-base">
              {/* ...결과 요약 카드... */}
            </div>

            {/* 버튼 섹션: 카카오톡 공유 & 링크 복사 */}
            <div className="my-8 flex flex-col sm:flex-row sm:justify-center gap-4">
              <ExcelExport className="flex-1 w-full text-center" summary={summary} chartData={chartData} />
              <ShareButton
                className="flex-1 w-full text-center"
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

        {/* 안내문구 */}
        <section className="mt-12 text-sm sm:text-base text-gray-300 space-y-2 border-t border-gray-700 pt-6">
          {/* ...안내 문구... */}
        </section>
      </main>
    </div>
  );
}

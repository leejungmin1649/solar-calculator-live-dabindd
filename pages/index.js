// pages/index.js
import Head from 'next/head';
import { useState, useEffect } from 'react';
import CalculatorForm from '../components/CalculatorForm';
import ProfitChart from '../components/ProfitChart';
import ExcelExport from '../components/ExcelExport';
import ThemeToggle from '../components/ThemeToggle';
import ShareButton from '../components/ShareButton';
import { decompressFromEncodedURIComponent } from 'lz-string';

export default function Home() {
  const [chartData, setChartData] = useState([]);
  const [breakEvenYear, setBreakEvenYear] = useState(null);
  const [summary, setSummary] = useState(null);
  const [projectName, setProjectName] = useState('');
  const [date, setDate] = useState('');
  const [contractAmount, setContractAmount] = useState('');
  const [contractCapacity, setContractCapacity] = useState('');

  // URL 복원
  useEffect(() => {
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
  }, [typeof window !== 'undefined' && window.location.search]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <Head>
        <title>태양광 수익성 계산기</title>
      </Head>

      <header className="py-10 border-b border-gray-700">
        <div className="max-w-5xl mx-auto px-4 flex flex-col items-center text-center space-y-4 sm:flex-row sm:justify-between sm:items-center sm:space-y-0 sm:text-left">
          {/* 로고 + 타이틀 */}
          <div className="flex flex-col items-center sm:flex-row sm:items-center sm:space-x-3">
            <a href="http://www.dabinenc.com" target="_blank" rel="noopener noreferrer">
              <img src="/logo-dabin.png" alt="다빈이앤씨 로고" className="w-32 h-auto mb-2 sm:mb-0" />
            </a>
            <div>
              <h1 className="text-3xl font-bold text-emerald-400">☀️ 태양광 수익성 계산기</h1>
              <p className="text-gray-400 text-sm">실시간 수익 분석 & Excel 보고서 제공</p>
            </div>
          </div>
          {/* 연락처 & 블로그 */}
          <div className="flex flex-col items-center space-y-2 sm:flex-row sm:space-x-6 sm:space-y-0">
            <div className="flex items-center space-x-1 text-sm text-gray-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.11-.21 11.36 11.36 0 003.55.57 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1 11.36 11.36 0 00.57 3.55 1 1 0 01-.21 1.11l-2.24 2.13z" />
              </svg>
              <a href="tel:042-484-1108" className="underline hover:text-emerald-400">042-484-1108</a>
              <span className="ml-1">(태양광 투자, 토지개발, 유통, 공사, 금융, RE100 문의)</span>
            </div>
            <div className="flex items-center space-x-1 text-sm text-gray-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4.18 15.82a2.18 2.18 0 102.18 2.18 2.18 2.18 0 00-2.18-2.18zM2 5.5v3a11.5 11.5 0 0111.5 11.5h-3A8.5 8.5 0 002 8.5zm0 6v3a5.5 5.5 0 015.5 5.5h3a8.5 8.5 0 00-8.5-8.5z"/>
              </svg>
              <a href="https://blog.naver.com/dabincoltd2025" target="_blank" rel="noopener noreferrer" className="underline hover:text-emerald-400">다빈이앤씨 블로그</a>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-10">
        <ThemeToggle />

        <div className="bg-gray

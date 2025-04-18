'use client';

import * as XLSX from 'xlsx';

export default function ExcelExport({ summary, chartData }) {
  const handleDownload = () => {
    if (!summary) return alert('요약 정보가 없습니다.');

    const wb = XLSX.utils.book_new();

    // 📊 1. 요약 정보 시트
    const summarySheet = XLSX.utils.aoa_to_sheet([
      ['항목', '값'],
      ['예상 발전량', `${summary.yearlyGen.toLocaleString()} kWh`],
      ['총 수익', `${summary.revenue.toLocaleString()} KRW`],
      ['운영비용', `${summary.operationCost.toLocaleString()} KRW`],
      ['연간 원리금 상환', `${summary.yearlyRepayment.toLocaleString()} KRW`],
      ['순수익', `${summary.netProfit.toLocaleString()} KRW`],
      ['자기자본 수익률', `${summary.roi}%`],
      ['회수기간', typeof summary.payback === 'number' ? `${summary.payback} 년` : '-']
    ]);
    XLSX.utils.book_append_sheet(wb, summarySheet, '결과 요약');

    // 📈 2. 연간 수익 그래프 시트
    if (chartData?.length) {
      const chartSheet = XLSX.utils.json_to_sheet(chartData);
      XLSX.utils.book_append_sheet(wb, chartSheet, '연간 수익');
    }

    XLSX.writeFile(wb, '태양광_수익성_보고서.xlsx');
  };

  return (
    <button
      onClick={handleDownload}
      className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded shadow"
    >
      📊 엑셀 다운로드
    </button>
  );
}

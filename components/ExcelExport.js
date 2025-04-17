'use client';

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export default function ExcelExport({ summary, chartData }) {
  const handleExport = () => {
    const workbook = XLSX.utils.book_new();

    // ✅ 시트 1: 결과 요약
    const summaryData = [
      ['항목', '값'],
      ['예상 발전량 (kWh)', summary?.yearlyGen],
      ['총 수익 (KRW)', summary?.revenue],
      ['운영비용 (KRW)', summary?.operationCost],
      ['연간 원리금 상환 (KRW)', summary?.yearlyRepayment],
      ['순수익 (KRW)', summary?.netProfit],
      ['자기자본 수익률 (%)', summary?.roi],
      ['회수기간 (년)', summary?.payback],
    ];
    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(workbook, summarySheet, '수익 요약');

    // ✅ 시트 2: 연도별 수익
    const chartSheetData = [
      ['연도', '연간 순수익', '누적 수익'],
      ...chartData.map((d) => [d.year, d.netProfit, d.cumulativeProfit]),
    ];
    const chartSheet = XLSX.utils.aoa_to_sheet(chartSheetData);
    XLSX.utils.book_append_sheet(workbook, chartSheet, '연도별 수익');

    // ✅ 엑셀 파일로 저장
    const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/octet-stream' });
    saveAs(blob, '태양광_수익성_보고서.xlsx');
  };

  return (
    <button
      onClick={handleExport}
      className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded shadow mt-6"
    >
      📊 Excel 다운로드
    </button>
  );
}

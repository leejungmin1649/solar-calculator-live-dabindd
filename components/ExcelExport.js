'use client';

import * as XLSX from 'xlsx';

export default function ExcelExport({ summary, chartData }) {
  const handleExport = () => {
    const wb = XLSX.utils.book_new();

    // 1. 결과 요약 시트
    const summarySheetData = [
      ['항목', '값'],
      ['예상 발전량', `${summary?.yearlyGen?.toLocaleString()} kWh`],
      ['총 수익', `${summary?.revenue?.toLocaleString()} KRW`],
      ['운영비용', `${summary?.operationCost?.toLocaleString()} KRW`],
      ['연간 원리금 상환(평균)', `${summary?.yearlyRepayment?.toLocaleString()} KRW`],
      ['순수익', `${summary?.netProfit?.toLocaleString()} KRW`],
      ['자기자본 수익률', `${summary?.roi}%`],
      ['대출금 수익률', `${summary?.loanRoi}%`],
      ['회수기간', typeof summary?.payback === 'number' ? `${summary?.payback} 년` : '-']
    ];
    const summarySheet = XLSX.utils.aoa_to_sheet(summarySheetData);
    XLSX.utils.book_append_sheet(wb, summarySheet, '수익 요약');

    // 2. 연간 수익 데이터 시트 (상환금액 추가)
    if (chartData?.length > 0) {
      const dataSheetData = [
        ['연도', '연간 순수익 (KRW)', '누적 순수익 (KRW)', '연간 상환금 (KRW)']
      ];

      chartData.forEach((item) => {
        dataSheetData.push([
          item.year,
          item.netProfit?.toLocaleString() || 0,
          item.cumulativeProfit?.toLocaleString() || 0,
          item.yearlyRepayment?.toLocaleString() || 0, // ⭐ 연간 상환금 추가
        ]);
      });

      const dataSheet = XLSX.utils.aoa_to_sheet(dataSheetData);
      XLSX.utils.book_append_sheet(wb, dataSheet, '연간 수익 데이터');
    }

    XLSX.writeFile(wb, '태양광_수익성_계산_결과.xlsx');
  };

  return (
    <button
      onClick={handleExport}
      className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded shadow mt-4"
    >
      📊 Excel 다운로드
    </button>
  );
}

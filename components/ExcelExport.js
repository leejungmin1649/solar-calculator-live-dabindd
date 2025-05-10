// components/ExcelExport.js
'use client';

import * as XLSX from 'xlsx';

export default function ExcelExport({
  summary,
  chartData,
  contractCapacity = '',
  totalInvestment = 0,
  className = '',
}) {
  const handleExport = () => {
    const wb = XLSX.utils.book_new();

    // 1. 결과 요약 시트
    const summarySheetData = [
      ['항목', '값'],
      ['🔋 설치 용량', contractCapacity ? `${contractCapacity} kW` : '- kW'],
      ['💳 계약 금액', totalInvestment ? `${totalInvestment.toLocaleString()} 원` : '- 원'],
      ['🏦 대출 금액', summary?.loan ? `${summary.loan.toLocaleString()} 원` : '- 원'],
      ['📌 예상 발전량', `${summary?.yearlyGen?.toLocaleString()} kWh`],
      ['💰 총 수익', `${summary?.revenue?.toLocaleString()} KRW`],
      ['🛠️ 운영비용', `${summary?.operationCost?.toLocaleString()} KRW`],
      ['🏦 연간 원리금 상환(평균)', `${summary?.yearlyRepayment?.toLocaleString()} KRW`],
      ['📈 순수익', `${summary?.netProfit?.toLocaleString()} KRW`],
      ['📊 자기자본 수익률', `${summary?.roi}%`],
      ['📊 대출금 수익률', `${summary?.loanRoi}%`],
      ['⏱️ 회수기간', typeof summary?.payback === 'number' ? `${summary.payback} 년` : '-'],
    ];
    const summarySheet = XLSX.utils.aoa_to_sheet(summarySheetData);
    XLSX.utils.book_append_sheet(wb, summarySheet, '수익 요약');

    // 2. 연간 수익 데이터 시트
    if (chartData?.length > 0) {
      const dataSheetData = [
        ['연도', '연간 순수익 (KRW)', '누적 순수익 (KRW)', '연간 상환금 (KRW)'],
      ];

      chartData.forEach((item) => {
        dataSheetData.push([
          item.year,
          item.netProfit?.toLocaleString() || '0',
          item.cumulativeProfit?.toLocaleString() || '0',
          item.yearlyRepayment?.toLocaleString() || '0',
        ]);
      });

      const dataSheet = XLSX.utils.aoa_to_sheet(dataSheetData);
      XLSX.utils.book_append_sheet(wb, dataSheet, '연간 수익 데이터');
    }

    XLSX.writeFile(wb, '태양광_수익성_계산_결과.xlsx');
  };

  return (
    <button
      type="button"
      onClick={handleExport}
      className={`
        inline-flex items-center justify-center
        w-full sm:w-48 h-10
        text-sm leading-none
        rounded px-4 flex-1
        bg-yellow-500 hover:bg-yellow-600 text-white shadow
        ${className}
      `}
    >
      <span className="mr-2 flex-shrink-0">📊</span>
      <span className="leading-none">Excel 다운로드</span>
    </button>
  );
}

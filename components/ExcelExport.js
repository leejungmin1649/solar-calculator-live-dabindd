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

    // 1. 결과 요약 시트 (값을 숫자로 넣어 Excel이 텍스트가 아닌 숫자로 인식하게 합니다)
    const summarySheetData = [
      ['항목', '값'],
      ['🔋 설치 용량 (kW)', contractCapacity ? parseFloat(contractCapacity) : null],
      ['💳 총 투자금 (원)', totalInvestment || null],
      ['🏦 대출 금액 (원)', summary?.loan ?? null],
      ['📌 예상 발전량 (kWh)', summary?.yearlyGen ?? null],
      ['💰 총 수익 (KRW)', summary?.revenue ?? null],
      ['🛠️ 운영비용 (KRW)', summary?.operationCost ?? null],
      ['🏦 연간 원리금 상환(평균) (KRW)', summary?.yearlyRepayment ?? null],
      ['📈 순수익 (KRW)', summary?.netProfit ?? null],
      ['📊 자기자본 수익률 (%)', summary?.roi !== '-' ? parseFloat(summary.roi) : null],
      ['📊 대출금 수익률 (%)', summary?.loanRoi !== '-' ? parseFloat(summary.loanRoi) : null],
      ['⏱️ 회수기간 (년)', typeof summary?.payback === 'number' ? summary.payback : null],
    ];

    const summarySheet = XLSX.utils.aoa_to_sheet(summarySheetData);
    // 셀 서식 지정 (콤마 구분, 소수점 1자리 등) – 필요 시 z 프로퍼티를 설정할 수 있습니다.
    // 예: summarySheet['B2'].z = '#,##0.00'; 

    XLSX.utils.book_append_sheet(wb, summarySheet, '수익 요약');

    // 2. 연간 수익 데이터 시트
    if (chartData?.length) {
      const dataSheetData = [
        ['연도', '연간 순수익 (KRW)', '누적 순수익 (KRW)', '연간 상환금 (KRW)'],
        ...chartData.map(item => [
          item.year,
          item.netProfit,
          item.cumulativeProfit,
          item.yearlyRepayment,
        ]),
      ];
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

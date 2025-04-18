'use client';

import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

export default function ExcelExportWithChart({ summary, chartRef }) {
  const handleExport = async () => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('수익 요약');

    // 1. 텍스트 요약 정보
    const data = [
      ['항목', '값'],
      ['예상 발전량', `${summary?.yearlyGen?.toLocaleString()} kWh`],
      ['총 수익', `${summary?.revenue?.toLocaleString()} KRW`],
      ['운영비용', `${summary?.operationCost?.toLocaleString()} KRW`],
      ['연간 원리금 상환', `${summary?.yearlyRepayment?.toLocaleString()} KRW`],
      ['순수익', `${summary?.netProfit?.toLocaleString()} KRW`],
      ['자기자본 수익률', `${summary?.roi}%`],
      ['회수기간', typeof summary?.payback === 'number' ? `${summary?.payback} 년` : '-'],
    ];
    sheet.addRows(data);

    // 2. 차트 이미지 (canvas → base64 → Excel)
    if (chartRef?.current) {
      const chartCanvas = chartRef.current.querySelector('canvas');
      const imgData = chartCanvas?.toDataURL('image/png');
      const imageId = workbook.addImage({
        base64: imgData,
        extension: 'png',
      });
      sheet.addImage(imageId, {
        tl: { col: 3, row: 1 },
        ext: { width: 500, height: 300 },
      });
    }

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, '태양광_수익성_결과.xlsx');
  };

  return (
    <button
      onClick={handleExport}
      className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded shadow mt-4"
    >
      📊 Excel 다운로드 (차트 포함)
    </button>
  );
}

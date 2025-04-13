import jsPDF from 'jspdf';
import 'jspdf-autotable';
import font from '../public/NanumGothic.js';

export default function PdfExport({ summary }) {
  const handleDownload = () => {
    const doc = new jsPDF();

    // 한글 폰트 등록
    doc.addFileToVFS('NanumGothic.ttf', font);
    doc.addFont('NanumGothic.ttf', 'NanumGothic', 'normal');
    doc.setFont('NanumGothic');

    doc.setFontSize(14);
    doc.text('태양광 수익성 요약 보고서', 20, 20);

    const rows = [
      ['예상 발전량', `${summary?.yearlyGen?.toLocaleString()} kWh`],
      ['총 수익', `${summary?.revenue?.toLocaleString()} 원`],
      ['운영비', `${summary?.operationCost?.toLocaleString()} 원`],
      ['연간 원리금 상환', `${summary?.yearlyRepayment?.toLocaleString()} 원`],
      ['순수익', `${summary?.netProfit?.toLocaleString()} 원`],
      ['자기자본 수익률', `${summary?.roi}%`],
      ['회수기간', typeof summary?.payback === 'number' ? `${summary?.payback} 년` : '-'],
    ];

    doc.autoTable({ startY: 30, head: [['항목', '값']], body: rows });
    doc.text('※ 본 수지분석표는 참고용이며, 법적 효력이 없습니다.', 14, doc.lastAutoTable.finalY + 10);
    doc.save('태양광_수익성_분석.pdf');
  };

  return (
    <button
      onClick={handleDownload}
      className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 mt-6 rounded shadow"
    >
      PDF 다운로드
    </button>
  );
}
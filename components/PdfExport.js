import jsPDF from 'jspdf';
import 'jspdf-autotable';
import NanumGothic from './NanumGothic_full_utf8_safe'; // 꼭 이 파일을 import

export default function PdfExport({ summary }) {
  const handleDownload = () => {
    const doc = new jsPDF();
    doc.addFileToVFS('NanumGothic.ttf', NanumGothic);
    doc.addFont('NanumGothic.ttf', 'NanumGothic', 'normal');
    doc.setFont('NanumGothic');

    doc.setFontSize(16);
    doc.text('태양광 수익성 요약 보고서', 20, 20);

    const rows = [
      ['예상 발전량', `${summary?.yearlyGen?.toLocaleString()} kWh`],
      ['총 수익', `${summary?.revenue?.toLocaleString()} KRW`],
      ['운영비용', `${summary?.operationCost?.toLocaleString()} KRW`],
      ['연간 원리금 상환', `${summary?.yearlyRepayment?.toLocaleString()} KRW`],
      ['순수익', `${summary?.netProfit?.toLocaleString()} KRW`],
      ['자기자본 수익률', `${summary?.roi}%`],
      ['회수기간', typeof summary?.payback === 'number' ? `${summary?.payback} 년` : '-']
    ];

    doc.autoTable({
      startY: 30,
      head: [['항목', '값']],
      body: rows,
      styles: { font: 'NanumGothic', fontSize: 11 }
    });

    doc.text('※ 본 보고서는 참고용이며, 실제 수익과 차이가 발생할 수 있으며 법적 효력이 없습니다.', 14, doc.lastAutoTable.finalY + 20);
    doc.save('태양광_수익성_보고서.pdf');
  };

  return (
    <button onClick={handleDownload} className="bg-emerald-600 text-white px-4 py-2 rounded mt-6">
      📄 PDF 다운로드
    </button>
  );
}

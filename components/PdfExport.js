import jsPDF from 'jspdf';
import 'jspdf-autotable';
import NanumGothic from './NanumGothic_full.js'; // 반드시 base64 포함된 default export

export default function PdfExport({ summary }) {
  const handleDownload = () => {
    if (!summary) {
      alert('PDF로 출력할 데이터가 없습니다.');
      return;
    }

    const doc = new jsPDF();

    // ✅ 한글 폰트 등록
    doc.addFileToVFS('NanumGothic.ttf', NanumGothic);
    doc.addFont('NanumGothic.ttf', 'NanumGothic', 'normal');
    doc.setFont('NanumGothic');

    // ✅ 제목
    doc.setFontSize(14);
    doc.text('태양광 수익성 요약 보고서', 20, 20);

    // ✅ 데이터 표 구성
    const rows = [
      ['예상 발전량', `${summary?.yearlyGen?.toLocaleString()} kWh`],
      ['총 수익', `${summary?.revenue?.toLocaleString()} 원`],
      ['운영비', `${summary?.operationCost?.toLocaleString()} 원`],
      ['연간 원리금 상환', `${summary?.yearlyRepayment?.toLocaleString()} 원`],
      ['순수익', `${summary?.netProfit?.toLocaleString()} 원`],
      ['자기자본 수익률', `${summary?.roi}%`],
      ['회수기간', typeof summary?.payback === 'number' ? `${summary?.payback} 년` : '-']
    ];

    doc.autoTable({
      startY: 30,
      head: [['항목', '값']],
      body: rows,
      styles: {
        font: 'NanumGothic',
        fontSize: 11,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [22, 163, 74], // emerald-600
        textColor: 255,
        fontStyle: 'bold',
      }
    });

    // ✅ 법적 고지 문구
    const tableY = doc.lastAutoTable?.finalY || 40;
    doc.setFontSize(10);
    doc.text(
      '※ 본 계산기는 추정치를 기반으로 작성된 참고 자료이며, 법적 효력이 없습니다.',
      14,
      tableY + 12
    );

    // ✅ 저장
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

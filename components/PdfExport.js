'use client';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useState } from 'react';

export default function PdfExport() {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    const chartContainer = document.getElementById('chart-wrapper');

    if (!chartContainer) {
      alert('차트가 아직 로딩되지 않았습니다.');
      return;
    }

    setLoading(true);

    try {
      const canvas = await html2canvas(chartContainer, {
        scale: 2,
        useCORS: true,
        allowTaint: true
      });

      const imgData = canvas.toDataURL('image/png');
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const imgProps = doc.getImageProperties(imgData);
      const pdfWidth = 210;
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      doc.addImage(imgData, 'PNG', 0, 10, pdfWidth, pdfHeight);
      doc.save('태양광_수익성_분석.pdf');
    } catch (error) {
      console.error('PDF 생성 오류:', error);
      alert('PDF 생성 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-4 mt-6 justify-center">
      <button
        onClick={handleDownload}
        disabled={loading}
        className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded shadow"
      >
        {loading ? '로딩 중...' : '📄 PDF 다운로드'}
      </button>
    </div>
  );
}

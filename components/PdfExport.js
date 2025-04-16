'use client';

import jsPDF from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';
import NanumGothic from './NanumGothic_full';
import { useState } from 'react';

export default function PdfExport({ summary, chartContent }) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async (lang = 'ko') => {
    const chartContainer = document.getElementById('chart-wrapper');

    if (!chartContainer) {
      alert('차트가 아직 로딩되지 않았습니다. 잠시 후 다시 시도해주세요.');
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const canvas = await html2canvas(chartContainer);
      const chartImage = canvas.toDataURL('image/png');
      const doc = new jsPDF();

      doc.addFileToVFS('NanumGothic.ttf', NanumGothic);
      doc.addFont('NanumGothic.ttf', 'NanumGothic', 'normal');
      doc.setFont('NanumGothic');

      const isKo = lang === 'ko';
      const t = (en, ko) => (isKo ? ko : en);

      doc.setFontSize(16);
      doc.text(t('Solar Profitability Summary Report', '태양광 수익성 요약 보고서'), 20, 20);

      const rows = [
        [t('Expected Generation', '예상 발전량'), `${summary?.yearlyGen?.toLocaleString()} kWh`],
        [t('Total Revenue', '총 수익'), `${summary?.revenue?.toLocaleString()} KRW`],
        [t('Operating Cost', '운영비용'), `${summary?.operationCost?.toLocaleString()} KRW`],
        [t('Annual Loan Repayment', '연간 원리금 상환'), `${summary?.yearlyRepayment?.toLocaleString()} KRW`],
        [t('Net Profit', '순수익'), `${summary?.netProfit?.toLocaleString()} KRW`],
        [t('ROI (Equity)', '자기자본 수익률'), `${summary?.roi}%`],
        [t('Payback Period', '회수기간'), typeof summary?.payback === 'number' ? `${summary?.payback} ${t('years', '년')}` : '-']
      ];

      doc.autoTable({
        startY: 30,
        head: [[t('Item', '항목'), t('Value', '값')]],
        body: rows,
        styles: { font: 'NanumGothic', fontSize: 11 }
      });

      const tableY = doc.lastAutoTable.finalY || 50;

      doc.setFontSize(12);
      doc.text(t('📈 Profit Graph', '📈 수익 그래프'), 14, tableY + 12);
      doc.addImage(chartImage, 'PNG', 14, tableY + 18, 180, 80);

      doc.setFontSize(10);
      doc.text(
        t(
          '※ This report is for reference only. Actual profits may vary and this has no legal effect.',
          '※ 본 보고서는 참고용이며, 실제 수익과 차이가 발생할 수 있으며 법적 효력이 없습니다.'
        ),
        14,
        tableY + 105
      );

      doc.text(
        t('Company: Dabin ENC | www.dabinenc.com', '회사: 다빈이앤씨 | www.dabinenc.com'),
        14,
        285
      );

      doc.save(isKo ? '태양광_수익성_보고서.pdf' : 'solar_profitability_report.pdf');
      setLoading(false);
    } catch (error) {
      console.error('PDF 생성 중 오류 발생:', error);
      alert('PDF 생성 중 오류가 발생했습니다.');
      setLoading(false);
    }
  };

  return (
    <>
      <div id="chart-wrapper">
        {chartContent}
      </div>

      <div className="flex gap-4 mt-6">
        <button
          onClick={() => handleDownload('ko')}
          disabled={loading}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded shadow"
        >
          {loading ? '로딩 중...' : '📄 PDF 다운로드 (국문)'}
        </button>
        <button
          onClick={() => handleDownload('en')}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
        >
          {loading ? 'Loading...' : '📄 Download PDF (EN)'}
        </button>
      </div>
    </>
  );
}
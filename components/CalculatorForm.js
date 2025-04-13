import React, { useState, useEffect } from 'react';

function calculatePMT(rate, nper, pv) {
  return (rate * pv) / (1 - Math.pow(1 + rate, -nper));
}

function parseNumber(value) {
  return parseFloat((value || '0').toString().replace(/,/g, '')) || 0;
}

export function CalculatorForm({ onDataChange }) {
  const [form, setForm] = useState({
    capacity: 100,
    hours: 3.5,
    smp: 140,
    rec: 70,
    weight: 1.0,
    operationCost: 0,
    equity: '70,000,000',
    loan: '150,000,000',
    interest: 5.8,
    term: 10
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const capacity = parseNumber(form.capacity);
  const hours = parseNumber(form.hours);
  const smp = parseNumber(form.smp);
  const rec = parseNumber(form.rec);
  const weight = parseNumber(form.weight);
  const operationCost = parseNumber(form.operationCost);
  const equity = parseNumber(form.equity);
  const loan = parseNumber(form.loan);
  const interest = parseNumber(form.interest);
  const term = parseNumber(form.term);

  const yearlyGen = capacity * 365 * hours;
  const revenue = yearlyGen * (smp + rec * weight);
  const monthlyRate = interest / 100 / 12;
  const nper = term * 12;
  const pmt = calculatePMT(monthlyRate, nper, loan);
  const yearlyRepayment = Math.round(pmt * 12);
  const netProfit = revenue - operationCost - yearlyRepayment;
  const payback = netProfit > 0 ? Math.ceil(equity / netProfit) : '-';
  const roi = netProfit > 0 ? ((netProfit / equity) * 100).toFixed(1) : '-';

  useEffect(() => {
    const data = [];
    let cumulative = 0;
    let breakEvenYear = null;
    for (let y = 1; y <= term; y++) {
      const yearly = netProfit;
      cumulative += yearly;
      data.push({ year: y, netProfit: yearly, cumulativeProfit: cumulative });
      if (breakEvenYear === null && cumulative >= equity) {
        breakEvenYear = y;
      }
    }
    const summary = {
      yearlyGen,
      revenue,
      operationCost,
      yearlyRepayment,
      netProfit,
      roi,
      payback
    };
    onDataChange?.(data, breakEvenYear, summary);
  }, [form]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {[
        ['capacity', '설치용량 (kW)'],
        ['hours', '일일 발전시간 (h)'],
        ['smp', 'SMP 단가 (원/kWh)'],
        ['rec', 'REC 단가 (원/kWh)'],
        ['weight', 'REC 가중치'],
        ['operationCost', '운영비용 (원)'],
        ['equity', '투자금액 (원)'],
        ['loan', '대출금 (원)'],
        ['interest', '이자율 (%)'],
        ['term', '상환기간 (년)'],
      ].map(([name, label]) => (
        <div key={name}>
          <label className="block text-sm font-medium text-white mb-1">{label}</label>
          <input
            name={name}
            value={form[name]}
            onChange={handleChange}
            className="w-full h-10 px-4 text-sm text-black bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      ))}

      <div className="col-span-1 md:col-span-2 mt-6 space-y-1 text-sm text-white">
        <h2 className="font-semibold text-lg">결과 요약</h2>
        <div>예상 발전량: {yearlyGen.toLocaleString()} kWh</div>
        <div>총 수익: {revenue.toLocaleString()} 원</div>
        <div>운영비: {operationCost.toLocaleString()} 원</div>
        <div>연간 원리금 상환: {isNaN(yearlyRepayment) ? '-' : yearlyRepayment.toLocaleString()} 원</div>
        <div>순수익: {isNaN(netProfit) ? '-' : netProfit.toLocaleString()} 원</div>
        <div>자기자본 수익률: {roi === '-' ? '-' : `${roi}%`}</div>
        <div>회수기간: {typeof payback === 'number' ? `${payback} 년` : '-'}</div>
      </div>
    </div>
  );
}

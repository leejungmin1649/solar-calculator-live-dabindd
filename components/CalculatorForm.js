import { useState, useEffect } from 'react';

export default function CalculatorForm({ onDataChange }) {
  const [form, setForm] = useState({
    capacity: '100',
    hours: '3.5',
    smp: '130',
    rec: '70',
    weight: '1.2',
    operationCost: '0',
    equity: '80,000,000',
    loan: '150,000,000',
    interest: '5.8',
    term: '10',
    deferPeriod: '0' // ⭐ 거치기간 (년)
  });

  const formatNumber = (value) => {
    const number = value.toString().replace(/,/g, '');
    if (isNaN(Number(number))) return '';
    return Number(number).toLocaleString();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const isCurrencyField = ['equity', 'loan', 'operationCost'].includes(name);
    const formatted = isCurrencyField ? formatNumber(value) : value;
    setForm({ ...form, [name]: formatted });
  };

  const parseNumber = (v) => parseFloat((v || '0').toString().replace(/,/g, '')) || 0;

  useEffect(() => {
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
    const deferPeriod = parseNumber(form.deferPeriod);

    const yearlyGen = capacity * 365 * hours;
    const revenue = yearlyGen * (smp + rec * weight);
    const monthlyRate = interest / 100 / 12;
    const nper = (term - deferPeriod) * 12; // 거치 제외 상환개월
    const pmt = nper > 0 ? (monthlyRate * loan) / (1 - Math.pow(1 + monthlyRate, -nper)) : 0;

    let data = [];
    let cumulativeProfit = 0;
    let breakEvenYear = null;

    for (let i = 0; i < term; i++) {
      let yearlyRepayment;

      if (i < deferPeriod) {
        // 거치기간: 이자만 납부
        yearlyRepayment = loan * (interest / 100);
      } else {
        // 상환기간: 원리금 균등상환
        yearlyRepayment = pmt * 12;
      }

      const netProfit = revenue - operationCost - yearlyRepayment;
      cumulativeProfit += netProfit;

      if (!breakEvenYear) {
        const target = equity > 0 ? equity : loan;
        if (cumulativeProfit >= target) {
          breakEvenYear = i + 1;
        }
      }

      data.push({
        year: i + 1,
        netProfit,
        cumulativeProfit,
        yearlyRepayment: Math.round(yearlyRepayment) // ⭐ 연간 상환금 기록
      });
    }

    const lastYear = data[data.length - 1];
    const finalNetProfit = lastYear ? lastYear.netProfit : 0;

    const roi = equity > 0 && finalNetProfit > 0 ? ((finalNetProfit / equity) * 100).toFixed(1) : '-';
    const loanRoi = loan > 0 && finalNetProfit > 0 ? ((finalNetProfit / loan) * 100).toFixed(1) : '0.0';
    const payback = finalNetProfit > 0
      ? (equity > 0
          ? Math.ceil(equity / finalNetProfit)
          : loan > 0
            ? Math.ceil(loan / finalNetProfit)
            : '-')
      : '-';

    const summary = {
      yearlyGen,
      revenue,
      operationCost,
      yearlyRepayment: Math.round(pmt * 12),
      netProfit: finalNetProfit,
      payback,
      roi,
      loanRoi,
      equity, // ⭐ 추가! (Home.jsx에서 구분할 수 있게)
    };

    onDataChange(data, breakEvenYear, summary);
  }, [form]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {[
        ['capacity', '설치용량 (kW)'],
        ['hours', '일일 발전시간 (h)'],
        ['smp', 'SMP 단가 (원/kWh)'],
        ['rec', 'REC 단가 (원/kWh)'],
        ['weight', 'REC 가중치'],
        ['operationCost', '운영비용 (원)'],
        ['equity', '자기자본 (원)'],
        ['loan', '대출금액 (원)'],
        ['interest', '이자율 (%)'],
        ['term', '상환기간 (년)'],
        ['deferPeriod', '거치기간 (년)'], // ⭐ 입력란
      ].map(([name, label]) => (
        <div key={name}>
          <label className="block mb-1 font-medium text-sm">{label}</label>
          <input
            name={name}
            value={form[name]}
            onChange={handleChange}
            className="w-full h-11 px-3 py-2 text-sm bg-gray-100 dark:bg-gray-800 text-black dark:text-white border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      ))}
    </div>
  );
}

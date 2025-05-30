// components/CalculatorForm.js
import { useState, useEffect } from 'react';

export default function CalculatorForm({ onDataChange, onMetaChange }) {
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
    deferPeriod: '0'
  });

  // 1. Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('solarCalcForm');
    if (saved) {
      setForm(JSON.parse(saved));
    }
  }, []);

  // 2. Save to localStorage when form changes
  useEffect(() => {
    localStorage.setItem('solarCalcForm', JSON.stringify(form));
  }, [form]);

  // 3. Notify parent of meta changes (contractAmount, contractCapacity)
  useEffect(() => {
    if (onMetaChange) {
      onMetaChange({
        contractAmount: form.equity,
        contractCapacity: form.capacity
      });
    }
  }, [form.equity, form.capacity, onMetaChange]);

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

  // 4. Calculate data and summary, then notify parent
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
    const nper = (term - deferPeriod) * 12;
    const pmt =
      nper > 0
        ? (monthlyRate * loan) / (1 - Math.pow(1 + monthlyRate, -nper))
        : 0;

    let data = [];
    let cumulativeProfit = 0;
    let breakEvenYear = null;

    for (let i = 0; i < term; i++) {
      const yearlyRepayment =
        i < deferPeriod ? loan * (interest / 100) : pmt * 12;

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
        yearlyRepayment: Math.round(yearlyRepayment)
      });
    }

    const lastYear = data[data.length - 1];
    const finalNetProfit = lastYear ? lastYear.netProfit : 0;
    const roi =
      equity > 0 && finalNetProfit > 0
        ? ((finalNetProfit / equity) * 100).toFixed(1)
        : '-';
    const loanRoi =
      loan > 0 && finalNetProfit > 0
        ? ((finalNetProfit / loan) * 100).toFixed(1)
        : '0.0';
    const payback = finalNetProfit > 0
      ? equity > 0
        ? Math.ceil(equity / finalNetProfit)
        : loan > 0
        ? Math.ceil(loan / finalNetProfit)
        : '-'
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
      equity,
      loan
    };

    onDataChange(data, breakEvenYear, summary);
  }, [form, onDataChange]);

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
        ['deferPeriod', '거치기간 (년)']
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

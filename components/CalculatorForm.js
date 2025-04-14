import { useState, useEffect } from 'react';

export default function CalculatorForm({ onDataChange }) {
  const [form, setForm] = useState({
    capacity: '100',
    hours: '3.5',
    smp: '140',
    rec: '70',
    weight: '1.0',
    operationCost: '0',
    equity: '70,000,000',
    loan: '150,000,000',
    interest: '5.8',
    term: '10'
  });

  // 천단위 콤마 포맷 함수
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
    // 숫자 파싱
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

    // 계산
    const yearlyGen = capacity * 365 * hours;
    const revenue = yearlyGen * (smp + rec * weight);
    const monthlyRate = interest / 100 / 12;
    const nper = term * 12;
    const pmt = loan > 0 ? (monthlyRate * loan) / (1 - Math.pow(1 + monthlyRate, -nper)) : 0;
    const yearlyRepayment = loan > 0 ? Math.round(pmt * 12) : 0;

    const netProfit = revenue - operationCost - yearlyRepayment;

    const roi = equity > 0 ? ((netProfit / equity) * 100).toFixed(1) : '-'; // ✅ 대출이 0이어도 ROI 계산

    const payback = netProfit > 0 ? Math.ceil(equity / netProfit) : '-';

    // 연간 데이터 생성
    const data = Array.from({ length: term }, (_, i) => ({
      year: i + 1,
      netProfit,
      cumulativeProfit: netProfit * (i + 1),
    }));

    const breakEvenYear = data.find(d => d.cumulativeProfit >= equity)?.year ?? null;

    const summary = {
      yearlyGen,
      revenue,
      operationCost,
      yearlyRepayment,
      netProfit,
      payback,
      roi
    };

    onDataChange(data, breakEvenYear, summary);
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
        ['equity', '자기자본 (원)'],
        ['loan', '대출금액 (원)'],
        ['interest', '이자율 (%)'],
        ['term', '상환기간 (년)'],
      ].map(([name, label]) => (
        <div key={name}>
          <label className="block mb-1">{label}</label>
          <input
            name={name}
            value={form[name]}
            onChange={handleChange}
            className="w-full px-2 py-1 text-black rounded"
          />
        </div>
      ))}
    </div>
  );
}

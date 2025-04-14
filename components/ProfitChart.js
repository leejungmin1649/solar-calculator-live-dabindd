import { LineChart, Line, XAxis, YAxis, Tooltip, ReferenceLine, Legend, ResponsiveContainer } from 'recharts';

export default function ProfitChart({ data, breakEvenYear }) {
  return (
    <div className="text-black">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <XAxis dataKey="year" />
          <YAxis tickFormatter={(v) => `${(v / 1_000_000).toFixed(0)}M`} />
          <Tooltip formatter={(v) => `${v.toLocaleString()} 원`} />
          <Legend />
          <Line type="monotone" dataKey="netProfit" stroke="#10B981" name="순수익" />
          <Line type="monotone" dataKey="loan" stroke="#EF4444" strokeDasharray="5 5" name="대출금" />
          <ReferenceLine y={0} stroke="#8884d8" strokeDasharray="3 3" />
          {breakEvenYear && (
            <ReferenceLine
              x={breakEvenYear}
              stroke="#FACC15"
              label={{ value: `손익분기점 ${breakEvenYear}년`, fill: '#FACC15', position: 'top' }}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
      {breakEvenYear && (
        <p className="mt-2 text-sm text-yellow-600">💡 손익분기점: {breakEvenYear}년 (누적수익이 자기자본 도달)</p>
      )}
    </div>
  );
}
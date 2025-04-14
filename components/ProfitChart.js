import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function ProfitChart({ data, breakEvenYear }) {
  return (
    <div className="text-black">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="netProfit" stroke="#10B981" />
        </LineChart>
      </ResponsiveContainer>
      {breakEvenYear && (
        <p className="mt-2 text-sm text-green-700">💡 손익분기점: {breakEvenYear}년</p>
      )}
    </div>
  );
}
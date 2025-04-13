import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';

export function ProfitChart({ data, breakEvenYear }) {
  return (
    <div className="text-white">
      <h2 className="text-lg font-semibold mb-2">연간 수익 및 손익분기점</h2>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <XAxis dataKey="year" />
          <YAxis tickFormatter={(v) => `${(v / 1000000).toFixed(1)}백만원`} />
          <Tooltip formatter={(value) => `${value.toLocaleString()} 원`} />
          <Legend />
          <Line type="monotone" dataKey="netProfit" stroke="#82ca9d" name="순수익" dot />
          <Line type="monotone" dataKey="cumulativeProfit" stroke="#8884d8" name="누적수익" dot />
          {breakEvenYear && (
            <ReferenceLine
              x={breakEvenYear}
              stroke="red"
              strokeDasharray="3 3"
              label="손익분기점"
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

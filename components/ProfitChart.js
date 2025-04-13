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
      <h2 className="text-lg font-semibold mb-2">손익분기점 그래프</h2>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <XAxis dataKey="year" />
          {/* ✅ Y축을 '백만원 단위' 대신 'M' 단위, 소수점 없이 */}
          <YAxis tickFormatter={(value) => `${Math.round(value / 1000000)}M`} />
          <Tooltip formatter={(value) => `${value.toLocaleString()} 원`} />
          <Legend />

          {/* ✅ 연간 수익 (netProfit) 그래프 표시 */}
          <Line type="monotone" dataKey="netProfit" stroke="#82ca9d" name="연간 순수익" dot />
          <Line type="monotone" dataKey="cumulativeProfit" stroke="#8884d8" name="누적 수익" dot />

          {breakEvenYear && (
            <ReferenceLine
              x={breakEvenYear}
              stroke="red"
              strokeDasharray="3 3"
              label={{ position: 'top', value: '손익분기점', fill: 'red' }}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

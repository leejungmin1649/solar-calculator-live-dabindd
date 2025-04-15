import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts';

export default function ProfitChart({ data, breakEvenYear }) {
  return (
    <div className="text-black dark:text-white">
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={data}>
          <XAxis dataKey="year" />
          <YAxis tickFormatter={(v) => `${(v / 1_000_000).toFixed(0)}M`} />
          <Tooltip formatter={(value) => `${value.toLocaleString()} 원`} />
          <Legend />
          <Line
            type="monotone"
            dataKey="netProfit"
            name="연간 순수익"
            stroke="#34D399"
            dot
          />
          <Line
            type="monotone"
            dataKey="cumulativeProfit"
            name="누적 수익"
            stroke="#818CF8"
            dot
          />

          {breakEvenYear && (
            <ReferenceLine
              x={breakEvenYear}
              stroke="red"
              strokeDasharray="4 2"
              label={{
                value: `손익분기점 ${breakEvenYear}년`,
                position: 'top',
                fill: 'red',
              }}
            />
          )}
        </LineChart>
      </ResponsiveContainer>

      {breakEvenYear && (
        <p className="mt-2 text-sm text-red-500 font-medium text-center">
          📍 손익분기점: {breakEvenYear}년 (누적 수익이 자기자본 도달)
        </p>
      )}
    </div>
  );
}

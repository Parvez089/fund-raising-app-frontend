/** @format */
"use client";

interface MonthlyInflow {
  month: string;
  amount: number;
}

interface ChartProps {
  data: MonthlyInflow[];
  thisMonthAmount: number;
}

export default function Chart({ data, thisMonthAmount }: ChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-gray-100 flex items-center justify-center h-64">
        <p className="text-gray-400 text-sm">No chart data available</p>
      </div>
    );
  }

  const width = 500;
  const height = 180;
  const padding = { top: 20, bottom: 30, left: 10, right: 10 };

  const maxVal = Math.max(...data.map((d) => d.amount), 1);
  const minVal = Math.min(...data.map((d) => d.amount));

  const points = data.map((d, i) => ({
    x: padding.left + (i / (data.length - 1)) * (width - padding.left - padding.right),
    y: padding.top + (1 - (d.amount - minVal) / (maxVal - minVal || 1)) * (height - padding.top - padding.bottom),
    ...d,
  }));

  // Smooth curve path
  const toPath = (pts: typeof points) => {
    if (pts.length < 2) return "";
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const cp1x = pts[i].x + (pts[i + 1].x - pts[i].x) / 2;
      const cp1y = pts[i].y;
      const cp2x = pts[i].x + (pts[i + 1].x - pts[i].x) / 2;
      const cp2y = pts[i + 1].y;
      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${pts[i + 1].x} ${pts[i + 1].y}`;
    }
    return d;
  };

  const linePath = toPath(points);
  const areaPath =
    linePath +
    ` L ${points[points.length - 1].x} ${height - padding.bottom} L ${points[0].x} ${height - padding.bottom} Z`;

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="font-bold text-gray-900 text-lg">Monthly Fund Inflow</h3>
          <p className="text-sm text-gray-400 mt-0.5">
            Showing data for the last {data.length} months
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-emerald-600">
            ${thisMonthAmount.toLocaleString()}
          </p>
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">
            This Month
          </p>
        </div>
      </div>

      {/* SVG Chart */}
      <div className="w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full"
          preserveAspectRatio="none">
          <defs>
            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Area fill */}
          <path d={areaPath} fill="url(#areaGrad)" />

          {/* Line */}
          <path
            d={linePath}
            fill="none"
            stroke="#10b981"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Dots */}
          {points.map((pt, i) => (
            <circle
              key={i}
              cx={pt.x}
              cy={pt.y}
              r="4"
              fill="white"
              stroke="#10b981"
              strokeWidth="2.5"
            />
          ))}
        </svg>

        {/* X Labels */}
        <div className="flex justify-between mt-2 px-2">
          {data.map((d, i) => (
            <span key={i} className="text-xs text-gray-400 font-medium">
              {d.month}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

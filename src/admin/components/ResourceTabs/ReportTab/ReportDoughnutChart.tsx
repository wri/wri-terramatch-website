import React from "react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

interface ReportDoughnutChartProps {
  label: string;
  currentValue: number;
  goalValue: number;
  description: string;
  color?: string;
  hidePercentage?: boolean;
  backgroundColor?: string;
}

const ReportDoughnutChart: React.FC<ReportDoughnutChartProps> = ({
  label,
  currentValue,
  goalValue,
  description,
  color = "#00aaff",
  hidePercentage = false,
  backgroundColor = "#eee"
}) => {
  const currentValuePercentage = (currentValue / goalValue) * 100;
  const clampedCurrentValuePercentage = currentValue > goalValue ? 100 : currentValuePercentage;
  const remainingValuePercentage = 100 - clampedCurrentValuePercentage;
  const data = [
    { name: "Filled", value: currentValuePercentage },
    { name: "Remaining", value: remainingValuePercentage }
  ];

  const COLORS = [color, backgroundColor];

  return (
    <div className="flex flex-col items-center">
      <strong className="mt-2 text-center">{label}</strong>
      <div className="relative h-32 w-32">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={35}
              outerRadius={45}
              startAngle={90}
              endAngle={-270}
              dataKey="value"
              strokeWidth={0}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {!hidePercentage && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-gray-800 text-sm">{currentValuePercentage.toFixed(0)}%</span>
          </div>
        )}
      </div>

      <small className="mt-1 text-center">{description}</small>
    </div>
  );
};

export default ReportDoughnutChart;

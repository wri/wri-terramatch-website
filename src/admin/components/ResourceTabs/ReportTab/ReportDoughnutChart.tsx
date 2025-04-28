import React from "react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

import Text from "@/components/elements/Text/Text";

interface ReportDoughnutChartProps {
  label: string;
  currentValue: number;
  goalValue: number;
  description: React.ReactNode;
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
    <div className="flex flex-col items-center gap-0">
      <Text variant="text-10-light" className="text-center uppercase leading-[normal] text-neutral-650">
        {label}
      </Text>
      <div className="relative h-26 w-26">
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
            <div className="flex flex-col items-center">
              <Text variant="text-10-bold" className="text-center leading-[normal] text-darkCustom">
                {currentValuePercentage.toFixed(0)}%
              </Text>
              <Text variant="text-10-light" className="text-center leading-[normal] text-darkCustom">
                complete
              </Text>
            </div>
          </div>
        )}
      </div>

      <div className="mt-0.5 text-center">{description}</div>
    </div>
  );
};

export default ReportDoughnutChart;

import React from "react";
import { Cell, Label, Pie, PieChart, ResponsiveContainer } from "recharts";

interface ChartDataItem {
  name: string;
  value: number;
}

export interface ProgressGoalsData {
  chartData: ChartDataItem[];
}

interface ProgressGoalsDoughnutChartProps {
  data?: ProgressGoalsData;
}

const percentage = (current: number, total: number) => {
  const percentValue = (current / total) * 100;
  return percentValue.toFixed(0);
};

const ProgressGoalsDoughnutChart: React.FC<ProgressGoalsDoughnutChartProps> = ({ data }) => {
  const { chartData } = data as any;

  const currentValue = chartData[0]?.value || 0;
  const totalValue = chartData[1]?.value || 0;

  const remainingValue = Math.max(totalValue - currentValue, 0);

  const transformedData =
    currentValue > totalValue
      ? [{ value: 1, isProgress: true }]
      : [
          { value: currentValue, isProgress: true },
          { value: remainingValue, isProgress: false }
        ];

  const COLORS = ["#27A9E0", "#DFF2FB"];

  return (
    <div className="relative flex h-[180px] w-full flex-col items-center justify-center pt-0">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={transformedData}
            cx="50%"
            cy="50%"
            innerRadius={45}
            outerRadius={75}
            paddingAngle={0}
            dataKey="value"
            startAngle={90}
            endAngle={-270}
          >
            {totalValue > 0 && (
              <Label
                position="center"
                content={(props: any) => {
                  const { viewBox } = props;
                  const { cx, cy } = viewBox;
                  return (
                    <text
                      x={cx}
                      y={cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="text-20-semibold !font-semibold !text-darkCustom"
                    >
                      <tspan x={cx} dy="-4" className="text-16 !font-bold !text-blueCustom-700">
                        {percentage(currentValue, totalValue)}%
                      </tspan>
                      <tspan x={cx} dy="16" className="text-12-light !text-darkCustom">
                        complete
                      </tspan>
                    </text>
                  );
                }}
              />
            )}
            {transformedData.map((entry: any, index: any) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
                className={currentValue > totalValue ? "opacity-80" : ""}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProgressGoalsDoughnutChart;

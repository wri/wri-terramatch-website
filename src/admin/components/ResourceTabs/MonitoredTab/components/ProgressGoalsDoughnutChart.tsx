import React, { useState } from "react";
import { Cell, Label, Pie, PieChart, ResponsiveContainer, Sector, Tooltip } from "recharts";

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
const percentage = (value: number, total: number) => ((value / total) * 100).toFixed(0);

const formattedValue = (value: number) =>
  value.toLocaleString("en-US", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  });

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const value = payload[0].value;

    return (
      <div className="shadow-lg absolute z-50 flex flex-col items-center justify-center rounded  border bg-white p-1 text-center">
        <p className="text-sm font-medium">{payload[0].name}</p>
        <p className="text-gray-600 text-sm">{`${formattedValue(value)}`}</p>
      </div>
    );
  }
  return null;
};

const renderActiveShape = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 10}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
    </g>
  );
};

const ProgressGoalsDoughnutChart: React.FC<ProgressGoalsDoughnutChartProps> = ({ data }) => {
  const { chartData } = data as any;

  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);

  const total = chartData.reduce((sum: any, item: any) => sum + item.value, 0);

  const enhancedChartData = chartData.map((item: any) => ({
    ...item,
    total
  }));

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(undefined);
  };

  const COLORS = ["#27A9E0FF", "#D8EAF6"];

  return (
    <div className="relative h-[150px] w-[150px] overflow-hidden">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Tooltip content={<CustomTooltip />} />
          <Pie
            data={enhancedChartData}
            cx="50%"
            cy="50%"
            innerRadius={35}
            outerRadius={65}
            paddingAngle={0}
            dataKey="value"
            onMouseEnter={onPieEnter}
            onMouseLeave={onPieLeave}
            activeIndex={activeIndex}
            activeShape={renderActiveShape}
          >
            {chartData[1]?.value ? (
              <Label
                position="center"
                content={({ viewBox }) => {
                  const { cx, cy } = viewBox as any;
                  return (
                    <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" className="text-20-semibold">
                      <tspan x={cx} dy="-10" className="text-blue-900 font-bold" style={{ fontSize: "13px" }}>
                        {percentage(chartData[0]?.value, chartData[1]?.value)}%
                      </tspan>
                      <tspan x={cx} dy="20" className="text-gray-600" style={{ fontSize: "12px" }}>
                        complete
                      </tspan>
                    </text>
                  );
                }}
              />
            ) : null}
            {chartData.map((entry: any, index: any) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProgressGoalsDoughnutChart;

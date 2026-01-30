import React from "react";
import { Cell, Label, Pie, PieChart, ResponsiveContainer } from "recharts";

interface ChartDataItem {
  name: string;
  value: number;
}

export interface KeyIndicatorsInsightsData {
  chartData: ChartDataItem[];
}

interface KeyIndicatorsInsightsDoughnutChartProps {
  data?: KeyIndicatorsInsightsData;
  icon?: React.ReactNode;
  color?: string;
}

const KeyIndicatorsInsightsDoughnutChart: React.FC<KeyIndicatorsInsightsDoughnutChartProps> = ({
  data,
  icon,
  color
}) => {
  const { chartData } = data as any;

  const currentValue = chartData[0]?.value ?? 0;
  const totalValue = chartData[1]?.value ?? 0;

  const remainingValue = Math.max(totalValue - currentValue, 0);

  const transformedData =
    currentValue > totalValue
      ? [{ value: 1, isProgress: true }]
      : [
          { value: currentValue, isProgress: true },
          { value: remainingValue == 0 ? 1 : remainingValue, isProgress: false }
        ];

  const COLORS = [color, "#e7e6e6"];
  const CHART_HEIGHT = 90;
  const OUTER_RADIUS = 36;
  const INNER_RADIUS = 20;

  return (
    <div
      className="relative flex w-full flex-col items-center justify-center pt-0"
      style={{ height: `${CHART_HEIGHT}px` }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={transformedData}
            cx="50%"
            cy="50%"
            innerRadius={INNER_RADIUS}
            outerRadius={OUTER_RADIUS}
            paddingAngle={0}
            dataKey="value"
            startAngle={90}
            endAngle={-270}
          >
            <Label
              position="center"
              content={(props: any) => {
                const { viewBox } = props;
                const { cx, cy } = viewBox;
                const size = 24;
                const x = cx - size / 2;
                const y = cy - size / 2;
                return (
                  <foreignObject x={x} y={y} width={size} height={size}>
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      {icon}
                    </div>
                  </foreignObject>
                );
              }}
            />
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

export default KeyIndicatorsInsightsDoughnutChart;

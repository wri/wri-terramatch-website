import React, { useState } from "react";
import { Cell, Label, Legend, Pie, PieChart, ResponsiveContainer, Sector, Tooltip } from "recharts";

interface ChartDataItem {
  name: string;
  value: number;
}

export interface EcoRegionData {
  chartData: ChartDataItem[];
  total: number;
}

interface EcoRegionDoughnutChartProps {
  data: EcoRegionData;
}

type LegendPayload = {
  value: string;
  id?: string;
  type?: string;
  color?: string;
};

interface CustomLegendProps {
  payload?: LegendPayload[];
}

const COLORS = ["#FFD699", "#90EE90", "#2F4F4F", "#BDB76B", "#98FB98"];

const CustomLegend = ({ payload }: CustomLegendProps) => {
  if (!payload) return null;
  return (
    <ul className="flex flex-col gap-2 text-sm">
      {payload.map((entry, index) => (
        <li key={index} className="flex items-center gap-2">
          <span className="inline-block h-3 w-3 rounded-full" style={{ backgroundColor: entry.color }} />
          <span>{entry.value}</span>
        </li>
      ))}
    </ul>
  );
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="shadow-lg rounded border bg-white p-2">
        <p className="font-medium">{payload[0].name}</p>
        <p className="text-gray-600">{`Value: ${payload[0].value}`}</p>
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

const EcoRegionDoughnutChart: React.FC<EcoRegionDoughnutChartProps> = ({ data }) => {
  const { chartData } = data;
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(undefined);
  };

  return (
    <div className="relative flex h-80 w-full items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Tooltip content={<CustomTooltip />} />
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={100}
            outerRadius={140}
            paddingAngle={0}
            dataKey="value"
            onMouseEnter={onPieEnter}
            onMouseLeave={onPieLeave}
            activeIndex={activeIndex}
            activeShape={renderActiveShape}
          >
            <Label position="center" className="text-20-semibold !font-semibold !text-darkCustom">
              ECO-REGION
            </Label>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Legend
            content={props => <CustomLegend {...props} />}
            layout="vertical"
            align="right"
            verticalAlign="middle"
            wrapperStyle={{
              right: "calc(50% - 261px)",
              paddingLeft: 0
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EcoRegionDoughnutChart;

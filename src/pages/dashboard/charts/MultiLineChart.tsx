import React from "react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { COLORS } from "@/constants/dashbordConsts";
import { countValuesPerYear, formatDate, formatMonth, formatNumberChart } from "@/utils/dashboardUtils";

type DataPoint = {
  time: string;
  Total: number;
  Enterprise: number;
  "Non Profit": number;
};

type ChartData = {
  values: { time: string; value: number }[];
};

type ChartProps = {
  data: ChartData[];
};

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;

  const [year, month] = label.split("-");
  const orderedPayload = payload.sort((a: any, b: any) => {
    const order = ["Total", "Non Profit", "Enterprise"];
    return order.indexOf(a.name) - order.indexOf(b.name);
  });

  return (
    <div className="custom-tooltip border-gray-300 border bg-white p-2">
      <p className="text-xs font-bold text-black">{`${year} - ${formatMonth(Number(month))}`}</p>
      {orderedPayload.map((item: any, index: number) => (
        <p key={index} className="text-xs">
          <span className="text-xs font-normal text-black">{item.name}: </span>
          <span className="text-xs font-bold text-black">{item.value.toLocaleString()}</span>
        </p>
      ))}
    </div>
  );
};

const MultiLineChart: React.FC<ChartProps> = ({ data = [] }) => {
  const formattedData: DataPoint[] =
    data[0]?.values?.map((item, index) => ({
      time: formatDate(item.time),
      Total: data[0].values[index].value,
      Enterprise: data[1].values[index].value,
      "Non Profit": data[2].values[index].value
    })) || [];

  const yearCounts = countValuesPerYear(formattedData);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={formattedData}>
        <CartesianGrid vertical={false} stroke="#E1E4E9" />
        <XAxis
          dataKey="time"
          tick={{ fill: "#353535", className: "text-xs" }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(time, index) => {
            const year = time.split("-")[0];
            const previousYear = index > 0 ? formattedData[index - 1].time.split("-")[0] : null;
            return yearCounts[year] > 1 && previousYear !== year ? year : "";
          }}
          interval={0}
        />
        <YAxis
          tick={{ fill: "#353535", fontSize: 12 }}
          tickLine={false}
          axisLine={false}
          tickFormatter={formatNumberChart}
        />
        <Tooltip content={<CustomTooltip />} />
        {Object.keys(COLORS).map(key => (
          <Line
            key={key}
            type="linear"
            dataKey={key}
            stroke={COLORS[key]}
            dot={{ stroke: COLORS[key], strokeWidth: 2, r: 4 }}
            strokeWidth={2}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default MultiLineChart;

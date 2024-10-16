import React from "react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { formatNumberChart } from "@/utils/dashboardUtils";

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

const COLORS: Record<string, string> = {
  Total: "#053D38",
  Enterprise: "#27A9E0",
  "Non Profit": "#7BBD31"
};

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
};

const formatMonth = (monthNumber: number): string => MONTHS[monthNumber - 1];

const countValuesPerYear = (data: DataPoint[]): Record<string, number> => {
  return data.reduce((acc, item) => {
    const year = item.time.split("-")[0];
    acc[year] = (acc[year] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
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

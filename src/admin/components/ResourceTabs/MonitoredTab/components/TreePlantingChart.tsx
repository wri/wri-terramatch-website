import React from "react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { ChartCategory, formatNumberChart } from "@/utils/dashboardUtils";

type DataPoint = {
  time: string;
  "Tree Planted"?: number;
  "Seeding Records"?: number;
};

type ChartProps = {
  data: ChartCategory[];
};

const COLORS = {
  "Tree Planted": "#4AAAE0",
  "Seeding Records": "#0C2733"
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
};

const formatMonth = (month: number) => {
  return new Date(2000, month - 1).toLocaleString("default", { month: "long" });
};

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;

  const [year, month] = label.split("-");

  return (
    <div className="border-gray-300 rounded-lg border bg-white p-2">
      <p className="font-bold text-black">{`${year} - ${formatMonth(Number(month))}`}</p>
      {payload.map((item: any, index: number) => (
        <p key={index}>
          <span className="text-black">{item.name}: </span>
          <span className="font-bold text-black">{item.value.toLocaleString()}</span>
        </p>
      ))}
    </div>
  );
};

const CustomXAxisTick: React.FC<any> = ({ x, y, payload, previousYear }) => {
  const year = payload.value.split("-")[0];
  const shouldDisplayYear = previousYear !== year;
  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={16} textAnchor="middle" fill="#353535">
        {shouldDisplayYear ? year : ""}
      </text>
    </g>
  );
};

const CustomYAxisTick: React.FC<any> = ({ x, y, payload }) => {
  const formattedValue = formatNumberChart(payload.value);

  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={4} textAnchor="end" fill="#353535">
        {formattedValue}
      </text>
    </g>
  );
};
const TreePlantingChart: React.FC<ChartProps> = ({ data = [] }) => {
  const dataMap = new Map(data.map(item => [item.name, item]));

  const allTimePoints = data.flatMap(series => series.values.map((v: any) => formatDate(v.time))).sort();

  const uniqueTimePoints = Array.from(new Set(allTimePoints));

  const formattedData: DataPoint[] = uniqueTimePoints.map(timePoint => {
    const dataPoint: DataPoint = { time: timePoint };

    if (dataMap.has("Tree Planted")) {
      const value = dataMap.get("Tree Planted")?.values.find((v: any) => formatDate(v.time) === timePoint)?.value;
      if (value !== undefined) dataPoint["Tree Planted"] = value;
    }

    if (dataMap.has("Seeding Records")) {
      const value = dataMap.get("Seeding Records")?.values.find((v: any) => formatDate(v.time) === timePoint)?.value;
      if (value !== undefined) dataPoint["Seeding Records"] = value;
    }

    return dataPoint;
  });

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={formattedData} margin={{ top: 25, right: 20, left: 15, bottom: 5 }}>
        <CartesianGrid vertical={true} horizontal={false} stroke="#E1E4E9" strokeDasharray="3 3" />
        <XAxis
          dataKey="time"
          tickLine={false}
          axisLine={true}
          tick={props => {
            const index = props.index;
            const previousYear = index > 0 ? formattedData[index - 1].time.split("-")[0] : null;
            return <CustomXAxisTick {...props} previousYear={previousYear} />;
          }}
          interval={0}
          padding={{ left: 10 }}
        />
        <YAxis tickLine={false} axisLine={true} tick={props => <CustomYAxisTick {...props} />} />
        <Tooltip content={CustomTooltip} cursor={{ stroke: "#a6a6a6", strokeWidth: 1, strokeDasharray: "4 4" }} />
        {Object.entries(COLORS).map(
          ([key, color]) =>
            dataMap.has(key) && (
              <Line
                key={key}
                type="linear"
                dataKey={key}
                stroke={color}
                dot={{ stroke: color, strokeWidth: 2, r: 4 }}
                strokeWidth={2}
              />
            )
        )}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default TreePlantingChart;

import React from "react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { COLORS } from "@/constants/dashboardConsts";
import { formatDate, formatMonth, formatNumberChart } from "@/utils/dashboardUtils";

type DataPoint = {
  time: string;
  Total?: number;
  Enterprise?: number;
  "Non Profit"?: number;
};

type ChartData = {
  name: string;
  values: { time: string; value: number; name: string }[];
};

type ChartProps = {
  data: ChartData[];
  isAbsoluteData?: boolean;
};

const CustomTooltip: React.FC<any> = ({ active, payload, label, isAbsoluteData }) => {
  if (!active || !payload || !payload.length) return null;

  const [year, month] = typeof label === "string" ? label.split("-") : ["", ""];
  const orderedPayload = payload.sort((a: any, b: any) => {
    const order = ["Total", "Non Profit", "Enterprise"];
    return order.indexOf(a.name) - order.indexOf(b.name);
  });

  return (
    <div className="border-gray-300 custom-tooltip rounded-lg border bg-white p-2">
      <p className="text-12-bold font-bold text-black">{`${year} - ${formatMonth(Number(month))}`}</p>
      {orderedPayload.map((item: any, index: number) => (
        <p key={index} className="text-12">
          <span className="text-12 font-normal text-black">{item.name}: </span>
          <span className="text-12-bold font-bold text-black">
            {isAbsoluteData ? `${item.value.toFixed(2)}%` : item.value.toLocaleString()}
          </span>
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
      <text x={0} y={0} dy={16} textAnchor="middle" fill="#353535" className="text-12 text-darkCustom">
        {shouldDisplayYear ? year : ""}
      </text>
    </g>
  );
};

const CustomYAxisTick: React.FC<any> = ({ x, y, payload, isAbsoluteData }) => {
  const formattedValue = isAbsoluteData ? `${payload.value}%` : formatNumberChart(payload.value);

  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={4} textAnchor="end" fill="#353535" className="text-12 text-darkCustom">
        {formattedValue}
      </text>
    </g>
  );
};

const MultiLineChart: React.FC<ChartProps> = ({ data = [], isAbsoluteData = false }) => {
  const dataMap = new Map(data.map(item => [item.name, item]));
  const referenceSeries = data[0]?.values || [];

  const formattedData: DataPoint[] = referenceSeries.map((item, index) => {
    const timePoint = formatDate(item.time);
    const dataPoint: DataPoint = { time: timePoint };

    if (dataMap.has("Total")) {
      dataPoint.Total = dataMap.get("Total")?.values[index].value;
    }
    if (dataMap.has("Enterprise")) {
      dataPoint.Enterprise = dataMap.get("Enterprise")?.values[index].value;
    }
    if (dataMap.has("Non Profit")) {
      dataPoint["Non Profit"] = dataMap.get("Non Profit")?.values[index].value;
    }

    return dataPoint;
  });

  const hasValuesOver100 = formattedData.some(point =>
    Object.entries(point)
      .filter(([key]) => key !== "time")
      .some(([_, value]) => value && +value > 100)
  );

  const availableColors = Object.fromEntries(Object.entries(COLORS).filter(([key]) => dataMap.has(key)));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={formattedData}>
        <CartesianGrid vertical={false} stroke="#E1E4E9" />
        <XAxis
          dataKey="time"
          tickLine={false}
          axisLine={false}
          tick={props => {
            const index = props.index;
            const previousYear = index > 0 ? formattedData[index - 1].time.split("-")[0] : null;
            return <CustomXAxisTick {...props} previousYear={previousYear} />;
          }}
          interval={0}
          padding={{ left: 10 }}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tick={props => <CustomYAxisTick {...props} isAbsoluteData={isAbsoluteData} />}
          domain={isAbsoluteData && !hasValuesOver100 ? [0, 100] : ["auto", "auto"]}
        />
        <Tooltip
          content={props => <CustomTooltip {...props} isAbsoluteData={isAbsoluteData} />}
          cursor={{ stroke: "#a6a6a6", strokeWidth: 1, strokeDasharray: "4 4" }}
        />
        {Object.entries(availableColors).map(([key, color]) => (
          <Line
            key={key}
            type="linear"
            dataKey={key}
            stroke={color}
            dot={{ stroke: color, strokeWidth: 2, r: 4 }}
            strokeWidth={2}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default MultiLineChart;

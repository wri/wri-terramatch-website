import React from "react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { COLORS } from "@/constants/dashbordConsts";
import { formatDate, formatMonth, formatNumberChart } from "@/utils/dashboardUtils";

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
  isAbsoluteData?: boolean;
};

const CustomTooltip: React.FC<any> = ({ active, payload, label, isAbsoluteData }) => {
  if (!active || !payload || !payload.length) return null;

  const [year, month] = label.split("-");
  const orderedPayload = payload.sort((a: any, b: any) => {
    const order = ["Total", "Non Profit", "Enterprise"];
    return order.indexOf(a.name) - order.indexOf(b.name);
  });

  return (
    <div className="border-gray-300 custom-tooltip rounded-lg border bg-white p-2">
      <p className="text-xs font-bold text-black">{`${year} - ${formatMonth(Number(month))}`}</p>
      {orderedPayload.map((item: any, index: number) => (
        <p key={index} className="text-xs">
          <span className="text-xs font-normal text-black">{item.name}: </span>
          <span className="text-xs font-bold text-black">
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
      <text x={0} y={0} dy={16} textAnchor="middle" fill="#353535" className="text-10-light text-darkCustom">
        {shouldDisplayYear ? year : ""}
      </text>
    </g>
  );
};

const CustomYAxisTick: React.FC<any> = ({ x, y, payload, isAbsoluteData }) => {
  const formattedValue = isAbsoluteData ? `${payload.value}%` : formatNumberChart(payload.value);

  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={4} textAnchor="end" fill="#353535" className="text-10-light text-darkCustom">
        {formattedValue}
      </text>
    </g>
  );
};

const MultiLineChart: React.FC<ChartProps> = ({ data = [], isAbsoluteData = false }) => {
  const formattedData: DataPoint[] =
    data[0]?.values?.map((item, index) => ({
      time: formatDate(item.time),
      Total: data[0].values[index].value,
      Enterprise: data[1].values[index].value,
      "Non Profit": data[2].values[index].value
    })) || [];

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
          domain={isAbsoluteData ? [0, 100] : ["auto", "auto"]}
        />
        <Tooltip
          content={props => <CustomTooltip {...props} isAbsoluteData={isAbsoluteData} />}
          cursor={{ stroke: "#a6a6a6", strokeWidth: 1, strokeDasharray: "4 4" }}
        />
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

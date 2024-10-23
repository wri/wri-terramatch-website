import React from "react";
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { CustomBar } from "./CustomBarJobsCreated";
import CustomTooltip from "./CustomTooltip";

type ResturationStrategy = {
  label: string;
  value: number;
};

type FormattedData = {
  name: string;
  value: number;
};

const SimpleBarChart = ({ data }: { data: ResturationStrategy[] }) => {
  const formattedData: FormattedData[] = data.map(item => ({
    name: item.label.split(",").join(" + ").replace(/-/g, " "),
    value: item.value
  }));

  const getBarColor = (name: string) => {
    if (name.includes("tree planting")) return "#7BBD31";
    if (name.includes("direct seeding")) return "#27A9E0";
    return "#053D38";
  };

  const CustomLabel = (props: any) => {
    const { x, y, width, height, value } = props;
    const isSmallValue = value < 1.5;

    return (
      <text
        x={x + width / 2}
        y={isSmallValue ? y - 8 : y + height / 2}
        fill={isSmallValue ? "#000000" : "white"}
        textAnchor="middle"
        dominantBaseline={isSmallValue ? "bottom" : "middle"}
        className="text-sm font-medium"
      >
        {`${value.toFixed(0)} ha`}
      </text>
    );
  };

  return (
    <div className="h-96 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={formattedData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 20
          }}
          barSize={100}
        >
          <CartesianGrid vertical={false} stroke="#E1E4E9" />
          <XAxis
            tickLine={false}
            axisLine={false}
            dataKey="name"
            height={60}
            interval={0}
            className="text-sm"
            tick={{ fill: "#374151" }}
          />
          <YAxis tickLine={false} axisLine={false} className="text-sm" tick={{ fill: "#374151" }} />
          <Bar dataKey="value" label={<CustomLabel />} shape={(props: any) => <CustomBar {...props} />}>
            {formattedData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarColor(entry.name)} />
            ))}
          </Bar>
          <Tooltip content={props => <CustomTooltip {...props} />} cursor={{ fill: "rgba(0, 0, 0, 0.05)" }} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SimpleBarChart;

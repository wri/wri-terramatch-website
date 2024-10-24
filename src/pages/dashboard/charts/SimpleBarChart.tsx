import React from "react";
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { getBarColorRestoration } from "@/utils/dashboardUtils";

import { CustomBar } from "./CustomBarJobsCreated";
import CustomLabel from "./CustomLabelRestoration";
import CustomTooltip from "./CustomTooltip";
import CustomXAxisTick from "./CustomXAxisTickRestoration";

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

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={formattedData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 30
          }}
          barSize={100}
        >
          <CartesianGrid vertical={false} stroke="#E1E4E9" />
          <XAxis tickLine={false} axisLine={false} dataKey="name" height={20} interval={0} tick={<CustomXAxisTick />} />
          <YAxis tickLine={false} axisLine={false} className="text-sm" tick={{ fill: "#374151" }} />
          <Bar dataKey="value" label={<CustomLabel />} shape={(props: any) => <CustomBar {...props} />}>
            {formattedData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarColorRestoration(entry.name)} />
            ))}
          </Bar>
          <Tooltip content={props => <CustomTooltip {...props} />} cursor={{ fill: "rgba(0, 0, 0, 0.05)" }} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SimpleBarChart;

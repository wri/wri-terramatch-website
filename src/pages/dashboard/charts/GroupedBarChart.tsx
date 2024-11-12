import React from "react";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { calculateTotals, GroupedBarChartData } from "@/utils/dashboardUtils";

import { CustomBar } from "./CustomBarJobsCreated";
import { CustomLegend } from "./CustomLegendJobsCreated";
import { CustomTooltip } from "./CustomTooltip";
import { CustomXAxisTick } from "./CustomXAxisTickJobsCreated";
import { CustomYAxisTick } from "./CustomYAxisTickJobsCreated";

const GroupedBarChart: React.FC<{ data: GroupedBarChartData }> = ({ data }) => {
  const { type, chartData, total, maxValue } = data;
  const totals = calculateTotals(data);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid vertical={false} stroke="#E1E4E9" />
        <XAxis tickLine={false} axisLine={false} dataKey="name" tick={props => <CustomXAxisTick {...props} />} />
        <YAxis tickLine={false} axisLine={false} range={[0, maxValue]} tick={props => <CustomYAxisTick {...props} />} />
        <Tooltip content={props => <CustomTooltip {...props} />} cursor={{ fill: "rgba(0, 0, 0, 0.05)" }} />
        <Legend content={<CustomLegend totals={totals} totalJobs={total} />} />
        <Bar
          dataKey={type === "gender" ? "Women" : "Youth"}
          fill="#7BBD31"
          shape={(props: any) => <CustomBar {...props} />}
        />
        <Bar
          dataKey={type === "gender" ? "Men" : "Non-Youth"}
          fill="#27A9E0"
          shape={(props: any) => <CustomBar {...props} />}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default GroupedBarChart;

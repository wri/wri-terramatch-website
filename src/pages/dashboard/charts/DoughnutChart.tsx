import React from "react";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { calculateTotalsVolunteers, ChartDataVolunteers, COLORS_VOLUNTEERS } from "@/utils/dashboardUtils";

import { CustomLegendVolunteers } from "./CustomLegendVolunteers";
import { CustomTooltip } from "./CustomTooltipJobsCreated";

const DoughnutChart: React.FC<{ data: ChartDataVolunteers }> = ({ data }) => {
  const { chartData, total } = data;
  const totals = calculateTotalsVolunteers(chartData);

  return (
    <div className="h-[330px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={chartData} cx="50%" cy="50%" innerRadius={85} outerRadius={120} fill="#8884d8" dataKey="value">
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS_VOLUNTEERS[index % COLORS_VOLUNTEERS.length]} />
            ))}
          </Pie>
          <Tooltip content={props => <CustomTooltip {...props} total={total} />} />
          <Legend content={<CustomLegendVolunteers totals={totals} totalVolunteers={total} />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DoughnutChart;

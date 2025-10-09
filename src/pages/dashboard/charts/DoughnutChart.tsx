import React from "react";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { calculateTotalsVolunteers, ChartDataVolunteers, COLORS_VOLUNTEERS } from "@/utils/dashboardUtils";

import { CustomLegendVolunteers } from "./CustomLegendVolunteers";
import { CustomTooltip } from "./CustomTooltipJobsCreated";

const DoughnutChart: React.FC<{ data: ChartDataVolunteers }> = ({ data }) => {
  const { chartData, total } = data;
  const totals = calculateTotalsVolunteers(chartData);

  const getColorForEntry = (entryName: string, index: number) => {
    const colorMap: { [key: string]: string } = {
      Women: COLORS_VOLUNTEERS[0],
      Men: COLORS_VOLUNTEERS[1],
      "Non-Binary": COLORS_VOLUNTEERS[2],
      Unknown: COLORS_VOLUNTEERS[3],
      Youth: COLORS_VOLUNTEERS[0],
      "Non-Youth": COLORS_VOLUNTEERS[1]
    };

    return colorMap[entryName] || COLORS_VOLUNTEERS[index % COLORS_VOLUNTEERS.length];
  };

  return (
    <div className="h-[305px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={chartData} cx="50%" cy="50%" innerRadius={65} outerRadius={90} fill="#8884d8" dataKey="value">
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getColorForEntry(entry.name, index)} />
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

import React from "react";
import { LegendProps } from "recharts";

import { getPercentage } from "@/utils/dashboardUtils";

interface CustomLegendProps extends LegendProps {
  totals: { [key: string]: number };
  totalJobs: number;
}

export const CustomLegend: React.FC<CustomLegendProps> = ({ payload, totals, totalJobs }) => {
  if (!payload) return null;

  return (
    <ul style={{ listStyle: "none", padding: "0 0 0 30px", margin: 0, display: "flex", justifyContent: "center" }}>
      {payload.map((entry: any, index: number) => (
        <li key={`item-${index}`} style={{ display: "flex", alignItems: "baseline" }}>
          <svg width="12" height="10" style={{ marginRight: "7px" }}>
            <circle cx="5" cy="5" r="5" fill={entry.color} />
          </svg>
          <span style={{ display: "flex", flexDirection: "column" }}>
            <span className="text-12-light">{entry.value}</span>
            <span className="text-12-light text-darkCustom text-opacity-70">
              {`Total: ${totals[entry?.value]?.toLocaleString()} (${getPercentage(totals[entry.value], totalJobs)}%)`}
            </span>
          </span>
        </li>
      ))}
    </ul>
  );
};

export default CustomLegend;

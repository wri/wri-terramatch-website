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
    <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", justifyContent: "center" }}>
      {payload.map((entry: any, index: number) => (
        <li key={`item-${index}`} style={{ display: "flex", alignItems: "center", marginRight: "20px" }}>
          <svg width="10" height="10" style={{ marginRight: "5px" }}>
            <circle cx="5" cy="5" r="5" fill={entry.color} />
          </svg>
          <span style={{ color: "black", display: "flex", flexDirection: "column" }}>
            <span>{entry.value}</span>
            <span style={{ fontSize: "0.8em", color: "#666" }}>
              {`Total: ${totals[entry?.value]?.toLocaleString()} (${getPercentage(totals[entry.value], totalJobs)}%)`}
            </span>
          </span>
        </li>
      ))}
    </ul>
  );
};

export default CustomLegend;

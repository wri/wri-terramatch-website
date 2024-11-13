import React from "react";

import { getPercentageVolunteers } from "@/utils/dashboardUtils";

interface CustomLegendProps {
  payload?: Array<{ value: string; color: string }>;
  totals: { [key: string]: number };
  totalVolunteers: number;
}

export const CustomLegendVolunteers: React.FC<CustomLegendProps> = ({ payload, totals, totalVolunteers }) => {
  if (!payload) return null;

  const hasValues = Object.values(totals).some(value => !!value);
  if (!hasValues) return null;

  return (
    <div className="pl-7">
      <ul className="m-0 flex list-none justify-center p-0">
        {payload.map((entry, index) => (
          <li key={`item-${index}`} style={{ display: "flex", alignItems: "baseline" }}>
            <svg width="12" height="10" style={{ marginRight: "7px" }}>
              <circle cx="5" cy="5" r="5" fill={entry.color} />
            </svg>
            <span style={{ display: "flex", flexDirection: "column" }}>
              <span className="text-12-light">{entry.value}</span>
              <span className="text-12-light text-darkCustom">
                {`Total: ${totals[entry?.value]?.toLocaleString()} (${getPercentageVolunteers(
                  totals[entry.value],
                  totalVolunteers
                )}%)`}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CustomLegendVolunteers;

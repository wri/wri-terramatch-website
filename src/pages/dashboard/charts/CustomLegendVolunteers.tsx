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
    <div>
      <ul className="m-0 flex list-none justify-center p-0">
        {payload.map((entry, index) => (
          <li key={`item-${index}`} className="mr-5 flex items-center">
            <svg width="10" height="10" className="mr-1">
              <circle cx="5" cy="5" r="5" fill={entry.color} />
            </svg>
            <span className="flex flex-col text-black">
              <span>{entry.value}</span>
              <span className="text-gray-600 text-xs">
                {`Total: ${totals[entry.value].toLocaleString()} (${getPercentageVolunteers(
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

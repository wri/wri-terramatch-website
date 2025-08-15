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

  const items = payload.map((entry: any, index: number) => ({
    ...entry,
    key: `item-${index}`,
    label: entry.value,
    total: totals[entry?.value] || 0,
    percentage: getPercentageVolunteers(totals[entry.value], totalVolunteers)
  }));

  let matrix: Array<Array<any | null>> = [];
  if (items.length === 4) {
    matrix = [
      [items[0], items[1]],
      [items[2], items[3]]
    ];
  } else if (items.length === 3) {
    matrix = [
      [items[0], items[1]],
      [items[2], null]
    ];
  } else if (items.length === 2) {
    matrix = [[items[0], items[1]]];
  } else {
    matrix = [items];
  }

  return (
    <div className="mt-5 pl-7">
      {matrix.map((row, rowIndex) => (
        <div key={`row-${rowIndex}`} className="mb-2 flex justify-between">
          {row.map((item, colIndex) => (
            <div key={`col-${rowIndex}-${colIndex}`} className="flex items-center" style={{ width: "48%" }}>
              {item ? (
                <>
                  <svg width="12" height="10" style={{ marginRight: "7px" }}>
                    <circle cx="5" cy="5" r="5" fill={item.color} />
                  </svg>
                  <span style={{ display: "flex", flexDirection: "column" }}>
                    <span className="text-12-light">{item.label}</span>
                    <span className="text-12-light text-darkCustom">{`${item.total.toLocaleString()} (${
                      item.percentage
                    }%)`}</span>
                  </span>
                </>
              ) : (
                <div style={{ width: "100%" }} />
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default CustomLegendVolunteers;

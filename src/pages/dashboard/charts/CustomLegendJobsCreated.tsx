import React from "react";
import { LegendProps } from "recharts";

import { getPercentage } from "@/utils/dashboardUtils";

interface CustomLegendProps extends LegendProps {
  totals: { [key: string]: number };
  totalJobs: number;
}

export const CustomLegend: React.FC<CustomLegendProps> = ({ payload, totals, totalJobs }) => {
  if (!payload) return null;

  const createLegendMatrix = () => {
    const items = payload.map((entry: any, index: number) => ({
      ...entry,
      key: `item-${index}`,
      label: entry.value,
      total: totals[entry?.value] || 0,
      percentage: getPercentage(totals[entry.value], totalJobs)
    }));

    if (items.length === 4) {
      return [
        [items[0], items[1]],
        [items[2], items[3]]
      ];
    }

    if (items.length === 3) {
      return [
        [items[0], items[1]],
        [items[2], null]
      ];
    }

    return [items];
  };

  const legendMatrix = createLegendMatrix();

  return (
    <div className="pl-[42px]">
      {legendMatrix.map((row, rowIndex) => (
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
                    <span className="text-12-light text-darkCustom">
                      {`${item.total.toLocaleString()} (${item.percentage}%)`}
                    </span>
                  </span>
                </>
              ) : (
                <div style={{ width: "100%" }}></div>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default CustomLegend;

import React from "react";

import { formatNumberLocaleString } from "@/utils/dashboardUtils";

export const CustomYAxisTick: React.FC<any> = ({ x, y, payload }) => {
  const formattedValue = formatNumberLocaleString(payload.value);

  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={4} textAnchor="end" fill="#353535" className="text-12-light text-darkCustom">
        {formattedValue}
      </text>
    </g>
  );
};

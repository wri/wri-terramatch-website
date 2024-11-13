import React from "react";

export const CustomXAxisTick: React.FC<any> = ({ x, y, payload }) => {
  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={16} textAnchor="middle" fill="#353535" className="text-12 text-darkCustom">
        {payload.value}
      </text>
    </g>
  );
};

export default CustomXAxisTick;

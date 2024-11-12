import React from "react";

export const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="border-gray-300 custom-tooltip rounded-lg border bg-white p-2">
      <p className="text-12-bold text-black">{label}</p>
      {payload.map((item: any, index: number) => (
        <p key={index} className="text-12">
          <span className="text-12 font-normal text-black">{item.name}: </span>
          <span className="text-12-bold text-black">{item.value.toLocaleString()}</span>
        </p>
      ))}
    </div>
  );
};

export default CustomTooltip;

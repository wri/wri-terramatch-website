import React from "react";

export const CustomTooltip: React.FC<any> = ({ active, payload, label, total }) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="border-gray-300 custom-tooltip rounded-lg border bg-white p-2">
      <p className="text-xs font-bold text-black">{label}</p>
      {payload.map((item: any, index: number) => {
        const percentage = ((item.value / total) * 100).toFixed(1);
        return (
          <p key={index} className="text-xs">
            <span className="text-xs font-normal text-black">{item.name}: </span>
            <span className="text-xs font-bold text-black">{`${item.value.toLocaleString()} (${percentage}%)`}</span>
          </p>
        );
      })}
    </div>
  );
};

export default CustomTooltip;

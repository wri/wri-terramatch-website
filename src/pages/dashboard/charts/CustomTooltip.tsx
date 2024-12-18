import React from "react";

export const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;
  const value = payload[0].value;
  const total = payload[0].payload.total;
  const percentage = (value / total) * 100;

  const formattedValue = value.toLocaleString("en-US", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  });

  const formattedPercentage = percentage.toFixed(0);

  return (
    <div className="border-gray-300 custom-tooltip rounded-lg border bg-white p-2">
      <p className="text-12-bold text-black">{label}</p>
      {payload.map((item: any, index: number) => (
        <p key={index} className="text-12">
          <p className="text-gray-600">{`${formattedValue}ha (${formattedPercentage}%)`}</p>
        </p>
      ))}
    </div>
  );
};

export default CustomTooltip;

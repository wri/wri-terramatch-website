import React from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

const HorizontalStackedBarChart = ({ data, className }: { data: any; className?: string }) => {
  const totalValue = data[0].value;
  const enterpriseValue = data[1].value;
  const nonProfitValue = data[2].value;
  const remainingValue = totalValue - enterpriseValue - nonProfitValue;

  const chartData = [
    {
      nonProfit: nonProfitValue,
      enterprise: enterpriseValue,
      remaining: remainingValue
    }
  ];

  return (
    <div className={`absolute inset-0 right-0 ${className}`}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout="vertical"
          data={chartData}
          margin={{ top: 1, right: 0, left: 0, bottom: 1 }}
          barCategoryGap="0%"
        >
          <XAxis type="number" hide={true} domain={[0, totalValue]} />
          <YAxis type="category" hide={true} />
          <Bar dataKey="nonProfit" stackId="a" fill="#7BBD31" />
          <Bar dataKey="enterprise" stackId="a" fill="#27A9E0" />
          <Bar dataKey="remaining" stackId="a" fill="#DDDDDD" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HorizontalStackedBarChart;

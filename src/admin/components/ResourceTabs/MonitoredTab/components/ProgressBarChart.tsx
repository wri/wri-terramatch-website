import React from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

const ProgressBarChart = ({ data = [], className }: { data: any; className?: string }) => {
  if (!data.length) return null;
  const totalValue = data[0].value;
  const progressValue = data[1].value;
  const remainingValue = progressValue > totalValue ? 0 : totalValue - progressValue;

  const chartData = [
    {
      progress: progressValue,
      remaining: remainingValue === 0 ? 1 : remainingValue
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
          <Bar dataKey="progress" stackId="a" fill="#27A9E0" />
          <Bar dataKey="remaining" stackId="a" fill="#E5F8FF" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProgressBarChart;

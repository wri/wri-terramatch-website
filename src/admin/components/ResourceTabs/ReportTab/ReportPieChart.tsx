import React from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

interface EmploymentData {
  fullTime: number;
  partTime: number;
  volunteers: number;
}

interface ReportPieChartProps {
  data: EmploymentData;
}

const ReportPieChart: React.FC<ReportPieChartProps> = ({ data }) => {
  const chartData = [
    { name: "Full Time Jobs created", value: data.fullTime, color: "#F59E0C" },
    { name: "Part Time Jobs created", value: data.partTime, color: "#FACC14" },
    { name: "Volunteers created", value: data.volunteers, color: "#15B8A6" }
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const { name, value } = payload[0].payload;
      return (
        <div
          style={{
            backgroundColor: "#fff",
            padding: "8px",
            border: "1px solid #ccc",
            borderRadius: "4px"
          }}
        >
          <p style={{ margin: 0 }}>
            <strong>{name}</strong>: {value}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ width: "100%", height: "160px", position: "relative" }} className="pie-chart-container-report">
      <ResponsiveContainer width="100%" height={160}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={false}
            labelLine={false}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} stroke="white" strokeWidth={2} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      <style>
        {`
          @media print {
            .pie-chart-container-report .recharts-wrapper {
              width: 100% !important;
              height: 125px !important;
            }
            .pie-chart-container-report .recharts-surface {
              width: 100% !important;
              height: 125px !important;
            }
            .pie-chart-container-report .recharts-pie {
              transform: scale(1.5);
              transform-origin: center;
            }
          }
        `}
      </style>
    </div>
  );
};

export default ReportPieChart;

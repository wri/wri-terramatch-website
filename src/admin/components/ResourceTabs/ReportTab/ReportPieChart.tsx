import React from "react";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

interface EmploymentData {
  fullTime: number;
  partTime: number;
  volunteers: number;
}

interface ReportPieChartProps {
  data: EmploymentData;
}

const ReportPieChart: React.FC<ReportPieChartProps> = ({ data }) => {
  const total = data.fullTime + data.partTime + data.volunteers;

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

  const CustomLegend = ({ payload }: any) => {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          position: "absolute",
          right: "15%",
          top: "40%",
          transform: "translate(35%, -125%)",
          padding: "10px",
          gap: "12px"
        }}
      >
        {payload?.map((entry: any, index: number) => (
          <div
            key={`legend-${index}`}
            style={{
              display: "flex",
              alignItems: "center",
              fontSize: "14px"
            }}
          >
            <div
              style={{
                width: "16px",
                height: "16px",
                backgroundColor: chartData[index].color,
                borderRadius: "4px",
                marginRight: "12px"
              }}
            />
            <span style={{ marginRight: "8px" }}>{entry.value}</span>
            <span>{chartData[index].value}</span>
          </div>
        ))}
        <div
          style={{
            borderTop: "1px solid #000",
            paddingTop: "12px",
            fontSize: "14px",
            display: "flex",
            alignItems: "center"
          }}
        >
          <span style={{ marginLeft: "28px" }}>{total}</span>
        </div>
      </div>
    );
  };

  return (
    <div style={{ width: "100%", height: "300px", position: "relative" }}>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="25%"
            cy="50%"
            outerRadius={100}
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
          <Legend content={<CustomLegend />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ReportPieChart;

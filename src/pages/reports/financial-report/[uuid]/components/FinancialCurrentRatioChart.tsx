import React, { useMemo } from "react";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { formatYAxisNumber } from "@/utils/financialReport";

type FinancialCurrentRatioChartProps = {
  uuid: string;
  organisation_id: number;
  financial_report_id: number;
  collection: string;
  amount: number | null;
  year: number;
  description: string | null;
  documentation?: any[];
};

const FinancialCurrentRatioChart = ({ data }: { data: FinancialCurrentRatioChartProps[] }) => {
  const chartData = useMemo(() => {
    const currentRatioData = data.filter(item => item.collection === "current-ratio").sort((a, b) => a.year - b.year);

    return currentRatioData.map(item => ({
      year: item.year,
      currentRatio: item.amount || 0
    }));
  }, [data]);

  const xAxisDomain = useMemo(() => {
    if (chartData.length === 0) return [2020, 2025];

    const years = chartData.map(item => item.year);
    const minYear = Math.min(...years);
    const maxYear = Math.max(...years);

    return [minYear - 0.5, maxYear + 0.5];
  }, [chartData]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const entry = payload[0];
      const value = entry.value;

      return (
        <div className="border-gray-300 shadow-lg rounded border bg-white p-3">
          <p className="font-semibold">{`Year ${label}`}</p>
          <p style={{ color: entry.color }}>{`Current Ratio: ${value.toFixed(2)}`}</p>
        </div>
      );
    }
    return null;
  };

  const formatYAxis = (value: number) => {
    return formatYAxisNumber(value, "");
  };

  const formatXAxis = (value: number) => {
    return Number.isInteger(value) ? value.toString() : "";
  };

  const CustomDot = (props: any) => {
    const { cx, cy } = props;
    return <circle cx={cx} cy={cy} r={6} fill="#2196F3" stroke="#2196F3" strokeWidth={2} />;
  };

  return (
    <div className="h-96 w-full p-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
          <CartesianGrid horizontal={true} vertical={false} stroke="#e0e0e0" strokeDasharray="0" />

          <XAxis
            dataKey="year"
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            tickMargin={10}
            scale="linear"
            type="number"
            domain={xAxisDomain}
            tickFormatter={formatXAxis}
            ticks={chartData.map(item => item.year)}
          />

          <YAxis
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={formatYAxis}
            tickMargin={10}
          />

          <Tooltip content={<CustomTooltip />} />

          <Legend
            wrapperStyle={{ paddingTop: "20px" }}
            content={({ payload }) => (
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  display: "flex",
                  justifyContent: "center",
                  gap: "20px"
                }}
              >
                {payload?.map((entry: any, index: number) => (
                  <li key={`item-${index}`} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{ width: "16px", height: "16px", backgroundColor: entry.color, borderRadius: "2px" }} />
                    <span className="capitalize" style={{ color: "#000000" }}>
                      {entry.value}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          />

          <Line
            type="monotone"
            dataKey="currentRatio"
            name="Current Ratio"
            stroke="#2196F3"
            strokeWidth={3}
            dot={<CustomDot />}
            activeDot={{ r: 8, fill: "#2196F3", stroke: "#ffffff", strokeWidth: 2 }}
            connectNulls={true}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
export default FinancialCurrentRatioChart;

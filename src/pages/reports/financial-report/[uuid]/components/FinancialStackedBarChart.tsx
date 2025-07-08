import _ from "lodash";
import React, { useMemo } from "react";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  LabelList,
  Legend,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

import { currencyInput } from "@/utils/financialReport";

type FinancialStackedBarChartProps = {
  uuid: string;
  organisation_id: number;
  financial_report_id: number;
  collection: string;
  amount: number | null;
  year: number;
  description: string | null;
  documentation?: any[];
};

const FinancialStackedBarChart = ({ data, currency }: { data: FinancialStackedBarChartProps[]; currency?: string }) => {
  const currencySymbol = useMemo(() => {
    return currency ? currencyInput[currency] || "" : "";
  }, [currency]);

  const chartData = useMemo(() => {
    const groupedByYear = _.groupBy(data, "year");

    const transformedData = Object.keys(groupedByYear)
      .sort((a, b) => parseInt(a) - parseInt(b))
      .map(year => {
        const yearData = groupedByYear[year];

        const revenue = yearData.find(item => item.collection === "revenue")?.amount || 0;
        const expenses = yearData.find(item => item.collection === "expenses")?.amount || 0;
        const profit = yearData.find(item => item.collection === "profit")?.amount || 0;

        return {
          year: parseInt(year),
          revenue: revenue,
          expenses: -Math.abs(expenses),
          profit: profit
        };
      });

    return transformedData;
  }, [data]);

  const yAxisDomain = useMemo(() => {
    if (chartData.length === 0) return [-1000, 1000];

    const allValues = chartData.flatMap(item => [item.revenue, item.expenses, item.profit]);
    const minValue = Math.min(...allValues);
    const maxValue = Math.max(...allValues);

    const range = Math.max(maxValue - minValue, Math.abs(maxValue), Math.abs(minValue));
    const padding = range * 0.2;

    const hasExpenses = chartData.some(item => item.expenses < 0);
    const paddedMin = hasExpenses
      ? Math.floor(minValue - padding)
      : Math.min(Math.floor(minValue - padding), -Math.abs(maxValue) * 0.3);
    const paddedMax = Math.ceil(maxValue + padding);

    const finalMin = Math.min(paddedMin, -Math.abs(paddedMax) * 0.2);
    const finalMax = Math.max(paddedMax, Math.abs(paddedMin) * 0.2);

    return [finalMin, finalMax];
  }, [chartData]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="border-gray-300 shadow-lg rounded border bg-white p-3">
          <p className="font-semibold">{`${label}`}</p>
          {payload.map((entry: any, index: number) => {
            let value = entry.value;
            let name = entry.name;
            let displayValue = value;

            if (name === "expenses") {
              displayValue = Math.abs(value);
            }

            const formattedValue = `${currencySymbol}${Math.abs(displayValue).toLocaleString()}`;

            return (
              <p key={index} style={{ color: entry.color }} className="capitalize">
                {`${name}: ${formattedValue}`}
              </p>
            );
          })}
        </div>
      );
    }
    return null;
  };

  const legendFormatter = (value: string) => {
    return (
      <span className="capitalize" style={{ color: "#000000" }}>
        {value}
      </span>
    );
  };

  const formatYAxis = (value: number) => {
    if (value === 0) return `${currencySymbol}0`;
    const intValue = Math.round(value);
    return intValue > 0
      ? `${currencySymbol}${intValue.toLocaleString()}`
      : `${currencySymbol}-${Math.abs(intValue).toLocaleString()}`;
  };

  const getYAxisTicks = () => {
    const [min, max] = yAxisDomain;
    const range = max - min;
    const tickCount = 10;
    const rawStep = range / tickCount;

    const step = Math.max(1, Math.round(rawStep));

    const ticks = [];

    const startTick = Math.ceil(min / step) * step;
    for (let i = startTick; i <= max; i += step) {
      ticks.push(i);
    }

    if (!ticks.includes(0)) {
      ticks.push(0);
    }

    ticks.sort((a, b) => a - b);

    return [...new Set(ticks)];
  };

  const renderRevenueLabel = (props: any) => {
    const { x, y, width, value } = props;
    if (value > 0) {
      return (
        <text x={x + width / 2} y={y - 5} fill="#000" textAnchor="middle" fontSize="12" fontWeight="500">
          {`${currencySymbol}${value.toLocaleString()}`}
        </text>
      );
    }
    return null;
  };

  const renderExpenseLabel = (props: any) => {
    const { x, y, width, value } = props;

    if (value < 0) {
      return (
        <text
          x={x + width / 2}
          y={y + 5}
          fill="#000"
          textAnchor="middle"
          fontSize="12"
          fontWeight="500"
          dominantBaseline="hanging"
        >
          {`${currencySymbol}${Math.abs(value).toLocaleString()}`}
        </text>
      );
    }

    return null;
  };

  const renderWhiteLineOnExpenseBars = (props: any) => {
    const { x, y, width, height, value } = props;

    const lineY = y + height;

    if (value < 0) {
      return (
        <line x1={x} y1={lineY} x2={x + width} y2={lineY} stroke="#ffffff" strokeWidth={4} strokeLinecap="round" />
      );
    }

    return null;
  };

  return (
    <div className="h-96 w-full p-4">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={chartData} stackOffset="sign" margin={{ top: 20, right: 20, left: 10, bottom: 20 }}>
          <CartesianGrid horizontal={true} vertical={false} stroke="#e0e0e0" strokeDasharray="0" />

          <XAxis
            dataKey="year"
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: "#e0e0e0", strokeWidth: 2 }}
          />

          <YAxis
            domain={yAxisDomain}
            ticks={getYAxisTicks()}
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: "#e0e0e0", strokeWidth: 2 }}
            tickFormatter={formatYAxis}
            type="number"
          />

          <Tooltip content={<CustomTooltip />} />

          <Legend formatter={legendFormatter} wrapperStyle={{ paddingTop: "20px" }} />

          <ReferenceLine y={0} stroke="#999" strokeWidth={2} strokeOpacity={0.5} />

          <Bar dataKey="revenue" fill="#8BC34A" name="Revenue" stackId="stack">
            <LabelList content={renderRevenueLabel} />
          </Bar>

          <Bar dataKey="expenses" fill="#F44336" name="Expenses" stackId="stack">
            <LabelList content={renderExpenseLabel} />
            <LabelList content={renderWhiteLineOnExpenseBars} />
          </Bar>

          <Line
            dataKey="profit"
            stroke="#2196F3"
            strokeWidth={3}
            dot={{ fill: "#2196F3", strokeWidth: 2, r: 6 }}
            activeDot={{ r: 8, fill: "#2196F3" }}
            name="Profit"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FinancialStackedBarChart;

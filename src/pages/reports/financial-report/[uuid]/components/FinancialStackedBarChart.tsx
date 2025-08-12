import _ from "lodash";
import React, { useMemo } from "react";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Customized,
  LabelList,
  Legend,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

import { currencyInput, formatProfitValue, formatYAxisNumber } from "@/utils/financialReport";

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
          revenue,
          expenses: -Math.abs(expenses),
          profit,
          revenueForLabels: revenue
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

            let formattedValue = formatYAxisNumber(Math.abs(displayValue), currencySymbol);
            if (name == "Profit") {
              formattedValue = formatProfitValue(displayValue, currencySymbol);
            }

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

  const formatYAxis = (value: number) => {
    if (value === 0) return `${currencySymbol}0`;
    return formatYAxisNumber(value, currencySymbol);
  };

  const getYAxisTicks = () => {
    const [min, max] = yAxisDomain;
    const range = Math.abs(max - min);

    const magnitude = Math.pow(10, Math.floor(Math.log10(range)));
    let step = magnitude;

    if (range / step > 8) {
      step = magnitude * 2;
    } else if (range / step < 4) {
      step = magnitude / 2;
    }

    if (step < 1) {
      step = Math.pow(10, Math.floor(Math.log10(range / 5)));
    }

    const ticks = [];

    const startTick = Math.ceil(min / step) * step;
    const endTick = Math.floor(max / step) * step;

    for (let i = startTick; i <= endTick; i += step) {
      ticks.push(i);
    }

    if (min <= 0 && max >= 0 && !ticks.includes(0)) {
      ticks.push(0);
    }

    if (ticks.length < 3) {
      const additionalStep = step / 2;
      const additionalTicks = [];
      for (let i = Math.ceil(min / additionalStep) * additionalStep; i <= max; i += additionalStep) {
        if (!ticks.includes(i)) {
          additionalTicks.push(i);
        }
      }
      ticks.push(...additionalTicks);
    }

    ticks.sort((a, b) => a - b);

    return [...new Set(ticks)];
  };

  const renderExpenseLabel = (props: any) => {
    const { x, y, width, value } = props;

    if (value < 0) {
      return (
        <text
          x={x + width / 2}
          y={y + 10}
          fill="#000"
          textAnchor="middle"
          fontSize="12"
          fontWeight="500"
          dominantBaseline="hanging"
        >
          {formatYAxisNumber(Math.abs(value), currencySymbol)}
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

          <ReferenceLine y={0} stroke="#999" strokeWidth={2} strokeOpacity={0.5} />

          <Bar dataKey="revenue" fill="#8BC34A" name="Revenue" stackId="stack" />

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

          <Customized
            component={({ xAxisMap, yAxisMap, data }: any) => {
              const xAxis = xAxisMap[Object.keys(xAxisMap)[0]];
              const yAxis = yAxisMap[Object.keys(yAxisMap)[0]];
              const scale = xAxis.scale;
              const bandwidth = scale.bandwidth ? scale.bandwidth() : 40; // fallback if undefined

              return data.map((entry: any, index: number) => {
                const x = scale(entry.year) + bandwidth / 2;
                const y = yAxis.scale(entry.revenue);

                return (
                  entry.revenue > 0 && (
                    <text
                      key={`revenue-label-${index}`}
                      x={x}
                      y={y - 10}
                      fill="#000"
                      textAnchor="middle"
                      fontSize="12"
                      fontWeight="500"
                    >
                      {formatYAxisNumber(entry.revenue, currencySymbol)}
                    </text>
                  )
                );
              });
            }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FinancialStackedBarChart;

import React, { useMemo } from "react";
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

import { currencyInput } from "@/utils/financialReport";

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

const BASE = 1;

const FinancialCurrentRatioChart = ({
  data,
  currency
}: {
  data: FinancialCurrentRatioChartProps[];
  currency?: string;
}) => {
  const { chartData, xTicks } = useMemo(() => {
    const byYear: Record<
      number,
      {
        year: number;
        currentRatio: number;
        currentAssets?: number | null;
        currentLiabilities?: number | null;
      }
    > = {};

    const sorted = [...data].sort((a, b) => a.year - b.year);

    for (const item of sorted) {
      if (!byYear[item.year]) {
        byYear[item.year] = { year: item.year, currentRatio: 0 } as any;
      }
      if (item.collection === "current-assets") {
        byYear[item.year].currentAssets = item.amount ?? null;
      }
      if (item.collection === "current-liabilities") {
        byYear[item.year].currentLiabilities = item.amount ?? null;
      }
      if (item.collection === "current-ratio") {
        byYear[item.year].currentRatio = item.amount || 0;
      }
    }

    // If current-ratio is missing but assets/liabilities exist
    const raw = Object.values(byYear)
      .sort((a, b) => a.year - b.year)
      .map(entry => {
        if ((!entry.currentRatio || entry.currentRatio === 0) && entry.currentAssets && entry.currentLiabilities) {
          const liabilities = entry.currentLiabilities || 0;
          entry.currentRatio = liabilities !== 0 ? (entry.currentAssets || 0) / liabilities : 0;
        }
        return entry;
      });
    return { chartData: raw as any, xTicks: raw.map(r => r.year) };
  }, [data]);

  const xAxisDomain = useMemo(() => {
    if (chartData.length === 0) return [2020, 2025];

    const years = chartData.map((item: { year: number }) => item.year);
    const minYear = Math.min(...years);
    const maxYear = Math.max(...years);

    return [minYear - 0.5, maxYear + 0.5];
  }, [chartData]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const entry = payload.find((p: any) => p.dataKey === "currentRatio") || payload[0];
      const value = Number(entry?.value ?? 0);
      const datum = entry?.payload || {};
      const currencyCode = (currency as any) || "USD";
      const currencySymbolFallback = currencyInput[currencyCode] || "";

      const formatMoneyFull = (amount: number) => {
        try {
          return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: currencyCode,
            maximumFractionDigits: 0
          }).format(amount || 0);
        } catch {
          return `${currencySymbolFallback}${(amount || 0).toLocaleString()}`;
        }
      };

      return (
        <div
          className="shadow-lg min-w-64 overflow-hidden rounded-xl bg-white"
          style={{ border: "1px solid #e5e7eb", fontSize: "14px" }}
        >
          {/* Header with gray background */}
          <div
            className="px-4 py-2 text-center"
            style={{ backgroundColor: "#f3f4f6", borderBottom: "1px solid #e5e7eb" }}
          >
            <p className="m-0 font-semibold" style={{ color: "#111827", fontSize: "18px", lineHeight: "1.2" }}>
              {label}
            </p>
          </div>

          {/* Content section */}
          <div className="px-4 py-3">
            {/* Current Ratio */}
            <div className="mb-2 flex items-center justify-between">
              <span style={{ color: "#6b7280", fontSize: "13px" }}>Current Ratio</span>
              <span
                className="font-semibold"
                style={{ color: value >= BASE ? "#2196F3" : "#E35151", fontSize: "16px" }}
              >
                {value.toFixed(2)}
              </span>
            </div>

            {/* Separator line */}
            <div className="mb-2 w-full" style={{ height: "1px", backgroundColor: "#e5e7eb" }}></div>

            {/* Current Assets */}
            <div className="flex items-center justify-between py-1">
              <span style={{ color: "#6b7280", fontSize: "13px" }}>Current Assets</span>
              <span className="font-semibold" style={{ color: "#111827", fontSize: "14px" }}>
                {formatMoneyFull(datum.currentAssets || 0)}
              </span>
            </div>

            {/* Current Liabilities */}
            <div className="mb-3 flex items-center justify-between py-1">
              <span style={{ color: "#6b7280", fontSize: "13px" }}>Current Liabilities</span>
              <span className="font-semibold" style={{ color: "#111827", fontSize: "14px" }}>
                {formatMoneyFull(datum.currentLiabilities || 0)}
              </span>
            </div>

            {/* Formula text */}
            <p className="m-0 text-center" style={{ color: "#9ca3af", fontSize: "11px", lineHeight: "1.3" }}>
              Ratio = Current Assets ÷ Current Liabilities
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  const formatYAxis = (value: number) => {
    return Math.round(value).toString();
  };

  const formatXAxis = (value: number) => {
    return Number.isInteger(value) ? value.toString() : "";
  };

  const CustomDot = (props: any) => {
    const { cx, cy, payload } = props;
    const color = payload.currentRatio >= BASE ? "#2196F3" : "#E35151";
    return <circle cx={cx} cy={cy} r={8} fill={color} stroke="#ffffff" strokeWidth={3} filter="url(#dotShadow)" />;
  };

  const CustomActiveDot = (props: any) => {
    const { cx, cy, payload } = props;
    const color = payload.currentRatio >= BASE ? "#2196F3" : "#E35151";
    return <circle cx={cx} cy={cy} r={8} fill={color} stroke="#ffffff" strokeWidth={3} filter="url(#dotShadow)" />;
  };

  const yDomain = useMemo(() => {
    if (chartData.length === 0) return [0, 1];
    const values = chartData.map((d: any) => d.currentRatio);
    let min = Math.min(...values, BASE);
    let max = Math.max(...values, BASE);

    if (min === max) {
      min = min - 1;
      max = max + 1;
    }

    const minRounded = Math.floor(min);
    const maxRounded = Math.ceil(max);

    return [minRounded, maxRounded];
  }, [chartData]);

  const gradientOffset = useMemo(() => {
    const [min, max] = yDomain as [number, number];
    if (max === min) return 0;
    return (max - BASE) / (max - min);
  }, [yDomain]);

  const gradientOffsetLine = useMemo(() => {
    const [min, max] = yDomain as [number, number];
    if (max === min) return 0.5;
    const off = (max - BASE) / (max - min);
    return Math.max(0, Math.min(1, off));
  }, [yDomain]);

  const yTicks = useMemo(() => {
    const [min, max] = yDomain as [number, number];
    const desired = 5;
    const range = Math.max(1, max - min);
    const step = Math.max(1, Math.ceil(range / (desired - 1)));
    const ticks: number[] = [];
    for (let v = min; v <= max; v += step) {
      ticks.push(Math.round(v));
    }
    if (ticks[ticks.length - 1] !== max) ticks.push(Math.round(max));
    return ticks;
  }, [yDomain]);

  return (
    <div className="h-96 w-full p-4">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={chartData} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
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
            ticks={xTicks}
          />

          <YAxis
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={formatYAxis}
            tickMargin={10}
            domain={yDomain as any}
            ticks={yTicks}
          />

          <Tooltip content={<CustomTooltip />} />

          <Legend
            wrapperStyle={{ paddingTop: "20px" }}
            content={() => (
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
                <li style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div
                    style={{
                      width: "16px",
                      height: "16px",
                      background: "linear-gradient(90deg, #2196F3 0%, #E35151 100%)",
                      borderRadius: "2px"
                    }}
                  />
                  <span className="capitalize" style={{ color: "#000000" }}>
                    Current Ratio
                  </span>
                </li>
              </ul>
            )}
          />

          <defs>
            {/* Gradient area and base transition */}
            <linearGradient id="crSplit" x1="0" y1="0" x2="0" y2="1">
              {/* lighter blue at top to darker blue near base */}
              <stop offset={0} stopColor="#90CAF9" stopOpacity={0.25} />
              <stop offset={Math.max(0, gradientOffset - 0.001)} stopColor="#1565C0" stopOpacity={0.45} />
              {/* Cut at base (duplicate offset to avoid blending between blue and red) */}
              <stop offset={gradientOffset} stopColor="#90CAF9" stopOpacity={0.25} />
              <stop offset={gradientOffset} stopColor="#FCA5A5" stopOpacity={0.25} />
              {/* Light red near base to darker red at bottom */}
              <stop offset={Math.min(1, gradientOffset + 0.001)} stopColor="#B91C1C" stopOpacity={0.15} />
              <stop offset={1} stopColor="#FCA5A5" stopOpacity={0.85} />
            </linearGradient>
            <linearGradient id="crLineSplit" x1="0" y1="0" x2="0" y2="1">
              <stop offset={Math.max(0, gradientOffsetLine - 0.3)} stopColor="#2196F3" stopOpacity={1} />
              <stop offset={gradientOffsetLine} stopColor="#9ABBEA" stopOpacity={1} />
              <stop offset={Math.min(1, gradientOffsetLine + 0.3)} stopColor="#E35151" stopOpacity={1} />
            </linearGradient>
            <filter id="dotShadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000000" floodOpacity="0.25" />
            </filter>
          </defs>

          <ReferenceLine y={BASE} stroke="#9CA3AF" strokeDasharray="4 4" />

          <Area
            type="linear"
            dataKey="currentRatio"
            fill="url(#crSplit)"
            stroke="none"
            baseValue={BASE}
            isAnimationActive={false}
          />

          <Line
            type="linear"
            dataKey="currentRatio"
            name="Current Ratio"
            stroke="url(#crLineSplit)"
            strokeWidth={3}
            dot={<CustomDot />}
            activeDot={<CustomActiveDot />}
            connectNulls={true}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};
export default FinancialCurrentRatioChart;

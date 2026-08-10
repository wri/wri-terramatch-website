import { useT } from "@transifex/react";
import React from "react";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import CustomBar from "@/pages/dashboard/charts/CustomBarJobsCreated";
import { TreeCoverLossPolygonCounts } from "@/utils/MonitoredIndicatorUtils";

type TreeLossData = {
  name: number;
  treeCoverLoss: number;
  treeCoverLossFires: number;
};

interface TreeLossBarChartProps {
  data: TreeLossData[];
  className?: string;
  polygonCounts?: TreeCoverLossPolygonCounts;
}

const TreeLossBarChart = ({ data, className = "", polygonCounts }: TreeLossBarChartProps) => {
  const t = useT();
  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: any[]; label?: string }) => {
    if (active && payload && payload.length) {
      return (
        <div className="border-gray-200 min-w-[200px] rounded-md border bg-white p-2">
          <p className="text-12-semibold mb-2">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="text-12-light">{entry.name}</span>
              <span className="text-12-semibold ml-auto font-medium">
                {Number(entry.value).toFixed(1).toLocaleString()} ha
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`w-full p-0 pt-0 ${className}`}>
      <h2 className="text-14 mb-3 pl-8 uppercase text-darkCustom">Tree Loss Retrospective (ha)</h2>
      <h3 className="text-14-semibold mb-4 pl-8">2010-2024</h3>
      <div className="relative h-[375px] w-full lg:h-[500px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 0,
              bottom: 5
            }}
            barSize={40}
          >
            <CartesianGrid vertical={false} stroke="#E1E4E9" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} dy={10} />
            <YAxis
              axisLine={false}
              tickLine={false}
              tickFormatter={value => `${value.toLocaleString()}`}
              className="text-12"
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0, 0, 0, 0.05)" }} />
            <Legend
              wrapperStyle={{
                paddingTop: "20px"
              }}
            />
            <Bar dataKey="treeCoverLossFires" stackId="a" fill="#24555C" name="Tree cover loss from fires" />
            <Bar
              dataKey="treeCoverLoss"
              stackId="a"
              fill="#4097A3"
              name="Tree cover loss"
              shape={(props: any) => <CustomBar {...props} />}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      {polygonCounts != null && (
        <div className="mt-2 flex justify-end pr-8" aria-label={t("Tree cover loss polygon summary")}>
          <div className="shadow-sm rounded-lg border border-grey-350 bg-white px-4 py-3">
            <p className="text-12-light text-darkCustom">
              {t("Polygons with Loss:")}{" "}
              <span className="text-12-semibold font-semibold">{polygonCounts.withLoss}</span>
            </p>
            <p className="text-12-light mt-1 text-darkCustom">
              {t("Polygons with No Loss Detected (0 ha):")}{" "}
              <span className="text-12-semibold font-semibold">{polygonCounts.noLossDetected}</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TreeLossBarChart;

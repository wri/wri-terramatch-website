import { useT } from "@transifex/react";
import React, { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { calculateTotals, GroupedBarChartData } from "@/utils/dashboardUtils";

import { CustomBar } from "./CustomBarJobsCreated";
import { CustomLegend } from "./CustomLegendJobsCreated";
import { CustomTooltip } from "./CustomTooltipJobsCreated";
import { CustomXAxisTick } from "./CustomXAxisTickJobsCreated";
import { CustomYAxisTick } from "./CustomYAxisTickJobsCreated";

const GroupedBarChart: React.FC<{ data: GroupedBarChartData }> = ({ data }) => {
  const { type, chartData, total, maxValue } = data;
  const totals = calculateTotals(data);
  const t = useT();

  const mappingLabels = useMemo(() => {
    return {
      "Part-Time": t("Part-Time"),
      "Full-Time": t("Full-Time"),
      Women: t("Women"),
      Men: t("Men"),
      "Non-Binary": t("Non-Binary"),
      Other: t("Other"),
      "Non-Youth": t("Non-Youth"),
      Youth: t("Youth")
    };
  }, [t]);

  const transformedTotals = useMemo(() => {
    let transformedTotal: any = {};
    Object.entries(totals).forEach(([key, value]) => {
      const newKey = (mappingLabels[key as keyof typeof mappingLabels] as keyof typeof transformedTotal) || key;
      transformedTotal[newKey] = value;
    });
    return transformedTotal;
  }, [totals, mappingLabels]);

  const transformedChartData = useMemo(() => {
    return chartData.map(item => {
      let name = item.name.split(",").join(" + ");
      if (name in mappingLabels) {
        name = mappingLabels[name as keyof typeof mappingLabels];
      }
      let transformedItem: any = {
        name
      };
      Object.entries(item).forEach(([key, value]) => {
        if (key !== "name") {
          const newKey = (mappingLabels[key as keyof typeof mappingLabels] as keyof typeof transformedItem) || key;
          transformedItem[newKey] = value;
        }
      });
      return transformedItem;
    });
  }, [chartData, mappingLabels]);

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={transformedChartData}>
        <CartesianGrid vertical={false} stroke="#E1E4E9" />
        <XAxis tickLine={false} axisLine={false} dataKey="name" tick={props => <CustomXAxisTick {...props} />} />
        <YAxis tickLine={false} axisLine={false} range={[0, maxValue]} tick={props => <CustomYAxisTick {...props} />} />
        <Tooltip
          content={props => <CustomTooltip {...props} total={total} />}
          cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
        />
        <Legend content={<CustomLegend totals={transformedTotals} totalJobs={total} />} />
        {type === "gender" ? (
          <>
            <Bar dataKey={t("Women")} fill="#70B52B" shape={(props: any) => <CustomBar {...props} />} />
            <Bar dataKey={t("Men")} fill="#239FDC" shape={(props: any) => <CustomBar {...props} />} />
            <Bar dataKey={t("Non-Binary")} fill="#065327" shape={(props: any) => <CustomBar {...props} />} />
            <Bar dataKey={t("Other")} fill="#09354D" shape={(props: any) => <CustomBar {...props} />} />
          </>
        ) : (
          <>
            <Bar dataKey={t("Youth")} fill="#70B52B" shape={(props: any) => <CustomBar {...props} />} />
            <Bar dataKey={t("Non-Youth")} fill="#239FDC" shape={(props: any) => <CustomBar {...props} />} />
            <Bar dataKey={t("Other")} fill="#09354D" shape={(props: any) => <CustomBar {...props} />} />
          </>
        )}
      </BarChart>
    </ResponsiveContainer>
  );
};

export default GroupedBarChart;

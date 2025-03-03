import { useT } from "@transifex/react";
import React, { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { getBarColorRestoration } from "@/utils/dashboardUtils";

import { CustomBar } from "./CustomBarJobsCreated";
import CustomLabel from "./CustomLabelRestoration";
import CustomTooltip from "./CustomTooltip";
import CustomXAxisTick from "./CustomXAxisTickRestoration";
import CustomYAxisTick from "./CustomYAxisTickJobsCreated";

type ResturationStrategy = {
  label: string;
  value: number;
};

type FormattedData = {
  name: string;
  Value: number;
  total: number;
};

const SimpleBarChart = ({ data, total }: { data: ResturationStrategy[]; total?: number }) => {
  const t = useT();

  const formattedData: FormattedData[] = useMemo(() => {
    const mappingLabels = {
      "Direct Seeding": t("Direct Seeding"),
      "Assisted Natural Regeneration": t("Assisted Natural Regeneration"),
      "Tree Planting": t("Tree Planting"),
      "Multiple Strategies": t("Multiple Strategies")
    };

    return data.map(item => {
      const labelName = item.label.split(",").join(" + ").replace(/-/g, " ");
      const label = mappingLabels[labelName as keyof typeof mappingLabels] || labelName;
      return {
        name: label,
        Value: item.value,
        total: total ?? 0
      };
    });
  }, [data, total, t]);

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={formattedData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 30
          }}
          barSize={100}
        >
          <CartesianGrid vertical={false} stroke="#E1E4E9" />
          <XAxis tickLine={false} axisLine={false} dataKey="name" height={20} interval={0} tick={<CustomXAxisTick />} />
          <YAxis tickLine={false} axisLine={false} tick={props => <CustomYAxisTick {...props} />} />
          <Bar dataKey="Value" label={<CustomLabel />} shape={(props: any) => <CustomBar {...props} />}>
            {formattedData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarColorRestoration(entry.name)} />
            ))}
          </Bar>
          <Tooltip content={props => <CustomTooltip {...props} />} cursor={{ fill: "rgba(0, 0, 0, 0.05)" }} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SimpleBarChart;

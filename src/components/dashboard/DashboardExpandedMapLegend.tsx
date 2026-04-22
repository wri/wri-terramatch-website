import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";

type DashboardExpandedMapLegendProps = {
  nonProfitProjectCount: number;
  enterpriseProjectCount: number;
  translate: (key: string, options?: Record<string, string | number>) => string;
};

export function DashboardExpandedMapLegend({
  nonProfitProjectCount,
  enterpriseProjectCount,
  translate
}: DashboardExpandedMapLegendProps) {
  return (
    <div className="absolute bottom-6 left-6 grid gap-2 rounded-lg border border-neutral-175 bg-white px-4 py-2">
      <div className="flex gap-2">
        <Icon name={IconNames.IC_LEGEND_MAP} className="h-4.5 w-4.5 text-tertiary-800" />
        <Text variant="text-12" className="text-darkCustom">
          {translate("Non-Profit Projects ({count})", { count: nonProfitProjectCount })}
        </Text>
      </div>
      <div className="flex items-center gap-2">
        <Icon name={IconNames.IC_LEGEND_MAP} className="h-4.5 w-4.5 text-blue-50" />
        <Text variant="text-12" className="text-darkCustom">
          {translate("Enterprise Projects ({count})", { count: enterpriseProjectCount })}
        </Text>
      </div>
    </div>
  );
}

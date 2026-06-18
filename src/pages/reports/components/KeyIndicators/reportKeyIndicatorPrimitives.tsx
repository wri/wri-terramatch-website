import { Box } from "@chakra-ui/react";
import { ReactNode } from "react";

import Loader from "@/components/generic/Loading/Loader";
import { Framework, toFramework } from "@/context/framework.provider";

export type ReportKeyIndicatorFramework = "terrafund" | "ppc" | "hbf";

export type MetricTooltipContent = {
  title: string;
  tooltip: string;
};

export const REPORT_METRIC_CARD_CLASS = "flex-[0_0_calc((100%_-_0.75rem)_/_2)] lg:flex-[0_0_calc((100%_-_1.5rem)_/_2)]";

export const getReportKeyIndicatorFramework = (frameworkKey?: string | null): ReportKeyIndicatorFramework => {
  const framework = toFramework(frameworkKey);

  if (framework === Framework.PPC) return "ppc";
  if (framework === Framework.HBF) return "hbf";

  return "terrafund";
};

export const MetricTooltip = ({ title, tooltip }: MetricTooltipContent) => (
  <Box fontSize="14px" lineHeight="20px">
    <b>{title}</b>
    <br />
    {tooltip}
  </Box>
);

export const DemographicsLoader = ({ className = "h-32 w-full flex-1" }: { className?: string }) => (
  <Loader className={className} />
);

export const getTooltipContent = ({ title, tooltip }: MetricTooltipContent): ReactNode => (
  <MetricTooltip title={title} tooltip={tooltip} />
);

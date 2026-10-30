import { Flex } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC } from "react";

import MetricCard from "@/redesignComponents/dataDisplay/Metrics/MetricCard";
import { AreaHectaresIcon, TreeIcon } from "@/redesignComponents/foundations/Icons";

import { PolygonMetricTotals } from "../hooks/useProjectPolygonMetrics";

type PolygonReviewMetricsProps = {
  project: PolygonMetricTotals | null;
  filtered: PolygonMetricTotals | null | undefined;
  selected: PolygonMetricTotals | null | undefined;
};

const PolygonReviewMetrics: FC<PolygonReviewMetricsProps> = ({ project, filtered, selected }) => {
  const t = useT();

  return (
    <Flex className="items-center gap-4 mobile:w-full mobile:flex-col">
      <MetricCard
        color="secondary.600"
        icon={<TreeIcon />}
        variant="medium"
        title={t("Trees Planted")}
        progress={project?.treesPlanted ?? 0}
        goal={0}
        filtered={filtered === undefined ? undefined : filtered?.treesPlanted ?? null}
        selection={selected === undefined ? undefined : selected?.treesPlanted ?? null}
        tooltipContent={t("This is the sum of trees planted as reported in the polygon attributes")}
        className="min-w-[12.5rem] mobile:w-full mobile:min-w-full"
      />
      <MetricCard
        color="secondary.700"
        icon={<AreaHectaresIcon />}
        variant="medium"
        title={t("Restoration Area")}
        progress={project?.restorationAreaHa ?? 0}
        goal={0}
        progressSuffix="ha"
        filtered={filtered === undefined ? undefined : filtered?.restorationAreaHa ?? null}
        selection={selected === undefined ? undefined : selected?.restorationAreaHa ?? null}
        tooltipContent={t("This is the sum of hectares as calculated from the polygon geometries")}
        className="min-w-[12.5rem] mobile:w-full mobile:min-w-full"
      />
    </Flex>
  );
};

export default PolygonReviewMetrics;

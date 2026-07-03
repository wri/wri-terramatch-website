import { Flex } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import classNames from "classnames";
import type { FC } from "react";

import { useMyUser } from "@/connections/User";
import MetricCard from "@/redesignComponents/dataDisplay/Metrics/MetricCard";
import { AreaHectaresIcon, TreeIcon } from "@/redesignComponents/foundations/Icons";
import InlineMessage from "@/redesignComponents/status/InlineMessage/InlineMessage";

type SitePolygonMetricsSectionProps = {
  totalTreesPlanted: number;
  totalRestorationAreaHa: number;
  hasPolygonSelection: boolean;
  selectedTreesPlanted: number;
  selectedRestorationAreaRounded: number;
  polygonsWithOverlapCount: number;
  onSelectOverlapPolygons: () => void;
};

const SitePolygonMetricsSection: FC<SitePolygonMetricsSectionProps> = ({
  totalTreesPlanted,
  totalRestorationAreaHa,
  hasPolygonSelection,
  selectedTreesPlanted,
  selectedRestorationAreaRounded,
  polygonsWithOverlapCount,
  onSelectOverlapPolygons
}) => {
  const t = useT();
  const isAdmin = useMyUser();

  return (
    <Flex className="items-center justify-between gap-4 mobile:flex-col">
      <Flex className="items-center gap-4 mobile:w-full mobile:flex-col">
        <MetricCard
          color="secondary.600"
          icon={<TreeIcon />}
          variant={isAdmin ? "progressBar" : "medium"}
          title={t("Trees Planted")}
          progress={totalTreesPlanted}
          goal={Math.max(totalTreesPlanted, 1)}
          widthProgressBar={isAdmin ? "5rem" : undefined}
          selection={hasPolygonSelection ? selectedTreesPlanted : undefined}
          tooltipContent={t("This is the sum of trees planted as reported in the polygon attributes")}
          className={classNames(" mobile:w-full mobile:min-w-full", isAdmin ? "w-[18rem]" : "min-w-[12.5rem]")}
        />
        <MetricCard
          color="secondary.700"
          icon={<AreaHectaresIcon />}
          variant={isAdmin ? "progressBar" : "medium"}
          title={t("Restoration Area")}
          progress={totalRestorationAreaHa}
          goal={Math.max(totalRestorationAreaHa, 1)}
          widthProgressBar={isAdmin ? "5rem" : undefined}
          selection={hasPolygonSelection ? selectedRestorationAreaRounded : undefined}
          tooltipContent={t("This is the sum of hectares from the selected polygons")}
          className={classNames(" mobile:w-full mobile:min-w-full", isAdmin ? "min-w-[18rem]" : "min-w-[12.5rem]")}
        />
      </Flex>
      {polygonsWithOverlapCount > 0 && (
        <InlineMessage
          actionLabel={t("Select Polygons")}
          isButtonRight
          size="small"
          label={
            polygonsWithOverlapCount === 1
              ? t("1 overlap detected")
              : t("{count} overlaps detected", { count: polygonsWithOverlapCount })
          }
          onActionClick={onSelectOverlapPolygons}
          variant="error"
        />
      )}
    </Flex>
  );
};

export default SitePolygonMetricsSection;

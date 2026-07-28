import { Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import classNames from "classnames";
import type { FC } from "react";

import MetricCard from "@/redesignComponents/dataDisplay/Metrics/MetricCard";
import { AreaHectaresIcon, TreeIcon } from "@/redesignComponents/foundations/Icons";
import InlineMessage from "@/redesignComponents/status/InlineMessage/InlineMessage";

type SitePolygonMetricsSectionProps = {
  totalTreesPlanted: number;
  totalRestorationAreaHa: number;
  restorationAreaGoal: number | null;
  hasPolygonSelection: boolean;
  selectedTreesPlanted: number;
  selectedRestorationAreaRounded: number;
  polygonsWithOverlapCount: number;
  onSelectOverlapPolygons: () => void;
};

const SitePolygonMetricsSection: FC<SitePolygonMetricsSectionProps> = ({
  totalTreesPlanted,
  totalRestorationAreaHa,
  restorationAreaGoal,
  hasPolygonSelection,
  selectedTreesPlanted,
  selectedRestorationAreaRounded,
  polygonsWithOverlapCount,
  onSelectOverlapPolygons
}) => {
  const t = useT();

  return (
    <Flex className="items-center justify-between gap-4 mobile:flex-col">
      <Flex className="items-center gap-4 mobile:w-full mobile:flex-col">
        <MetricCard
          color="secondary.600"
          icon={<TreeIcon />}
          variant="medium"
          title={t("Trees Planted")}
          progress={totalTreesPlanted}
          goal={0}
          selection={hasPolygonSelection ? selectedTreesPlanted : undefined}
          tooltipContent={t("This is the sum of trees planted as reported in the polygon attributes")}
          className="min-w-[12.5rem] mobile:w-full mobile:min-w-full"
        />
        <MetricCard
          color="secondary.700"
          icon={<AreaHectaresIcon />}
          variant={"medium"}
          title={t("Restoration Area")}
          progress={totalRestorationAreaHa}
          goal={restorationAreaGoal ?? 0}
          progressSuffix="ha"
          goalSuffix="ha"
          widthProgressBar={undefined}
          selection={hasPolygonSelection ? selectedRestorationAreaRounded : undefined}
          tooltipContent={t("This is the sum of hectares from the selected polygons")}
          className={classNames("mobile:w-full mobile:min-w-full", "min-w-[12.5rem]")}
        />
      </Flex>
      {polygonsWithOverlapCount > 0 && (
        <InlineMessage
          actionLabel={t("Select Polygons")}
          isButtonRight
          size="small"
          className="w-max"
          label={
            <Text color="error.900" textStyle="300">
              <b>
                {polygonsWithOverlapCount === 1
                  ? t("1 overlap ")
                  : t("{count} overlaps ", { count: polygonsWithOverlapCount })}
              </b>
              {t("detected")}
            </Text>
          }
          onActionClick={onSelectOverlapPolygons}
          variant="error"
        />
      )}
    </Flex>
  );
};

export default SitePolygonMetricsSection;

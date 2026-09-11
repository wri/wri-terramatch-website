import { Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import classNames from "classnames";
import type { FC, ReactNode } from "react";

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
  // Project scope only (F7): count of deduped cross-site overlap pairs and a selection shortcut for
  // them. Omitted (default undefined/0) on the site page, which has no cross-site concept.
  crossSiteOverlapCount?: number;
  onSelectCrossSiteOverlapPolygons?: () => void;
  // Project scope only (F7): the `‹ ⚠ i of N ›` anomaly stepper, rendered alongside the overlap
  // banner. Omitted on the site page.
  anomalyStepper?: ReactNode;
};

const SitePolygonMetricsSection: FC<SitePolygonMetricsSectionProps> = ({
  totalTreesPlanted,
  totalRestorationAreaHa,
  restorationAreaGoal,
  hasPolygonSelection,
  selectedTreesPlanted,
  selectedRestorationAreaRounded,
  polygonsWithOverlapCount,
  onSelectOverlapPolygons,
  crossSiteOverlapCount = 0,
  onSelectCrossSiteOverlapPolygons,
  anomalyStepper
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
      <Flex className="items-center gap-3 mobile:w-full mobile:flex-col">
        {anomalyStepper}
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
        {crossSiteOverlapCount > 0 && onSelectCrossSiteOverlapPolygons != null && (
          <InlineMessage
            actionLabel={t("Select Polygons")}
            isButtonRight
            size="small"
            className="w-max"
            label={
              <Text color="error.900" textStyle="300">
                <b>
                  {crossSiteOverlapCount === 1
                    ? t("1 cross-site overlap ")
                    : t("{count} cross-site overlaps ", { count: crossSiteOverlapCount })}
                </b>
                {t("detected")}
              </Text>
            }
            onActionClick={onSelectCrossSiteOverlapPolygons}
            variant="error"
          />
        )}
      </Flex>
    </Flex>
  );
};

export default SitePolygonMetricsSection;

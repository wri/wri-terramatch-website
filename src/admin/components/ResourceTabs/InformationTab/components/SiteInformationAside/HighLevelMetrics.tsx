import { Box, Card, Stack, SxProps, Theme, Typography } from "@mui/material";
import { FC } from "react";
import { Labeled, NumberField, useShowContext } from "react-admin";

import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import { ContextCondition } from "@/context/ContextCondition";
import { Framework } from "@/context/framework.provider";

const verficationDifferentCount = (count: number, polygonsCount: number) => {
  return count == polygonsCount;
};

const HighLevelMetrics: FC = () => {
  const inlineLabelSx: SxProps<Theme> = {
    flexDirection: "row",
    justifyContent: "space-between"
  };

  const { record } = useShowContext();

  return (
    <Card className="!shadow-none">
      <Box paddingX={3.75} paddingY={2}>
        <Stack gap={3}>
          <Text variant="text-16-semibold" className="text-darkCustom">
            High Level Metrics
          </Text>
          <ContextCondition frameworksShow={[Framework.PPC]}>
            <Labeled label="Workdays Created (Old Calculation)" sx={inlineLabelSx}>
              <NumberField source="selfReportedWorkdayCount" emptyText="0" />
            </Labeled>
            <Labeled label="Workdays Created (New Calculation)" sx={inlineLabelSx}>
              <NumberField source="workdayCount" emptyText="0" />
            </Labeled>
            <Labeled label="Workdays Created (Combined - PD View)" sx={inlineLabelSx}>
              <NumberField source="combinedWorkdayCount" emptyText="0" />
            </Labeled>
          </ContextCondition>
          <div className="hidden">
            <Labeled label="Total Number Of Trees Planted" sx={inlineLabelSx} className="label-field-aside">
              <NumberField source="treesPlantedCount" emptyText="0" />
            </Labeled>
          </div>
          <ContextCondition frameworksShow={[Framework.PPC]}>
            <Labeled label="Total Number Of Seeds Planted" sx={inlineLabelSx} className="label-field-aside">
              <NumberField source="seedsPlantedCount" emptyText="0" />
            </Labeled>
          </ContextCondition>
          <ContextCondition frameworksShow={[Framework.PPC]}>
            <Labeled label="Estimate Number of Trees Restored via ANR" sx={inlineLabelSx} className="label-field-aside">
              <NumberField source="approvedRegeneratedTreesCount" emptyText="0" />
            </Labeled>
          </ContextCondition>
          <>
            <Labeled
              label={
                <span className="flex items-center gap-2">
                  Hectares Under Restoration{" "}
                  {verficationDifferentCount(
                    record?.totalHectaresRestoredSum,
                    record?.hectaresRestoredPolygonsCount
                  ) ? (
                    ""
                  ) : (
                    <Icon name={IconNames.WARNING_TRIANGLE} />
                  )}
                </span>
              }
            >
              <Stack direction="row" spacing={6} alignItems="center">
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Target
                  </Typography>
                  <NumberField source="totalHectaresRestoredSum" emptyText="0" />
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Polygons
                  </Typography>
                  <NumberField source="hectaresRestoredPolygonsCount" emptyText="0" />
                </Box>
              </Stack>
            </Labeled>

            <Labeled
              label={
                <span className="flex items-center gap-2">
                  Total Number of Trees Planted{" "}
                  {verficationDifferentCount(record?.treesPlantedCount, record?.treesPlantedPolygonsCount) ? (
                    ""
                  ) : (
                    <Icon name={IconNames.WARNING_TRIANGLE} />
                  )}
                </span>
              }
            >
              <Stack direction="row" spacing={6} alignItems="center">
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Reports
                  </Typography>
                  <NumberField source="treesPlantedCount" emptyText="0" />
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Polygons
                  </Typography>
                  <NumberField
                    source="treesPlantedPolygonsCount"
                    emptyText="0"
                    color={
                      verficationDifferentCount(record?.treesPlantedCount, record?.treesPlantedPolygonsCount)
                        ? ""
                        : "red"
                    }
                  />
                </Box>
              </Stack>
            </Labeled>
          </>

          <ContextCondition frameworksShow={[Framework.TF]}>
            <Labeled label="Hectares Restored Goal" sx={inlineLabelSx} className="label-field-aside">
              <NumberField source="hectaresToRestoreGoal" emptyText="0" />
            </Labeled>
          </ContextCondition>
          <div className="hidden">
            <Labeled label="Hectares Under Restoration" sx={inlineLabelSx} className="label-field-aside">
              <NumberField source="totalHectaresRestoredSum" emptyText="0" />
            </Labeled>
          </div>
        </Stack>
      </Box>
    </Card>
  );
};

export default HighLevelMetrics;

import { Box, Card, Stack, SxProps, Theme } from "@mui/material";
import { FC } from "react";
import { Labeled, NumberField } from "react-admin";

import Text from "@/components/elements/Text/Text";
import { ContextCondition } from "@/context/ContextCondition";
import { Framework } from "@/context/framework.provider";

const HighLevelMetrics: FC = () => {
  const inlineLabelSx: SxProps<Theme> = {
    flexDirection: "row",
    justifyContent: "space-between"
  };

  return (
    <Card className="!shadow-none">
      <Box paddingX={3.75} paddingY={2}>
        <Stack gap={3}>
          <Text variant="text-16-semibold" className="text-darkCustom">
            High Level Metrics
          </Text>
          <ContextCondition frameworksShow={[Framework.PPC]}>
            <Labeled label="Workdays Created (Old Calculation)" sx={inlineLabelSx}>
              <NumberField source="self_reported_workday_count" emptyText="0" />
            </Labeled>
            <Labeled label="Workdays Created (New Calculation)" sx={inlineLabelSx}>
              <NumberField source="workday_count" emptyText="0" />
            </Labeled>
            <Labeled label="Workdays Created (Combined - PD View)" sx={inlineLabelSx}>
              <NumberField source="combined_workday_count" emptyText="0" />
            </Labeled>
          </ContextCondition>
          <Labeled label="Total Number Of Trees Planted" sx={inlineLabelSx} className="label-field-aside">
            <NumberField source="trees_planted_count" emptyText="0" />
          </Labeled>
          <ContextCondition frameworksShow={[Framework.PPC]}>
            <Labeled label="Total Number Of Seeds Planted" sx={inlineLabelSx} className="label-field-aside">
              <NumberField source="seeds_planted_count" emptyText="0" />
            </Labeled>
          </ContextCondition>
          <ContextCondition frameworksShow={[Framework.PPC]}>
            <Labeled label="Estimate Number of Trees Restored via ANR" sx={inlineLabelSx} className="label-field-aside">
              <NumberField source="approved_regenerated_trees_count" emptyText="0" />
            </Labeled>
          </ContextCondition>
          <ContextCondition frameworksShow={[Framework.TF]}>
            <Labeled label="Hectares Restored Goal" sx={inlineLabelSx} className="label-field-aside">
              <NumberField source="hectares_to_restore_goal" emptyText="0" />
            </Labeled>
          </ContextCondition>
          <Labeled label="Hectares Under Restoration" sx={inlineLabelSx} className="label-field-aside">
            <NumberField source="total_hectares_restored_sum" emptyText="0" />
          </Labeled>
        </Stack>
      </Box>
    </Card>
  );
};

export default HighLevelMetrics;

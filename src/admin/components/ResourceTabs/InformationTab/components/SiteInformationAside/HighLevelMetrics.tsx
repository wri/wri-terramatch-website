import { Box, Card, Stack, SxProps, Theme } from "@mui/material";
import { FC } from "react";
import { Labeled, NumberField, useShowContext } from "react-admin";
import { When } from "react-if";

import Text from "@/components/elements/Text/Text";
const HighLevelMetics: FC = () => {
  const { record } = useShowContext();

  const inlineLabelSx: SxProps<Theme> = {
    flexDirection: "row",
    justifyContent: "space-between"
  };

  const isPPC = record.framework_key === "ppc";

  return (
    <Card className="!shadow-none">
      <Box paddingX={3.75} paddingY={2}>
        <Stack gap={3}>
          <Text variant="text-16-semibold" className="text-darkCustom">
            High Level Metrics
          </Text>
          <When condition={isPPC}>
            <Labeled label="Workdays Created (Old Calculation)" sx={inlineLabelSx}>
              <NumberField source="self_reported_workday_count" emptyText="0" />
            </Labeled>
            <Labeled label="Workdays Created (New Calculation)" sx={inlineLabelSx}>
              <NumberField source="workday_count" emptyText="0" />
            </Labeled>
          </When>
          <Labeled label="Total Number Of Trees Planted" sx={inlineLabelSx} className="label-field-aside">
            <NumberField source="trees_planted_count" emptyText="0" />
          </Labeled>
          <When condition={isPPC}>
            <Labeled label="Total Number Of Seeds Planted" sx={inlineLabelSx} className="label-field-aside">
              <NumberField source="seeds_planted_count" emptyText="0" />
            </Labeled>
          </When>
          <Labeled label="Hectares Under Restoration" sx={inlineLabelSx} className="label-field-aside">
            <NumberField source="hectares_to_restore_goal" emptyText="0" />
          </Labeled>
        </Stack>
      </Box>
    </Card>
  );
};

export default HighLevelMetics;

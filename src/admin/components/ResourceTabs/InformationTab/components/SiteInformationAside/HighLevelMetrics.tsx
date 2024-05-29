import { Box, Card, Divider, Stack, SxProps, Theme, Typography } from "@mui/material";
import { FC } from "react";
import { Labeled, NumberField, useShowContext } from "react-admin";
import { When } from "react-if";

const HighLevelMetics: FC = () => {
  const { record } = useShowContext();

  const inlineLabelSx: SxProps<Theme> = {
    flexDirection: "row",
    justifyContent: "space-between"
  };

  const isPPC = record.framework_key === "ppc";

  return (
    <Card>
      <Box paddingX={3.75} paddingY={2}>
        <Typography variant="h5">High Level Metrics</Typography>
      </Box>

      <Divider />

      <Box paddingX={3.75} paddingY={2}>
        <Stack gap={3}>
          <When condition={isPPC}>
            <Labeled label="Total Number Of Workdays Created" sx={inlineLabelSx}>
              <NumberField source="workday_count" emptyText="0" />
            </Labeled>
            <Labeled label="Self Reported Workdays Created" sx={inlineLabelSx}>
              <NumberField source="self_reported_workday_count" emptyText="0" />
            </Labeled>
          </When>
          <Labeled label="Total Number Of Trees Planted" sx={inlineLabelSx}>
            <NumberField source="trees_planted_count" emptyText="0" />
          </Labeled>
          <Labeled label="Hectares Under Restoration" sx={inlineLabelSx}>
            <NumberField source="hectares_to_restore_goal" emptyText="0" />
          </Labeled>
        </Stack>
      </Box>
    </Card>
  );
};

export default HighLevelMetics;

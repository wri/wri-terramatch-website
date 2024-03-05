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

  const isTerraFund = record.framework_key === "terrafund";

  return (
    <Card>
      <Box paddingX={3.75} paddingY={2}>
        <Typography variant="h5">High Level Metrics</Typography>
      </Box>

      <Divider />

      <Box paddingX={3.75} paddingY={2}>
        <Stack gap={3}>
          <When condition={!isTerraFund}>
            <Labeled label="Total Number Of Workdays Created" sx={inlineLabelSx}>
              <NumberField source={record.workdays_total ? "workdays_total" : "total_workdays_count"} emptyText="0" />
            </Labeled>
          </When>
          <When condition={isTerraFund}>
            <Labeled label="Total Number Of Jobs Created" sx={inlineLabelSx}>
              <NumberField source="total_jobs_created" emptyText="0" />
            </Labeled>
          </When>
          <Labeled label="Total Number Of Trees Planted" sx={inlineLabelSx}>
            <NumberField
              source={record.trees_planted_count ? "trees_planted_count" : "total_trees_planted_count"}
              emptyText="0"
            />
          </Labeled>
          <When condition={isTerraFund}>
            <Labeled label="Total Number Of Seedlings" sx={inlineLabelSx}>
              <NumberField source="seedlings_grown" emptyText="0" />
            </Labeled>
          </When>
        </Stack>
      </Box>
    </Card>
  );
};

export default HighLevelMetics;

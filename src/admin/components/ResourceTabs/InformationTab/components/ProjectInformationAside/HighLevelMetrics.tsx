import { Card, Divider, Stack, SxProps, Theme, Typography } from "@mui/material";
import { FC } from "react";
import { Labeled, NumberField, useShowContext } from "react-admin";
import { When } from "react-if";

const HighLevelMetics: FC = () => {
  const { record } = useShowContext();

  const inlineLabelSx: SxProps<Theme> = {
    flexDirection: "row",
    justifyContent: "space-between"
  };

  return (
    <Card sx={{ padding: 3.75 }}>
      <Typography variant="h5" marginBottom={2}>
        High Level Metrics
      </Typography>

      <Divider sx={{ marginBottom: 2 }} />

      <Stack gap={3}>
        <When condition={record?.framework_key === "terrafund"}>
          <Labeled label="Jobs Created" sx={inlineLabelSx}>
            <NumberField source="total_jobs_created" emptyText="0" />
          </Labeled>
        </When>
        <When condition={record?.framework_key === "ppc"}>
          <Labeled label="Workdays Created" sx={inlineLabelSx}>
            <NumberField source="workday_count" emptyText="0" />
          </Labeled>
          <Labeled label="Self Reported Workdays Created" sx={inlineLabelSx}>
            <NumberField source="self_reported_workday_count" emptyText="0" />
          </Labeled>
        </When>
        <Labeled label="Trees Planted" sx={inlineLabelSx}>
          <NumberField source="trees_planted_count" emptyText="0" />
        </Labeled>
      </Stack>
    </Card>
  );
};

export default HighLevelMetics;

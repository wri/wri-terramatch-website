import { Box, Card, Divider, Stack, SxProps, Theme, Typography } from "@mui/material";
import { FC } from "react";
import { Labeled, NumberField, useShowContext } from "react-admin";

const HighLevelMetrics: FC = () => {
  const { record } = useShowContext();

  const inlineLabelSx: SxProps<Theme> = {
    flexDirection: "row",
    justifyContent: "space-between"
  };

  return (
    <Card>
      <Box paddingX={3.75} paddingY={2}>
        <Typography variant="h5">High Level Metrics</Typography>
      </Box>

      <Divider />

      <Box paddingX={3.75} paddingY={2}>
        <Stack gap={3}>
          <Labeled label="Total Restoration Partners Engaged (with Double-Counting)" sx={inlineLabelSx}>
            <NumberField
              source={record.totalRestorationPartnersCount ? "totalRestorationPartnersCount" : "totalTreesPlantedCount"}
              emptyText="0"
            />
          </Labeled>
          <Labeled label="Total Unique Restoration Partners" sx={inlineLabelSx}>
            <NumberField
              source={
                record.totalUniqueRestorationPartners ? "totalUniqueRestorationPartners" : "totalTreesPlantedCount"
              }
              emptyText="0"
            />
          </Labeled>
        </Stack>
      </Box>
    </Card>
  );
};

export default HighLevelMetrics;

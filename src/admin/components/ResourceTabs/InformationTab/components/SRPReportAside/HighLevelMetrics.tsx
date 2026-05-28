import { Box, Card, Divider, Stack, Typography } from "@mui/material";
import { FC } from "react";
import { Labeled, NumberField, useShowContext } from "react-admin";

const INLINE_LABEL_SX = {
  flexDirection: "row",
  justifyContent: "space-between"
};

const HighLevelMetrics: FC = () => {
  const { record } = useShowContext();

  return (
    <Card>
      <Box paddingX={3.75} paddingY={2}>
        <Typography variant="h5">High Level Metrics</Typography>
      </Box>

      <Divider />

      <Box paddingX={3.75} paddingY={2}>
        <Stack gap={3}>
          <Labeled label="Total Restoration Partners Engaged (with Double-Counting)" sx={INLINE_LABEL_SX}>
            <NumberField
              source={record.totalRestorationPartnersCount ? "totalRestorationPartnersCount" : "totalTreesPlantedCount"}
              emptyText="0"
            />
          </Labeled>
          <Labeled label="Total Unique Restoration Partners" sx={INLINE_LABEL_SX}>
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

import { Box, Card, Divider, Stack, SxProps, Theme, Typography } from "@mui/material";
import { FC } from "react";
import { Labeled, NumberField } from "react-admin";

const HighLevelMetics: FC = () => {
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
          <Labeled label="Total No. Seedlings Were Grown" sx={inlineLabelSx}>
            <NumberField source="seedlingsGrownCount" />
          </Labeled>
        </Stack>
      </Box>
    </Card>
  );
};

export default HighLevelMetics;

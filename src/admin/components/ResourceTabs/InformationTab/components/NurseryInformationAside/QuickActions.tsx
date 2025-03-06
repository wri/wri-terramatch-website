import { Box, Button, Card, Divider, Stack, SxProps, Theme, Typography } from "@mui/material";
import { FC } from "react";
import { Labeled, NumberField, useShowContext } from "react-admin";
import { useNavigate } from "react-router";

import modules from "@/admin/modules";

const NuseryQuickActions: FC = () => {
  const { record } = useShowContext();

  const navigate = useNavigate();

  const handleNavigate = (view: keyof typeof modules) => {
    if (!record) return;

    const queryParams = new URLSearchParams({
      displayedFilters: JSON.stringify({ nursery_uuid: true }),
      filter: JSON.stringify({ nursery_uuid: record.uuid }),
      order: "ASC",
      page: "1",
      perPage: "10",
      sort: "id"
    }).toString();

    navigate(`/${view}?${queryParams}`);
  };

  const inlineLabelSx: SxProps<Theme> = {
    flexDirection: "row",
    justifyContent: "space-between"
  };

  return (
    <Card>
      <Box paddingX={3.75} paddingY={2}>
        <Typography variant="h5">Quick Actions</Typography>
      </Box>

      <Divider />

      <Box paddingX={3.75} paddingTop={2} paddingBottom={3}>
        <Stack gap={3}>
          <Labeled label="Total Nursery Reports" sx={inlineLabelSx}>
            <NumberField source="nurseryReportsTotal" />
          </Labeled>
          <Labeled label="Total Overdue Nursery Reports" sx={inlineLabelSx}>
            <NumberField source="overdueNurseryReportsTotal" />
          </Labeled>
          <Button variant="outlined" onClick={() => handleNavigate("nurseryReport")}>
            View Nursery Reports
          </Button>
        </Stack>
      </Box>
    </Card>
  );
};

export default NuseryQuickActions;

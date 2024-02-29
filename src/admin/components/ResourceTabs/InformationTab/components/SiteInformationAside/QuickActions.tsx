import { Box, Card, Divider, Stack, SxProps, Theme, Typography } from "@mui/material";
import { FC } from "react";
import { Button, Labeled, Link, NumberField, useCreatePath, useShowContext } from "react-admin";

import modules from "@/admin/modules";
import { downloadFileBlob } from "@/utils/network";

const QuickActions: FC = () => {
  const { record } = useShowContext();
  const createPath = useCreatePath();

  const getNavigationPath = (view: string) => {
    if (!record) return;

    const queryParams = new URLSearchParams({
      displayedFilters: JSON.stringify({ site_uuid: true }),
      filter: JSON.stringify({ site_uuid: record.uuid }),
      order: "ASC",
      page: "1",
      perPage: "10",
      sort: "id"
    }).toString();

    return `/${view}?${queryParams}`;
  };

  const inlineLabelSx: SxProps<Theme> = {
    flexDirection: "row",
    justifyContent: "space-between"
  };

  const downloadShapefile = async () => {
    try {
      if (record && record.name && record.boundary_geojson) {
        downloadFileBlob(record.boundary_geojson, `${record.name}_shapefile.json`);
      }
    } catch (error) {
      console.error("Error downloading shapefile:", error);
    }
  };

  return (
    <Card>
      <Box paddingX={3.75} paddingY={2}>
        <Typography variant="h5">Quick Actions</Typography>
      </Box>

      <Divider />

      <Box paddingX={3.75} paddingY={2}>
        <Button
          variant="outlined"
          component={Link}
          to={createPath({ resource: modules.project.ResourceName, type: "show", id: record.project.uuid })}
          fullWidth
          label="Back To Project"
        />
      </Box>

      <Divider />

      <Box paddingX={3.75} paddingTop={2} paddingBottom={3}>
        <Stack gap={3}>
          <Labeled label="Total Site Reports" sx={inlineLabelSx}>
            <NumberField source="site_reports_total" />
          </Labeled>
          <Labeled label="Total Overdue Site Reports" sx={inlineLabelSx}>
            <NumberField source="overdue_site_reports_total" />
          </Labeled>
          <Button variant="outlined" component={Link} to={getNavigationPath("siteReport")} label="View Site Reports" />
          <Button variant="outlined" component={Link} to={getNavigationPath("./4")} label="Add Monitored Data" />
          <Button variant="outlined" onClick={downloadShapefile} label="Download Shapefile" />
        </Stack>
      </Box>
    </Card>
  );
};

export default QuickActions;

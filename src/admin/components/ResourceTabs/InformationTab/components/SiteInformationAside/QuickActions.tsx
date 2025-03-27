import { Box, Card, Stack, SxProps, Theme } from "@mui/material";
import { FC } from "react";
import { Button, Labeled, Link, NumberField, useCreatePath, useShowContext } from "react-admin";

import modules from "@/admin/modules";
import Text from "@/components/elements/Text/Text";

const SiteQuickActions: FC = () => {
  const { record } = useShowContext();
  const createPath = useCreatePath();

  const getNavigationPath = (view: string) => {
    if (!record) return;

    const queryParams = new URLSearchParams({
      displayedFilters: JSON.stringify({ siteUuid: true }),
      filter: JSON.stringify({ siteUuid: record.uuid }),
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

  return (
    <Card className="!shadow-none">
      <Box paddingX={3.75} paddingY={2}>
        <Text variant="text-16-semibold" className="text-darkCustom">
          Quick Actions
        </Text>
      </Box>

      <Box paddingX={3.75} paddingY={2}>
        <Button
          className="button-aside-page-admin"
          component={Link}
          to={createPath({
            resource: modules.project.ResourceName,
            type: "show",
            id: record?.projectUuid
          })}
          fullWidth
          label="Back To Project"
        />
      </Box>

      <Box paddingX={3.75} paddingTop={2} paddingBottom={3}>
        <Stack gap={3}>
          <Labeled label="Total Site Reports" sx={inlineLabelSx} className="label-field-aside">
            <NumberField source="totalSiteReports" />
          </Labeled>
          <Labeled label="Total Overdue Site Reports" sx={inlineLabelSx} className="label-field-aside">
            <NumberField source="overdueSiteReportsTotal" />
          </Labeled>
          <Button
            className="button-aside-page-admin"
            component={Link}
            to={getNavigationPath("siteReport")}
            label="View Site Reports"
          />
          <Button
            className="button-aside-page-admin"
            component={Link}
            to={getNavigationPath("./4")}
            label="Add Monitored Data"
          />
        </Stack>
      </Box>
    </Card>
  );
};

export default SiteQuickActions;

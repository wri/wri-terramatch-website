import { Box, Card, Divider, Stack, Typography } from "@mui/material";
import { FC } from "react";
import { Button, Link, useCreatePath, useShowContext } from "react-admin";
import { When } from "react-if";

import modules from "@/admin/modules";
import { EntityName } from "@/types/common";

type QuickActionsProps = {
  type: EntityName;
};

const ReportQuickActions: FC<QuickActionsProps> = ({ type }) => {
  const { record } = useShowContext();
  const createPath = useCreatePath();

  const getReportsPath = (view: keyof typeof modules) => {
    if (!record) return;
    const queryParams = new URLSearchParams({
      displayedFilters: JSON.stringify({ project_uuid: true }),
      filter: JSON.stringify({ project_uuid: record.project.uuid }),
      order: "ASC",
      page: "1",
      perPage: "10",
      sort: "id"
    }).toString();

    return `/${view}?${queryParams}`;
  };

  return (
    <Card>
      <Box paddingX={3.75} paddingY={2}>
        <Typography variant="h5">Quick Actions</Typography>
      </Box>

      <Divider />

      <Box paddingX={3.75} paddingTop={2} paddingBottom={3}>
        <Stack gap={3}>
          <Button
            variant="outlined"
            component={Link}
            to={createPath({ resource: modules.task.ResourceName, type: "show", id: record.task_uuid })}
            fullWidth
            label="View Task"
          />
          <Button
            variant="outlined"
            component={Link}
            to={createPath({
              resource: modules.project.ResourceName,
              type: "show",
              id: record?.project?.uuid ?? record?.projectUuid
            })}
            fullWidth
            label="Back To Project"
          />
          <When condition={type === "site-reports"}>
            <Button
              variant="outlined"
              component={Link}
              to={createPath({ resource: modules.site.ResourceName, type: "show", id: record?.site?.uuid })}
              fullWidth
              label="Back To Site"
            />
          </When>
          <When condition={type === "nursery-reports"}>
            <Button
              variant="outlined"
              component={Link}
              to={createPath({ resource: modules.nursery.ResourceName, type: "show", id: record?.nursery?.uuid })}
              fullWidth
              label="Back To Nursery"
            />
          </When>
          <When condition={type === "project-reports"}>
            <Button variant="outlined" component={Link} to={getReportsPath("siteReport")} label="View Site Reports" />
            <Button
              variant="outlined"
              component={Link}
              to={getReportsPath("nurseryReport")}
              label="View Nursery Reports"
            />
          </When>
        </Stack>
      </Box>
    </Card>
  );
};

export default ReportQuickActions;

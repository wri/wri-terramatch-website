import { Box, Card, Divider, Stack, Typography } from "@mui/material";
import { FC } from "react";
import { Button, Link, useCreatePath, useShowContext } from "react-admin";
import { useNavigate } from "react-router";

import modules from "@/admin/modules";
import { EntityName } from "@/types/common";

type QuickActionsProps = {
  type: EntityName;
};

const ReportQuickActions: FC<QuickActionsProps> = ({ type }) => {
  const { record } = useShowContext();
  const createPath = useCreatePath();
  const navigate = useNavigate();

  const taskUuid = record?.taskUuid;

  const getReportsPath = (resource: keyof typeof modules) => {
    if (!record?.projectUuid) return;

    const displayedFilters: Record<string, boolean> = { projectUuid: true };
    const filter: Record<string, string> = { projectUuid: record.projectUuid };

    // Add taskUuid filter if available (for filtering reports by task)
    if (taskUuid != null) {
      displayedFilters.taskUuid = true;
      filter.taskUuid = taskUuid;
    }

    const queryParams = new URLSearchParams({
      displayedFilters: JSON.stringify(displayedFilters),
      filter: JSON.stringify(filter),
      order: "ASC",
      page: "1",
      perPage: "10",
      sort: "id"
    }).toString();

    return `/${resource}?${queryParams}`;
  };

  return (
    <Card>
      <Box paddingX={3.75} paddingY={2}>
        <Typography variant="h5">Quick Actions</Typography>
      </Box>

      <Divider />

      <Box paddingX={3.75} paddingTop={2} paddingBottom={3}>
        <Stack gap={3}>
          {type !== "disturbance-reports" && taskUuid != null && (
            <Button
              variant="outlined"
              component={Link}
              to={createPath({
                resource: modules.task.ResourceName,
                type: "show",
                id: taskUuid
              })}
              fullWidth
              label="View Task"
            />
          )}
          <Button
            variant="outlined"
            component={Link}
            to={createPath({
              resource: modules.project.ResourceName,
              type: "show",
              id: record?.projectUuid
            })}
            fullWidth
            label="Back To Project"
          />
          {type === "site-reports" && (
            <Button
              variant="outlined"
              component={Link}
              to={createPath({ resource: modules.site.ResourceName, type: "show", id: record?.siteUuid })}
              fullWidth
              label="Back To Site"
            />
          )}
          {type === "nursery-reports" && (
            <Button
              variant="outlined"
              component={Link}
              to={createPath({ resource: modules.nursery.ResourceName, type: "show", id: record?.nurseryUuid })}
              fullWidth
              label="Back To Nursery"
            />
          )}
          {type === "project-reports" && (
            <>
              <Button
                variant="outlined"
                onClick={() => {
                  const path = getReportsPath("siteReport");
                  if (path) navigate(path);
                }}
                fullWidth
                label="View Site Reports"
              />
              <Button
                variant="outlined"
                onClick={() => {
                  const path = getReportsPath("nurseryReport");
                  if (path) navigate(path);
                }}
                fullWidth
                label="View Nursery Reports"
              />
            </>
          )}
        </Stack>
      </Box>
    </Card>
  );
};

export default ReportQuickActions;

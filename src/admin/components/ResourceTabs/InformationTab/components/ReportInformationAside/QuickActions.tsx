import { Box, Card, Divider, Stack, Typography } from "@mui/material";
import { FC } from "react";
import { Button, Link, useCreatePath, useShowContext } from "react-admin";

import modules from "@/admin/modules";
import { EntityName } from "@/types/common";

type QuickActionsProps = {
  type: EntityName;
};

const ReportQuickActions: FC<QuickActionsProps> = ({ type }) => {
  const { record } = useShowContext();
  const createPath = useCreatePath();

  const taskUuid = record?.taskUuid ?? record?.task_uuid;

  return (
    <Card>
      <Box paddingX={3.75} paddingY={2}>
        <Typography variant="h5">Quick Actions</Typography>
      </Box>

      <Divider />

      <Box paddingX={3.75} paddingTop={2} paddingBottom={3}>
        <Stack gap={3}>
          {type === "disturbance-reports" ? null : (
            <Button
              variant="outlined"
              component={Link}
              to={createPath({
                resource: modules.task.ResourceName,
                type: "show",
                id: taskUuid!
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
          {type === "project-reports" && taskUuid && (
            <>
              <Button
                variant="outlined"
                component={Link}
                to={createPath({
                  resource: modules.task.ResourceName,
                  type: "show",
                  id: taskUuid
                })}
                fullWidth
                label="View Site Reports"
              />
              <Button
                variant="outlined"
                component={Link}
                to={createPath({
                  resource: modules.task.ResourceName,
                  type: "show",
                  id: taskUuid
                })}
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

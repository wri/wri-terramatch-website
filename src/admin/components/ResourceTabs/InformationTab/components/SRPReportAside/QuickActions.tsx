import { Box, Card, Divider, Stack, Typography } from "@mui/material";
import { FC } from "react";
import { Button, Link, useCreatePath, useShowContext } from "react-admin";

import modules from "@/admin/modules";

const ReportQuickActions: FC = () => {
  const { record } = useShowContext();
  const createPath = useCreatePath();

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
            to={createPath({
              resource: modules.task.ResourceName,
              type: "show",
              id: record?.taskUuid! ?? record?.task_uuid!
            })}
            fullWidth
            label="View Task"
          />
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
        </Stack>
      </Box>
    </Card>
  );
};

export default ReportQuickActions;

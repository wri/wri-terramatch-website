import { Box, Button, Divider, Grid, Stack } from "@mui/material";
import { useState } from "react";
import { FunctionField, Labeled, TextField, useRecordContext, useShowContext } from "react-admin";

import Aside from "@/admin/components/Aside/Aside";
import { ApplicationRead } from "@/generated/apiSchemas";

import ApplicationRequestMoreInfoModal from "./ApplicationChangeStatusModal";
import { statusChoices } from "./ApplicationList";

export type status = "approved" | "requires-more-information" | "rejected";

const ApplicationShowAside = () => {
  const [shouldRequestMessageWithStatus, setShouldRequestMessageWithStatus] = useState<status | null>(null);

  const { isLoading } = useShowContext();

  const application = useRecordContext<ApplicationRead>();

  const handleClose = () => {
    setShouldRequestMessageWithStatus(null);
  };

  return (
    <>
      <Aside title="Overview">
        <Grid container spacing={2} marginY={2}>
          <Grid item xs={6}>
            <Labeled label="Organisation">
              <TextField source="organisation.name" />
            </Labeled>
          </Grid>
          <Grid item xs={6}>
            <Labeled>
              <FunctionField
                label="Status"
                source="current_submission.status"
                render={(record: any) =>
                  statusChoices.find(status => status.id === record?.current_submission?.status)?.name ||
                  record?.current_submission?.status
                }
                sortable={false}
              />
            </Labeled>
          </Grid>
          <Grid item xs={12}>
            <Labeled label="Stage">
              <TextField source="current_submission.stage.name" />
            </Labeled>
          </Grid>
        </Grid>
        <Divider />
        <Box pt={2}>
          <Stack direction="row" alignItems="center" gap={2} flexWrap="wrap">
            <Button
              variant="contained"
              onClick={() => setShouldRequestMessageWithStatus("approved")}
              // @ts-ignore typo in response
              disabled={application?.current_submission?.status === "approved" || isLoading}
            >
              Approve
            </Button>
            <Button
              variant="outlined"
              onClick={() => setShouldRequestMessageWithStatus("requires-more-information")}
              // @ts-ignore typo in response
              disabled={application?.current_submission?.status === "requires-more-information" || isLoading}
            >
              Request More Information
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={() => setShouldRequestMessageWithStatus("rejected")} // @ts-ignore typo in response
              disabled={application?.current_submission?.status === "rejected" || isLoading}
            >
              Reject
            </Button>
          </Stack>
        </Box>
      </Aside>

      <ApplicationRequestMoreInfoModal
        handleClose={handleClose}
        open={Boolean(shouldRequestMessageWithStatus)}
        status={shouldRequestMessageWithStatus}
      />
    </>
  );
};

export default ApplicationShowAside;

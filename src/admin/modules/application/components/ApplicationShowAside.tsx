import { Box, Button, Divider, Grid, Stack } from "@mui/material";
import { useState } from "react";
import { FunctionField, Labeled, TextField, useRecordContext, useShowContext } from "react-admin";

import { ApplicationShowRecord } from "@/admin/apiProvider/dataProviders/applicationDataProvider";
import Aside from "@/admin/components/Aside/Aside";

import ApplicationRequestMoreInfoModal from "./ApplicationChangeStatusModal";
import { statusChoices } from "./ApplicationList";

export type status = "approved" | "requires-more-information" | "rejected";

const ApplicationShowAside = () => {
  const [shouldRequestMessageWithStatus, setShouldRequestMessageWithStatus] = useState<status | null>(null);

  const { isLoading } = useShowContext();

  const application = useRecordContext<ApplicationShowRecord>();

  const handleClose = () => {
    setShouldRequestMessageWithStatus(null);
  };

  const currentStatus = application?.currentSubmission?.status;

  return (
    <>
      <Aside title="Overview">
        <Grid container spacing={2} marginY={2}>
          <Grid item xs={6}>
            <Labeled label="Organisation">
              <TextField source="organisationName" />
            </Labeled>
          </Grid>
          <Grid item xs={6}>
            <Labeled>
              <FunctionField
                label="Status"
                source="currentSubmission.status"
                render={(record: any) =>
                  statusChoices.find(status => status.id === record?.currentSubmission?.status)?.name ||
                  record?.currentSubmission?.status
                }
                sortable={false}
              />
            </Labeled>
          </Grid>
          <Grid item xs={12}>
            <Labeled label="Stage">
              <TextField source="currentSubmission.stageName" />
            </Labeled>
          </Grid>
        </Grid>
        <Divider />
        <Box pt={2}>
          <Stack direction="row" alignItems="center" gap={2} flexWrap="wrap">
            <Button
              variant="contained"
              onClick={() => setShouldRequestMessageWithStatus("approved")}
              disabled={isLoading || currentStatus !== "awaiting-approval"}
            >
              Approve
            </Button>
            <Button
              variant="outlined"
              onClick={() => setShouldRequestMessageWithStatus("requires-more-information")}
              disabled={isLoading || currentStatus !== "awaiting-approval"}
            >
              Request More Information
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={() => setShouldRequestMessageWithStatus("rejected")}
              disabled={isLoading || currentStatus !== "awaiting-approval"}
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

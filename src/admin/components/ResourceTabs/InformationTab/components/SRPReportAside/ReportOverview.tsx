import { Check } from "@mui/icons-material";
import { Button, Card, Grid, Stack, Typography } from "@mui/material";
import { FC, useState } from "react";
import { DateField, Labeled, TextField, useShowContext } from "react-admin";

import StatusChangeModal from "@/admin/components/Dialogs/StatusChangeModal";
import FrameworkField from "@/admin/components/Fields/FrameworkField";
import ReadableStatusField from "@/admin/components/Fields/ReadableStatusField";

const ReportOverview: FC<{ parent?: { label: string; source: string } }> = ({ parent }) => {
  const [statusModal, setStatusModal] = useState<"approved" | "needs-more-information" | "reminder" | undefined>();

  const { record } = useShowContext();
  const reportActionDisabled = ["awaiting-approval", "needs-more-information"].includes(record.updateRequestStatus);

  return (
    <>
      <Card sx={{ padding: 3.75 }}>
        <Typography variant="h5" marginBottom={3.75}>
          Report Overview
        </Typography>

        <Stack gap={3}>
          {parent && parent.label !== "Financial Report" && parent.label !== "Disturbance Report" && (
            <Labeled label={parent.label}>
              <TextField source={parent.source} />
            </Labeled>
          )}
          {record?.projectName && (
            <Labeled label="Project">
              <TextField source="projectName" />
            </Labeled>
          )}

          <Labeled label="Organisation">
            <TextField source="organisationName" />
          </Labeled>

          <Grid spacing={2} marginBottom={2} container>
            {record?.frameworkKey && (
              <Grid xs={4} item>
                <Labeled label="Framework">
                  <FrameworkField prop="frameworkKey" />
                </Labeled>
              </Grid>
            )}

            <Grid xs={4} item>
              <Labeled label="Status">
                <ReadableStatusField prop="status" />
              </Labeled>
            </Grid>

            <Grid xs={4} item>
              <Labeled label="Change Request Status">
                <ReadableStatusField prop="updateRequestStatus" />
              </Labeled>
            </Grid>

            {record?.dueAt && parent?.label !== "Disturbance Report" && (
              <Grid xs={4} item>
                <Labeled label="Due Date">
                  <DateField source="dueAt" label="Due Date" locales="en-GB" />
                </Labeled>
              </Grid>
            )}
          </Grid>

          <Stack direction="row" alignItems="center" gap={2} flexWrap="wrap">
            <Button
              variant="outlined"
              disabled={reportActionDisabled || record?.status === "needs-more-information"}
              onClick={() => setStatusModal("needs-more-information")}
            >
              Request More Info
            </Button>
            <Button
              variant="contained"
              startIcon={<Check />}
              disabled={reportActionDisabled || record?.status === "approved"}
              onClick={() => setStatusModal("approved")}
            >
              Approve
            </Button>
            {(!parent || parent.label !== "Financial Report") && (
              <Button variant="outlined" onClick={() => setStatusModal("reminder")}>
                Reminder
              </Button>
            )}
          </Stack>
        </Stack>
      </Card>

      <StatusChangeModal open={!!statusModal} status={statusModal} handleClose={() => setStatusModal(undefined)} />
    </>
  );
};

export default ReportOverview;

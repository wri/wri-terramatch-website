import { Check } from "@mui/icons-material";
import { Button, Card, Grid, Stack, Typography } from "@mui/material";
import { FC, useState } from "react";
import { Labeled, TextField, useShowContext } from "react-admin";

import StatusChangeModal from "@/admin/components/Dialogs/StatusChangeModal";
import FrameworkField from "@/admin/components/Fields/FrameworkField";

const ReportOverview: FC<{ parent?: { label: string; source: string } }> = ({ parent }) => {
  const [statusModal, setStatusModal] = useState<"approve" | "moreinfo" | undefined>();

  const { record } = useShowContext();
  const reportActionDisabled = ["awaiting-approval", "needs-more-information"].includes(record.update_request_status);

  return (
    <>
      <Card sx={{ padding: 3.75 }}>
        <Typography variant="h5" marginBottom={3.75}>
          Report Overview
        </Typography>

        <Stack gap={3}>
          {parent && (
            <Labeled label={parent.label}>
              <TextField source={parent.source} />
            </Labeled>
          )}
          <Labeled label="Project">
            <TextField source="project.name" />
          </Labeled>

          <Labeled label="Organisation">
            <TextField source="organisation.name" />
          </Labeled>

          <Grid spacing={2} marginBottom={2} container>
            <Grid xs={4} item>
              <Labeled label="Framework">
                <FrameworkField />
              </Labeled>
            </Grid>

            <Grid xs={4} item>
              <Labeled label="Status">
                <TextField source="readable_status" />
              </Labeled>
            </Grid>

            <Grid xs={4} item>
              <Labeled label="Change Request Status">
                <TextField source="readable_update_request_status" />
              </Labeled>
            </Grid>
          </Grid>

          <Stack direction="row" alignItems="center" gap={2} flexWrap="wrap">
            <Button
              variant="outlined"
              disabled={reportActionDisabled || record?.status === "needs-more-information"}
              onClick={() => setStatusModal("moreinfo")}
            >
              Request More Info
            </Button>
            <Button
              variant="contained"
              startIcon={<Check />}
              disabled={reportActionDisabled || record?.status === "approved"}
              onClick={() => setStatusModal("approve")}
            >
              Approve
            </Button>
          </Stack>
        </Stack>
      </Card>

      <StatusChangeModal open={!!statusModal} status={statusModal} handleClose={() => setStatusModal(undefined)} />
    </>
  );
};

export default ReportOverview;

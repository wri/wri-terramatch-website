import { Check } from "@mui/icons-material";
import { Button, Card, Grid, Stack, Typography } from "@mui/material";
import { FC, useState } from "react";
import { Labeled, TextField, useShowContext } from "react-admin";

import StatusChangeModal from "@/admin/components/Dialogs/StatusChangeModal";
import ReadableStatusField from "@/admin/components/Fields/ReadableStatusField";

const NurseryOverview: FC = () => {
  const [statusModal, setStatusModal] = useState<"approved" | "needs-more-information" | undefined>();

  const { record } = useShowContext();

  return (
    <>
      <Card sx={{ padding: 3.75 }}>
        <Typography variant="h5" marginBottom={3.75}>
          Nursery Overview
        </Typography>

        <Stack gap={3}>
          <Grid spacing={2} marginBottom={2} container>
            <Grid xs={12} item>
              <Labeled label="Project">
                <TextField source="projectName" />
              </Labeled>
            </Grid>
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
          </Grid>

          <Stack direction="row" alignItems="center" gap={2} flexWrap="wrap">
            <Button
              variant="outlined"
              disabled={record?.status === "needs-more-information"}
              onClick={() => setStatusModal("needs-more-information")}
            >
              Request More Info
            </Button>
            <Button
              variant="contained"
              startIcon={<Check />}
              disabled={record?.status === "approved"}
              onClick={() => setStatusModal("approved")}
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

export default NurseryOverview;

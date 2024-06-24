import { Check } from "@mui/icons-material";
import { Box, Button, Card, Divider, Grid, Stack, Typography } from "@mui/material";
import { FC, useState } from "react";
import { BooleanField, Labeled, TextField, useShowContext } from "react-admin";

import StatusChangeModal from "@/admin/components/Dialogs/StatusChangeModal";
import FrameworkField from "@/admin/components/Fields/FrameworkField";

const ProjectOverview: FC = () => {
  const [statusModal, setStatusModal] = useState<"approve" | "moreinfo" | undefined>();

  const { record } = useShowContext();

  return (
    <>
      <Card sx={{ padding: 3.75 }}>
        <Typography variant="h5" marginBottom={3.75}>
          Project Overview
        </Typography>

        <Grid spacing={2} marginBottom={2} container>
          <Grid item xs={8}>
            <Labeled label="Organisation">
              <TextField source="organisation.name" />
            </Labeled>
          </Grid>

          <Grid xs={4} item>
            <Labeled label="Status">
              <TextField source="readable_status" />
            </Labeled>
          </Grid>

          <Grid xs={4} item>
            <Labeled label="Monitored Data">
              <BooleanField source="has_monitoring_data" looseValue />
            </Labeled>
          </Grid>

          <Grid xs={4} item>
            <Labeled label="Funding Programme">
              <FrameworkField />
            </Labeled>
          </Grid>

          <Grid xs={4} item>
            <Labeled label="Change Request Status">
              <TextField source="readable_update_request_status" />
            </Labeled>
          </Grid>
        </Grid>

        <Divider />

        <Box pt={2}>
          <Stack direction="row" alignItems="center" gap={2} flexWrap="wrap">
            <Button
              variant="outlined"
              disabled={record?.status === "needs-more-information"}
              onClick={() => setStatusModal("moreinfo")}
            >
              Request More Info
            </Button>
            <Button
              variant="contained"
              startIcon={<Check />}
              disabled={record?.status === "approved"}
              onClick={() => setStatusModal("approve")}
            >
              Approve
            </Button>
          </Stack>
        </Box>
      </Card>

      <StatusChangeModal open={!!statusModal} status={statusModal} handleClose={() => setStatusModal(undefined)} />
    </>
  );
};

export default ProjectOverview;

import { Check } from "@mui/icons-material";
import { Button, Card, Grid, Stack, Typography } from "@mui/material";
import { FC, useState } from "react";
import { BooleanField, FunctionField, Labeled, TextField, useShowContext } from "react-admin";

import StatusChangeModal from "@/admin/components/Dialogs/StatusChangeModal";
import FrameworkField from "@/admin/components/Fields/FrameworkField";

const SiteOverview: FC = () => {
  const [statusModal, setStatusModal] = useState<"approve" | "moreinfo" | undefined>();

  const { record } = useShowContext();

  return (
    <>
      <Card sx={{ padding: 3.75 }}>
        <Typography variant="h5" marginBottom={3.75}>
          Site Overview
        </Typography>

        <Stack gap={3}>
          <Labeled label="Site">
            <TextField source="name" />
          </Labeled>

          <Grid spacing={2} marginBottom={2} container>
            <Grid xs={6} item>
              <Labeled label="Framework">
                <FrameworkField />
              </Labeled>
            </Grid>

            <Grid xs={6} item>
              <Labeled label="Site Type">
                <FunctionField
                  source="control_site"
                  label="Site Type"
                  render={(record: any) => (record.control_site ? "Control Site" : "Site")}
                />
              </Labeled>
            </Grid>

            <Grid xs={6} item>
              <Labeled label="Monitored Data">
                <BooleanField source="has_monitoring_data" looseValue />
              </Labeled>
            </Grid>

            <Grid xs={6} item>
              <Labeled label="Status">
                <TextField source="readable_status" />
              </Labeled>
            </Grid>
          </Grid>

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
        </Stack>
      </Card>

      <StatusChangeModal open={!!statusModal} status={statusModal} handleClose={() => setStatusModal(undefined)} />
    </>
  );
};

export default SiteOverview;

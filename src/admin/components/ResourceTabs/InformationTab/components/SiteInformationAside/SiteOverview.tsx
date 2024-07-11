import { Check } from "@mui/icons-material";
import { Button, Card, Grid, Stack } from "@mui/material";
import { FC, useEffect, useState } from "react";
import { BooleanField, FunctionField, Labeled, TextField, useShowContext } from "react-admin";

import StatusChangeModal from "@/admin/components/Dialogs/StatusChangeModal";
import FrameworkField from "@/admin/components/Fields/FrameworkField";
import Text from "@/components/elements/Text/Text";
import { fetchGetV2SitesSiteCheckApprove } from "@/generated/apiComponents";

const SiteOverview: FC = () => {
  const [statusModal, setStatusModal] = useState<"approve" | "moreinfo" | "restoration-in-progress" | undefined>();
  const [checkPolygons, setCheckPolygons] = useState<boolean | undefined>(undefined);

  const { record } = useShowContext();

  useEffect(() => {
    const fetchCheckPolygons = async () => {
      const result = await fetchGetV2SitesSiteCheckApprove({
        pathParams: { site: record?.uuid }
      });
      setCheckPolygons(result.data?.can_approve);
    };

    fetchCheckPolygons();
  }, [record]);

  return (
    <>
      <Card sx={{ padding: 3.75 }} className="!shadow-none">
        <Text variant="text-16-semibold" className="mb-6 text-darkCustom">
          Site Overview
        </Text>

        <Stack gap={3}>
          <Labeled label="Site" className="label-field-aside">
            <TextField source="name" />
          </Labeled>

          <Grid spacing={2} marginBottom={2} container>
            <Grid xs={6} item>
              <Labeled label="Framework" className="label-field-aside">
                <FrameworkField />
              </Labeled>
            </Grid>

            <Grid xs={6} item>
              <Labeled label="Site Type" className="label-field-aside">
                <FunctionField
                  source="control_site"
                  label="Site Type"
                  render={(record: any) => (record.control_site ? "Control Site" : "Site")}
                />
              </Labeled>
            </Grid>

            <Grid xs={6} item>
              <Labeled label="Monitored Data" className="label-field-aside">
                <BooleanField source="has_monitoring_data" looseValue />
              </Labeled>
            </Grid>

            <Grid xs={6} item>
              <Labeled label="Status" className="label-field-aside">
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
              className="button-aside-page-admin"
              disabled={record?.status === "needs-more-information"}
              onClick={() => setStatusModal("moreinfo")}
            >
              Request More Info
            </Button>
            <Button
              className="button-aside-page-admin"
              disabled={record?.status === "restoration-in-progress"}
              onClick={() => setStatusModal("restoration-in-progress")}
            >
              Restoration in Progress
            </Button>
            <Button
              className="button-aside-page-admin"
              startIcon={<Check />}
              disabled={record?.status === "approved" || checkPolygons}
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

import { Box, Button, Divider, Grid, Stack } from "@mui/material";
import { Labeled, RaRecord, SelectField, TextField, useRefresh, useShowContext } from "react-admin";
import { When } from "react-if";

import Aside from "@/admin/components/Aside/Aside";
import { getOrganisationTypeOptions } from "@/constants/options/organisations";
import { usePutV2AdminOrganisationsApprove, usePutV2AdminOrganisationsReject } from "@/generated/apiComponents";
import { V2OrganisationRead } from "@/generated/apiSchemas";
import { optionToChoices } from "@/utils/options";

export const OrganisationShowAside = () => {
  const refresh = useRefresh();
  const { record } = useShowContext<V2OrganisationRead & RaRecord>();
  const hasOrganisationAttrib = !!record?.organisation;
  const uuid = hasOrganisationAttrib ? record?.organisation?.uuid : (record?.uuid as string);
  const status = hasOrganisationAttrib ? record?.organisation?.status : record?.status;

  const { mutate: approve } = usePutV2AdminOrganisationsApprove({
    onSuccess() {
      refresh();
    }
  });

  const { mutate: reject } = usePutV2AdminOrganisationsReject({
    onSuccess() {
      refresh();
    }
  });

  return (
    <Aside title="Organisation Review">
      <Grid container spacing={2} marginY={2}>
        <Grid item xs={6}>
          <Labeled>
            <TextField source={hasOrganisationAttrib ? "organisation.name" : "name"} />
          </Labeled>
        </Grid>
        <Grid item xs={6}>
          <Labeled>
            <SelectField
              source={hasOrganisationAttrib ? "organisation.type" : "type"}
              choices={optionToChoices(getOrganisationTypeOptions())}
              emptyText="Not Provided"
            />
          </Labeled>
        </Grid>
        <Grid item xs={6}>
          <Labeled label="Status">
            <TextField source={hasOrganisationAttrib ? "organisation.readable_status" : "readable_status"} />
          </Labeled>
        </Grid>
      </Grid>
      <Divider />
      <Box pt={2}>
        <When condition={status !== "draft"}>
          <Stack direction="row" alignItems="center" gap={2} flexWrap="wrap">
            <Button variant="contained" onClick={() => approve({ body: { uuid } })}>
              Approve
            </Button>
            <Button variant="outlined" onClick={() => reject({ body: { uuid } })}>
              Reject
            </Button>
          </Stack>
        </When>
      </Box>
    </Aside>
  );
};

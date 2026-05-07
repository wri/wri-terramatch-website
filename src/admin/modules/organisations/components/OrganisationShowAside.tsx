import { Box, Button, Divider, Grid, Stack } from "@mui/material";
import { FC, useCallback } from "react";
import {
  Button as AdminButton,
  Labeled,
  Link,
  RaRecord,
  SelectField,
  TextField,
  useCreatePath,
  useRefresh,
  useShowContext
} from "react-admin";

import Aside from "@/admin/components/Aside/Aside";
import { useOrganisation } from "@/connections/Organisation";
import { getOrganisationTypeOptions } from "@/constants/options/organisations";
import { OrganisationFullDto } from "@/generated/v3/userService/userServiceSchemas";
import { useRequestSuccess } from "@/hooks/useConnectionUpdate";
import { optionToChoices } from "@/utils/options";

import modules from "../..";

export const OrganisationShowAside: FC<{ financialReportTab?: boolean }> = ({ financialReportTab = false }) => {
  const refresh = useRefresh();
  const { record } = useShowContext<OrganisationFullDto & RaRecord>();
  const hasOrganisationAttrib = !!record?.organisationUuid;
  const uuid = hasOrganisationAttrib ? record?.organisationUuid : (record?.uuid as string);
  const status = hasOrganisationAttrib ? record?.organisationStatus : record?.status;
  const createPath = useCreatePath();

  const [, { update: updateOrg, isUpdating, updateFailure }] = useOrganisation({ id: uuid });
  const approve = useCallback(() => {
    updateOrg({ status: "approved" });
  }, [updateOrg]);
  const reject = useCallback(() => {
    updateOrg({ status: "rejected" });
  }, [updateOrg]);
  useRequestSuccess(isUpdating, updateFailure, refresh);

  return (
    <Aside title={financialReportTab ? "Organisation Details" : "Organisation Review"}>
      <Grid container spacing={2} marginY={2}>
        <Grid item xs={6}>
          <Labeled>
            <TextField source={hasOrganisationAttrib ? "organisationName" : "name"} />
          </Labeled>
        </Grid>
        <Grid item xs={6}>
          <Labeled>
            <SelectField
              source={hasOrganisationAttrib ? "organisationType" : "type"}
              choices={optionToChoices(getOrganisationTypeOptions())}
              emptyText="Not Provided"
            />
          </Labeled>
        </Grid>
        <Grid item xs={6}>
          <Labeled label="Status">
            <TextField source={hasOrganisationAttrib ? "organisationStatus" : "status"} />
          </Labeled>
        </Grid>
      </Grid>
      <Divider />
      <Box pt={2}>
        {status !== "draft" && (
          <Stack direction="row" alignItems="center" gap={2} flexWrap="wrap">
            {financialReportTab ? (
              <AdminButton
                variant="outlined"
                component={Link}
                to={createPath({
                  resource: modules.organisation.ResourceName,
                  type: "show",
                  id: uuid
                })}
                fullWidth
                label="Back To Organisation"
              />
            ) : (
              <>
                <Button variant="contained" onClick={approve}>
                  {" "}
                  Approve
                </Button>
                <Button variant="outlined" onClick={reject}>
                  {" "}
                  Reject
                </Button>
              </>
            )}
          </Stack>
        )}
      </Box>
    </Aside>
  );
};

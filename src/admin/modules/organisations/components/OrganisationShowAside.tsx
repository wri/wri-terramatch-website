import { Box, Button, Divider, Grid, Stack } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
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
import { When } from "react-if";

import Aside from "@/admin/components/Aside/Aside";
import { updateOrganisation } from "@/connections/Organisation";
import { getOrganisationTypeOptions } from "@/constants/options/organisations";
import { OrganisationFullDto } from "@/generated/v3/userService/userServiceSchemas";
import { optionToChoices } from "@/utils/options";

import modules from "../..";

export const OrganisationShowAside = ({ financialReportTab }: { financialReportTab?: boolean }) => {
  const refresh = useRefresh();
  const { record } = useShowContext<OrganisationFullDto & RaRecord>();
  const hasOrganisationAttrib = !!record?.organisationUuid;
  const uuid = hasOrganisationAttrib ? record?.organisationUuid : (record?.uuid as string);
  const status = hasOrganisationAttrib ? record?.organisationStatus : record?.status;
  const createPath = useCreatePath();

  const { mutate: approve } = useMutation({
    mutationFn: async (organisationUuid: string) => {
      return updateOrganisation({ status: "approved" }, { id: organisationUuid });
    },
    onSuccess() {
      refresh();
    }
  });

  const { mutate: reject } = useMutation({
    mutationFn: async (organisationUuid: string) => {
      return updateOrganisation({ status: "rejected" }, { id: organisationUuid });
    },
    onSuccess() {
      refresh();
    }
  });

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
        <When condition={status !== "draft"}>
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
                <Button variant="contained" onClick={() => approve(uuid)}>
                  {" "}
                  Approve
                </Button>
                <Button variant="outlined" onClick={() => reject(uuid)}>
                  {" "}
                  Reject
                </Button>
              </>
            )}
          </Stack>
        </When>
      </Box>
    </Aside>
  );
};

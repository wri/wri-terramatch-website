import { Check, PriorityHigh } from "@mui/icons-material";
import { Box, Button, Card, Grid, Stack, Typography } from "@mui/material";
import { pink } from "@mui/material/colors";
import { FC, useCallback, useMemo, useState } from "react";
import {
  FunctionField,
  Labeled,
  TabbedShowLayout,
  TabProps,
  TextField,
  useShowContext,
  WrapperField
} from "react-admin";

import ChangeRow from "@/admin/components/ResourceTabs/ChangeRequestsTab/ChangeRow";
import useFormChanges from "@/admin/components/ResourceTabs/ChangeRequestsTab/useFormChanges";
import List from "@/components/extensive/List/List";
import { useApiFieldsProvider } from "@/context/wizardForm.provider";
import { useEntityForm } from "@/hooks/useFormGet";
import { Entity, EntityName, SingularEntityName } from "@/types/common";

import ChangeRequestRequestMoreInfoModal, { IStatus } from "./MoreInformationModal";

interface IProps extends Omit<TabProps, "label" | "children"> {
  label?: string;
  entity: EntityName;
  singularEntity: SingularEntityName;
}

const ChangeRequestsTab: FC<IProps> = ({ label, entity, singularEntity, ...rest }) => {
  const ctx = useShowContext();
  const [statusToChangeTo, setStatusToChangeTo] = useState<IStatus>();

  const { formData: currentValues, form, refetch } = useEntityForm(entity, ctx?.record?.uuid);

  const changeRequest = currentValues?.data?.update_request;
  const changes = changeRequest?.content;
  const current = currentValues?.data?.answers;
  const status = changeRequest?.status;

  const [providerLoaded, fieldsProvider] = useApiFieldsProvider(currentValues?.data?.form_uuid);

  const entityDef = useMemo(
    () => ({ entityName: entity, entityUUID: ctx?.record?.uuid ?? "" } as Entity),
    [ctx?.record?.uuid, entity]
  );
  const formChanges = useFormChanges(fieldsProvider, current, changes, entityDef);
  const numFieldsAffected = useMemo(
    () =>
      formChanges.reduce((sum, stepChange) => {
        return sum + stepChange.changes.filter(({ newValue }) => newValue != null).length;
      }, 0),
    [formChanges]
  );

  const handleStatusUpdate = useCallback((type: IStatus) => {
    setStatusToChangeTo(type);
  }, []);

  const icon = status === "awaiting-approval" ? <PriorityHigh sx={{ color: pink[500] }} /> : undefined;

  if (ctx.isLoading || !providerLoaded) return null;

  return (
    <>
      <TabbedShowLayout.Tab
        style={{ flexDirection: "row", minHeight: "unset" }}
        icon={icon}
        label={label ?? "Change Requests"}
        {...rest}
      >
        {changeRequest != null ? (
          <Grid container spacing={2}>
            <Grid item xs={8}>
              <List
                className="space-y-8"
                items={formChanges}
                render={stepChange => <ChangeRow key={stepChange.stepTitle} stepChange={stepChange} />}
              />
            </Grid>
            <Grid item xs={4}>
              <Card sx={{ padding: 4 }}>
                <Grid spacing={2} container>
                  <Grid item xs={12}>
                    <Typography variant="h5" component="h3" className="capitalize">
                      Change requests
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Labeled label="Organisation">
                      <TextField source="organisation.name" />
                    </Labeled>
                  </Grid>

                  <Grid xs={6} item>
                    <Labeled label="Status">
                      <FunctionField
                        render={() => {
                          switch (status) {
                            case "draft":
                              return "Draft";
                            case "awaiting-approval":
                              return "Awaiting Approval";
                            case "more-information":
                            case "needs-more-information":
                              return "More information requested";
                            case "approved":
                              return "Approved";
                            default:
                              return "-";
                          }
                        }}
                      />
                    </Labeled>
                  </Grid>

                  <Grid xs={6} item>
                    <Labeled label="Fields Affected">
                      <WrapperField>{numFieldsAffected}</WrapperField>
                    </Labeled>
                  </Grid>
                </Grid>

                <Box pt={2}>
                  <Stack direction="row" alignItems="center" gap={2} flexWrap="wrap">
                    <Button
                      variant="contained"
                      startIcon={<Check />}
                      disabled={["approved", "draft"].includes(status ?? "")}
                      onClick={() => handleStatusUpdate("approve")}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="outlined"
                      disabled={["more-information", "draft"].includes(status ?? "")}
                      onClick={() => handleStatusUpdate("moreinfo")}
                    >
                      Request More Information
                    </Button>
                  </Stack>
                </Box>
              </Card>
            </Grid>
          </Grid>
        ) : (
          <Card sx={{ padding: 4 }}>
            <Typography variant="h5" component="h3" sx={{ marginBottom: 2 }}>
              No Change request
            </Typography>
            <Typography>
              This {singularEntity.replaceAll("-", " ")} does not have any pending change requests. If a project
              developer requests a change, you will be able to view the request here.
            </Typography>
          </Card>
        )}
      </TabbedShowLayout.Tab>

      {statusToChangeTo && changeRequest && form && (
        <ChangeRequestRequestMoreInfoModal
          open
          status={statusToChangeTo}
          uuid={changeRequest?.uuid!}
          entity={entity}
          handleClose={() => {
            setStatusToChangeTo(undefined);
            refetch?.();
          }}
          fieldsProvider={fieldsProvider}
        />
      )}
    </>
  );
};

export default ChangeRequestsTab;

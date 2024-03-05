import { Check, PriorityHigh } from "@mui/icons-material";
import { Box, Button, Card, Grid, Stack, Typography } from "@mui/material";
import { pink } from "@mui/material/colors";
import { useT } from "@transifex/react";
import { FC, useMemo, useState } from "react";
import {
  FunctionField,
  Labeled,
  TabbedShowLayout,
  TabProps,
  TextField,
  useShowContext,
  WrapperField
} from "react-admin";
import { Else, If, Then, When } from "react-if";

import ChangeRow from "@/admin/components/ResourceTabs/ChangeRequestsTab/ChangeRow";
import useFormChanges from "@/admin/components/ResourceTabs/ChangeRequestsTab/useFormChanges";
import List from "@/components/extensive/List/List";
import { useGetV2FormsENTITYUUID, useGetV2UpdateRequestsENTITYUUID } from "@/generated/apiComponents";
import { getCustomFormSteps } from "@/helpers/customForms";
import { EntityName, SingularEntityName } from "@/types/common";

import ChangeRequestRequestMoreInfoModal, { IStatus } from "./MoreInformationModal";

interface IProps extends Omit<TabProps, "label" | "children"> {
  label?: string;
  entity: EntityName;
  singularEntity: SingularEntityName;
}

const ChangeRequestsTab: FC<IProps> = ({ label, entity, singularEntity, ...rest }) => {
  const ctx = useShowContext();
  const t = useT();
  const [statusToChangeTo, setStatusToChangeTo] = useState<IStatus>();

  // Change Request
  const {
    data: changeRequest,
    refetch,
    isError
  } = useGetV2UpdateRequestsENTITYUUID(
    {
      pathParams: { entity: singularEntity, uuid: ctx?.record?.uuid }
    },
    {
      enabled: !!ctx?.record?.uuid
    }
  );

  // Current values
  const { data: currentValues } = useGetV2FormsENTITYUUID(
    {
      pathParams: { entity: entity, uuid: ctx?.record?.uuid }
    },
    {
      enabled: !!ctx?.record?.uuid
    }
  );

  // @ts-ignore
  const changes = changeRequest?.data?.content;
  // @ts-ignore
  const current = currentValues?.data?.answers;
  // @ts-ignore
  const status = changeRequest?.data?.status;
  // @ts-ignore
  const form = currentValues?.data?.form;

  const formSteps = useMemo(() => (form == null ? [] : getCustomFormSteps(form, t)), [form]);
  const formChanges = useFormChanges(current, changes, formSteps ?? []);
  const numFieldsAffected = useMemo(
    () =>
      formChanges.reduce((sum, stepChange) => {
        return sum + stepChange.changes.filter(({ newValue }) => newValue != null).length;
      }, 0),
    [formChanges]
  );

  const handleStatusUpdate = (type: IStatus) => {
    setStatusToChangeTo(type);
  };

  const icon = status === "awaiting-approval" ? <PriorityHigh sx={{ color: pink[500] }} /> : undefined;

  return (
    <When condition={!ctx.isLoading}>
      <TabbedShowLayout.Tab
        style={{ flexDirection: "row", minHeight: "unset" }}
        icon={icon}
        label={label ?? "Change Requests"}
        {...rest}
      >
        {/* @ts-ignore */}
        <If condition={changeRequest?.data && !isError}>
          <Then>
            <Grid container spacing={2}>
              {formSteps && (
                <Grid item xs={8}>
                  <List
                    className="space-y-8"
                    items={formChanges}
                    render={stepChange => <ChangeRow key={stepChange.step.title} stepChange={stepChange} />}
                  />
                </Grid>
              )}
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
                            // @ts-ignore
                            switch (changeRequest?.data?.status) {
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
                        // @ts-ignore
                        disabled={["approved", "draft"].includes(changeRequest?.data?.status)}
                        onClick={() => handleStatusUpdate("approve")}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="outlined"
                        // @ts-ignore
                        disabled={["more-information", "draft"].includes(changeRequest?.data?.status)}
                        onClick={() => handleStatusUpdate("moreinfo")}
                      >
                        Request More Information
                      </Button>
                    </Stack>
                  </Box>
                </Card>
              </Grid>
            </Grid>
          </Then>
          <Else>
            <Card sx={{ padding: 4 }}>
              <Typography variant="h5" component="h3" sx={{ marginBottom: 2 }}>
                No Change request
              </Typography>
              <Typography>
                This {singularEntity.replaceAll("-", " ")} does not have any pending change requests. If a project
                developer requests a change, you will be able to view the request here.
              </Typography>
            </Card>
          </Else>
        </If>
      </TabbedShowLayout.Tab>

      {statusToChangeTo && changeRequest && form && (
        <ChangeRequestRequestMoreInfoModal
          open
          status={statusToChangeTo}
          // @ts-ignore
          uuid={changeRequest?.data.uuid}
          handleClose={() => {
            setStatusToChangeTo(undefined);
            refetch();
          }}
          form={form}
        />
      )}
    </When>
  );
};

export default ChangeRequestsTab;

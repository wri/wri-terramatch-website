import { Check } from "@mui/icons-material";
import { Box, Button, Card, Grid, Stack, Typography } from "@mui/material";
import { useT } from "@transifex/react";
import { FC, useState } from "react";
import { FunctionField, Labeled, TabbedShowLayout, TabProps, TextField, useShowContext } from "react-admin";
import { Else, If, Then, When } from "react-if";

import List from "@/components/extensive/List/List";
import { FormSummaryRowProps, useGetFormEntries } from "@/components/extensive/WizardForm/FormSummaryRow";
import { useGetV2FormsENTITYUUID, useGetV2UpdateRequestsENTITYUUID } from "@/generated/apiComponents";
import { getCustomFormSteps, normalizedFormDefaultValue } from "@/helpers/customForms";
import { EntityName, SingularEntityName } from "@/types/common";

import ChangeRequestRequestMoreInfoModal, { IStatus } from "./MoreInformationModal";

interface IProps extends Omit<TabProps, "label" | "children"> {
  label?: string;
  entity: EntityName;
  singularEntity: SingularEntityName;
}

interface IChangeRowProps extends Omit<FormSummaryRowProps, "values"> {
  currentValues: any;
  changedValues: any;
}

const ChangeRow = ({ index, ...props }: IChangeRowProps) => {
  const currentEntries = useGetFormEntries({ values: props.currentValues, nullText: "-", ...props });
  const changedEntries = useGetFormEntries({ values: props.changedValues, nullText: "-", ...props });

  return (
    <Card sx={{ padding: 4 }}>
      <Typography variant="h5" component="h3" className="capitalize">
        {props.step.title}
      </Typography>
      <List
        className="my-4 flex flex-col gap-4"
        items={changedEntries}
        render={entry => {
          const currentEntry = currentEntries.find(e => e.title === entry.title);
          const currentValue = currentEntry?.value || "-";
          const newValue = entry.value || "-";

          return (
            <div>
              <Typography variant="h6" component="h4" className="capitalize">
                {entry?.title}
              </Typography>
              <If condition={typeof entry?.value === "string" || typeof entry?.value === "number"}>
                <Then>
                  <p className="mb-2">
                    New Value: <Typography variant="body2" dangerouslySetInnerHTML={{ __html: newValue }} />
                  </p>
                  <p className="mb-2">
                    Old Value: <Typography variant="body2" dangerouslySetInnerHTML={{ __html: currentValue }} />
                  </p>
                </Then>
                <Else>
                  <p className="mb-2">
                    New Value: {newValue} <br /> Old Value: {currentValue}
                  </p>
                </Else>
              </If>
            </div>
          );
        }}
      />
    </Card>
  );
};

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
  const form = currentValues?.data?.form;

  const formSteps = form && getCustomFormSteps(form, t);
  const currentValueData = normalizedFormDefaultValue(current, formSteps);
  const changedValueData = normalizedFormDefaultValue(changes, formSteps);

  const handleStatusUpdate = (type: IStatus) => {
    setStatusToChangeTo(type);
  };

  return (
    <When condition={!ctx.isLoading}>
      <TabbedShowLayout.Tab label={label ?? "Change Requests"} {...rest}>
        {/* @ts-ignore */}
        <If condition={changeRequest?.data && !isError}>
          <Then>
            <Grid container spacing={2}>
              {formSteps && (
                <Grid item xs={8}>
                  <List
                    className="space-y-8"
                    items={formSteps || []}
                    render={(step, index) => (
                      <ChangeRow
                        index={index}
                        // @ts-ignore
                        step={step}
                        currentValues={currentValueData}
                        changedValues={changedValueData}
                        steps={formSteps}
                      />
                    )}
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
                        <FunctionField render={() => Object.keys(changes || {}).length} />
                      </Labeled>
                    </Grid>
                  </Grid>

                  <Box pt={2}>
                    <Stack direction="row" alignItems="center" gap={2} flexWrap="wrap">
                      <Button
                        variant="contained"
                        startIcon={<Check />}
                        // @ts-ignore
                        disabled={changeRequest?.data?.status === "approved"}
                        onClick={() => handleStatusUpdate("approve")}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="outlined"
                        // @ts-ignore
                        disabled={changeRequest?.data?.status === "more-information"}
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

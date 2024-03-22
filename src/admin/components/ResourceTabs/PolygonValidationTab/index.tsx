import { Card, Grid, Stack } from "@mui/material";
import { useT } from "@transifex/react";
import { FC } from "react";
import { TabbedShowLayout, TabProps, useShowContext } from "react-admin";
import { When } from "react-if";

import { MonitoringPartnersTable } from "@/admin/components/ResourceTabs/InformationTab/components/ProjectInformationAside/MonitoringPartners";
import { setDefaultConditionalFieldsAnswers } from "@/admin/utils/forms";
import List from "@/components/extensive/List/List";
import { GetV2FormsENTITYUUIDResponse, useGetV2FormsENTITYUUID } from "@/generated/apiComponents";
import { getCustomFormSteps, normalizedFormDefaultValue } from "@/helpers/customForms";
import { EntityName } from "@/types/common";

import InformationTabRow from "../InformationTab/components/InformationTabRow";
import PolygonValidationAside from "./PolygonValidationAside";

interface IProps extends Omit<TabProps, "label" | "children"> {
  type: EntityName;
  label: string;
}

const InformationAside: FC<{ type: EntityName }> = ({ type }) => {
  switch (type) {
    case "sites":
      return <PolygonValidationAside />;
    default:
      return null;
  }
};

const PolygonValidationTab: FC<IProps> = props => {
  const { isLoading: ctxLoading, record } = useShowContext();

  const { data: response, isLoading: queryLoading } = useGetV2FormsENTITYUUID<{ data: GetV2FormsENTITYUUIDResponse }>({
    pathParams: {
      uuid: record.uuid,
      entity: props.type
    }
  });

  const t = useT();

  const isLoading = ctxLoading || queryLoading;

  if (isLoading) return null;

  const formSteps = getCustomFormSteps(response?.data.form!, t);

  const values = record.migrated
    ? setDefaultConditionalFieldsAnswers(normalizedFormDefaultValue(response?.data.answers!, formSteps), formSteps)
    : normalizedFormDefaultValue(response?.data.answers!, formSteps);

  return (
    <When condition={!isLoading}>
      <TabbedShowLayout.Tab {...props}>
        <Grid spacing={2} container>
          <Grid xs={8} item>
            <Stack gap={4}>
              <Card sx={{ padding: 4 }} className="!shadow-none">
                <List
                  className={`${props.type == "sites" && "test"} space-y-12`}
                  items={formSteps}
                  render={(step, index) => (
                    <InformationTabRow index={index} step={step} values={values} steps={formSteps} type={props.type} />
                  )}
                />
              </Card>
              <When condition={props.type === "projects"}>
                <MonitoringPartnersTable projectUUID={record?.uuid} />
              </When>
            </Stack>
          </Grid>

          <Grid xs={4} item>
            <InformationAside type={props.type} />
          </Grid>
        </Grid>
      </TabbedShowLayout.Tab>
    </When>
  );
};

export default PolygonValidationTab;

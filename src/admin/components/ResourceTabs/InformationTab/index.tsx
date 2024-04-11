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

import TreeSpeciesTable from "../../Tables/TreeSpeciesTable";
import InformationTabRow from "./components/InformationTabRow";
import NurseryInformationAside from "./components/NurseryInformationAside";
import ProjectInformationAside from "./components/ProjectInformationAside";
import ReportInformationAside from "./components/ReportInformationAside";
import SiteInformationAside from "./components/SiteInformationAside";

interface IProps extends Omit<TabProps, "label" | "children"> {
  type: EntityName;
}

const InformationAside: FC<{ type: EntityName }> = ({ type }) => {
  switch (type) {
    case "projects":
      return <ProjectInformationAside />;
    case "sites":
      return <SiteInformationAside />;
    case "nurseries":
      return <NurseryInformationAside />;
    case "project-reports":
      return <ReportInformationAside type={type} />;
    case "site-reports":
      return <ReportInformationAside type={type} parent={{ label: "Site", source: "site.name" }} />;
    case "nursery-reports":
      return <ReportInformationAside type={type} parent={{ label: "Nursery", source: "nursery.name" }} />;
    default:
      return null;
  }
};

const InformationTab: FC<IProps> = props => {
  const { isLoading: ctxLoading, record, resource } = useShowContext();

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

  const tabTitle = (() => {
    switch (props.type) {
      case "projects":
        return "Project Information";
      case "sites":
        return "Site Information";
      case "nurseries":
        return "Nursery Information";
      case "project-reports":
        return "Reported Data";
      case "site-reports":
        return "Reported Data";
      case "nursery-reports":
        return "Reported Data";
      default:
        return "Information";
    }
  })();

  return (
    <When condition={!isLoading}>
      <TabbedShowLayout.Tab label={tabTitle} {...props}>
        <Grid spacing={2} container>
          <Grid xs={8} item>
            <Stack gap={4}>
              <Card sx={{ padding: 4 }} className="!shadow-none">
                <List
                  className={`${props.type == "sites" && "map-span-3"} space-y-12`}
                  items={formSteps}
                  render={(step, index) => (
                    <InformationTabRow index={index} step={step} values={values} steps={formSteps} type={props.type} />
                  )}
                />
              </Card>
              <When condition={record}>
                <TreeSpeciesTable uuid={record.uuid} entity={resource} />
              </When>

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

export default InformationTab;

import { Card, Grid, Stack, Typography } from "@mui/material";
import { useT } from "@transifex/react";
import classNames from "classnames";
import { FC } from "react";
import { TabbedShowLayout, TabProps, useShowContext } from "react-admin";
import { Else, If, Then, When } from "react-if";

import { MonitoringPartnersTable } from "@/admin/components/ResourceTabs/InformationTab/components/ProjectInformationAside/MonitoringPartners";
import { ProjectManagersTable } from "@/admin/components/ResourceTabs/InformationTab/components/ProjectInformationAside/ProjectManagersTable";
import SeedingsTable from "@/admin/components/Tables/SeedingsTable";
import { setDefaultConditionalFieldsAnswers } from "@/admin/utils/forms";
import List from "@/components/extensive/List/List";
import { ContextCondition } from "@/context/ContextCondition";
import { Framework, useFrameworkContext } from "@/context/framework.provider";
import {
  GetV2FormsENTITYUUIDResponse,
  useGetV2FormsENTITYUUID,
  useGetV2SeedingsENTITYUUID
} from "@/generated/apiComponents";
import { getCustomFormSteps, normalizedFormDefaultValue } from "@/helpers/customForms";
import { pluralEntityNameToSingular } from "@/helpers/entity";
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

  const { data: seedlings } = useGetV2SeedingsENTITYUUID({
    pathParams: {
      uuid: record?.uuid,
      entity: resource.replace("Report", "-report")
    }
  });

  const totalSeedlings = seedlings?.data?.reduce((acc, curr) => acc + (curr?.amount ?? 0), 0);
  const t = useT();

  const isLoading = ctxLoading || queryLoading;

  if (isLoading) return null;

  const { framework } = useFrameworkContext();
  const formSteps = getCustomFormSteps(response?.data.form!, t, undefined, framework);

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
            <If condition={record.nothing_to_report}>
              <Then>
                <Card sx={{ padding: 4 }}>
                  <Typography variant="h5" component="h3" sx={{ marginBottom: 2 }}>
                    Nothing to Report
                  </Typography>
                  <Typography>
                    The project has indicated that there is no activity to report on for this{" "}
                    {pluralEntityNameToSingular(props.type).split("-")[0]} during this reporting period.
                  </Typography>
                </Card>
              </Then>
              <Else>
                <Stack gap={4}>
                  <Card sx={{ padding: 4 }} className="!shadow-none">
                    <List
                      className={classNames("space-y-12", {
                        "map-span-3": props.type === "sites"
                      })}
                      items={formSteps}
                      render={(step, index) => (
                        <InformationTabRow
                          index={index}
                          step={step}
                          values={values}
                          steps={formSteps}
                          type={props.type}
                        />
                      )}
                    />
                  </Card>
                  <When condition={record}>
                    <When condition={props.type === "sites" || props.type === "site-reports"}>
                      <ContextCondition frameworksShow={[Framework.PPC]}>
                        <Card sx={{ padding: 3 }}>
                          <Typography variant="h6" component="h3" className="capitalize">
                            Total Trees Planted
                          </Typography>
                          {record?.total_trees_planted_count}
                        </Card>
                      </ContextCondition>
                    </When>
                    <TreeSpeciesTable uuid={record.uuid} entity={resource} />
                  </When>

                  <When condition={props.type === "sites" || props.type === "site-reports"}>
                    <ContextCondition frameworksShow={[Framework.PPC]}>
                      <Card sx={{ padding: 3 }}>
                        <Typography variant="h6" component="h3" className="capitalize">
                          Total Seeds Planted
                        </Typography>
                        {totalSeedlings}
                      </Card>
                    </ContextCondition>
                    <SeedingsTable uuid={record.uuid} entity={resource} />
                  </When>

                  <When condition={props.type === "projects"}>
                    <MonitoringPartnersTable project={record} />
                    <ProjectManagersTable project={record} />
                  </When>
                </Stack>
              </Else>
            </If>
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

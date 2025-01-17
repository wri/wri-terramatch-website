import { Card, Grid, Stack, Typography } from "@mui/material";
import { useT } from "@transifex/react";
import classNames from "classnames";
import { FC } from "react";
import { TabbedShowLayout, TabProps, useShowContext } from "react-admin";
import { Else, If, Then, When } from "react-if";

import { MonitoringPartnersTable } from "@/admin/components/ResourceTabs/InformationTab/components/ProjectInformationAside/MonitoringPartners";
import { ProjectManagersTable } from "@/admin/components/ResourceTabs/InformationTab/components/ProjectInformationAside/ProjectManagersTable";
import { setDefaultConditionalFieldsAnswers } from "@/admin/utils/forms";
import Text from "@/components/elements/Text/Text";
import List from "@/components/extensive/List/List";
import TreeSpeciesTablePD from "@/components/extensive/Tables/TreeSpeciesTablePD";
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
  const t = useT();
  const { framework } = useFrameworkContext();
  const modelName = resource?.replace("Report", "-report");
  const modelUUID = record?.uuid;

  const { data: response, isLoading: queryLoading } = useGetV2FormsENTITYUUID<{ data: GetV2FormsENTITYUUIDResponse }>({
    pathParams: {
      uuid: record?.uuid,
      entity: props.type
    }
  });

  const { data: seedings } = useGetV2SeedingsENTITYUUID({
    pathParams: {
      uuid: record?.uuid,
      entity: resource?.replace("Report", "-report")
    }
  });

  const isLoading = ctxLoading || queryLoading;

  if (isLoading || !record) return null;

  const totalSeedlings = seedings?.data?.reduce((acc, curr) => acc + (curr?.amount ?? 0), 0);
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
      case "site-reports":
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
                    <div className="pl-8">
                      <When
                        condition={
                          props.type === "projects" ||
                          props.type === "sites" ||
                          props.type === "site-reports" ||
                          props.type === "project-reports"
                        }
                      >
                        <div className="flex flex-col gap-11">
                          <ContextCondition frameworksHide={[Framework.PPC]}>
                            <div className="flex flex-col gap-4">
                              <Text variant="text-16-bold" className="capitalize">
                                Non-Trees:
                              </Text>
                              <TreeSpeciesTablePD
                                modelUUID={modelUUID}
                                modelName={modelName}
                                collection="non-tree"
                                // modelName={
                                //   (framework.includes(Framework.TF) || framework.includes(Framework.ENTERPRISES)) &&
                                //   (props.type === "projects" || props.type === "sites")
                                //     ? "noGoal"
                                //     : "treeCount/Goal"
                                // }
                                // data={
                                //   (framework.includes(Framework.TF) || framework.includes(Framework.ENTERPRISES)) &&
                                //   (props.type === "projects" || props.type === "sites")
                                //     ? dataTreeCount
                                //     : dataTreeCountGoal
                                // }
                                secondColumnWidth="45%"
                              />
                            </div>
                          </ContextCondition>
                          <When condition={props.type === "projects" || props.type === "project-reports"}>
                            <ContextCondition frameworksShow={[Framework.PPC]}>
                              <div className="flex flex-col gap-4">
                                <Text variant="text-16-bold" className="capitalize">
                                  Nursery-Saplings:
                                </Text>
                                <TreeSpeciesTablePD
                                  modelUUID={modelUUID}
                                  modelName={modelName}
                                  collection="nursery-seedling"
                                  // modelName={props.type === "projects" ? "noGoal" : "treeCount/Goal"}
                                  // data={props.type === "projects" ? dataTreeCount : dataTreeCountGoal}
                                  secondColumnWidth="45%"
                                />
                              </div>
                            </ContextCondition>
                          </When>
                          <ContextCondition frameworksShow={[Framework.PPC]}>
                            <div className="flex flex-col gap-4">
                              <div className="flex items-center gap-1 py-8">
                                <Text variant="text-16-bold" className="capitalize">
                                  Seedings:
                                </Text>
                                <Text variant="text-18-semibold" className="capitalize text-primary" as="span">
                                  {totalSeedlings ?? 0}
                                </Text>
                              </div>
                              <TreeSpeciesTablePD
                                modelUUID={modelUUID}
                                modelName={modelName}
                                collection="seeding"
                                // modelName={props.type === "projects" ? "noGoal" : "treeCount/Goal"}
                                // data={props.type === "projects" ? dataTreeCount : dataTreeCountGoal}
                                secondColumnWidth="45%"
                              />
                            </div>
                          </ContextCondition>
                          <div className="flex flex-col gap-4">
                            <Text variant="text-16-bold" className="capitalize">
                              Trees Planted:
                            </Text>
                            <TreeSpeciesTablePD
                              modelUUID={modelUUID}
                              modelName={modelName}
                              collection="tree-planted"
                              // modelName={
                              //   ((framework.includes(Framework.TF) || framework.includes(Framework.ENTERPRISES)) &&
                              //     props.type === "sites") ||
                              //   (framework.includes(Framework.PPC) && props.type === "projects")
                              //     ? "noGoal"
                              //     : "treeCount/Goal"
                              // }
                              // data={
                              //   ((framework.includes(Framework.TF) || framework.includes(Framework.ENTERPRISES)) &&
                              //     props.type === "sites") ||
                              //   (framework.includes(Framework.PPC) && props.type === "projects")
                              //     ? dataTreeCount
                              //     : dataTreeCountGoal
                              // }
                              secondColumnWidth="45%"
                            />
                          </div>
                          <When condition={props.type === "site-reports" || props.type === "project-reports"}>
                            <ContextCondition frameworksShow={[Framework.TF, Framework.ENTERPRISES]}>
                              <div className="flex flex-col gap-4">
                                <Text variant="text-16-bold" className="capitalize">
                                  Replanting:
                                </Text>
                                <TreeSpeciesTablePD
                                  modelUUID={modelUUID}
                                  modelName={modelName}
                                  collection="replanting"
                                  // modelName="treeCount/Goal"
                                  // data={dataTreeCountGoal}
                                  secondColumnWidth="45%"
                                />
                              </div>
                            </ContextCondition>
                          </When>
                        </div>
                      </When>
                    </div>
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

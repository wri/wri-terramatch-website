import { Card, Grid, Stack, Typography } from "@mui/material";
import { useT } from "@transifex/react";
import classNames from "classnames";
import { camelCase } from "lodash";
import { FC } from "react";
import { TabbedShowLayout, TabProps, useShowContext } from "react-admin";
import { Else, If, Then, When } from "react-if";

import { MonitoringPartnersTable } from "@/admin/components/ResourceTabs/InformationTab/components/ProjectInformationAside/MonitoringPartners";
import { ProjectManagersTable } from "@/admin/components/ResourceTabs/InformationTab/components/ProjectInformationAside/ProjectManagersTable";
import { setDefaultConditionalFieldsAnswers } from "@/admin/utils/forms";
import Accordion from "@/components/elements/Accordion/Accordion";
import Text from "@/components/elements/Text/Text";
import List from "@/components/extensive/List/List";
import TreeSpeciesTable from "@/components/extensive/Tables/TreeSpeciesTable";
import { usePlantTotalCount } from "@/components/extensive/Tables/TreeSpeciesTable/hooks";
import { FieldType } from "@/components/extensive/WizardForm/types";
import { SupportedEntity } from "@/connections/EntityAssociation";
import { ContextCondition } from "@/context/ContextCondition";
import { ALL_TF, Framework, useFrameworkContext } from "@/context/framework.provider";
import { getCustomFormSteps, normalizedFormDefaultValue } from "@/helpers/customForms";
import { pluralEntityNameToSingular } from "@/helpers/entity";
import { useEntityForm } from "@/hooks/useFormGet";
import { EntityName } from "@/types/common";
import { formatDescriptionData, formatDocumentData } from "@/utils/financialReport";

import FinancialDescriptionsSection from "../HistoryTab/components/FinancialDescriptionsSection";
import FinancialDocumentsSection from "../HistoryTab/components/FinancialDocumentsSection";
import FinancialMetrics from "../HistoryTab/components/FinancialMetrics";
import FundingSourcesSection from "../HistoryTab/components/FundingSourcesSection";
import InformationTabRow from "./components/InformationTabRow";
import NurseryInformationAside from "./components/NurseryInformationAside";
import ProjectInformationAside from "./components/ProjectInformationAside";
import ReportInformationAside from "./components/ReportInformationAside";
import SiteInformationAside from "./components/SiteInformationAside";
import SRPReportAside from "./components/SRPReportAside";

interface IProps extends Omit<TabProps, "label" | "children"> {
  type: Exclude<EntityName, "project-pitches">;
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
      return <ReportInformationAside type={type} parent={{ label: "Site", source: "siteName" }} />;
    case "nursery-reports":
      return <ReportInformationAside type={type} parent={{ label: "Nursery", source: "nurseryName" }} />;
    case "financial-reports":
      return <ReportInformationAside type={type} parent={{ label: "Financial Report", source: "organisationName" }} />;
    case "disturbance-reports":
      return (
        <ReportInformationAside type={type} parent={{ label: "Disturbance Report", source: "organisationName" }} />
      );
    case "srp-reports":
      return <SRPReportAside />;
    default:
      return null;
  }
};
const InformationTab: FC<IProps> = props => {
  const { isLoading: ctxLoading, record } = useShowContext();
  const t = useT();
  const { framework } = useFrameworkContext();
  const entity = camelCase(props.type) as SupportedEntity;
  const entityUuid = record?.uuid;

  const totalCountNonTree = usePlantTotalCount({ entity, entityUuid, collection: "non-tree" });
  const totalCountNurserySeedling = usePlantTotalCount({ entity, entityUuid, collection: "nursery-seedling" });
  const totalCountSeeds = usePlantTotalCount({ entity, entityUuid, collection: "seeds" });
  const totalCountTreePlanted = usePlantTotalCount({ entity, entityUuid, collection: "tree-planted" });
  const totalCountReplanting = usePlantTotalCount({ entity, entityUuid, collection: "replanting" });

  const { formData: response, isLoading: queryLoading } = useEntityForm(props.type, record?.uuid);
  const isLoading = ctxLoading || queryLoading;

  if (isLoading || !record) return null;

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
      case "financial-reports":
        return "Financial History";
      case "disturbance-reports":
        return "Disturbance Report";
      case "srp-reports":
        return "SRP Report";
      default:
        return "Information";
    }
  })();

  return (
    <When condition={!isLoading}>
      <TabbedShowLayout.Tab label={tabTitle} {...props}>
        <Grid spacing={2} container>
          <Grid xs={8} item>
            <If condition={record.nothingToReport}>
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
                <If condition={props.type === "financial-reports"}>
                  <Then>
                    <div className="flex flex-col gap-8 p-2">
                      {formSteps.map(step =>
                        step?.fields?.map(field =>
                          field.type === FieldType.FinancialTableInput ? (
                            <>
                              <FinancialMetrics data={values[field.name]} years={field?.fieldProps?.years} />
                              <Accordion
                                title="Financial Documents per Year"
                                variant="drawer"
                                className="rounded-lg bg-white px-6 py-4 shadow-all"
                              >
                                <FinancialDocumentsSection files={formatDocumentData(values[field.name])} />
                              </Accordion>
                              <Accordion
                                title="Descriptions of Financials per Year"
                                variant="drawer"
                                className="rounded-lg bg-white px-6 py-4 shadow-all"
                              >
                                <FinancialDescriptionsSection items={formatDescriptionData(values[field.name])} />
                              </Accordion>
                            </>
                          ) : field.type === FieldType.FundingTypeDataTable ? (
                            <Accordion
                              title="Major Funding Sources by Year"
                              variant="drawer"
                              className="rounded-lg bg-white px-6 py-4 shadow-all"
                            >
                              <FundingSourcesSection data={values[field.name]} currency={record.currency} />
                            </Accordion>
                          ) : (
                            <></>
                          )
                        )
                      )}
                    </div>
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
                              props.type === "project-reports" ||
                              props.type === "nursery-reports"
                            }
                          >
                            <div className="flex flex-col gap-10">
                              <ContextCondition frameworksHide={[Framework.PPC]}>
                                <When condition={props.type !== "nursery-reports"}>
                                  <div className="flex flex-col gap-1">
                                    <div className="flex items-center gap-1 py-1">
                                      <Text variant="text-16-bold" className="capitalize">
                                        Non-Trees Planted:
                                      </Text>
                                      <Text variant="text-18-semibold" className="capitalize text-primary" as="span">
                                        {totalCountNonTree.toLocaleString() ?? 0}
                                      </Text>
                                    </div>
                                    <TreeSpeciesTable
                                      {...{ entity, entityUuid }}
                                      collection="non-tree"
                                      secondColumnWidth="45%"
                                    />
                                  </div>
                                </When>
                              </ContextCondition>
                              <When
                                condition={
                                  props.type === "projects" ||
                                  props.type === "project-reports" ||
                                  props.type === "nursery-reports"
                                }
                              >
                                <ContextCondition
                                  frameworksShow={[
                                    Framework.PPC,
                                    Framework.TF,
                                    Framework.TF_LANDSCAPES,
                                    Framework.ENTERPRISES
                                  ]}
                                >
                                  <When
                                    condition={
                                      (props.type != "nursery-reports" && framework == Framework.PPC) ||
                                      (props.type == "nursery-reports" &&
                                        [Framework.TF, Framework.TF_LANDSCAPES, Framework.ENTERPRISES].includes(
                                          framework
                                        ))
                                    }
                                  >
                                    <div className="flex flex-col gap-1">
                                      <div className="flex items-center gap-1 py-1">
                                        <Text variant="text-16-bold" className="capitalize">
                                          Saplings Grown in Nurseries:
                                        </Text>
                                        <Text variant="text-18-semibold" className="capitalize text-primary" as="span">
                                          {totalCountNurserySeedling.toLocaleString() ?? 0}
                                        </Text>
                                      </div>
                                      <TreeSpeciesTable
                                        {...{ entity, entityUuid }}
                                        collection="nursery-seedling"
                                        secondColumnWidth="45%"
                                      />
                                    </div>
                                  </When>
                                </ContextCondition>
                              </When>
                              <ContextCondition frameworksShow={[Framework.PPC]}>
                                <When condition={props.type !== "nursery-reports"}>
                                  <div className="flex flex-col gap-1">
                                    <div className="flex items-center gap-1 py-1">
                                      <Text variant="text-16-bold" className="capitalize">
                                        Seeds Planted:
                                      </Text>
                                      <Text variant="text-18-semibold" className="capitalize text-primary" as="span">
                                        {totalCountSeeds.toLocaleString()}
                                      </Text>
                                    </div>
                                    <TreeSpeciesTable
                                      {...{ entity, entityUuid }}
                                      collection="seeds"
                                      secondColumnWidth="45%"
                                    />
                                  </div>
                                </When>
                              </ContextCondition>
                              <When condition={props.type !== "nursery-reports"}>
                                <div className="flex flex-col gap-1">
                                  <div className="flex items-center gap-1 py-1">
                                    <Text variant="text-16-bold" className="capitalize">
                                      Trees Planted:
                                    </Text>
                                    <Text variant="text-18-semibold" className="capitalize text-primary" as="span">
                                      {totalCountTreePlanted.toLocaleString() ?? 0}
                                    </Text>
                                  </div>
                                  <TreeSpeciesTable
                                    {...{ entity, entityUuid }}
                                    collection="tree-planted"
                                    secondColumnWidth="45%"
                                  />
                                </div>
                              </When>
                              <When condition={props.type === "site-reports" || props.type === "project-reports"}>
                                <ContextCondition frameworksShow={ALL_TF}>
                                  <div className="flex flex-col gap-1">
                                    <div className="flex items-center gap-1 py-1">
                                      <Text variant="text-16-bold" className="capitalize">
                                        Replanting:
                                      </Text>
                                      <Text variant="text-18-semibold" className="capitalize text-primary" as="span">
                                        {totalCountReplanting?.toLocaleString() ?? 0}
                                      </Text>
                                    </div>
                                    <TreeSpeciesTable
                                      {...{ entity, entityUuid }}
                                      collection="replanting"
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

import { useT } from "@transifex/react";
import Link from "next/link";

import Button from "@/components/elements/Button/Button";
import UserProfileCard from "@/components/elements/Cards/UserProfileCard/UserProfileCard";
import ButtonField from "@/components/elements/Field/ButtonField";
import LongTextField from "@/components/elements/Field/LongTextField";
import SelectImageListField from "@/components/elements/Field/SelectImageListField";
import TextField from "@/components/elements/Field/TextField";
import List from "@/components/extensive/List/List";
import { ModalId } from "@/components/extensive/Modal/ModalConst";
import PageBody from "@/components/extensive/PageElements/Body/PageBody";
import PageCard from "@/components/extensive/PageElements/Card/PageCard";
import PageColumn from "@/components/extensive/PageElements/Column/PageColumn";
import PageRow from "@/components/extensive/PageElements/Row/PageRow";
import { getCountriesOptions } from "@/constants/options/countries";
import { getLandTenureOptions } from "@/constants/options/landTenure";
import { getRestorationStrategyOptions } from "@/constants/options/restorationStrategy";
import { ContextCondition } from "@/context/ContextCondition";
import { ALL_TF, Framework } from "@/context/framework.provider";
import { useModalContext } from "@/context/modal.provider";
import { GetV2ProjectsUUIDPartnersResponse, useGetV2ProjectsUUIDPartners } from "@/generated/apiComponents";
import { ProjectFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { useDate } from "@/hooks/useDate";
import { useGetOptions } from "@/hooks/useGetOptions";
import InviteMonitoringPartnerModal from "@/pages/project/[uuid]/components/InviteMonitoringPartnerModal";
import { formatOptionsList } from "@/utils/options";

interface ProjectDetailsTabProps {
  project: ProjectFullDto;
}

const ProjectDetailTab = ({ project }: ProjectDetailsTabProps) => {
  const t = useT();
  const { format } = useDate();
  const { openModal } = useModalContext();

  const restorationOptions = getRestorationStrategyOptions(t);

  const filterRestorationStrategyOptions = restorationOptions
    .filter(option => project.restorationStrategy?.includes(option.value as string))
    .map(option => option.value.toString());

  const landUseTypesOptions = useGetOptions(project.landUseTypes);
  const restorationStrategyOptions = useGetOptions(filterRestorationStrategyOptions);
  const detailedInterventionTypeOptions = useGetOptions(project.detailedInterventionTypes);

  const { data: partners, refetch } = useGetV2ProjectsUUIDPartners<{ data: GetV2ProjectsUUIDPartnersResponse }>({
    pathParams: { uuid: project.uuid }
  });

  const handleInvite = () => {
    openModal(
      ModalId.INVITE_MONITORING_PSRTNER_MODAL,
      <InviteMonitoringPartnerModal projectUUID={project.uuid} onSuccess={refetch} />
    );
  };

  return (
    <PageBody>
      <PageRow>
        <PageColumn>
          <PageCard title={t("Project Information")}>
            <LongTextField title={t("Description of Timeline")}>{project.descriptionOfProjectTimeline}</LongTextField>
            <LongTextField title={t("History of Project Area")}>{project.history}</LongTextField>
            <SelectImageListField
              title={t("Target Land Use Types")}
              options={landUseTypesOptions}
              selectedValues={project.landUseTypes ?? []}
            />
            <SelectImageListField
              title={t("Restoration Strategies")}
              options={restorationStrategyOptions}
              selectedValues={project.restorationStrategy ?? []}
            />
            <LongTextField frameworksShow={[Framework.HBF]} title={t("Detailed Intervention Types")}>
              {detailedInterventionTypeOptions.map(({ title }) => title).join(", ")}
            </LongTextField>
            <LongTextField title={t("Planting Start Date")}>{format(project.plantingStartDate)}</LongTextField>
            <LongTextField frameworksHide={[Framework.PPC]} title={t("Planting End Date")}>
              {format(project.plantingEndDate)}
            </LongTextField>
          </PageCard>

          <PageCard frameworksShow={ALL_TF.concat([Framework.HBF])} title={t("Project Objectives")}>
            <LongTextField title={t("Objectives")}>{project.objectives}</LongTextField>
            <LongTextField title={t("Environmental Goals")}>{project.environmentalGoals}</LongTextField>
            <LongTextField title={t("Socioeconomic Goals")}>{project.socioeconomicGoals}</LongTextField>
            <LongTextField frameworksHide={[Framework.HBF]} title={t("Community Engagement Strategy")}>
              {project.landholderCommEngage}
            </LongTextField>
            <SelectImageListField
              title={t("Land Tenure")}
              options={getLandTenureOptions(t)}
              selectedValues={project.landTenureProjectArea ?? []}
            />
            <LongTextField frameworksHide={[Framework.HBF]} title={t("Project Partners")}>
              {project.projPartnerInfo}
            </LongTextField>
            <ContextCondition frameworksHide={ALL_TF}>
              <LongTextField title={t("Biodiversity Impact")}>{project.projImpactBiodiv}</LongTextField>
              <LongTextField title={t("Food Security Impact")}>{project.projImpactFoodsec}</LongTextField>
            </ContextCondition>
            <LongTextField title={t("Government Partners")}>{project.proposedGovPartners}</LongTextField>
            <LongTextField title={t("SDGs Impacted")}>{project.sdgsImpacted}</LongTextField>
            <LongTextField title={t("Seedlings Source")}>{project.seedlingsSource}</LongTextField>
            <LongTextField title={t("Siting Strategy")}>{project.sitingStrategy}</LongTextField>
            <LongTextField title={t("Siting Strategy Description")}>{project.sitingStrategyDescription}</LongTextField>
          </PageCard>
        </PageColumn>

        <PageColumn>
          <PageCard title={t("Project Details")}>
            <TextField label={t("Project Name")} value={project.name ?? ""} />
            <TextField frameworksShow={[Framework.PPC]} label={t("Continent")} value={project.continent ?? ""} />
            <TextField label={t("Country")} value={formatOptionsList(getCountriesOptions(t), project.country ?? [])} />
            <TextField frameworksShow={[Framework.HBF]} label={t("State")} value={(project.states ?? []).join(", ")} />
            <TextField
              frameworksHide={[Framework.PPC]}
              label={t("District")}
              value={project.projectCountyDistrict ?? ""}
            />
          </PageCard>
          <ContextCondition frameworksShow={ALL_TF.concat([Framework.HBF])}>
            <PageCard title={t("Project Budget")}>
              <TextField label={t("Project Budget")} value={String(project.budget ?? "")} />
              <br />
              <ButtonField
                label={t("Detailed Project Budget")}
                buttonProps={{
                  as: Link,
                  children: t("Download"),
                  // TODO: files in the v3 response.
                  // href: project?.detailed_project_budget?.url || "",
                  download: true
                }}
              />
            </PageCard>
          </ContextCondition>
          <PageCard title={t("Files")}>
            {/* TODO: files in v3 response */}
            {/*<If*/}
            {/*  condition={*/}
            {/*    !project.file.length || !project.other_additional_documents.length || !project?.proof_of_land_tenure_mou*/}
            {/*  }*/}
            {/*>*/}
            {/*  <Then>*/}
            {/*    <h3>{t("Files not found")}</h3>*/}
            {/*  </Then>*/}
            {/*  <Else>*/}
            {/*    <Then>*/}
            {/*      <ContextCondition frameworksShow={[Framework.PPC]}>*/}
            {/*        {project.file?.map((document: any, index: any) => (*/}
            {/*          <ButtonField*/}
            {/*            key={index}*/}
            {/*            label={t("Files")}*/}
            {/*            subtitle={document?.file_name}*/}
            {/*            subtitleClassName="break-words whitespace-normal max-w-[450px]"*/}
            {/*            buttonProps={{*/}
            {/*              as: Link,*/}
            {/*              children: t("Download"),*/}
            {/*              href: document?.url || "",*/}
            {/*              download: true*/}
            {/*            }}*/}
            {/*            style={{ marginBottom: "10px" }}*/}
            {/*          />*/}
            {/*        ))}*/}
            {/*        {project.other_additional_documents?.map((document: any, index: any) => (*/}
            {/*          <ButtonField*/}
            {/*            key={index}*/}
            {/*            label={t("Other Documents")}*/}
            {/*            subtitle={document?.file_name}*/}
            {/*            subtitleClassName="break-words whitespace-normal max-w-[450px]"*/}
            {/*            buttonProps={{*/}
            {/*              as: Link,*/}
            {/*              children: t("Download"),*/}
            {/*              href: document?.url || "",*/}
            {/*              download: true*/}
            {/*            }}*/}
            {/*            style={{ marginBottom: "10px" }}*/}
            {/*          />*/}
            {/*        ))}*/}
            {/*      </ContextCondition>*/}
            {/*      <ContextCondition frameworksShow={[Framework.TF_LANDSCAPES]}>*/}
            {/*        {project?.proof_of_land_tenure_mou?.map((document: any, index: any) => (*/}
            {/*          <ButtonField*/}
            {/*            key={index}*/}
            {/*            label={t("Land Tenure MOU")}*/}
            {/*            subtitle={document?.file_name}*/}
            {/*            subtitleClassName="break-words whitespace-normal max-w-[450px]"*/}
            {/*            buttonProps={{*/}
            {/*              as: Link,*/}
            {/*              children: t("Download"),*/}
            {/*              href: document?.url || "",*/}
            {/*              download: true*/}
            {/*            }}*/}
            {/*          />*/}
            {/*        ))}*/}
            {/*      </ContextCondition>*/}
            {/*    </Then>*/}
            {/*  </Else>*/}
            {/*</If>*/}
          </PageCard>
          {/* TODO: project application association / DTO */}
          {/*<When condition={!!project.application}>*/}
          {/*  <Paper className="min-w-[500px]">*/}
          {/*    <ButtonField*/}
          {/*      label={t("Funding Application: {title}", { title: project.application?.funding_programme_name })}*/}
          {/*      buttonProps={{ as: Link, children: t("View"), href: `/applications/${project.application?.uuid}` }}*/}
          {/*    />*/}
          {/*  </Paper>*/}
          {/*  <Paper className="min-w-[500px]">*/}
          {/*    <ButtonField*/}
          {/*      label={t("Project pitch")}*/}
          {/*      buttonProps={{*/}
          {/*        as: Link,*/}
          {/*        children: t("View"),*/}
          {/*        href: `/project-pitches/${project.application?.project_pitch_uuid}`*/}
          {/*      }}*/}
          {/*    />*/}
          {/*  </Paper>*/}
          {/*</When>*/}
          <PageCard
            title={t("Monitoring Partners") + `${partners?.data.length! > 0 ? `(${partners?.data.length})` : ""}`}
            headerChildren={
              <Button variant="secondary" onClick={handleInvite}>
                {t("Invite")}
              </Button>
            }
            className="min-w-[500px]"
            isEmpty={partners?.data.length === 0}
            emptyStateProps={{
              title: t("Invite Monitored Partners"),
              content: t(
                "You don't have any monitored partners yet, but you can invite one to grant them access to this project and its reporting activities."
              )
            }}
          >
            <List
              as="div"
              itemAs="div"
              className="grid grid-cols-3 gap-4"
              items={partners?.data || []}
              render={partner => {
                const fullName = `${partner.first_name || ""} ${partner.last_name || ""}`.trim();

                return (
                  <UserProfileCard
                    className="h-full"
                    //@ts-expect-error
                    organisation={partner.organisation?.name || ""}
                    email={partner.email_address || ""}
                    username={fullName || ""}
                    status={partner.status as string}
                    project={project}
                    refetch={refetch}
                  />
                );
              }}
            />
          </PageCard>
        </PageColumn>
      </PageRow>
      <br />
      <br />
    </PageBody>
  );
};

export default ProjectDetailTab;

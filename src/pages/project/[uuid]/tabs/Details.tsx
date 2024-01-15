import { useT } from "@transifex/react";
import Link from "next/link";
import { Else, If, Then, When } from "react-if";

import Button from "@/components/elements/Button/Button";
import UserProfileCard from "@/components/elements/Cards/UserProfileCard/UserProfileCard";
import ButtonField from "@/components/elements/Field/ButtonField";
import LongTextField from "@/components/elements/Field/LongTextField";
import SelectImageListField from "@/components/elements/Field/SelectImageListField";
import TextField from "@/components/elements/Field/TextField";
import Paper from "@/components/elements/Paper/Paper";
import List from "@/components/extensive/List/List";
import PageBody from "@/components/extensive/PageElements/Body/PageBody";
import PageCard from "@/components/extensive/PageElements/Card/PageCard";
import PageColumn from "@/components/extensive/PageElements/Column/PageColumn";
import PageRow from "@/components/extensive/PageElements/Row/PageRow";
import { getLandTenureOptions } from "@/constants/options/landTenure";
import { useModalContext } from "@/context/modal.provider";
import { GetV2ProjectsUUIDPartnersResponse, useGetV2ProjectsUUIDPartners } from "@/generated/apiComponents";
import { useFramework } from "@/hooks/useFramework";
import { useGetOptions } from "@/hooks/useGetOptions";
import InviteMonitoringPartnerModal from "@/pages/project/[uuid]/components/InviteMonitoringPartnerModal";

interface ProjectDetailsTabProps {
  project: any;
}

const ProjectDetailTab = ({ project }: ProjectDetailsTabProps) => {
  const t = useT();
  const { openModal } = useModalContext();
  const { isTerrafund } = useFramework(project);

  const landUseTypesOptions = useGetOptions(project.land_use_types);
  const sdgsImpactedOptions = useGetOptions(project.sdgs_impacted);
  const restorationStrategyOptions = useGetOptions(project.restoration_strategy);

  const { data: partners, refetch } = useGetV2ProjectsUUIDPartners<{ data: GetV2ProjectsUUIDPartnersResponse }>({
    pathParams: { uuid: project.uuid }
  });

  const handleInvite = () => {
    openModal(<InviteMonitoringPartnerModal projectUUID={project.uuid} onSuccess={refetch} />);
  };

  return (
    <PageBody>
      <PageRow>
        <PageColumn>
          <PageCard title={t("Project Information")}>
            <LongTextField title={t("Description of Timeline")}>
              {project.description_of_project_timeline}
            </LongTextField>
            <LongTextField title={t("History of Project Area")}>{project.history}</LongTextField>
            <SelectImageListField
              title={t("Target Land Use Types")}
              options={landUseTypesOptions}
              selectedValues={project.land_use_types}
            />
            <SelectImageListField
              title={t("Restoration Strategies")}
              options={restorationStrategyOptions}
              selectedValues={project.restoration_strategy}
            />
          </PageCard>

          <When condition={isTerrafund}>
            <PageCard title={t("Project Objectives")}>
              <LongTextField title={t("Objectives")}>{project.objectives}</LongTextField>
              <LongTextField title={t("Environmental Goals")}>{project.environmental_goals}</LongTextField>
              <LongTextField title={t("Socioeconomic Goals")}>{project.socioeconomic_goals}</LongTextField>
              <SelectImageListField
                title={t("SDGs Impacted")}
                options={sdgsImpactedOptions}
                selectedValues={project.sdgs_impacted}
              />
              <LongTextField title={t("Project Partners")}>{project.proj_partner_info}</LongTextField>
              <LongTextField title={t("Seedlings Source")}>{project.seedlings_source}</LongTextField>
              <LongTextField title={t("Overview of Siting Strategy")}>
                {project.siting_strategy_description}
              </LongTextField>
              <LongTextField title={t("Siting Strategy")}>{project.siting_strategy}</LongTextField>
              <LongTextField title={t("Community Engagement Strategy")}>{project.landholder_comm_engage}</LongTextField>
              <SelectImageListField
                title={t("Land Tenure")}
                options={getLandTenureOptions(t)}
                selectedValues={project.land_tenure_project_area || []}
              />
              <If condition={!project?.proof_of_land_tenure_mou}>
                <Then>
                  <Paper className="min-w-[500px]">
                    <h3>{t("Files not found")}</h3>
                  </Paper>
                </Then>
                <Else>
                  <Then>
                    {project?.proof_of_land_tenure_mou?.map((document: any, index: any) => (
                      <ButtonField
                        key={index}
                        label={t("Land Tenure MOU")}
                        buttonProps={{
                          as: Link,
                          children: t("Download"),
                          href: document?.url || "",
                          download: true
                        }}
                      />
                    ))}
                  </Then>
                </Else>
              </If>
            </PageCard>
          </When>
        </PageColumn>

        <PageColumn>
          <When condition={isTerrafund}>
            <Paper className="min-w-[500px]">
              <TextField label={t("Project Budget")} value={project.budget} />
              <br />
              <ButtonField
                label={t("Detailed Project Budget")}
                buttonProps={{
                  as: Link,
                  children: t("Download"),
                  href: project?.detailed_project_budget?.url || "",
                  download: true
                }}
              />
            </Paper>
            <Paper className="min-w-[500px]">
              <If condition={!project.other_additional_documents.length}>
                <Then>
                  <h3>{t("Files not found")}</h3>
                </Then>
                <Else>
                  <Then>
                    {project.other_additional_documents?.map((document: any, index: any) => (
                      <ButtonField
                        key={index}
                        label={t("Additional Document", { title: document })}
                        buttonProps={{
                          as: Link,
                          children: t("Download"),
                          href: document?.url || "",
                          download: true
                        }}
                        style={{ marginBottom: "10px" }}
                      />
                    ))}
                  </Then>
                </Else>
              </If>
            </Paper>
          </When>
          <When condition={!!project.application}>
            <Paper className="min-w-[500px]">
              <ButtonField
                label={t("Funding Application: {title}", { title: project.application?.funding_programme_name })}
                buttonProps={{ as: Link, children: t("View"), href: `/applications/${project.application?.uuid}` }}
              />
            </Paper>
          </When>
          <When condition={!!project.application}>
            <Paper className="min-w-[500px]">
              <ButtonField
                label={t("Project pitch")}
                buttonProps={{
                  as: Link,
                  children: t("View"),
                  href: `/project-pitches/${project.application?.project_pitch_uuid}`
                }}
              />
            </Paper>
          </When>
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
                  />
                );
              }}
            />
          </PageCard>
        </PageColumn>
      </PageRow>
    </PageBody>
  );
};

export default ProjectDetailTab;

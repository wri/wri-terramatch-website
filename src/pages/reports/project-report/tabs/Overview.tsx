import { Box, Flex } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { useRouter } from "next/router";
import { FC, useCallback, useMemo, useState } from "react";

import OnboardingCard from "@/components/extensive/OnboardingCard/OnboardingCard";
import AboutPageItem from "@/components/extensive/PageElements/AboutPageItem/AboutPageItem";
import PageContent from "@/components/extensive/PageElements/PageContent/PageContent";
import PageItem from "@/components/extensive/PageElements/PageItem/PageItem";
import HighLevelMetricsCard from "@/components/reports/HighLevelMetrics/HighLevelMetricsCard";
import { PENDING_APPROVAL } from "@/constants/statuses";
import { ProjectFullDto, ProjectReportFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { getEntitySetupButtonLabel } from "@/helpers/entity";
import { useGetEditEntityHandler } from "@/hooks/entity/useGetEditEntityHandler";
import EntitySetUpSection from "@/pages/project/[uuid]/tabs/EntitySetUpSection";
import LatestImagesSectionTab from "@/pages/project/[uuid]/tabs/LatestImagesSection";
import TagSubmission from "@/redesignComponents/actions/Tags/TagSubmission/TagSubmission";
import { ChevronRightIcon } from "@/redesignComponents/foundations/Icons/Function/ChevronRightIcon";
import { createMetricsCardCtaHandler } from "@/utils/analytics/metricsCardAnalytics";
import { ONBOARDING_CARD_TYPES } from "@/utils/analytics/onboardingCardAnalytics";
import { mapStatusToTagStateEntity } from "@/utils/mapStatusToTagStateEntity";

import KeyIndicatorsInsights from "../components/KeyIndicatorsInsights";

interface ProjectReportOverviewTabProps {
  projectReport: ProjectReportFullDto;
  project?: ProjectFullDto | null;
}

const ProjectReportOverviewTab: FC<ProjectReportOverviewTabProps> = ({ projectReport, project }) => {
  const router = useRouter();
  const t = useT();
  const [isReportSetupComplete, setIsReportSetupComplete] = useState(false);

  const { handleEdit, EditModals } = useGetEditEntityHandler({
    entityName: "project-reports",
    entityUUID: projectReport.uuid,
    entityStatus: projectReport.status,
    updateRequestStatus: projectReport.updateRequestStatus,
    entityTitle: projectReport.projectName ?? "",
    reportTitle: projectReport.reportTitle ?? "",
    feedback: projectReport.feedback,
    useStatusModal: true,
    useInformationRequiredModal: true
  });

  const goToTab = useCallback(
    (tab: string) => {
      router.push({ pathname: router.pathname, query: { ...router.query, tab } }, undefined, {
        shallow: true
      });
    },
    [router]
  );

  const editButtonLabel = getEntitySetupButtonLabel(t, projectReport.status, isReportSetupComplete);

  const statusTag = useMemo(() => {
    if (projectReport.updateRequestStatus === PENDING_APPROVAL) {
      return <TagSubmission size="small" state="pending-approval" />;
    }

    const tagState = mapStatusToTagStateEntity(projectReport.status);
    if (projectReport.status == null || tagState == null) return null;

    return <TagSubmission size="small" state={tagState.type} />;
  }, [projectReport.status, projectReport.updateRequestStatus]);

  return (
    <PageContent>
      {EditModals}
      <Flex gap={7} className="flex-col">
        <Flex gap={7}>
          <Flex gap={5} className="flex-[2] flex-col">
            <PageItem
              title={t("Key Indicators and Insights")}
              buttonProps={{
                variant: "secondary",
                size: "small",
                children: t("View Indicator & Insights"),
                rightIcon: <ChevronRightIcon />,
                onClick: createMetricsCardCtaHandler(
                  { entityType: "project-report", entityId: projectReport.uuid },
                  () => goToTab("goals")
                )
              }}
            >
              <HighLevelMetricsCard entityType="project-report" entityId={projectReport.uuid}>
                <KeyIndicatorsInsights projectReport={projectReport} project={project} />
              </HighLevelMetricsCard>
            </PageItem>
            <PageItem
              title={t("Featured Images")}
              buttonProps={{
                variant: "secondary",
                size: "small",
                children: t("View Gallery"),
                rightIcon: <ChevronRightIcon />,
                onClick: () => goToTab("gallery")
              }}
            >
              <LatestImagesSectionTab
                entityUuid={projectReport.uuid}
                entityName="projectReports"
                columns={4}
                rows={1}
              />
            </PageItem>
          </Flex>
          <PageItem
            title={t("Project Report")}
            flexProps={{ flex: 1 }}
            buttonProps={{
              variant: "primary",
              size: "small",
              children: editButtonLabel,
              rightIcon: <ChevronRightIcon />,
              onClick: () => handleEdit()
            }}
            tag={statusTag}
          >
            <Box backgroundColor="neutral.100" padding={5} borderRadius={1}>
              <EntitySetUpSection
                onStatusChange={setIsReportSetupComplete}
                onEditStep={handleEdit}
                entity={projectReport}
                type="projectReports"
                entityTitle={projectReport.projectName ?? ""}
                reportTitle={projectReport.reportTitle ?? ""}
              />
            </Box>
          </PageItem>
        </Flex>
        <OnboardingCard
          cardType={ONBOARDING_CARD_TYPES.MRV_GUIDANCE}
          entityType="project-report"
          entityId={projectReport.uuid}
        >
          <AboutPageItem
            type="project-report"
            flexProps={{ flex: 1 }}
            contentClassName="flex-row gap-14"
            descriptionMaxWidth="65%"
          />
        </OnboardingCard>
      </Flex>
    </PageContent>
  );
};

export default ProjectReportOverviewTab;

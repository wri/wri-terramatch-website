import { Box, Flex } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import classNames from "classnames";
import { useRouter } from "next/router";
import { Component, ErrorInfo, FC, ReactNode, useCallback, useMemo, useState } from "react";

import OnboardingCard from "@/components/extensive/OnboardingCard/OnboardingCard";
import AboutPageItem from "@/components/extensive/PageElements/AboutPageItem/AboutPageItem";
import MetricCardsRow from "@/components/extensive/PageElements/MetricCardsRow/MetricCardsRow";
import PageContent from "@/components/extensive/PageElements/PageContent/PageContent";
import PageItem from "@/components/extensive/PageElements/PageItem/PageItem";
import HighLevelMetricsCard from "@/components/reports/HighLevelMetrics/HighLevelMetricsCard";
import { AWAITING_APPROVAL } from "@/constants/statuses";
import { isTerrafund, toFramework } from "@/context/framework.provider";
import { NurseryReportFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { getEntitySetupButtonLabel } from "@/helpers/entity";
import { useGetEditEntityHandler } from "@/hooks/entity/useGetEditEntityHandler";
import EntitySetUpSection from "@/pages/project/[uuid]/tabs/EntitySetUpSection";
import LatestImagesSectionTab from "@/pages/project/[uuid]/tabs/LatestImagesSection";
import NothingToReportEmptyState from "@/pages/reports/nursery-report/components/NothingToReportEmptyState";
import TagSubmission from "@/redesignComponents/actions/Tags/TagSubmission/TagSubmission";
import MetricCard from "@/redesignComponents/dataDisplay/Metrics/MetricCard";
import { ChevronRightIcon, SeedlingsIcon } from "@/redesignComponents/foundations/Icons";
import { createMetricsCardCtaHandler } from "@/utils/analytics/metricsCardAnalytics";
import { ONBOARDING_CARD_TYPES } from "@/utils/analytics/onboardingCardAnalytics";
import Log from "@/utils/log";
import { mapStatusToTagStateEntity } from "@/utils/mapStatusToTagStateEntity";

interface NurseryReportOverviewProps {
  report: NurseryReportFullDto;
}

type NurseryReportOverviewErrorBoundaryProps = {
  fallback: ReactNode;
  children: ReactNode;
};

type NurseryReportOverviewErrorBoundaryState = {
  hasError: boolean;
};

class NurseryReportOverviewErrorBoundary extends Component<
  NurseryReportOverviewErrorBoundaryProps,
  NurseryReportOverviewErrorBoundaryState
> {
  state: NurseryReportOverviewErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    Log.error("Nursery report overview failed to render", { error, errorInfo });
  }

  render() {
    if (this.state.hasError) return this.props.fallback;

    return this.props.children;
  }
}

const NurseryReportOverviewFallback: FC = () => {
  const t = useT();

  return (
    <PageContent>
      <Box className="bg-theme-neutral-100 text-theme-neutral-600 rounded-md p-6 text-center text-sm">
        {t("Unable to display this nursery report overview.")}
      </Box>
    </PageContent>
  );
};

const NurseryReportOverviewContent: FC<NurseryReportOverviewProps> = ({ report }) => {
  const t = useT();
  const router = useRouter();
  const [isReportSetupComplete, setIsReportSetupComplete] = useState(false);

  const { handleEdit, EditModals } = useGetEditEntityHandler({
    entityName: "nursery-reports",
    entityUUID: report.uuid,
    entityStatus: report.status,
    updateRequestStatus: report.updateRequestStatus,
    entityTitle: report.nurseryName ?? "",
    reportTitle: report.reportTitle ?? "",
    feedback: report.feedback,
    useStatusModal: true
  });

  const goToTab = useCallback(
    (tab: string) => {
      router.push({ pathname: router.pathname, query: { ...router.query, tab } }, undefined, {
        shallow: true
      });
    },
    [router]
  );

  const editButtonLabel = getEntitySetupButtonLabel(t, report.status, isReportSetupComplete);

  const statusTag = useMemo(() => {
    if (report.updateRequestStatus === AWAITING_APPROVAL) {
      return <TagSubmission size="small" state="pending-approval" />;
    }

    const tagState = mapStatusToTagStateEntity(report.status);
    if (report.status == null || tagState == null) return null;

    return <TagSubmission size="small" state={tagState.type} />;
  }, [report.status, report.updateRequestStatus]);

  if (report.nothingToReport) {
    return (
      <PageContent>
        <NothingToReportEmptyState />
      </PageContent>
    );
  }

  const isTerrafundFramework = isTerrafund(toFramework(report.frameworkKey));
  const seedlingsGrown = report.seedlingsYoungTrees ?? 0;

  return (
    <PageContent>
      {EditModals}
      <Flex gap={7} className="flex-col">
        <Flex gap={7}>
          <Flex gap={5} className={classNames(isTerrafundFramework ? "flex-row" : "flex-col", "flex-[2]")}>
            <PageItem
              title={t("Key Indicators and Insights")}
              buttonProps={{
                variant: "secondary",
                size: "small",
                children: t("View Indicator & Insights"),
                rightIcon: <ChevronRightIcon />,
                onClick: createMetricsCardCtaHandler({ entityType: "nursery-report", entityId: report.uuid }, () =>
                  goToTab("goals")
                )
              }}
            >
              <HighLevelMetricsCard entityType="nursery-report" entityId={report.uuid}>
                <MetricCardsRow>
                  <MetricCard
                    title={t("Seedlings Grown")}
                    progress={seedlingsGrown}
                    goal={0}
                    variant="large"
                    icon={<SeedlingsIcon />}
                    color="secondary.600"
                    metricLabel="seedlings_grown"
                    tooltipContent={t(
                      "This is the total number of seedlings produced in this nursery during this reporting period."
                    )}
                    className="flex-1"
                  />
                </MetricCardsRow>
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
                entityUuid={report.uuid}
                entityName="nurseryReports"
                columns={isTerrafundFramework ? 2 : 4}
                rows={1}
                minItems={2}
                onClickAdd={() => goToTab("gallery")}
              />
            </PageItem>
          </Flex>
          <PageItem
            title={t("Nursery Report")}
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
                entity={report}
                type="nurseryReports"
                entityTitle={report.nurseryName ?? ""}
                reportTitle={report.reportTitle ?? ""}
              />
            </Box>
          </PageItem>
        </Flex>
        <OnboardingCard
          cardType={ONBOARDING_CARD_TYPES.MRV_GUIDANCE}
          entityType="nursery-report"
          entityId={report.uuid}
        >
          <AboutPageItem
            type="nursery-report"
            className="flex-row gap-14"
            contentClassName="flex-row gap-14"
            descriptionMaxWidth="65%"
          />
        </OnboardingCard>
      </Flex>
    </PageContent>
  );
};

const NurseryReportOverview: FC<NurseryReportOverviewProps> = props => (
  <NurseryReportOverviewErrorBoundary fallback={<NurseryReportOverviewFallback />}>
    <NurseryReportOverviewContent {...props} />
  </NurseryReportOverviewErrorBoundary>
);

export default NurseryReportOverview;

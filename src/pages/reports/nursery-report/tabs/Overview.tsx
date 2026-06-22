import { Box, Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import classNames from "classnames";
import { useRouter } from "next/router";
import { Component, ErrorInfo, FC, ReactNode, useCallback, useMemo, useState } from "react";

import { getStatusProps } from "@/components/extensive/EntityStatusBar";
import EntityStatusModal from "@/components/extensive/EntityStatusModal";
import { ModalId } from "@/components/extensive/Modal/ModalConst";
import About from "@/components/extensive/PageElements/About/About";
import ContactSupport from "@/components/extensive/PageElements/ContactSupport/ContactSupport";
import MetricCardsRow from "@/components/extensive/PageElements/MetricCardsRow/MetricCardsRow";
import PageContent from "@/components/extensive/PageElements/PageContent/PageContent";
import PageItem from "@/components/extensive/PageElements/PageItem/PageItem";
import HighLevelMetricsCard from "@/components/reports/HighLevelMetrics/HighLevelMetricsCard";
import { AWAITING_APPROVAL, NEEDS_MORE_INFORMATION } from "@/constants/statuses";
import { isTerrafund, toFramework } from "@/context/framework.provider";
import { useModalContext } from "@/context/modal.provider";
import { NurseryReportFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { useGetEditEntityHandler } from "@/hooks/entity/useGetEditEntityHandler";
import EntitySetUpSection from "@/pages/project/[uuid]/tabs/EntitySetUpSection";
import LatestImagesSectionTab from "@/pages/project/[uuid]/tabs/LatestImagesSection";
import NothingToReportEmptyState from "@/pages/reports/nursery-report/components/NothingToReportEmptyState";
import { useNurseryReportAboutContent } from "@/pages/reports/nursery-report/constants/nurseryReportAboutContent";
import TagSubmission from "@/redesignComponents/actions/Tags/TagSubmission/TagSubmission";
import MetricCard from "@/redesignComponents/dataDisplay/Metrics/MetricCard";
import { ChevronRightIcon, SeedlingsIcon } from "@/redesignComponents/foundations/Icons";
import { createMetricsCardCtaHandler } from "@/utils/analytics/metricsCardAnalytics";
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
      <Box className="rounded-md bg-theme-neutral-100 p-6 text-center text-sm text-theme-neutral-600">
        {t("Unable to display this nursery report overview.")}
      </Box>
    </PageContent>
  );
};

const NurseryReportOverviewContent: FC<NurseryReportOverviewProps> = ({ report }) => {
  const t = useT();
  const router = useRouter();
  const { openModal } = useModalContext();
  const [isReportSetupComplete, setIsReportSetupComplete] = useState(false);
  const nurseryReportAboutContent = useNurseryReportAboutContent();

  const { handleEdit } = useGetEditEntityHandler({
    entityName: "nursery-reports",
    entityUUID: report.uuid,
    entityStatus: report.status,
    updateRequestStatus: report.updateRequestStatus
  });

  const needMoreInformation =
    report.updateRequestStatus === NEEDS_MORE_INFORMATION || report.status === NEEDS_MORE_INFORMATION;
  const awaitingApproval = report.updateRequestStatus === AWAITING_APPROVAL || report.status === AWAITING_APPROVAL;
  const statusProps = useMemo(() => getStatusProps(t, report, report.status), [t, report]);

  const handleEditClick = useCallback(() => {
    if (needMoreInformation && !awaitingApproval && statusProps != null) {
      openModal(
        ModalId.STATUS,
        <EntityStatusModal
          statusProps={statusProps}
          feedback={report.feedback}
          needMoreInformation={needMoreInformation}
          entityName="nurseryReports"
          entityUuid={report.uuid}
        />
      );
    } else {
      handleEdit();
    }
  }, [awaitingApproval, handleEdit, needMoreInformation, openModal, report.feedback, report.uuid, statusProps]);

  const aboutContentItem = useMemo(() => {
    if (report.frameworkKey == null) return nurseryReportAboutContent[0];

    return (
      nurseryReportAboutContent.find(content => content.frameworks.includes(report.frameworkKey ?? "")) ??
      nurseryReportAboutContent[0]
    );
  }, [report.frameworkKey, nurseryReportAboutContent]);

  const goToTab = useCallback(
    (tab: string) => {
      router.push({ pathname: router.pathname, query: { ...router.query, tab } }, undefined, {
        shallow: true
      });
    },
    [router]
  );

  const editButtonLabel = report.status === "approved" && isReportSetupComplete ? t("Edit") : t("Continue");

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
      <Flex gap={7} className="flex-col">
        <Flex gap={7}>
          <Flex gap={5} className={classNames(isTerrafundFramework ? "flex-row" : "flex-col", "flex-[2]")}>
            <PageItem
              title={t("Key Indicators & Insights")}
              buttonProps={{
                variant: "secondary",
                size: "small",
                children: t("View Progress & Goals"),
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
              onClick: handleEditClick
            }}
            tag={statusTag}
          >
            <Box backgroundColor="neutral.100" padding={5} borderRadius={1}>
              <EntitySetUpSection onStatusChange={setIsReportSetupComplete} entity={report} type="nurseryReports" />
            </Box>
          </PageItem>
        </Flex>
        <PageItem title={t("About Nursery Report")}>
          <About
            className="flex-row gap-12"
            description={
              <Flex direction="column" gap={5}>
                {aboutContentItem?.paragraphs.map((paragraph, index) => {
                  const isFirstParagraph = index === 0;
                  const isLastParagraph = index === (aboutContentItem.paragraphs.length ?? 0) - 1;

                  if (isFirstParagraph) {
                    return (
                      <Text key={index} color="neutral.900" textStyle="300">
                        <strong>{t("Nursery Report")} </strong> {paragraph}
                      </Text>
                    );
                  }

                  if (isLastParagraph) {
                    return (
                      <ContactSupport
                        key={index}
                        message={paragraph}
                        subject={t("Support Request for Nursery Report")}
                      />
                    );
                  }

                  return (
                    <Text key={index} color="neutral.900" textStyle="300">
                      {paragraph}
                    </Text>
                  );
                })}
              </Flex>
            }
            links={
              aboutContentItem?.links.map(link => ({
                title: t(link.title),
                link: link.link
              })) ?? []
            }
          />
        </PageItem>
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

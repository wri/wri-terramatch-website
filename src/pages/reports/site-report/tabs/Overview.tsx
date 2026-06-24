import { Box, Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import classNames from "classnames";
import { useRouter } from "next/router";
import { FC, useCallback, useEffect, useMemo, useState } from "react";

import EmptyState from "@/components/elements/EmptyState/EmptyState";
import OverviewMapArea from "@/components/elements/Map-mapbox/components/OverviewMapArea";
import { IconNames } from "@/components/extensive/Icon/Icon";
import OnboardingCard from "@/components/extensive/OnboardingCard/OnboardingCard";
import About from "@/components/extensive/PageElements/About/About";
import ContactSupport from "@/components/extensive/PageElements/ContactSupport/ContactSupport";
import MapPlaceholder from "@/components/extensive/PageElements/MapPlaceholder/MapPlaceholder";
import PageContent from "@/components/extensive/PageElements/PageContent/PageContent";
import PageItem from "@/components/extensive/PageElements/PageItem/PageItem";
import HighLevelMetricsCard from "@/components/reports/HighLevelMetrics/HighLevelMetricsCard";
import { useAllSitePolygons } from "@/connections/SitePolygons";
import { AWAITING_APPROVAL } from "@/constants/statuses";
import { Framework } from "@/context/framework.provider";
import { useMapAreaContext } from "@/context/mapArea.provider";
import { SitePolygonDataProvider } from "@/context/sitePolygon.provider";
import { SiteFullDto, SiteReportFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { useGetEditEntityHandler } from "@/hooks/entity/useGetEditEntityHandler";
import EntitySetUpSection from "@/pages/project/[uuid]/tabs/EntitySetUpSection";
import LatestImagesSectionTab from "@/pages/project/[uuid]/tabs/LatestImagesSection";
import SiteReportKeyIndicatorsInsights from "@/pages/reports/site-report/components/KeyIndicatorsInsights";
import { useSiteReportAboutContent } from "@/pages/reports/site-report/constants/siteReportAboutContent";
import { SITE_POLYGON_MAP_INITIAL_HEIGHT } from "@/pages/site/[uuid]/constants/sitePolygonMapSizing";
import TagSubmission from "@/redesignComponents/actions/Tags/TagSubmission/TagSubmission";
import { AreaHectaresIcon } from "@/redesignComponents/foundations/Icons";
import { ChevronRightIcon } from "@/redesignComponents/foundations/Icons/Function/ChevronRightIcon";
import { createMetricsCardCtaHandler } from "@/utils/analytics/metricsCardAnalytics";
import { ONBOARDING_CARD_TYPES } from "@/utils/analytics/onboardingCardAnalytics";
import { mapStatusToTagStateEntity } from "@/utils/mapStatusToTagStateEntity";

interface OverviewProps {
  siteReport: SiteReportFullDto;
  site?: SiteFullDto | null;
  workdaysTotal?: number | null;
}

const Overview: FC<OverviewProps> = ({ siteReport, site, workdaysTotal }) => {
  const router = useRouter();
  const t = useT();
  const { setSiteData, resetSiteMapInteractionState } = useMapAreaContext();
  const [isReportSetupComplete, setIsReportSetupComplete] = useState(false);
  const siteReportAboutContent = useSiteReportAboutContent();

  const {
    data: sitePolygonDataV3,
    isLoading: isLoadingSitePolygons,
    refetch: refetchSitePolygons
  } = useAllSitePolygons({
    entityName: "sites",
    entityUuid: site?.uuid ?? "",
    enabled: site?.uuid != null
  });

  useEffect(() => {
    resetSiteMapInteractionState();
  }, [resetSiteMapInteractionState]);

  useEffect(() => {
    setSiteData(site ?? undefined);
  }, [setSiteData, site]);

  const reloadSiteData = useCallback(() => {
    refetchSitePolygons();
  }, [refetchSitePolygons]);

  const { handleEdit, EditModals } = useGetEditEntityHandler({
    entityName: "site-reports",
    entityUUID: siteReport.uuid,
    entityStatus: siteReport.status,
    updateRequestStatus: siteReport.updateRequestStatus,
    feedback: siteReport.feedback,
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

  const goToSiteMap = useCallback(() => {
    if (site?.uuid == null) return;

    router.push(`/site/${site.uuid}?tab=polygons`);
  }, [router, site?.uuid]);

  const aboutContentItem = useMemo(() => {
    return siteReportAboutContent.find(content => content.frameworks.includes(siteReport.frameworkKey!));
  }, [siteReport.frameworkKey, siteReportAboutContent]);

  const editButtonLabel = siteReport.status === "approved" && isReportSetupComplete ? t("Edit") : t("Continue");

  const statusTag = useMemo(() => {
    if (siteReport.updateRequestStatus === AWAITING_APPROVAL) {
      return <TagSubmission size="small" state="pending-approval" />;
    }

    const tagState = mapStatusToTagStateEntity(siteReport.status);
    if (siteReport.status == null || tagState == null) return null;

    return <TagSubmission size="small" state={tagState.type} />;
  }, [siteReport.status, siteReport.updateRequestStatus]);

  if (siteReport.nothingToReport) {
    return (
      <PageContent>
        <EmptyState
          iconProps={{ name: IconNames.DOCUMENT_CIRCLE, className: "fill-success" }}
          title={t("Nothing to report")}
          subtitle={t(
            "You've marked this report as 'Nothing to Report,' indicating there are no updates for this site report. If you wish to add information to this report, please use the edit button."
          )}
        />
      </PageContent>
    );
  }

  const isHBFFramework = siteReport.frameworkKey === Framework.HBF;

  return (
    <SitePolygonDataProvider sitePolygonData={sitePolygonDataV3} reloadSiteData={reloadSiteData}>
      <PageContent>
        {EditModals}
        <Flex gap={7} className="flex-col">
          <Flex gap={7} className="mobile:flex-col">
            <Flex gap={5} className={classNames(isHBFFramework ? "flex-row" : "flex-col", "flex-[2]")}>
              <PageItem
                title={t("Key Indicators & Insights")}
                buttonProps={{
                  variant: "secondary",
                  size: "small",
                  children: t("View Key Indicators & Insights"),
                  rightIcon: <ChevronRightIcon />,
                  onClick: createMetricsCardCtaHandler({ entityType: "site-report", entityId: siteReport.uuid }, () =>
                    goToTab("goals")
                  )
                }}
              >
                <HighLevelMetricsCard entityType="site-report" entityId={siteReport.uuid}>
                  <SiteReportKeyIndicatorsInsights siteReport={siteReport} workdaysTotal={workdaysTotal} />
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
                  entityUuid={siteReport.uuid}
                  entityName="siteReports"
                  columns={isHBFFramework ? 2 : 4}
                  rows={1}
                />
              </PageItem>
            </Flex>
            <PageItem
              title={t("Site Report")}
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
                  entity={siteReport}
                  type="siteReports"
                />
              </Box>
            </PageItem>
          </Flex>
          <Flex gap={7} className="mobile:flex-col">
            {site != null && (
              <PageItem title={t("Site Map")} flexProps={{ flex: 1 }} className="min-h-0">
                <Box className="relative overflow-hidden rounded" minH={SITE_POLYGON_MAP_INITIAL_HEIGHT}>
                  <OverviewMapArea
                    entityModel={site}
                    type="sites"
                    className="h-full min-h-0 rounded"
                    disabledPolygonPanel={true}
                    hideFullscreenControl={true}
                    siteReportPolygonPopup={true}
                  />
                  {!isLoadingSitePolygons && (sitePolygonDataV3?.length ?? 0) === 0 && (
                    <MapPlaceholder
                      icon={<AreaHectaresIcon boxSize={6} color="neutral.100" />}
                      title={t("Site Areas not defined yet.")}
                      buttonGroupProps={{
                        buttons: [
                          {
                            id: "add-polygons",
                            variant: "borderless",
                            size: "small",
                            rightIcon: <ChevronRightIcon boxSize={4} />,
                            className: "!text-theme-neutral-100",
                            children: t("Add Polygons"),
                            onClick: goToSiteMap
                          }
                        ]
                      }}
                      className="z-10"
                    />
                  )}
                </Box>
              </PageItem>
            )}
            <PageItem title={t("About Site Report")} flexProps={{ flex: 1 }}>
              <OnboardingCard
                cardType={ONBOARDING_CARD_TYPES.MRV_GUIDANCE}
                entityType="site-report"
                entityId={siteReport.uuid}
              >
                <About
                  description={
                    <Flex direction="column" gap={5}>
                      {aboutContentItem?.paragraphs.map((paragraph, index) => {
                        const isFirstParagraph = index === 0;
                        const isLastParagraph = index === (aboutContentItem.paragraphs.length ?? 0) - 1;

                        if (isFirstParagraph) {
                          return (
                            <Text key={index} color="neutral.900" textStyle="300">
                              <strong>{t("Site Report")} </strong> {paragraph}
                            </Text>
                          );
                        }

                        if (isLastParagraph) {
                          return (
                            <ContactSupport
                              key={index}
                              message={paragraph}
                              subject={t("Support Request for Site Report")}
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
              </OnboardingCard>
            </PageItem>
          </Flex>
        </Flex>
      </PageContent>
    </SitePolygonDataProvider>
  );
};

export default Overview;

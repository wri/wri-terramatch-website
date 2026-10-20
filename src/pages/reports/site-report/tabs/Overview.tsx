import { Box, Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import classNames from "classnames";
import { useRouter } from "next/router";
import { FC, useCallback, useEffect, useMemo, useState } from "react";

import OverviewMapArea from "@/components/elements/Map-mapbox/components/OverviewMapArea";
import StatusTag from "@/components/elements/StatusTag/StatusTag";
import OnboardingCard from "@/components/extensive/OnboardingCard/OnboardingCard";
import AboutPageItem from "@/components/extensive/PageElements/AboutPageItem/AboutPageItem";
import MapPlaceholder from "@/components/extensive/PageElements/MapPlaceholder/MapPlaceholder";
import PageContent from "@/components/extensive/PageElements/PageContent/PageContent";
import PageItem from "@/components/extensive/PageElements/PageItem/PageItem";
import HighLevelMetricsCard from "@/components/reports/HighLevelMetrics/HighLevelMetricsCard";
import { pruneSitePolygonsCache, useSitePolygonMapIndex } from "@/connections/SitePolygons";
import { PENDING_APPROVAL } from "@/constants/statuses";
import { Framework } from "@/context/framework.provider";
import { useMapAreaContext } from "@/context/mapArea.provider";
import { SitePolygonDataProvider } from "@/context/sitePolygon.provider";
import { SiteFullDto, SiteReportFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { getEntitySetupButtonLabel } from "@/helpers/entity";
import { useGetEditEntityHandler } from "@/hooks/entity/useGetEditEntityHandler";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import EntitySetUpSection from "@/pages/project/[uuid]/tabs/EntitySetUpSection";
import LatestImagesSectionTab from "@/pages/project/[uuid]/tabs/LatestImagesSection";
import SiteReportKeyIndicatorsInsights from "@/pages/reports/site-report/components/KeyIndicatorsInsights";
import { SITE_POLYGON_MAP_INITIAL_HEIGHT } from "@/pages/site/[uuid]/constants/sitePolygonMapSizing";
import TagSubmission from "@/redesignComponents/actions/Tags/TagSubmission/TagSubmission";
import { AreaHectaresIcon } from "@/redesignComponents/foundations/Icons";
import { ChevronRightIcon } from "@/redesignComponents/foundations/Icons/Function/ChevronRightIcon";
import { createMetricsCardCtaHandler } from "@/utils/analytics/metricsCardAnalytics";
import { ONBOARDING_CARD_TYPES } from "@/utils/analytics/onboardingCardAnalytics";

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

  const [mapIndexLoaded, { data: mapIndex }] = useSitePolygonMapIndex({
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
    pruneSitePolygonsCache();
  }, []);

  const { handleEdit, EditModals } = useGetEditEntityHandler({
    entityName: "site-reports",
    entityUUID: siteReport.uuid,
    entityStatus: siteReport.status,
    updateRequestStatus: siteReport.updateRequestStatus,
    entityTitle: siteReport.siteName ?? "",
    reportTitle: siteReport.reportTitle ?? "",
    feedback: siteReport.feedback,
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

  const goToSiteMap = useCallback(() => {
    if (site?.uuid == null) return;

    router.push(`/site/${site.uuid}?tab=polygons`);
  }, [router, site?.uuid]);

  const editButtonLabel = getEntitySetupButtonLabel(t, siteReport.status, isReportSetupComplete);

  const isAdmin = useIsAdmin();

  const statusTag = useMemo(() => {
    if (siteReport.updateRequestStatus === PENDING_APPROVAL) {
      return <TagSubmission size="small" state={isAdmin ? "pending-approval" : "pending-approval-neutral"} />;
    }

    if (siteReport.nothingToReport) {
      return <StatusTag size="small" status={"nothing-reported"} />;
    }

    return <StatusTag size="small" status={siteReport.status} />;
  }, [siteReport.status, siteReport.updateRequestStatus, isAdmin, siteReport.nothingToReport]);

  const isHBFFramework = siteReport.frameworkKey === Framework.HBF;

  return (
    <SitePolygonDataProvider sitePolygonData={undefined} reloadSiteData={reloadSiteData}>
      <PageContent>
        {EditModals}
        <Flex gap={7} className="flex-col">
          <Flex gap={7} className="mobile:flex-col">
            {!siteReport.nothingToReport && (
              <Flex gap={5} className={classNames(isHBFFramework ? "flex-row" : "flex-col", "flex-[2]")}>
                <PageItem
                  title={t("Key Indicators and Insights")}
                  buttonProps={{
                    variant: "secondary",
                    size: "small",
                    children: t("View Indicator & Insights"),
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
            )}
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
              {siteReport.nothingToReport && (
                <Text textStyle="400" color="neutral.800">
                  {t(
                    "It was indicated that there are no updates for this project report. If you wish to add information, please click on Edit."
                  )}
                </Text>
              )}
              <Box backgroundColor="neutral.100" padding={5} borderRadius={1}>
                <EntitySetUpSection
                  onStatusChange={setIsReportSetupComplete}
                  onEditStep={handleEdit}
                  entity={siteReport}
                  type="siteReports"
                  entityTitle={siteReport.siteName ?? ""}
                  reportTitle={siteReport.reportTitle ?? ""}
                  disabled={siteReport.nothingToReport === true}
                />
              </Box>
            </PageItem>
          </Flex>
          <Flex gap={7} className="mobile:flex-col">
            {site != null && !siteReport.nothingToReport && (
              <PageItem title={t("Site Map")} flexProps={{ flex: 1 }} className="min-h-0">
                <Box className="relative overflow-hidden rounded" minH={SITE_POLYGON_MAP_INITIAL_HEIGHT}>
                  <OverviewMapArea
                    entityModel={site}
                    type="sites"
                    className="h-full min-h-0 rounded"
                    hideFullscreenControl={true}
                    overviewPolygonPopup="attributes"
                  />
                  {mapIndexLoaded && (mapIndex?.total ?? 0) === 0 && (
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
            <OnboardingCard
              cardType={ONBOARDING_CARD_TYPES.MRV_GUIDANCE}
              entityType="site-report"
              entityId={siteReport.uuid}
            >
              <AboutPageItem
                type="site-report"
                flexProps={{ flex: 1 }}
                isNothingToReport={siteReport?.nothingToReport!}
              />
            </OnboardingCard>
          </Flex>
        </Flex>
      </PageContent>
    </SitePolygonDataProvider>
  );
};

export default Overview;

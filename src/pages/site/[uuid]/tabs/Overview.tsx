import { Box, Flex, useBreakpointValue } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import router from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";

import { getStatusProps } from "@/components/extensive/EntityStatusBar";
import EntityStatusModal from "@/components/extensive/EntityStatusModal";
import AboutPageItem from "@/components/extensive/PageElements/AboutPageItem/AboutPageItem";
import PageContent from "@/components/extensive/PageElements/PageContent/PageContent";
import PageItem from "@/components/extensive/PageElements/PageItem/PageItem";
import SiteActionsPanel from "@/components/siteData/SiteActionsPanel";
import SiteKpiPanel from "@/components/siteData/SiteKpiPanel";
import SiteMap from "@/components/siteData/SiteMap";
import { useSiteDrilldown } from "@/components/siteData/useSiteDrilldown";
import { useAllSitePolygons } from "@/connections/SitePolygons";
import { INFORMATION_REQUIRED, PENDING_APPROVAL } from "@/constants/statuses";
import { useMapAreaContext } from "@/context/mapArea.provider";
import { SitePolygonDataProvider } from "@/context/sitePolygon.provider";
import { SiteFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { useGetEditEntityHandler } from "@/hooks/entity/useGetEditEntityHandler";
import EntitySetUpSection from "@/pages/project/[uuid]/tabs/EntitySetUpSection";
import LatestImagesSectionTab from "@/pages/project/[uuid]/tabs/LatestImagesSection";
import TagSubmission, { TagSubmissionState } from "@/redesignComponents/actions/Tags/TagSubmission/TagSubmission";
import { ChevronRightIcon } from "@/redesignComponents/foundations/Icons";
import { mapStatusToTagStateEntity } from "@/utils/mapStatusToTagStateEntity";

/** Fixed height of the map row. The map fills it on the left; the right column stacks the Actions
 * panel over the indicator panel within the same height. Set inline (not via a Tailwind arbitrary
 * class) so the Mapbox canvas is bounded and cannot overflow into the section below. */
const DRILLDOWN_ROW_HEIGHT = "34rem";

interface SiteOverviewTabProps {
  site: SiteFullDto;
  refetch?: () => void;
}

const SiteOverviewTab = ({ site }: SiteOverviewTabProps) => {
  const t = useT();
  const contextMapArea = useMapAreaContext();
  const [openStatusModal, setOpenStatusModal] = useState(false);
  const { setSiteData, resetSiteMapInteractionState } = contextMapArea;

  useEffect(() => {
    resetSiteMapInteractionState();
  }, [resetSiteMapInteractionState]);
  const [isSiteSetupComplete, setIsSiteSetupComplete] = useState(false);
  const isMobile = useBreakpointValue({ base: true, md: false });

  const { handleEdit, EditModals } = useGetEditEntityHandler({
    entityName: "sites",
    entityUUID: site.uuid,
    entityStatus: site.status ?? "draft",
    updateRequestStatus: site.updateRequestStatus
  });

  const { data: sitePolygonDataV3, refetch: refetchV3 } = useAllSitePolygons({
    entityName: "sites",
    entityUuid: site.uuid,
    enabled: !!site.uuid
  });
  const reload = () => {
    refetchV3();
  };
  useEffect(() => {
    setSiteData(site);
  }, [setSiteData, site]);

  // The site belongs to a project; the map and Actions deep-links route through it. Empty string
  // when a site has no project keeps the drill-down hooks disabled rather than firing bad requests.
  const projectUuid = site.projectUuid ?? "";

  // Rollup + geometry + aggregate, shared by the map (left) and the KPI panel (right) so both show
  // the same site figures — the site analogue of the project Overview's drill-down.
  const drilldown = useSiteDrilldown(projectUuid, site.uuid);

  const goToTab = (tab: string) => {
    router.push({ pathname: router.pathname, query: { ...router.query, tab: tab } }, undefined, {
      shallow: true
    });
  };

  const needMoreInformation = site.updateRequestStatus === INFORMATION_REQUIRED || site.status === INFORMATION_REQUIRED;
  const awaitingApproval = site.updateRequestStatus === PENDING_APPROVAL || site.status === PENDING_APPROVAL;
  const statusProps = useMemo(() => getStatusProps(t, site, site.status!), [t, site]);

  const handleEditClick = useCallback(() => {
    if (needMoreInformation && !awaitingApproval) {
      setOpenStatusModal(true);
    } else {
      handleEdit();
    }
  }, [needMoreInformation, handleEdit, awaitingApproval]);

  return (
    <SitePolygonDataProvider sitePolygonData={sitePolygonDataV3} reloadSiteData={reload}>
      <EntityStatusModal
        statusProps={statusProps!}
        feedback={site.feedback}
        needMoreInformation={needMoreInformation}
        entityName="sites"
        entityUuid={site.uuid}
        open={openStatusModal}
        onOpenChange={setOpenStatusModal}
      />
      <PageContent>
        {EditModals}
        {/* Above the fold: this site's polygons on the left, and a right column stacking the anomaly
            work-queue over the aggregated indicators. Everything lives inside one PageItem with a
            fixed row height, so no section can overflow into another — the Mapbox canvas is bounded
            and clipped, and the indicator panel scrolls within its share of the column. The row
            height is an inline style, not a Tailwind arbitrary height: those did not survive this
            project's build. */}
        <PageItem
          title={t("Site Data")}
          flexProps={{ width: "100%" }}
          buttonProps={{
            variant: "secondary",
            size: "small",
            children: t("View site map"),
            rightIcon: <ChevronRightIcon />,
            onClick: () => goToTab("polygons")
          }}
        >
          <Flex gap={5} className="w-full flex-col ws-1100:flex-row" style={{ minHeight: DRILLDOWN_ROW_HEIGHT }}>
            <Box className="relative w-full flex-1 overflow-hidden rounded-lg" style={{ height: DRILLDOWN_ROW_HEIGHT }}>
              <SiteMap drilldown={drilldown} projectUuid={projectUuid} />
            </Box>
            <Flex
              className="w-full shrink-0 flex-col ws-1100:w-[26rem]"
              gap={4}
              style={{ height: DRILLDOWN_ROW_HEIGHT }}
            >
              <Box className="shrink-0">
                <SiteActionsPanel projectUuid={projectUuid} siteUuid={site.uuid} />
              </Box>
              {/* Indicators fill the rest of the column and scroll internally, so a long polygon
                  list never pushes the column past the map's height. */}
              <Box className="min-h-0 flex-1 overflow-hidden">
                <SiteKpiPanel drilldown={drilldown} siteName={site.name ?? t("Site")} projectUuid={projectUuid} />
              </Box>
            </Flex>
          </Flex>
        </PageItem>
        {/* Sites Set Up, demoted below the fold: it is a setup/editing flow, not day-to-day data. */}
        <PageItem
          flexProps={{ paddingY: 2, width: "100%" }}
          title={t("Sites Set Up")}
          tag={(() => {
            const tagState = mapStatusToTagStateEntity(site?.status);
            return site.updateRequestStatus === "pending-approval" ? (
              <TagSubmission state="pending-approval" />
            ) : site?.status != null ? (
              <TagSubmission state={tagState?.type as TagSubmissionState} />
            ) : null;
          })()}
          buttonProps={{
            variant: "primary",
            size: "small",
            children: isSiteSetupComplete ? t("Edit") : t("Continue"),
            rightIcon: <ChevronRightIcon boxSize={4} />,
            onClick: () => handleEditClick()
          }}
        >
          <Box backgroundColor="neutral.100" padding={5} borderRadius={1}>
            <EntitySetUpSection onStatusChange={setIsSiteSetupComplete} entity={site} type="sites" />
          </Box>
        </PageItem>
        <Flex gap={7} paddingY={2} className="max-h-full flex-col sm:max-h-[39.625rem] sm:flex-row">
          <PageItem
            title={t("Latest Images")}
            flexProps={{ flex: 1 }}
            buttonProps={{
              variant: "secondary",
              size: "small",
              children: t("View Gallery"),
              rightIcon: <ChevronRightIcon />,
              onClick: () => goToTab("gallery")
            }}
          >
            <LatestImagesSectionTab entityUuid={site.uuid} entityName="sites" columns={isMobile ? 2 : 4} rows={1} />
          </PageItem>
          <AboutPageItem type="site" />
        </Flex>
      </PageContent>
    </SitePolygonDataProvider>
  );
};

export default SiteOverviewTab;

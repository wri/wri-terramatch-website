import { Box, Flex, useBreakpointValue } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import router from "next/router";
import { useCallback, useEffect, useState } from "react";

import OverviewMapArea from "@/components/elements/Map-mapbox/components/OverviewMapArea";
import StatusTag from "@/components/elements/StatusTag/StatusTag";
import EntityInformationRequiredModal from "@/components/extensive/EntityInformationRequiredModal";
import AboutPageItem from "@/components/extensive/PageElements/AboutPageItem/AboutPageItem";
import MapPlaceholder from "@/components/extensive/PageElements/MapPlaceholder/MapPlaceholder";
import PageContent from "@/components/extensive/PageElements/PageContent/PageContent";
import PageItem from "@/components/extensive/PageElements/PageItem/PageItem";
import { useAllSitePolygons } from "@/connections/SitePolygons";
import { INFORMATION_REQUIRED, PENDING_APPROVAL } from "@/constants/statuses";
import { useMapAreaContext } from "@/context/mapArea.provider";
import { SitePolygonDataProvider } from "@/context/sitePolygon.provider";
import { SiteFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { useGetEditEntityHandler } from "@/hooks/entity/useGetEditEntityHandler";
import EntitySetUpSection from "@/pages/project/[uuid]/tabs/EntitySetUpSection";
import LatestImagesSectionTab from "@/pages/project/[uuid]/tabs/LatestImagesSection";
import TagSubmission from "@/redesignComponents/actions/Tags/TagSubmission/TagSubmission";
import { ChevronRightIcon, SiteIcon } from "@/redesignComponents/foundations/Icons";

import { SITE_POLYGON_MAP_INITIAL_HEIGHT } from "../constants/sitePolygonMapSizing";
import KeyIndicatorsInsightsTab from "./KeyIndicatorsInsights";

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
    updateRequestStatus: site.updateRequestStatus,
    useInformationRequiredModal: true
  });

  const {
    data: sitePolygonDataV3,
    isLoading: isLoadingSitePolygons,
    refetch: refetchV3
  } = useAllSitePolygons({
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

  const goToTab = (tab: string) => {
    router.push({ pathname: router.pathname, query: { ...router.query, tab: tab } }, undefined, {
      shallow: true
    });
  };

  const needMoreInformation = site.updateRequestStatus === INFORMATION_REQUIRED || site.status === INFORMATION_REQUIRED;
  const awaitingApproval = site.updateRequestStatus === PENDING_APPROVAL || site.status === PENDING_APPROVAL;

  const handleEditClick = useCallback(() => {
    if (needMoreInformation && !awaitingApproval) {
      setOpenStatusModal(true);
    } else {
      handleEdit();
    }
  }, [needMoreInformation, handleEdit, awaitingApproval]);

  return (
    <SitePolygonDataProvider sitePolygonData={sitePolygonDataV3} reloadSiteData={reload}>
      <EntityInformationRequiredModal
        feedback={site.feedback}
        entityName="sites"
        entityUuid={site.uuid}
        open={openStatusModal}
        onOpenChange={setOpenStatusModal}
      />
      <PageContent>
        {EditModals}
        <Flex gap={7} className="flex-col sm:flex-row">
          <Flex className="flex-[2] flex-col gap-7 mobile:flex-[1]">
            <PageItem
              title={t("Key Indicators & Insights")}
              flexProps={{ paddingY: 2, width: "100%" }}
              buttonProps={{
                variant: "secondary",
                size: "small",
                children: t("View Progress & Goals"),
                rightIcon: <ChevronRightIcon />,
                onClick: () => goToTab("goals")
              }}
            >
              <Flex gap={4}>
                <KeyIndicatorsInsightsTab site={site} />
              </Flex>
            </PageItem>
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
          </Flex>
          <PageItem
            flexProps={{ width: "fit-content", overflow: "hidden" }}
            className="!w-full !max-w-full flex-[1] sm:!w-[30%] sm:!max-w-[30%]"
            title={t("Sites Set Up")}
            classNameRightSectionHeader="mobile:!w-fit"
            tag={
              site.updateRequestStatus === PENDING_APPROVAL ? (
                <TagSubmission state="pending-approval" />
              ) : (
                <StatusTag status={site?.status} />
              )
            }
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
        </Flex>
        <Flex gap={7} paddingY={2} className="max-h-full flex-col sm:max-h-[39.625rem] sm:flex-row">
          <PageItem
            title={t("Site Map")}
            flexProps={{ flex: 1 }}
            className="min-h-0"
            buttonProps={{
              variant: "secondary",
              size: "small",
              children: t("View site map"),
              rightIcon: <ChevronRightIcon />,
              onClick: () => goToTab("polygons")
            }}
          >
            <Box className="relative flex-1 overflow-hidden rounded" minH={SITE_POLYGON_MAP_INITIAL_HEIGHT}>
              <OverviewMapArea
                entityModel={site}
                type="sites"
                className="h-full min-h-0 rounded"
                disabledPolygonPanel={true}
                hideFullscreenControl={true}
                overviewPolygonPopup={true}
              />
              {!isLoadingSitePolygons && (sitePolygonDataV3?.length ?? 0) === 0 && (
                <MapPlaceholder
                  icon={<SiteIcon boxSize={6} color="neutral.100" />}
                  title={t("Project Site not defined")}
                  buttonGroupProps={{
                    buttons: [
                      {
                        id: "add-polygons",
                        variant: "borderless",
                        size: "small",
                        rightIcon: <ChevronRightIcon boxSize={4} />,
                        className: "!text-theme-neutral-100",
                        children: t("Add Polygons"),
                        onClick: () => goToTab("polygons")
                      }
                    ]
                  }}
                  className="z-10"
                />
              )}
            </Box>
          </PageItem>
          <AboutPageItem type="site" />
        </Flex>
      </PageContent>
    </SitePolygonDataProvider>
  );
};

export default SiteOverviewTab;

import { Box, Flex, Text, useBreakpointValue } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import router from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";

import OverviewMapArea from "@/components/elements/Map-mapbox/components/OverviewMapArea";
import { getStatusProps } from "@/components/extensive/EntityStatusBar";
import EntityStatusModal from "@/components/extensive/EntityStatusModal";
import { ModalId } from "@/components/extensive/Modal/ModalConst";
import About from "@/components/extensive/PageElements/About/About";
import MapPlaceholder from "@/components/extensive/PageElements/MapPlaceholder/MapPlaceholder";
import PageContent from "@/components/extensive/PageElements/PageContent/PageContent";
import PageItem from "@/components/extensive/PageElements/PageItem/PageItem";
import { useAllSitePolygons } from "@/connections/SitePolygons";
import { ABOUT_SITES_CONTENT } from "@/constants/AboutSites.constants";
import { AWAITING_APPROVAL, NEEDS_MORE_INFORMATION } from "@/constants/statuses";
import { useMapAreaContext } from "@/context/mapArea.provider";
import { useModalContext } from "@/context/modal.provider";
import { SitePolygonDataProvider } from "@/context/sitePolygon.provider";
import { SiteFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { useGetEditEntityHandler } from "@/hooks/entity/useGetEditEntityHandler";
import EntitySetUpSection from "@/pages/project/[uuid]/tabs/EntitySetUpSection";
import LatestImagesSectionTab from "@/pages/project/[uuid]/tabs/LatestImagesSection";
import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import TagSubmission from "@/redesignComponents/actions/Tags/TagSubmission/TagSubmission";
import { TagSubmissionState } from "@/redesignComponents/actions/Tags/TagSubmission/TagSubmission";
import { AreaHectaresIcon, ChevronRightIcon } from "@/redesignComponents/foundations/Icons";
import { mapStatusToTagStateEntity } from "@/utils/mapStatusToTagStateEntity";

import KeyIndicatorsInsightsTab from "./KeyIndicatorsInsights";
interface SiteOverviewTabProps {
  site: SiteFullDto;
  refetch?: () => void;
}

const SiteOverviewTab = ({ site }: SiteOverviewTabProps) => {
  const t = useT();
  const contextMapArea = useMapAreaContext();
  const { openModal } = useModalContext();

  const { setSiteData, resetSiteMapInteractionState } = contextMapArea;

  useEffect(() => {
    resetSiteMapInteractionState();
  }, [resetSiteMapInteractionState]);
  const [isSiteSetupComplete, setIsSiteSetupComplete] = useState(false);
  const isMobile = useBreakpointValue({ base: true, md: false });

  const { handleEdit } = useGetEditEntityHandler({
    entityName: "sites",
    entityUUID: site.uuid,
    entityStatus: site.status ?? "started",
    updateRequestStatus: site.updateRequestStatus ?? "no-update"
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

  const aboutSitesContentItem = useMemo(() => {
    return ABOUT_SITES_CONTENT.find(content => content.frameworks.includes(site.frameworkKey!));
  }, [site.frameworkKey]);

  const needMoreInformation =
    site.updateRequestStatus === NEEDS_MORE_INFORMATION || site.status === NEEDS_MORE_INFORMATION;
  const awaitingApproval = site.updateRequestStatus === AWAITING_APPROVAL || site.status === AWAITING_APPROVAL;
  const statusProps = useMemo(() => getStatusProps(t, site, site.status!), [t, site]);

  const handleEditClick = useCallback(() => {
    if (needMoreInformation && !awaitingApproval) {
      openModal(
        ModalId.STATUS,
        <EntityStatusModal
          statusProps={statusProps!}
          feedback={site.feedback}
          needMoreInformation={needMoreInformation}
          entityName="sites"
          entityUuid={site.uuid}
        />
      );
    } else {
      handleEdit();
    }
  }, [needMoreInformation, statusProps, openModal, site.feedback, site.uuid, handleEdit, awaitingApproval]);

  return (
    <SitePolygonDataProvider sitePolygonData={sitePolygonDataV3} reloadSiteData={reload}>
      <PageContent>
        <Flex gap={7} className="flex-col sm:flex-row">
          <PageItem
            title={t("Site Map")}
            flexProps={{ flex: 1 }}
            buttonProps={{
              variant: "secondary",
              size: "small",
              children: t("View site map"),
              rightIcon: <ChevronRightIcon />,
              onClick: () => goToTab("map")
            }}
          >
            <Box className="relative h-auto">
              <OverviewMapArea entityModel={site} type="sites" className="max-h-[432px]" disabledPolygonPanel={true} />
              {!isLoadingSitePolygons && (sitePolygonDataV3?.length ?? 0) === 0 && (
                <MapPlaceholder
                  icon={<AreaHectaresIcon boxSize={6} color="neutral.100" />}
                  title={t("Site Areas not defined yet.")}
                  buttonGroupProps={{
                    buttons: [
                      {
                        variant: "borderless",
                        size: "small",
                        rightIcon: <ChevronRightIcon boxSize={4} />,
                        className: "!text-theme-neutral-100",
                        children: t("Add Polygons"),
                        onClick: () => goToTab("map")
                      }
                    ]
                  }}
                  className="z-10"
                />
              )}
            </Box>
          </PageItem>
          <PageItem
            flexProps={{ width: "fit-content", overflow: "hidden" }}
            className="!w-full !max-w-full sm:!w-[30%] sm:!max-w-[30%]"
            title={t("Sites Set Up")}
            classNameRightSectionHeader="mobile:!w-fit"
            tag={(() => {
              const tagState = mapStatusToTagStateEntity(site?.status);
              return site.updateRequestStatus === "awaiting-approval" ? (
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
        </Flex>
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
        <Flex gap={7} paddingY={2} className="max-h-full flex-col sm:max-h-[570px] sm:flex-row">
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
            <LatestImagesSectionTab entityUuid={site.uuid} entityName="sites" columns={isMobile ? 2 : 3} />
          </PageItem>
          <PageItem title={t(aboutSitesContentItem?.title!)}>
            <About
              description={
                <Flex direction="column" gap={5}>
                  <Text color="neutral.900" textStyle="300">
                    <strong>{t("Sites")} </strong>
                    {t(aboutSitesContentItem?.paragraph1!)}
                  </Text>
                  <Text color="neutral.900" textStyle="300">
                    {t(aboutSitesContentItem?.paragraph2!)}
                    <Button variant="borderless" size="small" rightIcon={<ChevronRightIcon />} as="span">
                      info@terramatch.org
                    </Button>
                  </Text>
                </Flex>
              }
              links={
                aboutSitesContentItem?.links.map(link => ({
                  title: t(link.title),
                  link: link.link
                })) ?? []
              }
            />
          </PageItem>
        </Flex>
      </PageContent>
    </SitePolygonDataProvider>
  );
};

export default SiteOverviewTab;

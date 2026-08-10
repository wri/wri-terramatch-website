import { Box, Flex } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { useRouter } from "next/router";
import { useCallback, useMemo, useState } from "react";

import { downloadProjectSitePolygonsGeoJson } from "@/components/elements/Map-mapbox/utils";
import { getStatusProps } from "@/components/extensive/EntityStatusBar";
import EntityStatusModal from "@/components/extensive/EntityStatusModal";
import AboutPageItem from "@/components/extensive/PageElements/AboutPageItem/AboutPageItem";
import { MapPlaceholder } from "@/components/extensive/PageElements/MapPlaceholder/MapPlaceholder";
import PageContent from "@/components/extensive/PageElements/PageContent/PageContent";
import PageItem from "@/components/extensive/PageElements/PageItem/PageItem";
import SemanticZoomBreadcrumb from "@/components/semanticZoom/SemanticZoomBreadcrumb";
import SemanticZoomMap from "@/components/semanticZoom/SemanticZoomMap";
import SemanticZoomPanel from "@/components/semanticZoom/SemanticZoomPanel";
import { useSemanticZoom } from "@/components/semanticZoom/useSemanticZoom";
import { useAllSitePolygons } from "@/connections/SitePolygons";
import { useUserAssociations } from "@/connections/UserAssociation";
import { AWAITING_APPROVAL, NEEDS_MORE_INFORMATION } from "@/constants/statuses";
import { shouldHideNurseries, useFrameworkContext } from "@/context/framework.provider";
import { ProjectFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { useGetEditEntityHandler } from "@/hooks/entity/useGetEditEntityHandler";
import { SITE_POLYGON_MAP_INITIAL_HEIGHT } from "@/pages/site/[uuid]/constants/sitePolygonMapSizing";
import type { ButtonGroupButtonProps } from "@/redesignComponents/actions/Buttons/ButtonGroup/ButtonGroup";
import TagSubmission, { TagSubmissionState } from "@/redesignComponents/actions/Tags/TagSubmission/TagSubmission";
import ProfileListCard from "@/redesignComponents/content/ContentCard/ProfileListCard/ProfileListCard";
import { ChevronRightIcon, DownloadIcon, SiteIcon } from "@/redesignComponents/foundations/Icons";
import Log from "@/utils/log";
import { mapStatusToTagStateEntity } from "@/utils/mapStatusToTagStateEntity";

import InviteMonitoringPartnerModal from "../components/InviteMonitoringPartnerModal";
import EntitySetUpSection from "./EntitySetUpSection";
import KeyIndicatorsInsightsTab from "./KeyIndicatorsInsights";
import LatestImagesSectionTab from "./LatestImagesSection";

/** Height of the map-and-panel row. Taller than the map's own minimum so the panel has room. */
const DRILLDOWN_ROW_HEIGHT = "30rem";

interface ProjectOverviewTabProps {
  project: ProjectFullDto;
  onViewSites?: () => void;
}

const ProjectOverviewTab = ({ project, onViewSites }: ProjectOverviewTabProps) => {
  const router = useRouter();
  const t = useT();
  const { framework } = useFrameworkContext();
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isProjectSetupComplete, setIsProjectSetupComplete] = useState(false);
  const [openStatusModal, setOpenStatusModal] = useState(false);
  const { handleEdit, EditModals } = useGetEditEntityHandler({
    entityName: "projects",
    entityUUID: project.uuid,
    entityStatus: project.status ?? "started",
    updateRequestStatus: project.updateRequestStatus ?? "no-update"
  });

  const [, { data: associatedUsers }] = useUserAssociations({
    uuid: project.uuid,
    model: "projects"
  });

  const monitoringPartners = useMemo(() => {
    return associatedUsers
      ?.filter(user => user.roleName === "project-developer")
      ?.slice(0, 3)
      .map(user => ({
        id: user.uuid,
        name: user.fullName
        //TODO: replace with actual image once it is implemented
      }));
  }, [associatedUsers]);
  const projectManagers = useMemo(() => {
    return associatedUsers
      ?.filter(user => user.roleName === "project-manager")
      .map(user => ({
        id: user.uuid,
        name: user.fullName
        //TODO: replace with actual image once it is implemented
      }));
  }, [associatedUsers]);
  const needMoreInformation =
    project.updateRequestStatus === NEEDS_MORE_INFORMATION || project.status === NEEDS_MORE_INFORMATION;
  const awaitingApproval = project.updateRequestStatus === AWAITING_APPROVAL || project.status === AWAITING_APPROVAL;
  const statusProps = useMemo(() => getStatusProps(t, project, project.status!), [t, project]);
  const handleEditClick = useCallback(() => {
    if (needMoreInformation && !awaitingApproval) {
      setOpenStatusModal(true);
    } else {
      handleEdit();
    }
  }, [handleEdit, needMoreInformation, awaitingApproval]);

  const goToTab = useCallback(
    (tab: string) => {
      router.push({ pathname: router.pathname, query: { ...router.query, tab: tab } }, undefined, {
        shallow: true
      });
    },
    [router]
  );

  const handleInviteClick = useCallback(() => {
    setShowInviteModal(true);
  }, []);

  const handleDownloadPolygons = async () => {
    if (!project?.uuid || !project?.name) return;

    setIsDownloading(true);
    try {
      await downloadProjectSitePolygonsGeoJson(project.uuid, project.name, {
        includeExtendedData: true
      });
    } catch (error) {
      Log.error("Failed to download project polygons:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  const hideNurseries = shouldHideNurseries(framework);

  const addSitesAndNurseriesButtons = useMemo<ButtonGroupButtonProps[]>(() => {
    const buttons: ButtonGroupButtonProps[] = [
      {
        id: "add-sites",
        variant: "borderless",
        size: "small",
        rightIcon: <ChevronRightIcon boxSize={4} />,
        className: "!text-theme-neutral-100",
        children: t("Add Sites"),
        onClick: () => goToTab("sites")
      }
    ];

    if (!hideNurseries) {
      buttons.push({
        id: "add-nurseries",
        variant: "borderless",
        size: "small",
        rightIcon: <ChevronRightIcon boxSize={4} />,
        className: "!text-theme-neutral-100",
        children: t("Add Nurseries"),
        onClick: () => goToTab("nurseries")
      });
    }

    return buttons;
  }, [goToTab, hideNurseries, t]);

  const { data: projectPolygonDataV3, isLoading: isLoadingProjectPolygons } = useAllSitePolygons({
    entityName: "projects",
    entityUuid: project.uuid,
    enabled: project.uuid != null
  });

  // The Project -> Site -> Polygon descent. The hook is held here rather than inside either card
  // because the map and the indicator panel are two separate PageItems on this tab, and they have
  // to be showing the same level as each other.
  const zoom = useSemanticZoom({
    projectUuid: project.uuid,
    projectName: project.name ?? t("Project"),
    claims: { hectares: project.totalHectaresRestoredSum ?? null, trees: project.treesPlantedCount ?? null },
    goals: { hectares: project.totalHectaresRestoredGoal ?? null, trees: project.treesGrownGoal ?? null }
  });

  const isDraftOrPendingApproval = project.status === "started" || awaitingApproval;

  const showSiteAreasMapPlaceholder =
    !isLoadingProjectPolygons && (projectPolygonDataV3?.length ?? 0) === 0 && isDraftOrPendingApproval;

  const teamMemberItems = useMemo(
    () => [
      {
        title: t("Project Managers"),
        profiles: projectManagers,
        onProfileClick: () => {},
        type: "project-manager"
      },
      {
        title: t("Monitoring Partners"),
        profiles: monitoringPartners,
        onProfileClick: () => {},
        type: "monitoring-partner"
      }
    ],
    [monitoringPartners, projectManagers, t]
  );

  return (
    <PageContent>
      {EditModals}
      <EntityStatusModal
        statusProps={statusProps!}
        feedback={project.feedback}
        needMoreInformation={needMoreInformation}
        entityName="projects"
        entityUuid={project.uuid}
        open={openStatusModal}
        onOpenChange={setOpenStatusModal}
      />
      <InviteMonitoringPartnerModal
        projectUUID={project.uuid}
        open={showInviteModal}
        onClose={() => setShowInviteModal(false)}
      />
      {/* Map and indicators share one full-width card. They were briefly split across two rows;
          descending then moved the map but left the numbers below the fold, so a click on a site
          looked like it had done nothing. The whole point of the zoom is that both change at once. */}
      <Flex gap={7} className="flex-col sm:flex-row sm:items-stretch">
        <PageItem
          title={t("Project Map")}
          flexProps={{ flex: 1, width: "100%" }}
          className="min-h-0"
          buttonProps={{
            variant: "secondary",
            size: "small",
            children: t("View Sites"),
            rightIcon: <ChevronRightIcon />,
            onClick: onViewSites ?? (() => goToTab("sites"))
          }}
          downloadButtonProps={{
            variant: "secondary",
            size: "small",
            children: t("Download Project Polygons"),
            leftIcon: <DownloadIcon />,
            onClick: handleDownloadPolygons,
            loading: isDownloading
          }}
        >
          <Box className="flex min-h-0 flex-1 flex-col gap-2">
            <SemanticZoomBreadcrumb zoom={zoom} />
            {/* The row height is a Chakra prop, not a Tailwind class, and it has to hold. The
                panel's child list runs to 100 rows; an unbounded row stretches to fit it and drags
                the map canvas along — 1,200 x 4,000px, with every polygon scrolled far below the
                visible slice, which reads as "the map is broken". A `ws-1100:h-[30rem]` did exactly
                that, because that variant does not survive this project's build. */}
            <Flex className="flex-col gap-4 sm:flex-row" h={{ base: "auto", sm: DRILLDOWN_ROW_HEIGHT }}>
              <Box className="relative flex-1 overflow-hidden rounded" minH={SITE_POLYGON_MAP_INITIAL_HEIGHT}>
                <SemanticZoomMap zoom={zoom} />
                {showSiteAreasMapPlaceholder && (
                  <MapPlaceholder
                    icon={<SiteIcon boxSize={6} color="neutral.100" />}
                    title={t("Project Sites not defined")}
                    className="z-10 bg-map-project-placeholder"
                    buttonGroupProps={{ buttons: addSitesAndNurseriesButtons }}
                  />
                )}
              </Box>
              <Box className="w-full shrink-0 sm:w-[25rem]" h={{ base: DRILLDOWN_ROW_HEIGHT, sm: "100%" }} minH={0}>
                <SemanticZoomPanel zoom={zoom} />
              </Box>
            </Flex>
          </Box>
        </PageItem>
      </Flex>
      <Flex gap={7} paddingY={2} className="flex-col sm:flex-row sm:items-stretch">
        <PageItem
          flexProps={{ width: "fit-content", overflow: "hidden" }}
          className="!w-full !max-w-full sm:!w-[35%] sm:!max-w-[35%] lg:!w-[30%] lg:!max-w-[30%]"
          title={t("Project Set Up")}
          tag={(() => {
            const tagState = mapStatusToTagStateEntity(project?.status);
            return project.updateRequestStatus === "awaiting-approval" ? (
              <TagSubmission state="pending-approval" />
            ) : project?.status != null ? (
              <TagSubmission state={tagState?.type as TagSubmissionState} />
            ) : null;
          })()}
          buttonProps={{
            variant: "primary",
            size: "small",
            children: isProjectSetupComplete ? t("Edit") : t("Continue"),
            rightIcon: <ChevronRightIcon />,
            onClick: handleEditClick
          }}
        >
          <Box backgroundColor="neutral.100" padding={5} borderRadius={1}>
            <EntitySetUpSection onStatusChange={setIsProjectSetupComplete} entity={project} type="projects" />
          </Box>
        </PageItem>
        <PageItem
          title={t("Key Indicators & Insights")}
          flexProps={{ flex: 1 }}
          buttonProps={{
            variant: "secondary",
            size: "small",
            children: t("View Progress & Goals"),
            rightIcon: <ChevronRightIcon />,
            onClick: () => goToTab("goals")
          }}
        >
          <KeyIndicatorsInsightsTab project={project} />
        </PageItem>
      </Flex>
      <Flex gap={7} paddingY={2} className="max-h-full flex-col sm:max-h-[39.625rem] sm:flex-row">
        <PageItem
          flexProps={{ flex: 1 }}
          title={t("Team Members")}
          buttonProps={{
            variant: "secondary",
            size: "small",
            children: t("Manage Team"),
            rightIcon: <ChevronRightIcon />,
            onClick: () => goToTab("team-members")
          }}
        >
          <ProfileListCard items={teamMemberItems} onInviteClick={handleInviteClick} />
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
          <LatestImagesSectionTab entityUuid={project.uuid} entityName="projects" />
        </PageItem>
        <AboutPageItem type="project" />
      </Flex>
    </PageContent>
  );
};

export default ProjectOverviewTab;

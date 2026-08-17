import { Box, Flex } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { useRouter } from "next/router";
import { useCallback, useMemo, useState } from "react";

import { downloadProjectSitePolygonsGeoJson } from "@/components/elements/Map-mapbox/utils";
import EntityActionsPanel from "@/components/entityData/EntityActionsPanel";
import EntityDataView from "@/components/entityData/EntityDataView";
import EntityKpiPanel from "@/components/entityData/EntityKpiPanel";
import EntityMap from "@/components/entityData/EntityMap";
import { useEntityDrilldown } from "@/components/entityData/useEntityDrilldown";
import { getStatusProps } from "@/components/extensive/EntityStatusBar";
import EntityStatusModal from "@/components/extensive/EntityStatusModal";
import AboutPageItem from "@/components/extensive/PageElements/AboutPageItem/AboutPageItem";
import PageContent from "@/components/extensive/PageElements/PageContent/PageContent";
import PageItem from "@/components/extensive/PageElements/PageItem/PageItem";
import { useUserAssociations } from "@/connections/UserAssociation";
import { INFORMATION_REQUIRED, PENDING_APPROVAL } from "@/constants/statuses";
import { ProjectFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { useGetEditEntityHandler } from "@/hooks/entity/useGetEditEntityHandler";
import TagSubmission, { TagSubmissionState } from "@/redesignComponents/actions/Tags/TagSubmission/TagSubmission";
import ProfileListCard from "@/redesignComponents/content/ContentCard/ProfileListCard/ProfileListCard";
import { ChevronRightIcon, DownloadIcon } from "@/redesignComponents/foundations/Icons";
import Log from "@/utils/log";
import { mapStatusToTagStateEntity } from "@/utils/mapStatusToTagStateEntity";

import InviteMonitoringPartnerModal from "../components/InviteMonitoringPartnerModal";
import EntitySetUpSection from "./EntitySetUpSection";
import LatestImagesSectionTab from "./LatestImagesSection";

interface ProjectOverviewTabProps {
  project: ProjectFullDto;
  onViewSites?: () => void;
}

const ProjectOverviewTab = ({ project, onViewSites }: ProjectOverviewTabProps) => {
  const router = useRouter();
  const t = useT();
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isProjectSetupComplete, setIsProjectSetupComplete] = useState(false);
  const [openStatusModal, setOpenStatusModal] = useState(false);
  const { handleEdit, EditModals } = useGetEditEntityHandler({
    entityName: "projects",
    entityUUID: project.uuid,
    entityStatus: project.status ?? "draft",
    updateRequestStatus: project.updateRequestStatus
  });

  const [, { data: associatedUsers }] = useUserAssociations({
    uuid: project.uuid,
    model: "projects"
  });

  // Rollup + centroids + aggregate, shared by the map and the KPI panel so both show the same
  // project figures.
  const drilldown = useEntityDrilldown({ level: "project", projectUuid: project.uuid });

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
    project.updateRequestStatus === INFORMATION_REQUIRED || project.status === INFORMATION_REQUIRED;
  const awaitingApproval = project.updateRequestStatus === PENDING_APPROVAL || project.status === PENDING_APPROVAL;
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
      {/* Above the fold: the map on the left, and a right column stacking the anomaly work-queue over
          the aggregated indicators. Everything lives inside one PageItem with a fixed row height, so
          no section can overflow into another — the map's Mapbox canvas is bounded and clipped, and
          the indicator panel scrolls within its share of the column. The row height is an inline
          style, not a Tailwind arbitrary height: those did not survive this project's build. */}
      <PageItem
        title={t("Project Data")}
        flexProps={{ width: "100%" }}
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
        <EntityDataView
          map={<EntityMap drilldown={drilldown} projectUuid={project.uuid} />}
          actions={<EntityActionsPanel level="project" projectUuid={project.uuid} project={project} />}
          kpis={
            <EntityKpiPanel drilldown={drilldown} title={project.name ?? t("Project")} projectUuid={project.uuid} />
          }
        />
      </PageItem>
      {/* Project Set Up, demoted below the fold: it is a setup/editing flow, not day-to-day data. */}
      <PageItem
        flexProps={{ paddingY: 2, width: "100%" }}
        title={t("Project Set Up")}
        tag={(() => {
          const tagState = mapStatusToTagStateEntity(project?.status);
          return project.updateRequestStatus === "pending-approval" ? (
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

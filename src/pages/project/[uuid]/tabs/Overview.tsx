import { Box, Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { useRouter } from "next/router";
import { useCallback, useMemo, useState } from "react";

import OverviewMapArea from "@/components/elements/Map-mapbox/components/OverviewMapArea";
import { downloadProjectSitePolygonsGeoJson } from "@/components/elements/Map-mapbox/utils";
import { getStatusProps } from "@/components/extensive/EntityStatusBar";
import EntityStatusModal from "@/components/extensive/EntityStatusModal";
import { ModalId } from "@/components/extensive/Modal/ModalConst";
import About from "@/components/extensive/PageElements/About/About";
import { MapPlaceholder } from "@/components/extensive/PageElements/MapPlaceholder/MapPlaceholder";
import PageContent from "@/components/extensive/PageElements/PageContent/PageContent";
import PageItem from "@/components/extensive/PageElements/PageItem/PageItem";
import { useAllSitePolygons } from "@/connections/SitePolygons";
import { useUserAssociations } from "@/connections/UserAssociation";
import { AWAITING_APPROVAL, NEEDS_MORE_INFORMATION } from "@/constants/statuses";
import { Framework, useFrameworkContext } from "@/context/framework.provider";
import { useModalContext } from "@/context/modal.provider";
import { ProjectFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { useGetEditEntityHandler } from "@/hooks/entity/useGetEditEntityHandler";
import Button, { IButtonProps } from "@/redesignComponents/actions/Buttons/Button/Button";
import TagSubmission from "@/redesignComponents/actions/Tags/TagSubmission/TagSubmission";
import { TagSubmissionState } from "@/redesignComponents/actions/Tags/TagSubmission/TagSubmission";
import ProfileListCard from "@/redesignComponents/content/ContentCard/ProfileListCard/ProfileListCard";
import { ChevronRightIcon, DownloadIcon, SiteIcon } from "@/redesignComponents/foundations/Icons";
import Log from "@/utils/log";
import { mapStatusToTagStateEntity } from "@/utils/mapStatusToTagStateEntity";

import InviteMonitoringPartnerModal from "../components/InviteMonitoringPartnerModal";
import { useMrvOnboardingContent } from "./constants/mrvOnboardingContent";
import EntitySetUpSection from "./EntitySetUpSection";
import KeyIndicatorsInsightsTab from "./KeyIndicatorsInsights";
import LatestImagesSectionTab from "./LatestImagesSection";

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
  const mrvOnboardingContent = useMrvOnboardingContent();
  const { openModal } = useModalContext();
  const { handleEdit } = useGetEditEntityHandler({
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
      openModal(
        ModalId.STATUS,
        <EntityStatusModal
          statusProps={statusProps!}
          feedback={project.feedback}
          needMoreInformation={needMoreInformation}
          entityName="projects"
          entityUuid={project.uuid}
        />
      );
    } else {
      handleEdit();
    }
  }, [openModal, project.feedback, project.uuid, handleEdit, needMoreInformation, statusProps, awaitingApproval]);

  const goToTab = useCallback(
    (tab: string) => {
      router.push({ pathname: router.pathname, query: { ...router.query, tab: tab } }, undefined, {
        shallow: true
      });
    },
    [router]
  );

  const mrvOnboardingContentItem = useMemo(() => {
    return mrvOnboardingContent.find(content => content.frameworks.includes(project.frameworkKey!));
  }, [project.frameworkKey, mrvOnboardingContent]);

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

  const hasSites = (project.totalSites ?? 0) > 0;
  const hasNurseries = (project.totalNurseries ?? 0) > 0;
  const shouldHideNurseries = framework === Framework.PPC;

  const addSitesAndNurseriesButtons = useMemo<IButtonProps[]>(() => {
    const buttons: IButtonProps[] = [
      {
        variant: "borderless",
        size: "small",
        rightIcon: <ChevronRightIcon boxSize={4} />,
        className: "!text-theme-neutral-100",
        children: t("Add Sites"),
        onClick: () => goToTab("sites")
      }
    ];

    if (!shouldHideNurseries) {
      buttons.push({
        variant: "borderless",
        size: "small",
        rightIcon: <ChevronRightIcon boxSize={4} />,
        className: "!text-theme-neutral-100",
        children: t("Add Nurseries"),
        onClick: () => goToTab("nurseries")
      });
    }

    return buttons;
  }, [goToTab, shouldHideNurseries, t]);

  const { data: projectPolygonDataV3, isLoading: isLoadingProjectPolygons } = useAllSitePolygons({
    entityName: "projects",
    entityUuid: project.uuid,
    enabled: project.uuid != null
  });

  const showSiteAreasMapPlaceholder =
    !isLoadingProjectPolygons &&
    (projectPolygonDataV3?.length ?? 0) === 0 &&
    (!isProjectSetupComplete || (!hasSites && !hasNurseries));

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
      <InviteMonitoringPartnerModal
        projectUUID={project.uuid}
        open={showInviteModal}
        onClose={() => setShowInviteModal(false)}
      />
      <Flex gap={7} className="flex-col sm:flex-row">
        <PageItem
          title={t("Project Map")}
          flexProps={{ flex: 1 }}
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
          <Box className="relative h-auto">
            <OverviewMapArea
              entityModel={project}
              type="projects"
              className="max-h-[432px]"
              disabledPolygonPanel={true}
            />
            {showSiteAreasMapPlaceholder && (
              <MapPlaceholder
                icon={<SiteIcon boxSize={6} color="neutral.100" />}
                title={t("Siting Strategy not defined yet.")}
                className="z-10 bg-map-project-placeholder"
                buttonGroupProps={
                  !isProjectSetupComplete
                    ? {
                        buttons: [
                          {
                            variant: "borderless",
                            size: "small",
                            className: "!text-theme-neutral-100",
                            children: t("Please finish project set-up before adding sites."),
                            onClick: handleEditClick
                          }
                        ]
                      }
                    : !hasSites && !hasNurseries
                    ? {
                        buttons: addSitesAndNurseriesButtons
                      }
                    : undefined
                }
              />
            )}
          </Box>
        </PageItem>
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
        <KeyIndicatorsInsightsTab project={project} />
      </PageItem>
      <Flex gap={7} paddingY={2} className="max-h-full flex-col sm:max-h-[570px] sm:flex-row">
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
        <PageItem title={t("Project Onboarding")}>
          <About
            title={t("Monitoring, Reporting, and Verification (MRV)")}
            description={
              <>
                <Box as="ul" listStyleType="disc" marginInlineStart={3} paddingLeft={4}>
                  <Box as="li">
                    <Text color="neutral.900" textStyle="300">
                      <strong>{t("Monitoring")}:</strong> {t(mrvOnboardingContentItem?.content.monitoring)}
                    </Text>
                  </Box>
                  <Box as="li">
                    <Text color="neutral.900" textStyle="300">
                      <strong>{t("Reporting")}:</strong> {t(mrvOnboardingContentItem?.content.reporting)}
                    </Text>
                  </Box>
                  <Box as="li">
                    <Text color="neutral.900" textStyle="300">
                      <strong>{t("Verification")}:</strong> {t(mrvOnboardingContentItem?.content.verification)}
                    </Text>
                  </Box>
                </Box>
                <Flex alignItems="center" flexWrap="wrap">
                  <Text color="neutral.900" textStyle="300">
                    {t(mrvOnboardingContentItem?.content.mrvLinkPrefix)}
                  </Text>
                  <Button
                    variant="borderless"
                    size="small"
                    className="mobile:max-w-full mobile:truncate"
                    rightIcon={<ChevronRightIcon />}
                    onClick={() => window.open(mrvOnboardingContentItem?.content.mrvFrameworkLink, "_blank")}
                  >
                    {t(mrvOnboardingContentItem?.content.mrvLinkText)}
                  </Button>
                </Flex>
              </>
            }
            links={mrvOnboardingContentItem?.content.helpfulLinks ?? []}
          />
        </PageItem>
      </Flex>
    </PageContent>
  );
};

export default ProjectOverviewTab;

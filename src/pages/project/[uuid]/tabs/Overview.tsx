import { Box, Flex, FlexProps, Text } from "@chakra-ui/react";
import { Divider } from "@mui/material";
import { useT } from "@transifex/react";
import { useRouter } from "next/router";
import { FC, ReactNode, useCallback, useMemo, useState } from "react";

import OverviewMapArea from "@/components/elements/Map-mapbox/components/OverviewMapArea";
import { downloadProjectSitePolygonsGeoJson } from "@/components/elements/Map-mapbox/utils";
import { ModalId } from "@/components/extensive/Modal/ModalConst";
import PageBody from "@/components/extensive/PageElements/Body/PageBody";
import { useUserAssociations } from "@/connections/UserAssociation";
import { useModalContext } from "@/context/modal.provider";
import { ProjectFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { mapStatusToTagStateProject } from "@/helpers/entityFormLinkHeader";
import { IButtonProps } from "@/redesignComponents/actions/Buttons/Button/Button";
import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import FeedbackTag from "@/redesignComponents/actions/Tags/FeedbackTag/FeedbackTag";
import ProfileListCard from "@/redesignComponents/content/ContentCard/ProfileListCard/ProfileListCard";
import { ChevronRightIcon, DownloadIcon } from "@/redesignComponents/foundations/Icons";
import Log from "@/utils/log";

import InviteMonitoringPartnerModal from "../components/InviteMonitoringPartnerModal";
import { MRV_ONBOARDING_CONTENT } from "./constants/mrvOnboardingContent";
import KeyIndicatorsInsightsTab from "./KeyIndicatorsInsights";
import LastestImagesSectionTab from "./LastestImagesSection";
import ProjectSetUpSection from "./ProjectSetUpSection";

interface ProjectOverviewTabProps {
  project: ProjectFullDto;
}

interface OverviewItemProps {
  title: string;
  buttonProps?: IButtonProps;
  downloadButtonProps?: IButtonProps;
  children?: ReactNode;
  flexProps?: FlexProps;
  tag?: ReactNode;
}

const OverviewItem: FC<OverviewItemProps> = ({ title, buttonProps, downloadButtonProps, children, flexProps, tag }) => (
  <Flex direction="column" gap={4} flex={1} {...flexProps}>
    <Flex alignItems="center" justifyContent="space-between">
      <div className="flex items-center gap-2">
        <Text color="primary.900" textStyle="600">
          {title}
        </Text>
        {tag ? tag : null}
      </div>

      <Flex gap={4}>
        {downloadButtonProps ? <Button {...downloadButtonProps} /> : null}
        {buttonProps ? <Button {...buttonProps} /> : null}
      </Flex>
    </Flex>
    {children}
  </Flex>
);

const ProjectOverviewTab = ({ project }: ProjectOverviewTabProps) => {
  const router = useRouter();
  const t = useT();
  const { openModal } = useModalContext();
  const [isDownloading, setIsDownloading] = useState(false);
  const [isProjectSetupComplete, setIsProjectSetupComplete] = useState(false);

  const [, { data: associatedUsers }] = useUserAssociations({
    uuid: project.uuid
  });

  const monitoringPartners = useMemo(() => {
    return associatedUsers
      ?.filter(user => user.roleName === "monitoring-partner")
      ?.slice(0, 3)
      .map((user, index) => ({
        id: user.uuid,
        name: user.fullName,
        image: `https://i.pravatar.cc/300?img=${index}&w=640&q=71`
      }));
  }, [associatedUsers]);
  const projectManagers = useMemo(() => {
    return associatedUsers
      ?.filter(user => user.roleName === "project-manager")
      .map((user, index) => ({
        id: user.uuid,
        name: user.fullName,
        image: `https://i.pravatar.cc/300?img=${index}&w=640&q=71`
      }));
  }, [associatedUsers]);

  const goToContinueEditingTab = () => {
    router.push(`/entity/projects/edit/${project.uuid}`, undefined, {
      shallow: true
    });
  };

  const goToTab = (tab: string) => {
    router.push({ pathname: router.pathname, query: { ...router.query, tab: tab } }, undefined, {
      shallow: true
    });
  };

  const mrvOnboardingContentItem = useMemo(() => {
    return MRV_ONBOARDING_CONTENT.find(content => content.frameworks.includes(project.frameworkKey!));
  }, [project.frameworkKey]);

  const handleInviteClick = useCallback(() => {
    openModal(ModalId.INVITE_MONITORING_PARTNER_MODAL, <InviteMonitoringPartnerModal projectUUID={project.uuid} />);
  }, [openModal, project.uuid]);

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

  return (
    <PageBody className="bg-theme-neutral-200">
      <Flex direction="column" gap={5} paddingX={6} paddingBottom={4}>
        <Flex gap={7}>
          <OverviewItem
            title="Project Map"
            flexProps={{ flex: 3 }}
            buttonProps={{
              variant: "secondary",
              size: "small",
              children: "View Sites",
              rightIcon: <ChevronRightIcon />,
              onClick: () => goToTab("sites")
            }}
            downloadButtonProps={{
              variant: "secondary",
              size: "small",
              children: "Download Project Polygons",
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
            </Box>
          </OverviewItem>
          <OverviewItem
            flexProps={{ flex: 1, overflow: "hidden" }}
            title="Project Set Up"
            tag={
              <FeedbackTag
                type={mapStatusToTagStateProject(project?.status)!.type}
                label={mapStatusToTagStateProject(project?.status)!.label}
              />
            }
            buttonProps={{
              variant: "primary",
              size: "small",
              children: isProjectSetupComplete ? "Edit" : "Continue",
              rightIcon: <ChevronRightIcon />,
              onClick: goToContinueEditingTab
            }}
          >
            <Box backgroundColor="neutral.100" padding={5} borderRadius={1}>
              <ProjectSetUpSection entityUuid={project.uuid} onStatusChange={setIsProjectSetupComplete} />
            </Box>
          </OverviewItem>
        </Flex>
        <OverviewItem
          title="Key Indicators & Insights"
          flexProps={{ paddingY: 2, width: "100%" }}
          buttonProps={{
            variant: "secondary",
            size: "small",
            children: "View Progress & Goals",
            rightIcon: <ChevronRightIcon />,
            onClick: () => goToTab("goals")
          }}
        >
          <KeyIndicatorsInsightsTab project={project} />
        </OverviewItem>
        <Flex gap={7} maxHeight="570px" paddingY={2}>
          <OverviewItem
            flexProps={{ flex: 1 }}
            title="Team Members"
            buttonProps={{
              variant: "secondary",
              size: "small",
              children: "Manage Team",
              rightIcon: <ChevronRightIcon />,
              onClick: () => goToTab("team-members")
            }}
          >
            <ProfileListCard
              items={[
                {
                  title: "Project Managers",
                  profiles: projectManagers,
                  onProfileClick: () => {}
                },
                {
                  title: "Monitoring Partners",
                  profiles: monitoringPartners,
                  onProfileClick: () => {}
                }
              ]}
              onInviteClick={handleInviteClick}
            />
          </OverviewItem>
          <OverviewItem
            title="Latest Images"
            flexProps={{ flex: 1 }}
            buttonProps={{
              variant: "secondary",
              size: "small",
              children: "View Gallery",
              rightIcon: <ChevronRightIcon />,
              onClick: () => goToTab("gallery")
            }}
          >
            <LastestImagesSectionTab entityUuid={project.uuid} entityName="projects" />
          </OverviewItem>
          <OverviewItem title="Project Onboarding">
            <Flex direction="column" gap={2} padding={5} backgroundColor="neutral.100" borderRadius={1} minHeight={0}>
              <Text color="neutral.900" textStyle="400">
                {t("Monitoring, Reporting, and Verification (MRV)")}
              </Text>
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
                  rightIcon={<ChevronRightIcon />}
                  onClick={() => window.open(mrvOnboardingContentItem?.content.mrvFrameworkLink, "_blank")}
                >
                  {t(mrvOnboardingContentItem?.content.mrvLinkText)}
                </Button>
              </Flex>
              <Flex direction="column" gap={2} minHeight={0}>
                <Text color="neutral.900" textStyle="500">
                  {t("Helpful Links")}
                </Text>
                <Divider />
                <Flex direction="column" paddingTop={1.5} alignItems="flex-start">
                  {mrvOnboardingContentItem?.content.helpfulLinks.map(link => (
                    <Button
                      variant="borderless"
                      size="small"
                      rightIcon={<ChevronRightIcon />}
                      key={link.title}
                      onClick={() => window.open(link.link, "_blank")}
                    >
                      {t(link.title)}
                    </Button>
                  ))}
                </Flex>
              </Flex>
            </Flex>
          </OverviewItem>
        </Flex>
      </Flex>
    </PageBody>
  );
};

export default ProjectOverviewTab;

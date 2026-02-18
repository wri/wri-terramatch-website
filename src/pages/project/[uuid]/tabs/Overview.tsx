import { Box, Flex, FlexProps, Text } from "@chakra-ui/react";
import { Divider } from "@mui/material";
import { useT } from "@transifex/react";
import { useRouter } from "next/router";
import { FC, ReactNode, useCallback, useMemo, useState } from "react";

import OverviewMapArea from "@/components/elements/Map-mapbox/components/OverviewMapArea";
import { downloadProjectSitePolygonsGeoJson } from "@/components/elements/Map-mapbox/utils";
import { ModalId } from "@/components/extensive/Modal/ModalConst";
import PageBody from "@/components/extensive/PageElements/Body/PageBody";
import { useModalContext } from "@/context/modal.provider";
import {
  GetV2ProjectsUUIDPartnersResponse,
  useGetV2ProjectsUUIDManagers,
  useGetV2ProjectsUUIDPartners
} from "@/generated/apiComponents";
import { ProjectFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { useResolutions } from "@/hooks/useResolutions";
import { IButtonProps } from "@/redesignComponents/actions/Buttons/Button/Button";
import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import ProfileListCard from "@/redesignComponents/content/ContentCard/ProfileListCard/ProfileListCard";
import { ChevronRight, Download } from "@/redesignComponents/foundations/Icons";
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
}

const OverviewItem: FC<OverviewItemProps> = ({ title, buttonProps, downloadButtonProps, children, flexProps }) => (
  <Flex direction="column" gap={4} flex={1} {...flexProps}>
    <Flex alignItems="center" justifyContent="space-between">
      <Text color="primary.900" fontSize="20px" lineHeight="28px">
        {title}
      </Text>
      <Flex gap={4}>
        {downloadButtonProps ? <Button {...downloadButtonProps} /> : null}
        {buttonProps ? <Button {...buttonProps} /> : null}
      </Flex>
    </Flex>
    {children}
  </Flex>
);

const formatTeamMembers = (members: GetV2ProjectsUUIDPartnersResponse, isProjectManager: boolean) =>
  members
    .map((member, index) => ({
      id: member.uuid ?? "",
      name: `${member.first_name} ${member.last_name}`,
      image: `https://i.pravatar.cc/300?img=${index}`,
      email: member.email_address,
      isProjectManager
    }))
    ?.slice(0, 2) ?? [];

const ProjectOverviewTab = ({ project }: ProjectOverviewTabProps) => {
  const router = useRouter();
  const t = useT();
  const { openModal } = useModalContext();
  const { isLargerResolution } = useResolutions();
  const [isDownloading, setIsDownloading] = useState(false);
  const [isProjectSetupComplete, setIsProjectSetupComplete] = useState(false);

  const { data: partners, refetch: refetchPartners } = useGetV2ProjectsUUIDPartners<{
    data: GetV2ProjectsUUIDPartnersResponse;
  }>({
    pathParams: { uuid: project?.uuid }
  });

  const { data: managers } = useGetV2ProjectsUUIDManagers<{ data: GetV2ProjectsUUIDPartnersResponse }>({
    pathParams: { uuid: project.uuid }
  });

  const monitoringPartners = formatTeamMembers(partners?.data ?? [], false);
  const projectManagers = formatTeamMembers(managers?.data ?? [], true);

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
    openModal(
      ModalId.INVITE_MONITORING_PARTNER_MODAL,
      <InviteMonitoringPartnerModal projectUUID={project.uuid} onSuccess={refetchPartners} />
    );
  }, [openModal, project.uuid, refetchPartners]);

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
              rightIcon: <ChevronRight />,
              onClick: () => goToTab("sites")
            }}
            downloadButtonProps={{
              variant: "secondary",
              size: "small",
              children: "Download Project Polygons",
              leftIcon: <Download />,
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
            buttonProps={{
              variant: "primary",
              size: "small",
              children: isProjectSetupComplete ? "Edit" : "Continue Editing",
              rightIcon: <ChevronRight />,
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
          flexProps={{ paddingY: 2, width: isLargerResolution ? "fit-content" : "100%" }}
          buttonProps={{
            variant: "secondary",
            size: "small",
            children: "View Progress & Goals",
            rightIcon: <ChevronRight />,
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
              rightIcon: <ChevronRight />,
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
              rightIcon: <ChevronRight />,
              onClick: () => goToTab("gallery")
            }}
          >
            <LastestImagesSectionTab entityUuid={project.uuid} entityName="projects" />
          </OverviewItem>
          <OverviewItem title="Project Onboarding">
            <Flex direction="column" gap={2} padding={5} backgroundColor="neutral.100" borderRadius={1} minHeight={0}>
              <Text color="neutral.900" fontSize="16px" lineHeight="24px" fontWeight="bold">
                {t("Monitoring, Reporting, and Verification (MRV)")}
              </Text>
              <Box as="ul" listStyleType="disc" marginInlineStart={3} paddingLeft={4}>
                <Box as="li">
                  <Text color="neutral.900" fontSize="14px" lineHeight="20px">
                    <strong>{t("Monitoring")}:</strong> {t(mrvOnboardingContentItem?.content.monitoring)}
                  </Text>
                </Box>
                <Box as="li">
                  <Text color="neutral.900" fontSize="14px" lineHeight="20px">
                    <strong>{t("Reporting")}:</strong> {t(mrvOnboardingContentItem?.content.reporting)}
                  </Text>
                </Box>
                <Box as="li">
                  <Text color="neutral.900" fontSize="14px" lineHeight="20px">
                    <strong>{t("Verification")}:</strong> {t(mrvOnboardingContentItem?.content.verification)}
                  </Text>
                </Box>
              </Box>
              <Flex alignItems="center" flexWrap="wrap">
                <Text color="neutral.900" fontSize="14px" lineHeight="20px">
                  {t(mrvOnboardingContentItem?.content.mrvLinkPrefix)}
                </Text>
                <Button
                  variant="borderless"
                  size="small"
                  rightIcon={<ChevronRight />}
                  onClick={() => window.open(mrvOnboardingContentItem?.content.mrvFrameworkLink, "_blank")}
                >
                  {t(mrvOnboardingContentItem?.content.mrvLinkText)}
                </Button>
              </Flex>
              <Flex direction="column" gap={2} minHeight={0}>
                <Text color="neutral.900" fontSize="18px" lineHeight="28px" fontWeight="bold">
                  {t("Helpful Links")}
                </Text>
                <Divider />
                <Flex direction="column" paddingTop={1.5} alignItems="flex-start">
                  {mrvOnboardingContentItem?.content.helpfulLinks.map(link => (
                    <Button
                      variant="borderless"
                      size="small"
                      rightIcon={<ChevronRight />}
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

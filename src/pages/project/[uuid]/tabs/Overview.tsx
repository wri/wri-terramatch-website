import { Box, Flex, FlexProps, Text, useMediaQuery } from "@chakra-ui/react";
import { Divider } from "@mui/material";
import { useT } from "@transifex/react";
import { useRouter } from "next/router";
import { FC, ReactNode, useCallback, useMemo } from "react";

import OverviewMapArea from "@/components/elements/Map-mapbox/components/OverviewMapArea";
import { ModalId } from "@/components/extensive/Modal/ModalConst";
import PageBody from "@/components/extensive/PageElements/Body/PageBody";
import { GetV2ProjectsUUIDPartnersResponse, useGetV2ProjectsUUIDManagers, useGetV2ProjectsUUIDPartners } from "@/generated/apiComponents";
import { ProjectFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { IButtonProps } from "@/redesignComponents/actions/Buttons/Button/Button";
import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import ProfileListCard from "@/redesignComponents/content/ContentCard/ProfileListCard/ProfileListCard";
import { ChevronRight } from "@/redesignComponents/foundations/Icons";

import InviteMonitoringPartnerModal from "../components/InviteMonitoringPartnerModal";
import { MRV_ONBOARDING_CONTENT } from "./constants/mrvOnboardingContent";
import KeyIndicatorsInsightsTab from "./KeyIndicatorsInsights";
import LastestImagesSectionTab from "./LastestImagesSection";
import ProjectSetUpSection from "./ProjectSetUpSection";
import { useModalContext } from "@/context/modal.provider";

interface ProjectOverviewTabProps {
  project: ProjectFullDto
}

interface OverviewItemProps {
  title: string;
  buttonProps?: IButtonProps;
  children?: ReactNode;
  flexProps?: FlexProps;
}


const OverviewItem: FC<OverviewItemProps> = props => {
  const { title, buttonProps, children, flexProps } = props;

  return (
    <Flex direction="column" gap={4} flex={1} {...flexProps}>
      <Flex alignItems="center" justifyContent="space-between">
        <Text color="primary.900" fontSize="20px" lineHeight="28px">
          {title}
        </Text>
        {buttonProps ? <Button {...buttonProps} /> : null}
      </Flex>
      {children}
    </Flex>
  );
};

const formatTeamMembers = (members: GetV2ProjectsUUIDPartnersResponse) => {
  return (
    members
      .map((member, index) => {
        return {
          id: member.uuid ?? "",
          name: `${member.first_name} ${member.last_name}`,
          image: `https://i.pravatar.cc/300?img=${index}`
        };
      })
      ?.slice(0, 2) ?? []
  );
};

const ProjectOverviewTab = ({ project }: ProjectOverviewTabProps) => {
  const router = useRouter();
  const t = useT();
  const { openModal } = useModalContext();
  const [isLargerResolution] = useMediaQuery(["(min-width: 1500px)"]);


  const { data: partners, refetch: refetchPartners } = useGetV2ProjectsUUIDPartners<{
    data: GetV2ProjectsUUIDPartnersResponse;
  }>({
    pathParams: { uuid: project?.uuid }
  });

  const { data: managers } = useGetV2ProjectsUUIDManagers<{ data: GetV2ProjectsUUIDPartnersResponse }>({
    pathParams: { uuid: project.uuid }
  });

  const dataQualityAnalysts = formatTeamMembers(partners?.data ?? []);
  const projectManagers = formatTeamMembers(managers?.data ?? []);

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

  return (
    <PageBody>
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
              children: "Continue Editing",
              rightIcon: <ChevronRight />,
              onClick: goToContinueEditingTab
            }}
          >
            <ProjectSetUpSection entityUuid={project.uuid} />
          </OverviewItem>
        </Flex>
        <OverviewItem
          title="Key Indicators & Insights"
          flexProps={{ paddingY: 2 }}
          buttonProps={{
            variant: "secondary",
            size: "small",
            children: "View Progress & Goals",
            rightIcon: <ChevronRight />,
            onClick: () => goToTab("goals")
          }}
        >
          <KeyIndicatorsInsightsTab project={project} isLargerResolution={isLargerResolution} />
        </OverviewItem>
        <Flex gap={7} height="532px" paddingY={2}>
          <OverviewItem
            flexProps={{ flex: 1 }}
            title="Team Members"
            buttonProps={{
              variant: "secondary",
              size: "small",
              children: "Manage Team",
              rightIcon: <ChevronRight />,
              onClick: () => goToTab("details")
            }}
          >
            <ProfileListCard
              items={[
                {
                  title: "Project Managers",
                  profiles: projectManagers,
                  onProfileClick: profile => {
                    console.log("Profile clicked:", profile);
                  }
                },
                {
                  title: "Data Quality Analysts",
                  profiles: dataQualityAnalysts,
                  onProfileClick: profile => {
                    console.log("Profile clicked:", profile);
                  }
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
            <Flex direction="column" gap={6} padding={5} backgroundColor="neutral.100" borderRadius={1} minHeight={0}>
              <Text color="neutral.900" fontSize="14px" lineHeight="20px">
                {t(mrvOnboardingContentItem?.content.introText)}
              </Text>
              <Flex direction="column" gap={2} minHeight={0}>
                <Text color="neutral.900" fontSize="18px" lineHeight="28px" fontWeight="bold">
                  Helpful Links
                </Text>
                <Divider />
                <Flex direction="column" gap={3} paddingTop={3} alignItems="flex-start" className="overflow-y-auto">
                  {mrvOnboardingContentItem?.content.helpfulLinks.map(link => (
                    <Button
                      variant="borderless"
                      size="small"
                      rightIcon={<ChevronRight />}
                      key={link.title}
                      onClick={() => window.open(link.link, "_blank")}
                    >
                      {link.title}
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

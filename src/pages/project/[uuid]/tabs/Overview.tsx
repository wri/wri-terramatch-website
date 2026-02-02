import { Box, Flex, FlexProps, Text } from "@chakra-ui/react";
import { Divider } from "@mui/material";
import { useRouter } from "next/router";
import { ReactNode, useMemo } from "react";

import OverviewMapArea from "@/components/elements/Map-mapbox/components/OverviewMapArea";
import PageBody from "@/components/extensive/PageElements/Body/PageBody";
import {
  GetV2ProjectsUUIDPartnersResponse,
  useGetV2ProjectsUUIDManagers,
  useGetV2ProjectsUUIDPartners
} from "@/generated/apiComponents";
import { ProjectFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { IButtonProps } from "@/redesignComponents/actions/Buttons/Button/Button";
import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import ImageGalleryCard from "@/redesignComponents/content/ContentCard/ImageGalleryCard/ImageGalleryCard";
import ProfileListCard, { IProfile } from "@/redesignComponents/content/ContentCard/ProfileListCard/ProfileListCard";
import MetricCard from "@/redesignComponents/data-display/MetricCard";
import { AreaHectares, ChevronRight, Jobs, Seeds, Tree } from "@/redesignComponents/foundations/Icons";
import { ProgressSteps } from "@/redesignComponents/status/ProgressIndicator/ProgressSteps";
interface ProjectOverviewTabProps {
  project: ProjectFullDto & { jobsCreatedGoal: number; totalHectaresRestoredGoal: number; treesGrownGoal: number };
}

interface OverviewItemProps {
  title: string;
  buttonProps?: IButtonProps;
  children?: ReactNode;
  flexProps?: FlexProps;
}

const mrvOnboardingContent = [
  {
    frameworks: ["terrafund", "terrafund-landscapes", "enterprises", "epa-ghana-pilot"],
    content: {
      introText:
        "Monitoring, Reporting, and Verification refers to the set of processes used to track your project’s progress over time. Monitoring refers to checking your project against relevant datasetsa set of indicators (these can be ecological, like “Trees restored” or socioeconomic, like “Jobs created”) at pre-determined intervals (for example, Year 0, Year 3, and Year 6 of a project).  Reporting refers to your team’s work, filling out project, site, nursery, financial, and disturbance reports on TerraMatch. Verification refers to remote or field-based measurement of project progress.",
      helpfulLinks: [
        {
          title: "Glossary - Monitoring, Reporting, and Verification",
          link: "https://terramatchsupport.zendesk.com/hc/en-us/articles/21972136717979-Glossary-Monitoring-Reporting-Verification"
        },
        {
          title: "TerraFund Siting Guidance",
          link: "https://terramatchsupport.zendesk.com/hc/en-us/articles/25201750730907-TerraFund-Siting-Guide"
        },
        {
          title: "How to Prepare and Submit Your Reports on TerraMatch",
          link: "https://terramatchsupport.zendesk.com/hc/en-us/articles/21683197977627-How-to-Prepare-Submit-Your-Reports-on-TerraMatch"
        },
        {
          title: "Checklists for your TerraFund Reports",
          link: "https://terramatchsupport.zendesk.com/hc/en-us/articles/26920946851227-Checklists-for-your-TerraFund-Project-Nursery-and-Site-Reports"
        }
      ]
    }
  },
  {
    frameworks: ["hbf"],
    content: {
      introText:
        "Monitoring, Reporting, and Verification refers to the set of processes used to track your project’s progress over time. Monitoring refers to checking your project against relevant datasetsa set of indicators (these can be ecological, like “Trees restored” or socioeconomic, like “Jobs created”) at pre-determined intervals (for example, Year 0, Year 3, and Year 6 of a project).  Reporting refers to your team’s work, filling out project, site, nursery, financial, and disturbance reports on TerraMatch. Verification refers to remote or field-based measurement of project progress.",
      helpfulLinks: [
        {
          title: "Glossary - Monitoring, Reporting, and Verification",
          link: "https://terramatchsupport.zendesk.com/hc/en-us/articles/21972136717979-Glossary-Monitoring-Reporting-Verification"
        },
        {
          title: "How to Prepare and Submit Your Reports on TerraMatch",
          link: "https://terramatchsupport.zendesk.com/hc/en-us/articles/21683197977627-How-to-Prepare-Submit-Your-Reports-on-TerraMatch"
        }
      ]
    }
  },
  {
    frameworks: ["ppc"],
    content: {
      introText:
        "Monitoring, Reporting, and Verification refers to the set of processes used to track your project’s progress over time. Monitoring refers to checking your project against relevant datasetsa set of indicators (these can be ecological, like “Trees restored” or socioeconomic, like “Workdays created”) at pre-determined intervals (for example, Year 0, Year 2.5, and Year 5 of a project).  Reporting refers to your team’s work, filling out project, site, socioeconomic restoration partners, and disturbance reports on TerraMatch. Verification refers to remote or field-based measurement of project progress.",
      helpfulLinks: [
        {
          title: "Glossary - Monitoring, Reporting, and Verification",
          link: "https://terramatchsupport.zendesk.com/hc/en-us/articles/13322085147035-How-to-Submit-Your-Quarterly-Reports-PPC"
        },
        {
          title: "How to report (annually) on PPC Socioeconomic Restoration Partners",
          link: "https://terramatchsupport.zendesk.com/hc/en-us/articles/13322399098267-How-to-report-annually-on-PPC-Socioeconomic-Restoration-Partners"
        },
        {
          title: "How to do Field Tree Monitoring for the PPC – TerraMatch Help Center",
          link: "https://terramatchsupport.zendesk.com/hc/en-us/articles/13384531523227-How-to-do-Field-Tree-Monitoring-for-the-PPC"
        },
        {
          title: "PPC Tree Restoration Monitoring Framework",
          link: "https://terramatchsupport.zendesk.com/hc/en-us/articles/13319985438363-What-is-the-Tree-Restoration-Monitoring-Framework"
        }
      ]
    }
  }
];

const OverviewItem = (props: OverviewItemProps) => {
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

const ProjectOverviewTab = ({ project }: ProjectOverviewTabProps) => {
  const router = useRouter();

  const { data: partners } = useGetV2ProjectsUUIDPartners<{ data: GetV2ProjectsUUIDPartnersResponse }>({
    pathParams: { uuid: project?.uuid }
  });

  const { data: managers } = useGetV2ProjectsUUIDManagers<{ data: GetV2ProjectsUUIDPartnersResponse }>({
    pathParams: { uuid: project.uuid }
  });

  const dataQualityAnalysts = useMemo(() => {
    return (
      partners?.data
        .map((partner, index) => {
          return {
            id: partner.uuid ?? "",
            name: `${partner.first_name} ${partner.last_name}`,
            image: `https://i.pravatar.cc/300?img=${index}`
          };
        })
        ?.slice(0, 2) ?? []
    );
  }, [partners?.data]) as IProfile[];

  const projectManagers = useMemo(() => {
    return (
      managers?.data
        .map((manager, index) => {
          return {
            id: manager.uuid ?? "",
            name: `${manager.first_name} ${manager.last_name}`,
            image: `https://i.pravatar.cc/300?img=${index}`
          };
        })
        ?.slice(0, 2) ?? []
    );
  }, [managers?.data]) as IProfile[];

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
    return mrvOnboardingContent.find(content => content.frameworks.includes(project.frameworkKey!));
  }, [project.frameworkKey]);

  const totalTreesRestoredCount =
    (project?.treesPlantedCount ?? 0) + (project?.regeneratedTreesCount ?? 0) + (project?.seedsPlantedCount ?? 0);
  const chartDataJobs = {
    chartData: [
      { name: "JOBS CREATED", value: project.totalJobsCreated },
      {
        name: "TOTAL JOBS CREATED GOAL",
        value: project.jobsCreatedGoal
      }
    ],
    cardValues: {
      label: "Jobs Created",
      value: project.totalJobsCreated,
      totalName: "TOTAL JOBS CREATED GOAL",
      totalValue: project.jobsCreatedGoal
    },
    graph: true,
    hectares: false
  };
  const chartDataHectares = {
    chartData: [
      {
        name: "HECTARES RESTORED",
        value: project.totalHectaresRestoredSum,
        tooltipContent: "Number of hectares within approved polygons for this project"
      },
      {
        name: "TOTAL HECTARES RESTORED",
        value: project.totalHectaresRestoredGoal
      }
    ],
    cardValues: {
      label: "Hectares Restored",
      value: project.totalHectaresRestoredSum,
      totalName: "TOTAL HECTARES RESTORED",
      totalValue: project.totalHectaresRestoredGoal
    }
  };
  const chartDataTreesRestored = {
    chartData: [
      { name: "TREES RESTORED", value: totalTreesRestoredCount },
      {
        name: "TOTAL TREES RESTORED",
        value: project.treesGrownGoal
      }
    ],
    cardValues: {
      label: "Trees Restored",
      value: totalTreesRestoredCount,
      totalName: "TOTAL TREES RESTORED",
      totalValue: project.treesGrownGoal
    }
  };
  const chartDataSaplings = {
    chartData: [
      { name: "SAPLINGS RESTORED", value: totalTreesRestoredCount },
      {
        name: "TOTAL SAPLINGS RESTORED",
        value: project.treesGrownGoal
      }
    ],
    cardValues: {
      label: "Saplings Restored",
      value: totalTreesRestoredCount,
      totalName: "TOTAL SAPLINGS RESTORED",
      totalValue: project.treesGrownGoal
    }
  };

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
            flexProps={{ flex: 1 }}
            title="Project Set Up"
            buttonProps={{
              variant: "primary",
              size: "small",
              children: "Continue Editing",
              rightIcon: <ChevronRight />,
              onClick: goToContinueEditingTab
            }}
          >
            <ProgressSteps entityUUID={project.uuid} entityName="projects" />
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
          <Flex gap={2} flex={1} justify="space-between">
            <MetricCard
              title="Trees Planted"
              progress={chartDataTreesRestored.cardValues.value}
              goal={chartDataTreesRestored.cardValues.totalValue}
              variant="donutChart"
              icon={<Tree />}
              color="secondary.600"
            />
            <MetricCard
              title="Seedlings Grown"
              progress={chartDataSaplings.cardValues.value}
              goal={chartDataSaplings.cardValues.totalValue}
              variant="donutChart"
              icon={<Seeds />}
              color="secondary.600"
            />
            <MetricCard
              title="Hectares Restored"
              progress={chartDataHectares.cardValues.value}
              goal={chartDataHectares.cardValues.totalValue}
              variant="donutChart"
              icon={<AreaHectares />}
              color="secondary.700"
            />
            <MetricCard
              title="Jobs Created"
              progress={chartDataJobs.cardValues.value}
              goal={chartDataJobs.cardValues.totalValue}
              variant="donutChart"
              icon={<Jobs />}
            />
          </Flex>
        </OverviewItem>
        <Flex gap={7} height="445px" paddingY={2}>
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
                }
              ]}
            />
            <ProfileListCard
              items={[
                {
                  title: "Data Quality Analysts",
                  profiles: dataQualityAnalysts,
                  onProfileClick: profile => {
                    console.log("Profile clicked:", profile);
                  }
                }
              ]}
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
            <ImageGalleryCard entityUUID={project.uuid} entityName="projects" />
          </OverviewItem>
          <OverviewItem title="Project Onboarding">
            <Flex direction="column" gap={6} padding={5} backgroundColor="neutral.100" borderRadius={1}>
              <Text color="neutral.900" fontSize="14px" lineHeight="20px">
                {mrvOnboardingContentItem?.content.introText}
              </Text>
              <Flex direction="column" gap={2}>
                <Text color="neutral.900" fontSize="18px" lineHeight="28px" fontWeight="bold">
                  Helpful Links
                </Text>
                <Divider />
                <Flex
                  direction="column"
                  gap={3}
                  paddingTop={3}
                  alignItems="flex-start"
                  className="max-h-[75px] overflow-y-auto"
                >
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

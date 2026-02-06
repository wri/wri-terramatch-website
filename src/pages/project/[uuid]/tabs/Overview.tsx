import { Box, Flex, FlexProps, Text, useMediaQuery } from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { Divider } from "@mui/material";
import { useT } from "@transifex/react";
import classNames from "classnames";
import { Dictionary } from "lodash";
import { useRouter } from "next/router";
import { ReactNode, useCallback, useMemo } from "react";
import { useRef } from "react";

import { UseFormReturn } from "react-hook-form";
import { useForm } from "react-hook-form";

import OverviewMapArea from "@/components/elements/Map-mapbox/components/OverviewMapArea";
import { TabItem } from "@/components/elements/Tabs/Default/Tabs";
import { ModalId } from "@/components/extensive/Modal/ModalConst";
import PageBody from "@/components/extensive/PageElements/Body/PageBody";
import { FormStep } from "@/components/extensive/WizardForm/FormStep";
import { getSchema } from "@/components/extensive/WizardForm/utils";
import { SupportedEntity, useMedias } from "@/connections/EntityAssociation";
import { FormEntity } from "@/connections/Form";
import { toFramework } from "@/context/framework.provider";
import { useModalContext } from "@/context/modal.provider";
import { useApiFieldsProvider } from "@/context/wizardForm.provider";
import { GetV2ProjectsUUIDPartnersResponse, useGetV2ProjectsUUIDManagers, useGetV2ProjectsUUIDPartners } from "@/generated/apiComponents";
import { ProjectFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { normalizedFormData } from "@/helpers/customForms";
import { v2EntityName, v3EntityName } from "@/helpers/entity";
import { useDebounce } from "@/hooks/useDebounce";
import { useDefaultValues, useEntityForm } from "@/hooks/useFormGet";
import { useFormUpdate } from "@/hooks/useFormUpdate";
import { IButtonProps } from "@/redesignComponents/actions/Buttons/Button/Button";
import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import ImageGalleryCard from "@/redesignComponents/content/ContentCard/ImageGalleryCard/ImageGalleryCard";
import ProfileListCard from "@/redesignComponents/content/ContentCard/ProfileListCard/ProfileListCard";
import MetricCard from "@/redesignComponents/dataDisplay/Metrics/MetricCard";
import { AreaHectares, ChevronRight, Edit, Jobs, Seeds, Tree } from "@/redesignComponents/foundations/Icons";
import { ProgressSteps } from "@/redesignComponents/status/ProgressIndicator/ProgressSteps";
import { StepProps } from "@/redesignComponents/status/ProgressIndicator/types";
import { HookProps } from "@/types/connection";

import InviteMonitoringPartnerModal from "../components/InviteMonitoringPartnerModal";

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

const tabOptions = {
  markDone: true,
  disableFutureTabs: true
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
  const mode = router.query.mode as string | undefined;
  const model = useMemo(() => ({ model: v3EntityName("projects") as FormEntity, uuid: project.uuid }), [project.uuid]);
  const { updateEntityAnswers } = useFormUpdate(model.model, project.uuid);
  const { formData } = useEntityForm(model.model, project.uuid);
  const framework = toFramework(formData?.frameworkKey);
  const feedbackFields = useMemo(
    () => (mode?.includes("provide-feedback") ? formData?.feedbackFields ?? [] : []),
    [formData?.feedbackFields, mode]
  );
  const [, fieldsProvider] = useApiFieldsProvider(formData?.formUuid, feedbackFields);

  const { data: partners, refetch: refetchPartners } = useGetV2ProjectsUUIDPartners<{
    data: GetV2ProjectsUUIDPartnersResponse;
  }>({
    pathParams: { uuid: project?.uuid }
  });

  const { data: managers } = useGetV2ProjectsUUIDManagers<{ data: GetV2ProjectsUUIDPartnersResponse }>({
    pathParams: { uuid: project.uuid }
  });

  const [isLargerResolution] = useMediaQuery(["(min-width: 1500px)"]);

  const [, { data: mediaList }] = useMedias(
    useMemo<HookProps<typeof useMedias>>(() => {
      return {
        entity: "projects" as SupportedEntity,
        uuid: project.uuid,
        pageNumber: 1,
        pageSize: 4,
        sortDirection: "DESC"
      };
    }, [project.uuid])
  );

  const images = mediaList?.map(media => media.url) ?? [];

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
    return mrvOnboardingContent.find(content => content.frameworks.includes(project.frameworkKey!));
  }, [project.frameworkKey]);

  const totalTreesRestoredCount =
    (project?.treesPlantedCount ?? 0) + (project?.regeneratedTreesCount ?? 0) + (project?.seedsPlantedCount ?? 0);
  const chartDataJobs = {
    cardValues: {
      value: project.totalJobsCreated,
      totalValue: project.jobsCreatedGoal
    }
  };
  const chartDataHectares = {
    cardValues: {
      value: project.totalHectaresRestoredSum,
      totalValue: project.totalHectaresRestoredGoal
    }
  };
  const chartDataTreesRestored = {
    cardValues: {
      value: totalTreesRestoredCount,
      totalValue: project.treesGrownGoal
    }
  };
  const chartDataSaplings = {
    cardValues: {
      value: totalTreesRestoredCount,
      totalValue: project.treesGrownGoal
    }
  };

  const handleInviteClick = useCallback(() => {
    openModal(
      ModalId.INVITE_MONITORING_PSRTNER_MODAL,
      <InviteMonitoringPartnerModal projectUUID={project.uuid} onSuccess={refetchPartners} />
    );
  }, [openModal, project.uuid, refetchPartners]);

  const defaultValues = useDefaultValues(formData, fieldsProvider);
  const steps = useMemo(
    () =>
      fieldsProvider.stepIds().map(stepId => ({
        id: stepId,
        title: fieldsProvider.step(stepId)?.title,
        validation: getSchema(fieldsProvider, t, framework, fieldsProvider.fieldNames(stepId))
      })),
    [framework, fieldsProvider, t]
  );

  const firstIncompleteStepIndex = useMemo(() => {
    if (defaultValues == null) return 0;
    const idx = steps.findIndex(({ validation }) => !validation.isValidSync(defaultValues));
    return idx < 0 ? steps.length : idx;
  }, [defaultValues, steps]);

  const selectedSection = steps[0];
  const formHook: UseFormReturn = useForm(
    useMemo(
      () =>
        selectedSection?.validation != null
          ? {
            resolver: yupResolver(selectedSection?.validation),
            defaultValues: defaultValues,
            mode: "onTouched"
          }
          : { mode: "onTouched" },
      [defaultValues, selectedSection?.validation]
    )
  );

  const formHasError = useRef(false);
  formHasError.current = Object.values(formHook.formState.errors ?? {}).length > 0;
  const onChange = useCallback(
    (data: Dictionary<any>) => {
      updateEntityAnswers({ answers: normalizedFormData(data, fieldsProvider) });
    },
    [fieldsProvider, updateEntityAnswers]
  );
  const _onChange = useDebounce(
    useCallback(() => !formHasError.current && onChange?.(formHook.getValues()), [formHook, onChange]),
    // Send an update to the server at most once per second
    1000
  );

  const renderStep = useCallback(
    (stepId: string) => <FormStep id="step" stepId={stepId} formHook={formHook} onChange={_onChange} />,
    [formHook, _onChange]
  );

  const stepTabItems = useMemo(
    () =>
      steps.map(({ id, title }, index) => ({
        title: title ?? "",
        done: tabOptions.markDone && index < firstIncompleteStepIndex,
        // TODO: Uncomment this when we have a way to disable the future steps
        // disabled: tabOptions.disableFutureTabs && index > firstIncompleteStepIndex,
        disabled: false,
        renderBody: () => renderStep(id)
      })),
    [firstIncompleteStepIndex, renderStep, steps]
  );

  const tabItems: TabItem[] = stepTabItems;

  const handleEditStep = useCallback(
    (index: number) => {
      const editPath = `/entity/${v2EntityName("projects")}/edit/${project.uuid}`;
      router.push(`${editPath}?step=${index}`);
    },
    [project.uuid, router]
  );

  // TODO: Uncomment this when we have a way to edit the step
  // const isStepEditable = useCallback(
  //   (index: number) => index <= firstIncompleteStepIndex,
  //   [firstIncompleteStepIndex]
  // );

  const tabItemsStep: StepProps[] = tabItems.map((item, index) => {
    const done = item.done ?? false;
    const disabled = item.disabled ?? false;
    // TODO: Uncomment this when we have a way to edit the step
    // const editable = isStepEditable(index);
    const isFirstIncomplete = index === firstIncompleteStepIndex && index < steps.length;
    const status: StepProps["status"] = done
      ? "completed"
      : disabled
        ? "disabled"
        : isFirstIncomplete
          ? "error"
          : "active";
    return {
      ...item,
      index: index + 1,
      status,
      label: item.title,
      actions: (
        <Button
          type="button"
          variant="borderless"
          size="small"
          leftIcon={<Edit boxSize={3} />}
          onClick={() => handleEditStep(index)}
        >
          Edit
        </Button>
      ),
      onClick: () => handleEditStep(index)
    };
  });

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
            <ProgressSteps steps={tabItemsStep} />
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
          <Flex gap={10} flex={1} justify={isLargerResolution ? "flex-start" : "space-between"}>
            <MetricCard
              title="Trees Planted"
              progress={chartDataTreesRestored.cardValues.value}
              goal={chartDataTreesRestored.cardValues.totalValue}
              variant="donutChart"
              icon={<Tree />}
              color="secondary.600"
              type="treesRestored"
              className={classNames({ "flex-1": !isLargerResolution })}
            />
            <MetricCard
              title="Seedlings Grown"
              progress={chartDataSaplings.cardValues.value}
              goal={chartDataSaplings.cardValues.totalValue}
              variant="donutChart"
              icon={<Seeds />}
              color="secondary.600"
              type="saplingsRestored"
              className={classNames({ "flex-1": !isLargerResolution })}
            />
            <MetricCard
              title="Hectares Restored"
              progress={chartDataHectares.cardValues.value}
              goal={chartDataHectares.cardValues.totalValue}
              variant="donutChart"
              icon={<AreaHectares />}
              color="secondary.700"
              type="hectaresRestored"
              className={classNames({ "flex-1": !isLargerResolution })}
            />
            <MetricCard
              title="Jobs Created"
              progress={chartDataJobs.cardValues.value}
              goal={chartDataJobs.cardValues.totalValue}
              variant="donutChart"
              icon={<Jobs />}
              type="jobsCreated"
              className={classNames({ "flex-1": !isLargerResolution })}
            />
          </Flex>
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
            <ImageGalleryCard images={images as string[]} />
          </OverviewItem>
          <OverviewItem title="Project Onboarding">
            <Flex direction="column" gap={6} padding={5} backgroundColor="neutral.100" borderRadius={1} minHeight={0}>
              <Text color="neutral.900" fontSize="14px" lineHeight="20px">
                {mrvOnboardingContentItem?.content.introText}
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

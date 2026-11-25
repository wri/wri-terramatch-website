import { Box, Flex, IconProps, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { useRouter } from "next/router";
import { ComponentType, FC, Fragment, useCallback, useMemo } from "react";
import Twemoji from "react-twemoji";

import { useMedia } from "@/connections/EntityAssociation";
import { useGadmOptions } from "@/connections/Gadm";
import { useReportingFramework } from "@/connections/ReportingFramework";
import { shouldHideNurseries, useFramework } from "@/context/framework.provider";
import { ProjectMetaDto } from "@/generated/v3/entityService/entityServiceSchemas";
import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import ProgressTag from "@/redesignComponents/actions/Tags/ProgressTag/ProgressTag";
import TagSubmission from "@/redesignComponents/actions/Tags/TagSubmission/TagSubmission";
import {
  countryCodeToFlag,
  getPlantingProgressState
} from "@/redesignComponents/content/headers/PageHeaders/ProjectHeader/projectHeader.utils";
import {
  ChevronRightIcon,
  NurseryIcon,
  OrganizationIcon,
  ProgrammeIcon,
  ReportsIcon,
  SiteIcon
} from "@/redesignComponents/foundations/Icons";
import EllipsisDivider from "@/redesignComponents/miscellaneous/Dividers/EllipsisDivider";
import SimpleDivider from "@/redesignComponents/miscellaneous/Dividers/SimpleDivider";
import { isNotNull } from "@/utils/array";
import { formatOptionsList } from "@/utils/options";

import ProjectCardImage from "./ProjectCardImage";
import ProjectCardMetricRow from "./ProjectCardMetricRow";
import { getProjectCardMetrics } from "./projectCardMetrics";

export type ProjectCardProject = ProjectMetaDto;

type CardAction = {
  key: string;
  Icon: ComponentType<IconProps>;
  label: string;
  disabled: boolean;
  onClick?: () => void;
};

export interface ProjectCardProps {
  project: ProjectCardProject;
}

const ProjectCard: FC<ProjectCardProps> = ({ project }) => {
  const t = useT();
  const router = useRouter();
  const framework = useFramework(project.frameworkKey);
  const countryOptions = useGadmOptions({ level: 0 });
  const [, { data: reportingFramework }] = useReportingFramework({ frameworkKey: project.frameworkKey ?? undefined });
  const [, { data: coverImage }] = useMedia({ entity: "projects", uuid: project.uuid, filter: { isCover: true } });

  const title = project.name ?? "-";
  const countryFlag = countryCodeToFlag(project.level0Project);
  const projectPath = `/project/${project.uuid}`;
  const metrics = useMemo(() => getProjectCardMetrics(t, framework, project), [framework, project, t]);
  const handleViewProjectClick = useCallback(() => void router.push(projectPath), [projectPath, router]);

  const actions = useMemo<CardAction[]>(
    () =>
      [
        {
          key: "sites",
          Icon: SiteIcon,
          label: t("{count} Sites", { count: project.totalSites }),
          disabled: project.totalSites === 0,
          onClick: () => void router.push(`${projectPath}?tab=sites`)
        },
        shouldHideNurseries(framework)
          ? undefined
          : {
              key: "nurseries",
              Icon: NurseryIcon,
              label: t("{count} Nurseries", { count: project.totalNurseries }),
              disabled: project.totalNurseries === 0,
              onClick: () => void router.push(`${projectPath}?tab=nurseries`)
            },
        {
          key: "reports",
          Icon: ReportsIcon,
          label: t("Reports"),
          disabled: project.totalProjectReports === 0,
          onClick: () => void router.push(`${projectPath}?tab=reports`)
        }
      ].filter(isNotNull),
    [framework, project.totalNurseries, project.totalProjectReports, project.totalSites, projectPath, router, t]
  );

  return (
    <Flex
      direction="column"
      width="100%"
      minWidth={0}
      bg="secondary.neutral"
      borderRadius="0.5rem"
      boxShadow="xs"
      overflow="hidden"
    >
      <Flex gap={3} paddingX={4} paddingTop={3} paddingBottom={4}>
        <ProjectCardImage imageUrl={coverImage?.thumbUrl} alt={title} />
        <Flex direction="column" justifyContent="flex-end" gap={1} minWidth={0} flex={1}>
          <Text textStyle="400-bold" color="primary.900" maxWidth="full" truncate title={title}>
            {title}
          </Text>
          <Flex alignItems="center" columnGap={2} paddingLeft={0.5} paddingBottom={1} flexWrap="wrap">
            <Flex alignItems="flex-start" gap={1}>
              <OrganizationIcon boxSize="0.75rem" flexShrink={0} marginTop={1} color="primary.900" />
              <Text textStyle="300" color="primary.900">
                {project.organisationName ?? "-"}
              </Text>
            </Flex>
            <EllipsisDivider color="primary.900" />
            <Flex alignItems="flex-start" gap={1}>
              <ProgrammeIcon boxSize="0.75rem" flexShrink={0} marginTop={1} color="primary.900" />
              <Text textStyle="300" color="primary.900">
                {reportingFramework?.name ?? "-"}
              </Text>
            </Flex>
            <EllipsisDivider color="primary.900" />
            <Flex alignItems="flex-start" gap={1}>
              {countryFlag !== "" && (
                <Box flexShrink={0} marginTop={1}>
                  <Twemoji options={{ className: "h-3 w-3" }}>{countryFlag}</Twemoji>
                </Box>
              )}
              <Text textStyle="300" color="primary.900">
                {formatOptionsList(countryOptions ?? [], project.level0Project ?? [])}
              </Text>
            </Flex>
          </Flex>
          <Flex gap={2} paddingTop={0.5} flexWrap="wrap">
            <TagSubmission state={project.status} size="small" />
            <ProgressTag state={getPlantingProgressState(project.plantingStatus)} />
          </Flex>
        </Flex>
      </Flex>

      <Flex
        direction="column"
        gap={3}
        paddingX={4}
        paddingY={3}
        bg="neutral.100"
        borderBottomWidth="0.0625rem"
        borderColor="secondary.neutral"
      >
        {metrics.map(metric => (
          <ProjectCardMetricRow key={metric.key} metric={metric} />
        ))}
      </Flex>

      <Flex
        alignItems="center"
        justifyContent="space-between"
        flexWrap="wrap"
        columnGap={4}
        rowGap={2}
        paddingLeft={2}
        paddingRight={4}
        paddingY={2}
        bg="neutral.100"
      >
        <Flex alignItems="center" gap={1}>
          {actions.map(({ key, Icon, label, disabled, onClick }, index) => (
            <Fragment key={key}>
              {index > 0 && (
                <Box height="1.8125rem">
                  <SimpleDivider variant="vertical" />
                </Box>
              )}
              <Button
                variant="borderless"
                size="small"
                leftIcon={<Icon />}
                className="[&_svg]:!h-3 [&_svg]:!w-3"
                disabled={disabled}
                onClick={onClick}
              >
                {label}
              </Button>
            </Fragment>
          ))}
        </Flex>
        <Button
          variant="primary"
          size="small"
          className="ml-auto"
          rightIcon={<ChevronRightIcon boxSize="0.625rem" />}
          onClick={handleViewProjectClick}
        >
          {t("View Project")}
        </Button>
      </Flex>
    </Flex>
  );
};

export default ProjectCard;

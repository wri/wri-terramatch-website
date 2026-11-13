import { Box, Flex, IconProps, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { ComponentType, FC, Fragment } from "react";
import { twMerge } from "tailwind-merge";

import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import ProgressTag, { ProgressState } from "@/redesignComponents/actions/Tags/ProgressTag/ProgressTag";
import TagSubmission, { TagSubmissionState } from "@/redesignComponents/actions/Tags/TagSubmission/TagSubmission";
import {
  AreaHectaresIcon,
  ChevronRightIcon,
  JobsIcon,
  NurseryIcon,
  OrganizationIcon,
  ProgrammeIcon,
  ReportsIcon,
  SiteIcon,
  TreeIcon
} from "@/redesignComponents/foundations/Icons";
import EllipsisDivider from "@/redesignComponents/miscellaneous/Dividers/EllipsisDivider";
import SimpleDivider from "@/redesignComponents/miscellaneous/Dividers/SimpleDivider";

import ProjectCardImage from "./ProjectCardImage";
import ProjectCardMetricRow, { ProjectCardMetric } from "./ProjectCardMetricRow";

type CardIcon = ComponentType<IconProps>;

export interface ProjectCardProps {
  title: string;
  organisationName: string;
  programmeName: string;
  country: string;
  imageUrl?: string | null;
  status: TagSubmissionState;
  plantingStatus?: ProgressState | null;
  treesGrown: ProjectCardMetric;
  areaRestored: ProjectCardMetric;
  jobsCreated: ProjectCardMetric;
  sitesCount: number;
  nurseriesCount: number;
  isIncomplete?: boolean;
  onSitesClick?: () => void;
  onNurseriesClick?: () => void;
  onReportsClick?: () => void;
  onViewProjectClick?: () => void;
  className?: string;
}

const DISABLED_COLOR = "neutral.500";

const ProjectCard: FC<ProjectCardProps> = ({
  title,
  organisationName,
  programmeName,
  country,
  imageUrl,
  status,
  plantingStatus,
  treesGrown,
  areaRestored,
  jobsCreated,
  sitesCount,
  nurseriesCount,
  isIncomplete = false,
  onSitesClick,
  onNurseriesClick,
  onReportsClick,
  onViewProjectClick,
  className
}) => {
  const t = useT();

  const details: { key: string; Icon?: CardIcon; text: string }[] = [
    { key: "organisation", Icon: OrganizationIcon, text: organisationName },
    { key: "programme", Icon: ProgrammeIcon, text: programmeName },
    { key: "country", text: country }
  ];

  const metrics: { key: string; Icon: CardIcon; label: string; metric: ProjectCardMetric; color: string }[] = [
    { key: "trees", Icon: TreeIcon, label: t("Trees Grown:"), metric: treesGrown, color: "secondary.600" },
    {
      key: "area",
      Icon: AreaHectaresIcon,
      label: t("Area Restored (ha):"),
      metric: areaRestored,
      color: "secondary.800"
    },
    { key: "jobs", Icon: JobsIcon, label: t("Jobs Created:"), metric: jobsCreated, color: "primary.600" }
  ];

  const actions: { key: string; Icon: CardIcon; label: string; onClick?: () => void }[] = [
    { key: "sites", Icon: SiteIcon, label: t("{count} Sites", { count: sitesCount }), onClick: onSitesClick },
    {
      key: "nurseries",
      Icon: NurseryIcon,
      label: t("{count} Nurseries", { count: nurseriesCount }),
      onClick: onNurseriesClick
    },
    { key: "reports", Icon: ReportsIcon, label: t("Reports"), onClick: onReportsClick }
  ];

  return (
    <Flex
      direction="column"
      width="100%"
      bg="secondary.neutral"
      borderRadius="0.5rem"
      boxShadow="xs"
      className={twMerge("overflow-hidden", className)}
    >
      <Flex gap={3} paddingX={4} paddingTop={3} paddingBottom={4}>
        <ProjectCardImage imageUrl={imageUrl} alt={title} />
        <Flex direction="column" justifyContent="flex-end" gap={1} minWidth={0} flex={1}>
          <Text textStyle="400-bold" color="primary.900">
            {title}
          </Text>
          <Flex alignItems="center" gap={2} paddingLeft={0.5} paddingBottom={1} flexWrap="wrap">
            {details.map(({ key, Icon, text }, index) => (
              <Fragment key={key}>
                {index > 0 && <EllipsisDivider color="primary.900" />}
                <Flex alignItems="center" gap={1}>
                  {Icon != null && <Icon boxSize="0.75rem" color="primary.900" />}
                  <Text textStyle="300" color="primary.900">
                    {text}
                  </Text>
                </Flex>
              </Fragment>
            ))}
          </Flex>
          <Flex gap={2} paddingTop={0.5} flexWrap="wrap">
            <TagSubmission state={status} size="small" />
            <ProgressTag state={plantingStatus ?? "not-available"} />
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
        {metrics.map(({ key, Icon, label, metric, color }) => (
          <ProjectCardMetricRow
            key={key}
            icon={<Icon boxSize="0.875rem" color={isIncomplete ? DISABLED_COLOR : color} />}
            label={label}
            metric={metric}
            color={color}
          />
        ))}
      </Flex>

      <Flex
        alignItems="center"
        justifyContent="space-between"
        gap={4}
        paddingLeft={2}
        paddingRight={4}
        paddingY={2}
        bg="neutral.100"
      >
        <Flex alignItems="center" gap={1}>
          {actions.map(({ key, Icon, label, onClick }, index) => (
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
                disabled={isIncomplete}
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
          rightIcon={<ChevronRightIcon boxSize="0.625rem" />}
          onClick={onViewProjectClick}
        >
          {t("View Project")}
        </Button>
      </Flex>
    </Flex>
  );
};

export default ProjectCard;

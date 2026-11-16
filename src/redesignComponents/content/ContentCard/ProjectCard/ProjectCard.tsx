import { Box, Flex, IconProps, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { ComponentType, FC, Fragment } from "react";
import Twemoji from "react-twemoji";
import { twMerge } from "tailwind-merge";

import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import ProgressTag, { ProgressState } from "@/redesignComponents/actions/Tags/ProgressTag/ProgressTag";
import TagSubmission, { TagSubmissionState } from "@/redesignComponents/actions/Tags/TagSubmission/TagSubmission";
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

import ProjectCardImage from "./ProjectCardImage";
import ProjectCardMetricRow, { ProjectCardMetric } from "./ProjectCardMetricRow";

type CardAction = {
  key: string;
  Icon: ComponentType<IconProps>;
  label: string;
  disabled: boolean;
  onClick?: () => void;
};

export interface ProjectCardProps {
  title: string;
  organisationName: string;
  programmeName: string;
  country: string;
  countryFlag?: string;
  imageUrl?: string | null;
  status: TagSubmissionState;
  plantingStatus?: ProgressState | null;
  metrics: ProjectCardMetric[];
  sitesCount: number;
  nurseriesCount?: number;
  hasReports: boolean;
  onSitesClick?: () => void;
  onNurseriesClick?: () => void;
  onReportsClick?: () => void;
  onViewProjectClick?: () => void;
  className?: string;
}

const ProjectCard: FC<ProjectCardProps> = ({
  title,
  organisationName,
  programmeName,
  country,
  countryFlag,
  imageUrl,
  status,
  plantingStatus,
  metrics,
  sitesCount,
  nurseriesCount,
  hasReports,
  onSitesClick,
  onNurseriesClick,
  onReportsClick,
  onViewProjectClick,
  className
}) => {
  const t = useT();

  const actions: CardAction[] = [
    {
      key: "sites",
      Icon: SiteIcon,
      label: t("{count} Sites", { count: sitesCount }),
      disabled: sitesCount === 0,
      onClick: onSitesClick
    },
    nurseriesCount == null
      ? undefined
      : {
          key: "nurseries",
          Icon: NurseryIcon,
          label: t("{count} Nurseries", { count: nurseriesCount }),
          disabled: nurseriesCount === 0,
          onClick: onNurseriesClick
        },
    { key: "reports", Icon: ReportsIcon, label: t("Reports"), disabled: !hasReports, onClick: onReportsClick }
  ].filter(isNotNull);

  return (
    <Flex
      direction="column"
      width="100%"
      minWidth={0}
      bg="secondary.neutral"
      borderRadius="0.5rem"
      boxShadow="xs"
      className={twMerge("overflow-hidden", className)}
    >
      <Flex gap={3} paddingX={4} paddingTop={3} paddingBottom={4}>
        <ProjectCardImage imageUrl={imageUrl} alt={title} />
        <Flex direction="column" justifyContent="flex-end" gap={1} minWidth={0} flex={1}>
          <Text textStyle="400-bold" color="primary.900" className="truncate" title={title}>
            {title}
          </Text>
          <Flex alignItems="center" columnGap={2} paddingLeft={0.5} paddingBottom={1} flexWrap="wrap">
            <Flex alignItems="center" gap={1}>
              <OrganizationIcon boxSize="0.75rem" color="primary.900" />
              <Text textStyle="300" color="primary.900">
                {organisationName}
              </Text>
            </Flex>
            <EllipsisDivider color="primary.900" />
            <Flex alignItems="center" gap={1}>
              <ProgrammeIcon boxSize="0.75rem" color="primary.900" />
              <Text textStyle="300" color="primary.900">
                {programmeName}
              </Text>
            </Flex>
            <EllipsisDivider color="primary.900" />
            <Flex alignItems="center" gap={1}>
              {countryFlag != null && <Twemoji options={{ className: "h-3 w-3" }}>{countryFlag}</Twemoji>}
              <Text textStyle="300" color="primary.900">
                {country}
              </Text>
            </Flex>
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
        {metrics.map(metric => (
          <ProjectCardMetricRow key={metric.key} metric={metric} />
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

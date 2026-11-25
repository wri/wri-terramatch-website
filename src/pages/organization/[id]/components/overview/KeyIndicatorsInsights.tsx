import { Box, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { sumBy, uniq } from "lodash";
import { FC, ReactNode, useMemo } from "react";

import MetricCardsRow from "@/components/extensive/PageElements/MetricCardsRow/MetricCardsRow";
import { Framework } from "@/context/framework.provider";
import MetricCard from "@/redesignComponents/dataDisplay/Metrics/MetricCard";
import { AreaHectaresIcon, JobsIcon, TreeIcon, TreePlantingIcon } from "@/redesignComponents/foundations/Icons";

import { OrganisationProjectTotals } from "./types";

const CARD_CLASS_NAME = "min-w-0 flex-1 mobile:min-w-full";

type KeyIndicator = {
  type: string;
  title: string;
  tooltip: string;
  icon: ReactNode;
  color?: string;
  progress: number;
  goal: number;
};

const getTreesPlanted = (project: OrganisationProjectTotals) => project.treesPlantedCount ?? 0;

const getTreesGrowing = (project: OrganisationProjectTotals) =>
  getTreesPlanted(project) + (project.seedsPlantedCount ?? 0) + project.regeneratedTreesCount;

/**
 * The framework shared by every project, or `undefined` when the projects span several frameworks (or there are
 * none). Framework-specific labels only apply when all the aggregated projects follow the same rules.
 * TODO TM-4219: confirm with product which labels a multi-framework organization should show.
 */
const getSharedFramework = (projects: OrganisationProjectTotals[]) => {
  const frameworks = uniq(projects.map(({ frameworkKey }) => frameworkKey));
  return frameworks.length === 1 ? frameworks[0] : undefined;
};

const useKeyIndicators = (projects: OrganisationProjectTotals[]): KeyIndicator[] => {
  const t = useT();

  return useMemo(() => {
    const framework = getSharedFramework(projects);
    const isPpc = framework === Framework.PPC;
    const isHbf = framework === Framework.HBF;

    const treesCard = isPpc
      ? {
          title: t("Trees Growing"),
          tooltip: t(
            "This is the sum of trees planted, seeds planted, and estimated trees regenerating, in all approved reports across this organization’s projects."
          ),
          icon: <TreeIcon />,
          progress: sumBy(projects, getTreesGrowing)
        }
      : isHbf
      ? {
          title: t("Saplings Growing"),
          tooltip: t(
            "This is the sum of trees planted, seeds planted, and trees regenerating, in all approved reports across this organization’s projects."
          ),
          icon: <TreeIcon />,
          progress: sumBy(projects, getTreesGrowing)
        }
      : {
          title: t("Trees Planted"),
          tooltip: t("This is the sum of trees planted in the site reports of this organization’s projects."),
          icon: <TreePlantingIcon />,
          progress: sumBy(projects, getTreesPlanted)
        };

    const peopleCard: KeyIndicator = isPpc
      ? {
          type: "workdays",
          title: t("Workdays"),
          tooltip: t(
            "This is the sum of project- and site-level workdays in all approved reports across this organization’s projects."
          ),
          icon: <JobsIcon />,
          progress: sumBy(projects, "combinedWorkdayCount"),
          goal: 0
        }
      : {
          type: "jobsCreated",
          title: t("Jobs Created"),
          tooltip: isHbf
            ? t(
                "This is the sum of full-time and part-time jobs in all approved reports across this organization’s projects."
              )
            : t(
                "This is the sum of full-time and part-time jobs in all approved project reports across this organization’s projects."
              ),
          icon: <JobsIcon />,
          progress: sumBy(projects, "totalJobsCreated"),
          goal: sumBy(projects, ({ jobsCreatedGoal }) => jobsCreatedGoal ?? 0)
        };

    return [
      {
        type: "treesRestored",
        color: "secondary.600",
        goal: sumBy(projects, ({ treesGrownGoal }) => treesGrownGoal ?? 0),
        ...treesCard
      },
      {
        type: "hectaresRestored",
        title: t("Area Restored (ha)"),
        tooltip: t("Number of hectares within approved polygons across this organization’s projects."),
        icon: <AreaHectaresIcon />,
        color: "secondary.700",
        progress: sumBy(projects, ({ totalHectaresRestoredSum }) => totalHectaresRestoredSum ?? 0),
        goal: sumBy(projects, ({ totalHectaresRestoredGoal }) => totalHectaresRestoredGoal ?? 0)
      },
      peopleCard
    ];
  }, [projects, t]);
};

type KeyIndicatorsInsightsProps = {
  projects: OrganisationProjectTotals[];
};

const KeyIndicatorsInsights: FC<KeyIndicatorsInsightsProps> = ({ projects }) => {
  const t = useT();
  const indicators = useKeyIndicators(projects);

  if (projects.length === 0) {
    return (
      <Box backgroundColor="neutral.100" padding={5} borderRadius={1}>
        <Text textStyle="400" color="neutral.900">
          {t("Key indicators will appear once this organization has projects.")}
        </Text>
      </Box>
    );
  }

  return (
    <MetricCardsRow>
      {indicators.map(({ type, title, tooltip, icon, color, progress, goal }) => {
        const showProgress = goal > 0;
        return (
          <MetricCard
            key={type}
            type={type}
            title={title}
            progress={progress}
            goal={goal}
            variant={showProgress ? "donutChart" : "large"}
            icon={icon}
            color={color}
            className={showProgress ? CARD_CLASS_NAME : `${CARD_CLASS_NAME} !h-auto`}
            tooltipContent={
              <Box>
                <Text textStyle="300-bold">{title}</Text>
                <Text textStyle="300">{tooltip}</Text>
              </Box>
            }
          />
        );
      })}
    </MetricCardsRow>
  );
};

export default KeyIndicatorsInsights;

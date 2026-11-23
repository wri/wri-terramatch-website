import { Box } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { sumBy } from "lodash";
import { FC, ReactNode, useMemo } from "react";

import MetricCardsRow from "@/components/extensive/PageElements/MetricCardsRow/MetricCardsRow";
import { Framework } from "@/context/framework.provider";
import { ProjectFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import MetricCard from "@/redesignComponents/dataDisplay/Metrics/MetricCard";
import { AreaHectaresIcon, JobsIcon, TreeIcon, TreePlantingIcon } from "@/redesignComponents/foundations/Icons";

export type OrganisationProjectTotals = Pick<
  ProjectFullDto,
  | "uuid"
  | "frameworkKey"
  | "treesPlantedCount"
  | "seedsPlantedCount"
  | "regeneratedTreesCount"
  | "treesGrownGoal"
  | "totalHectaresRestoredSum"
  | "totalHectaresRestoredGoal"
  | "totalJobsCreated"
  | "jobsCreatedGoal"
  | "combinedWorkdayCount"
>;

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

const useKeyIndicators = (projects: OrganisationProjectTotals[]): KeyIndicator[] => {
  const t = useT();

  return useMemo(() => {
    const framework = projects[0]?.frameworkKey;
    const isPpc = framework === Framework.PPC;
    const isHbf = framework === Framework.HBF;

    const treesCard = isPpc
      ? {
          title: t("Trees Growing"),
          tooltip: t(
            "This is the sum of trees planted, seeds planted, and estimated trees regenerating, in all approved reports for this project."
          ),
          icon: <TreeIcon />,
          progress: sumBy(projects, getTreesGrowing)
        }
      : isHbf
      ? {
          title: t("Saplings Growing"),
          tooltip: t(
            "This is the sum of trees planted, seeds planted, and trees regenerating, in all approved reports for this project."
          ),
          icon: <TreeIcon />,
          progress: sumBy(projects, getTreesGrowing)
        }
      : {
          title: t("Trees Planted"),
          tooltip: t("This is the sum of trees planted in this project’s site reports."),
          icon: <TreePlantingIcon />,
          progress: sumBy(projects, getTreesPlanted)
        };

    const peopleCard: KeyIndicator = isPpc
      ? {
          type: "workdays",
          title: t("Workdays"),
          tooltip: t("This is the sum of project- and site-level workdays in all approved reports for this project."),
          icon: <JobsIcon />,
          progress: sumBy(projects, "combinedWorkdayCount"),
          goal: 0
        }
      : {
          type: "jobsCreated",
          title: t("Jobs Created"),
          tooltip: isHbf
            ? t("This is the sum of full-time and part-time jobs in all approved reports for this project.")
            : t("This is the sum of full-time and part-time jobs in all approved project reports for this project."),
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
        tooltip: t("Number of hectares within approved polygons for this project."),
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
  const indicators = useKeyIndicators(projects);

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
              <Box textStyle="300">
                <b>{title}</b>
                <br />
                {tooltip}
              </Box>
            }
          />
        );
      })}
    </MetricCardsRow>
  );
};

export default KeyIndicatorsInsights;

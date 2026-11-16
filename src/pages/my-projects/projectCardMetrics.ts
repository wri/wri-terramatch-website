import { useT } from "@transifex/react";

import { Framework } from "@/context/framework.provider";
import { ProjectCardMetric } from "@/redesignComponents/content/ContentCard/ProjectCard/ProjectCardMetricRow";
import { AreaHectaresIcon, JobsIcon, TreeIcon } from "@/redesignComponents/foundations/Icons";

import { MyProject } from "./myProjects.mock";

const TREES_COLOR = "secondary.600";
const AREA_COLOR = "secondary.800";
const JOBS_COLOR = "primary.600";

export const getProjectCardMetrics = (
  t: ReturnType<typeof useT>,
  framework: Framework,
  project: MyProject
): ProjectCardMetric[] => {
  const trees = {
    key: "trees",
    Icon: TreeIcon,
    color: TREES_COLOR,
    value: project.treesCount,
    goal: project.treesGoal
  };
  const area: ProjectCardMetric = {
    key: "area",
    Icon: AreaHectaresIcon,
    color: AREA_COLOR,
    value: project.hectaresRestored,
    goal: project.hectaresGoal,
    label: t("Area Restored (ha):"),
    tooltipContent: t("Number of hectares within approved polygons for this project.")
  };
  const jobs = { key: "jobs", Icon: JobsIcon, color: JOBS_COLOR, value: project.jobsCount };

  if (framework === Framework.PPC) {
    return [
      {
        ...trees,
        label: t("Trees Growing:"),
        tooltipContent: t(
          "This is the sum of trees planted, seeds planted, and estimated trees regenerating, in all approved reports for this project."
        )
      },
      area,
      {
        ...jobs,
        label: t("Workdays"),
        tooltipContent: t(
          "This is the sum of project- and site-level workdays in all approved reports for this project."
        )
      }
    ];
  }

  if (framework === Framework.HBF) {
    return [
      {
        ...trees,
        label: t("Saplings Growing:"),
        tooltipContent: t(
          "This is the sum of trees planted, seeds planted, and trees regenerating, in all approved reports for this project."
        )
      },
      area,
      {
        ...jobs,
        goal: project.jobsGoal,
        label: t("Jobs Created:"),
        tooltipContent: t("This is the sum of full-time and part-time jobs in all approved reports for this project.")
      }
    ];
  }

  return [
    {
      ...trees,
      label: t("Trees Planted:"),
      tooltipContent: t("This is the sum of trees planted in this project’s site reports.")
    },
    area,
    {
      ...jobs,
      goal: project.jobsGoal,
      label: t("Jobs Created:"),
      tooltipContent: t(
        "This is the sum of full-time and part-time jobs in all approved project reports for this project."
      )
    }
  ];
};

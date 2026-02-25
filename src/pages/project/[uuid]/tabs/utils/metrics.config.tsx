import { ProjectFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { AreaHectares, Jobs, Regeneration, Seeds, Tree } from "@/redesignComponents/foundations/Icons";

import { calculateHectaresPercentage, calculateTreesRestored } from "./metrics.utils";

export const buildProjectMetrics = (project: ProjectFullDto, t: any) => {
  const totalTreesRestoredCount = calculateTreesRestored(project);

  const totalHectaresRestored = project.totalHectaresRestoredSum ?? 0;
  const totalHectaresRestoredGoal = project.totalHectaresRestoredGoal ?? 0;

  const hectaresTargetPercentage = calculateHectaresPercentage(totalHectaresRestored, totalHectaresRestoredGoal);

  return [
    {
      title: t("Trees Planted"),
      progress: totalTreesRestoredCount,
      goal: project.treesGrownGoal ?? 0,
      icon: <Tree />,
      color: "secondary.600",
      type: "treesRestored",
      tooltip: (
        <>
          <b>{t("Trees Planted")}</b>
          <br />
          {t("Number of trees planted for this project")}
        </>
      )
    },
    {
      title: t("Trees Regenerated"),
      progress: project.regeneratedTreesCount ?? 0,
      goal: project.goalTreesRestoredAnr ?? 0,
      icon: <Regeneration />,
      color: "secondary.600",
      type: "treesRestored",
      tooltip: (
        <>
          <b>{t("Trees Regenerated")}</b>
          <br />
          {t("Number of trees regenerated for this project")}
        </>
      )
    },
    {
      title: t("Seedlings Grown"),
      progress: project.seedsPlantedCount ?? 0,
      goal: project.seedsGrownGoal ?? 0,
      icon: <Seeds />,
      color: "secondary.600",
      type: "saplingsRestored",
      tooltip: (
        <>
          <b>{t("Seedlings Grown")}</b>
          <br />
          {t("Number of seedlings grown for this project")}
        </>
      )
    },
    {
      title: t("Area Restored (ha)"),
      progress: totalHectaresRestored,
      goal: totalHectaresRestoredGoal,
      icon: <AreaHectares />,
      color: "secondary.700",
      type: "hectaresRestored",
      tooltip: (
        <>
          <b>{t("Area Restored (ha)")}</b>
          <br />
          {t("Number of hectares within approved polygons for this project")}
          {hectaresTargetPercentage != null && (
            <>
              <br />
              {t("{percentage}% of target", { percentage: hectaresTargetPercentage })}
            </>
          )}
        </>
      )
    },
    {
      title: t("Jobs Created"),
      progress: project.totalJobsCreated,
      goal: project.jobsCreatedGoal ?? 0,
      icon: <Jobs />,
      type: "jobsCreated",
      tooltip: (
        <>
          <b>{t("Jobs Created")}</b>
          <br />
          {t("Number of jobs created for this project")}
        </>
      )
    }
  ];
};

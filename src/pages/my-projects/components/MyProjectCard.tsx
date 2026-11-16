import { useT } from "@transifex/react";
import { useRouter } from "next/router";
import { FC, useMemo } from "react";

import { shouldHideNurseries, useFramework } from "@/context/framework.provider";
import ProjectCard from "@/redesignComponents/content/ContentCard/ProjectCard/ProjectCard";
import { countryCodeToFlag } from "@/redesignComponents/content/headers/PageHeaders/ProjectHeader/projectHeader.utils";

import { MyProject } from "../myProjects.mock";
import { getProjectCardMetrics } from "../projectCardMetrics";

type MyProjectCardProps = {
  project: MyProject;
};

const MyProjectCard: FC<MyProjectCardProps> = ({ project }) => {
  const t = useT();
  const router = useRouter();
  const framework = useFramework(project.frameworkKey);
  const metrics = useMemo(() => getProjectCardMetrics(t, framework, project), [framework, project, t]);

  const handlers = useMemo(() => {
    const projectPath = `/project/${project.uuid}`;
    return {
      onSitesClick: () => void router.push(`${projectPath}?tab=sites`),
      onNurseriesClick: () => void router.push(`${projectPath}?tab=nurseries`),
      onReportsClick: () => void router.push(`${projectPath}?tab=reports`),
      onViewProjectClick: () => void router.push(projectPath)
    };
  }, [project.uuid, router]);

  return (
    <ProjectCard
      title={project.name}
      organisationName={project.organisationName}
      programmeName={project.programmeName}
      country={project.countryName}
      countryFlag={countryCodeToFlag(project.countryCode)}
      imageUrl={project.imageUrl}
      status={project.status}
      plantingStatus={project.plantingStatus}
      metrics={metrics}
      sitesCount={project.sitesCount}
      nurseriesCount={shouldHideNurseries(framework) ? undefined : project.nurseriesCount}
      hasReports={project.hasReports}
      {...handlers}
    />
  );
};

export default MyProjectCard;

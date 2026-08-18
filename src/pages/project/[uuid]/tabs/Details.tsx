import { FC } from "react";

import PageContent from "@/components/extensive/PageElements/PageContent/PageContent";
import PageItem from "@/components/extensive/PageElements/PageItem/PageItem";
import ProjectDataTable from "@/components/projectData/ProjectDataTable";
import { ProjectFullDto } from "@/generated/v3/entityService/entityServiceSchemas";

interface ProjectDetailsTabProps {
  project: ProjectFullDto;
}

const ProjectDetailTab: FC<ProjectDetailsTabProps> = ({ project }) => {
  // The editable detail form now lives on the Overview tab; this tab keeps only the sites/polygons
  // data table.
  return (
    <PageContent className="gap-2 bg-theme-neutral-100 sm:px-32">
      <PageItem title="Sites & Polygons" flexProps={{ width: "100%" }}>
        <ProjectDataTable projectUuid={project.uuid} project={project} />
      </PageItem>
    </PageContent>
  );
};

export default ProjectDetailTab;

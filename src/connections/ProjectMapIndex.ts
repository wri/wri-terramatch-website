import { v3Resource } from "@/connections/util/apiConnectionFactory";
import { connectionHook } from "@/connections/util/connectionShortcuts";
import {
  projectsMapIndex,
  ProjectsMapIndexQueryParams
} from "@/generated/v3/researchService/researchServiceComponents";
import { ProjectMapIndexDto } from "@/generated/v3/researchService/researchServiceSchemas";

const projectMapIndexConnection = v3Resource("projectMapIndexes", projectsMapIndex)
  .singleByFilter<ProjectMapIndexDto, ProjectsMapIndexQueryParams>()
  .buildConnection();

export const useProjectMapIndex = connectionHook(projectMapIndexConnection);

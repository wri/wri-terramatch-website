import { v3Resource } from "@/connections/util/apiConnectionFactory";
import { connectionHook } from "@/connections/util/connectionShortcuts";
import {
  projectsFilterOptions,
  ProjectsFilterOptionsQueryParams
} from "@/generated/v3/researchService/researchServiceComponents";
import { ProjectFilterOptionsDto } from "@/generated/v3/researchService/researchServiceSchemas";

const projectFilterOptionsConnection = v3Resource("projectFilterOptions", projectsFilterOptions)
  .singleByFilter<ProjectFilterOptionsDto, ProjectsFilterOptionsQueryParams>()
  .enabledProp()
  .buildConnection();

export const useProjectFilterOptions = connectionHook(projectFilterOptionsConnection);

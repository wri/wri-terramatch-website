import { connectionLoader } from "@/connections/util/connectionShortcuts";
import {
  projectPitchGet,
  projectPitchIndex,
  ProjectPitchIndexQueryParams
} from "@/generated/v3/entityService/entityServiceComponents";
import { ProjectPitchDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { Filter } from "@/types/connection";

import { v3Resource } from "./util/apiConnectionFactory";

const projectPitchConnection = v3Resource("projectPitches", projectPitchGet)
  .singleResource<ProjectPitchDto>(({ id }) => (id == null ? undefined : { pathParams: { uuid: id } }))
  .isLoading()
  .buildConnection();

const projectPitchesConnection = v3Resource("projectPitches", projectPitchIndex)
  .index<ProjectPitchDto>()
  .pagination()
  .filter<Filter<ProjectPitchIndexQueryParams>>()
  .buildConnection();

export const loadProjectPitch = connectionLoader(projectPitchConnection);
export const loadProjectPitches = connectionLoader(projectPitchesConnection);

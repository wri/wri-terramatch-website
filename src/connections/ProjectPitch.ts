import { connectionLoader } from "@/connections/util/connectionShortcuts";
import {
  projectPitchGet,
  projectPitchIndex,
  ProjectPitchIndexQueryParams
} from "@/generated/v3/entityService/entityServiceComponents";
import { ProjectPitchDto } from "@/generated/v3/entityService/entityServiceSchemas";

import { v3Endpoint } from "./util/apiConnectionFactory";

const projectPitchConnection = v3Endpoint("projectPitches", projectPitchGet)
  .singleResource<ProjectPitchDto>(({ id }) => (id == null ? undefined : { pathParams: { uuid: id } }))
  .isLoading()
  .buildConnection();

type ProjectPitchIndexFilter = Omit<
  ProjectPitchIndexQueryParams,
  "page[size]" | "page[number]" | "sort[field]" | "sort[direction]"
>;

const projectPitchesConnection = v3Endpoint("projectPitches", projectPitchIndex)
  .index<ProjectPitchDto>()
  .pagination()
  .filter<ProjectPitchIndexFilter>()
  .buildConnection();

export const loadProjectPitch = connectionLoader(projectPitchConnection);
export const loadProjectPitches = connectionLoader(projectPitchesConnection);

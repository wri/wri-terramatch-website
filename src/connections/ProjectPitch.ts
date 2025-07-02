import { connectionLoader } from "@/connections/util/connectionShortcuts";
import {
  projectPitchGet,
  ProjectPitchGetVariables,
  projectPitchIndex,
  ProjectPitchIndexQueryParams,
  ProjectPitchIndexVariables
} from "@/generated/v3/entityService/entityServiceComponents";
import { ProjectPitchDto } from "@/generated/v3/entityService/entityServiceSchemas";
import {
  projectPitchGetFetchFailed,
  projectPitchGetIsFetching,
  projectPitchIndexFetchFailed,
  projectPitchIndexIndexMeta
} from "@/generated/v3/entityService/entityServiceSelectors";

import { ApiConnectionFactory } from "./util/apiConnectionFactory";

const projectPitchConnection = ApiConnectionFactory.singleResource<ProjectPitchDto, ProjectPitchGetVariables>(
  "projectPitches",
  projectPitchGet,
  ({ id }) => (id == null ? undefined : { pathParams: { uuid: id } })
)
  .isLoading(projectPitchGetIsFetching)
  .loadFailure(projectPitchGetFetchFailed)
  .buildConnection();

type ProjectPitchIndexFilter = Omit<
  ProjectPitchIndexQueryParams,
  "page[size]" | "page[number]" | "sort[field]" | "sort[direction]"
>;

const projectPitchesConnection = ApiConnectionFactory.index<ProjectPitchDto, ProjectPitchIndexVariables>(
  "projectPitches",
  projectPitchIndex,
  projectPitchIndexIndexMeta
)
  .pagination()
  .loadFailure(projectPitchIndexFetchFailed)
  .filter<ProjectPitchIndexFilter>()
  .buildConnection();

export const loadProjectPitch = connectionLoader(projectPitchConnection);
export const loadProjectPitches = connectionLoader(projectPitchesConnection);

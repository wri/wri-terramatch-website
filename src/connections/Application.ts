import { v3Resource } from "@/connections/util/apiConnectionFactory";
import { connectionLoader } from "@/connections/util/connectionShortcuts";
import {
  applicationGet,
  ApplicationGetQueryParams,
  applicationIndex,
  ApplicationIndexQueryParams
} from "@/generated/v3/entityService/entityServiceComponents";
import { ApplicationDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { Filter } from "@/types/connection";

const applicationConnection = v3Resource("applications", applicationGet)
  .singleResource<ApplicationDto>(({ id }) => (id == null ? undefined : { pathParams: { uuid: id } }))
  .isLoading()
  .addProps<ApplicationGetQueryParams>(({ translated, sideloads }) => ({ queryParams: { translated, sideloads } }))
  .buildConnection();

const applicationsConnection = v3Resource("applications", applicationIndex)
  .index<ApplicationDto>()
  .pagination()
  .filter<Filter<ApplicationIndexQueryParams>>()
  .buildConnection();

export const loadApplicationIndex = connectionLoader(applicationsConnection);
export const loadApplication = connectionLoader(applicationConnection);

import { v3Resource } from "@/connections/util/apiConnectionFactory";
import { connectionHook, connectionLoader } from "@/connections/util/connectionShortcuts";
import {
  applicationGet,
  ApplicationGetQueryParams,
  applicationHistoryGet,
  applicationIndex,
  ApplicationIndexQueryParams
} from "@/generated/v3/entityService/entityServiceComponents";
import { ApplicationDto, ApplicationHistoryDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { Filter } from "@/types/connection";

const applicationConnection = v3Resource("applications", applicationGet)
  .singleResource<ApplicationDto>(({ id }) => (id == null ? undefined : { pathParams: { uuid: id } }))
  .isLoading()
  .addProps<ApplicationGetQueryParams>(({ translated, sideloads }) => ({ queryParams: { translated, sideloads } }))
  .buildConnection();

const applicationHistoryConnection = v3Resource("applicationHistories", applicationHistoryGet)
  .singleResource<ApplicationHistoryDto>(({ id }) => (id == null ? undefined : { pathParams: { uuid: id } }))
  .enabledProp()
  .buildConnection();

export const applicationsConnection = v3Resource("applications", applicationIndex)
  .index<ApplicationDto>()
  .pagination()
  .filter<Filter<ApplicationIndexQueryParams>>()
  .enabledProp()
  .buildConnection();

export const loadApplicationIndex = connectionLoader(applicationsConnection);
export const loadApplication = connectionLoader(applicationConnection);

export const useApplication = connectionHook(applicationConnection);
export const useApplications = connectionHook(applicationsConnection);
export const useApplicationHistory = connectionHook(applicationHistoryConnection);

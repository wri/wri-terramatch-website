import { DataProvider, DeleteManyParams, DeleteParams, GetListParams, GetListResult, GetOneParams } from "react-admin";

import { EntityFullDto, EntityIndexConnectionProps, EntityLightDto } from "@/connections/Entity";
import {
  DataConnection,
  FilterProp,
  IdProp,
  IndexConnection,
  LoadFailureConnection,
  SideloadsProp
} from "@/connections/util/apiConnectionFactory";
import { JsonApiResource } from "@/store/apiSlice";
import { PaginatedConnectionProps } from "@/types/connection";

import { v3ErrorForRA } from "./error";

interface ListQueryParams extends Record<string, unknown> {
  search?: string;
  filter?: string;
  sort?: string;
  per_page?: number;
  page?: number;
}

const getFilterKey = (original: string, replace?: { key: string; replaceWith: string }) => {
  if (!replace) {
    return original;
  }

  return replace.replaceWith;
};

export const raConnectionProps = <FilterType, SideloadType>(params: GetListParams) => {
  const filter = { ...params.filter };
  if (filter.frameworkKey != null && !Array.isArray(filter.frameworkKey)) {
    filter.frameworkKey = [filter.frameworkKey];
  }

  const queryParams: PaginatedConnectionProps & FilterProp<FilterType> & SideloadsProp<SideloadType> = {
    pageSize: params.pagination.perPage,
    pageNumber: params.pagination.page,
    filter
  };

  if (params.sort.field != null) {
    queryParams.sortField = params.sort.field;
    queryParams.sortDirection = (params.sort.order as "ASC" | "DESC") ?? "ASC";
  }
  if (params.meta?.sideloads) {
    queryParams.sideloads = params.meta.sideloads;
  }

  return queryParams;
};

export const raListParamsToQueryParams = (
  params: GetListParams,
  sortableList?: string[],
  filterReplaceList: { key: string; replaceWith: string }[] = [],
  sortReplaceList: { key: string; replaceWith: string }[] = [],
  extraParams: Record<string, unknown> | null = null
) => {
  const queryParams: ListQueryParams = {
    per_page: params.pagination.perPage,
    page: params.pagination.page
  };

  if (params.sort.field) {
    params.sort.field = getFilterKey(
      params.sort.field.replace(".", "_"),
      sortReplaceList.find(item => item.key === params.sort.field)
    );
  }

  Object.entries(params.filter).forEach(([k, v]) => {
    if (k === "search" || k === "q") return;
    queryParams[
      `filter[${getFilterKey(
        k,
        filterReplaceList.find(item => item.key === k)
      )}]`
    ] = v;
  });

  const search = params.filter.search || params.filter.q;
  if (search) queryParams.search = search;

  if (sortableList && sortableList.includes(params.sort.field)) {
    queryParams.sort = `${params.sort.order === "DESC" ? "-" : ""}${params.sort.field}`;
  } else if (!sortableList) {
    queryParams.sort = `${params.sort.order === "DESC" ? "-" : ""}${params.sort.field}`;
  }

  if (extraParams != null) {
    Object.entries(extraParams).forEach(([k, v]) => {
      queryParams[k] = v;
    });
  }

  return queryParams as any;
};

interface ApiListResponse {
  data?: { [index: string]: any; uuid?: string }[];
  meta?: any;
  included?: JsonApiResource[];
}

export const apiListResponseToRAListResult = (response: ApiListResponse): GetListResult => ({
  data: response?.data?.map(item => ({ ...item, id: item.uuid })) || [],
  total: (response?.meta?.total || response?.data?.length) as number,
  pageInfo: {
    hasNextPage: response?.meta?.last_page > response?.meta?.current_page || false,
    hasPreviousPage: response?.meta?.current_page > 1 || false
  }
});

type EntityListLoader<DTO extends EntityLightDto> = (
  props: EntityIndexConnectionProps
) => Promise<IndexConnection<DTO> & LoadFailureConnection>;
type EntitySingleLoader<DTO extends EntityFullDto> = (
  props: IdProp
) => Promise<DataConnection<DTO> & LoadFailureConnection>;
type EntityDeleter = (id: string) => Promise<void>;

export const connectionDataProvider = <LightDto extends EntityLightDto, FullDto extends EntityFullDto>(
  name: string,
  listLoader: EntityListLoader<LightDto>,
  singleLoader: EntitySingleLoader<FullDto>,
  deleter: EntityDeleter
): Partial<DataProvider> => ({
  getList: async <RecordType>(_: string, params: GetListParams) => {
    const connected = await listLoader(raConnectionProps(params));
    if (connected.loadFailure != null) {
      throw v3ErrorForRA(`${name} index fetch failed`, connected.loadFailure);
    }

    return {
      data: (connected.data?.map(entity => ({ ...entity, id: entity.uuid })) ?? []) as RecordType[],
      total: connected.indexTotal
    };
  },

  getOne: async <RecordType>(_: string, { id }: GetOneParams) => {
    const connected = await singleLoader({ id });
    if (connected.loadFailure != null) {
      throw v3ErrorForRA(`${name} get fetch failed`, connected.loadFailure);
    }

    return { data: { ...connected.data, id: connected.data!.uuid } } as RecordType;
  },

  delete: async <RecordType>(_: string, { id }: DeleteParams) => {
    try {
      await deleter(id);
      return { data: { id } } as RecordType;
    } catch (err) {
      throw v3ErrorForRA(`${name} delete failed`, err);
    }
  },

  deleteMany: async <RecordType>(_: string, { ids }: DeleteManyParams) => {
    try {
      for (const id of ids) {
        await deleter(id);
      }

      return { data: ids } as RecordType;
    } catch (err) {
      throw v3ErrorForRA(`${name} deleteMany failed`, err);
    }
  }
});

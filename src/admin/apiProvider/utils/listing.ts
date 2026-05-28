import { DataProvider, DeleteManyParams, DeleteParams, GetListParams, GetOneParams } from "react-admin";

import { EntityFullDto, EntityIndexConnectionProps, EntityLightDto } from "@/connections/Entity";
import {
  DataConnection,
  FilterProp,
  IdProp,
  IndexConnection,
  LoadFailureConnection,
  SideloadsProp
} from "@/connections/util/apiConnectionFactory";
import { PaginatedConnectionProps } from "@/types/connection";

import { v3ErrorForRA } from "./error";

export const raConnectionProps = <FilterType, SideloadType>(params: GetListParams) => {
  const filter: Record<string, unknown> = { ...params.filter };

  if (filter.frameworkKey != null && !Array.isArray(filter.frameworkKey)) {
    filter.frameworkKey = [filter.frameworkKey];
  }

  if (filter.q != null && filter.search == null) {
    filter.search = filter.q;
    delete filter.q;
  }

  const queryParams: PaginatedConnectionProps & FilterProp<FilterType> & SideloadsProp<SideloadType> = {
    pageSize: params.pagination?.perPage,
    pageNumber: params.pagination?.page,
    filter: filter as FilterType
  };

  if (params.sort?.field != null) {
    queryParams.sortField = params.sort?.field;
    queryParams.sortDirection = (params.sort?.order as "ASC" | "DESC") ?? "ASC";
  }
  if (params.meta?.sideloads) {
    queryParams.sideloads = params.meta.sideloads;
  }

  return queryParams;
};

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

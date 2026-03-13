import { DataProvider, Identifier } from "react-admin";

import { loadUser, loadUserIndex } from "@/connections/User";
import {
  DeleteV2AdminUsersUUIDError,
  fetchDeleteV2AdminUsersUUID,
  fetchGetV2AdminUsers,
  fetchGetV2AdminUsersMulti,
  fetchPostV2AdminUsersCreate,
  fetchPutV2AdminUsersUUID,
  GetV2AdminUsersMultiError,
  PostV2AdminUsersCreateError,
  PutV2AdminUsersUUIDError
} from "@/generated/apiComponents";
import { V2AdminUserRead } from "@/generated/apiSchemas";
import { UserDto } from "@/generated/v3/userService/userServiceSchemas";

import { getFormattedErrorForRA, v3ErrorForRA } from "../utils/error";
import { apiListResponseToRAListResult, raConnectionProps, raListParamsToQueryParams } from "../utils/listing";

const normalizeUserObject = (item: V2AdminUserRead) => ({
  ...item,
  id: item.uuid as Identifier,
  //@ts-ignore
  role: item.role,
  //@ts-ignore
  monitoring_organisations: item?.monitoring_organisations?.map(item => item.uuid)
});

export const userDataProvider: DataProvider = {
  //@ts-ignore
  async create(__, params) {
    try {
      const response = await fetchPostV2AdminUsersCreate({
        body: params.data
      });

      // @ts-expect-error
      return { data: { ...response.data, id: response.id } };
    } catch (err) {
      throw getFormattedErrorForRA(err as PostV2AdminUsersCreateError);
    }
  },
  //@ts-ignore
  async getList(_, params) {
    const connected = await loadUserIndex(raConnectionProps(params));
    if (connected.loadFailure != null) {
      throw v3ErrorForRA("Form index fetch failed", connected.loadFailure);
    }

    return {
      data: (connected.data?.map(user => ({ ...user, id: user.uuid })) ?? []) as UserDto[],
      total: connected.indexTotal
    };
  },

  //@ts-ignore
  async getOne<RecordType>(_: string, { id }: GetOneParams) {
    // Disable translation for admin data provider; forms must be edited in English so that the
    // labels that will be translated from the DB are in English as the source language.
    const connected = await loadUser({ id });
    console.log(connected);
    if (connected.loadFailure != null) {
      throw v3ErrorForRA("User get fetch failed", connected.loadFailure);
    }

    return { data: { ...connected.data, id: connected.data!.uuid } } as RecordType;
  },

  async getMany(_, params) {
    try {
      const response = await fetchGetV2AdminUsersMulti({ queryParams: { ids: params.ids.join(",") } });
      //@ts-ignore
      return { data: response.data?.map(item => normalizeUserObject(item)) };
    } catch (err) {
      throw getFormattedErrorForRA(err as GetV2AdminUsersMultiError);
    }
  },

  async getManyReference(_, params) {
    const res = await fetchGetV2AdminUsers({
      queryParams: {
        ...raListParamsToQueryParams(params),
        ["filter[organisation_uuid]"]: params.id
      }
    });

    return apiListResponseToRAListResult(res);
  },

  //@ts-ignore
  async delete(_, params) {
    try {
      await fetchDeleteV2AdminUsersUUID({
        pathParams: { uuid: params.id as string }
      });

      return { data: { id: params.id } };
    } catch (err) {
      throw getFormattedErrorForRA(err as DeleteV2AdminUsersUUIDError);
    }
  },

  async deleteMany(_, params) {
    try {
      for (const id of params.ids) {
        await fetchDeleteV2AdminUsersUUID({
          pathParams: { uuid: id as string }
        });
      }

      return { data: params.ids };
    } catch (err) {
      throw getFormattedErrorForRA(err as DeleteV2AdminUsersUUIDError);
    }
  },

  async update(_, params) {
    const uuid = params.id as string;
    const body = params.data;

    if (params.data.organisation?.uuid) {
      body.organisation = params.data.organisation.uuid;
    } else {
      body.organisation = null;
    }

    if (!body.role) delete body.role;

    try {
      const resp = await fetchPutV2AdminUsersUUID({ pathParams: { uuid }, body });
      // @ts-ignore
      return { data: { ...resp.data, id: resp.data.uuid } };
    } catch (err) {
      throw getFormattedErrorForRA(err as PutV2AdminUsersUUIDError);
    }
  }
};

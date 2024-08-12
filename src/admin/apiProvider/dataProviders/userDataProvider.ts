import { DataProvider, Identifier } from "react-admin";

import {
  DeleteV2AdminUsersUUIDError,
  fetchDeleteV2AdminUsersUUID,
  fetchGetV2AdminUsers,
  fetchGetV2AdminUsersExport,
  fetchGetV2AdminUsersMulti,
  fetchGetV2AdminUsersUUID,
  fetchPutV2AdminUsersUUID,
  GetV2AdminUsersError,
  GetV2AdminUsersExportError,
  GetV2AdminUsersMultiError,
  GetV2AdminUsersUUIDError,
  PutV2AdminUsersUUIDError
} from "@/generated/apiComponents";
import { V2AdminUserRead } from "@/generated/apiSchemas";
import { downloadFileBlob } from "@/utils/network";

import { getFormattedErrorForRA } from "../utils/error";
import { apiListResponseToRAListResult, raListParamsToQueryParams } from "../utils/listing";

export interface UserDataProvider extends DataProvider {
  export: (resource: string) => Promise<void>;
}

const normalizeUserObject = (item: V2AdminUserRead) => ({
  ...item,
  id: item.uuid as Identifier,
  //@ts-ignore
  role: item.role,
  //@ts-ignore
  monitoring_organisations: item?.monitoring_organisations?.map(item => item.uuid)
});

export const userDataProvider: UserDataProvider = {
  //@ts-ignore
  async getList(_, params) {
    try {
      const response = await fetchGetV2AdminUsers({
        queryParams: raListParamsToQueryParams(params)
      });

      const result = apiListResponseToRAListResult(response);

      return {
        ...result,
        data: result.data?.map((item: V2AdminUserRead) => normalizeUserObject(item))
      };
    } catch (err) {
      throw getFormattedErrorForRA(err as GetV2AdminUsersError);
    }
  },

  //@ts-ignore
  async getOne(_, params) {
    try {
      const response = await fetchGetV2AdminUsersUUID({
        pathParams: { uuid: params.id }
      });
      //@ts-ignore
      return { data: normalizeUserObject(response.data) };
    } catch (err) {
      throw getFormattedErrorForRA(err as GetV2AdminUsersUUIDError);
    }
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
  },

  export() {
    return fetchGetV2AdminUsersExport({})
      .then((response: any) => {
        downloadFileBlob(response, "Users.csv");
      })
      .catch(e => {
        throw getFormattedErrorForRA(e as GetV2AdminUsersExportError);
      });
  }
};

import {
  CreateParams,
  DataProvider,
  DeleteManyParams,
  DeleteParams,
  GetListParams,
  GetManyParams,
  GetManyResult,
  GetOneParams,
  UpdateParams
} from "react-admin";

import { createUser, deleteUser, loadUser, loadUserIndex, updateUserResource } from "@/connections/User";
import { UserCreateBaseAttributes, UserDto, UserUpdateAttributes } from "@/generated/v3/userService/userServiceSchemas";

import { v3ErrorForRA } from "../utils/error";
import { raConnectionProps } from "../utils/listing";

export const userDataProvider: Partial<DataProvider> = {
  async create<RecordType>(_: string, params: CreateParams<RecordType>) {
    try {
      const user = await createUser(params.data as UserCreateBaseAttributes);

      return { data: { id: user.uuid } } as RecordType;
    } catch (createFailure) {
      throw v3ErrorForRA("User creation failed", createFailure);
    }
  },

  async getList<RecordType>(_: string, params: GetListParams) {
    const connected = await loadUserIndex(raConnectionProps(params));
    if (connected.loadFailure != null) {
      throw v3ErrorForRA("User index fetch failed", connected.loadFailure);
    }

    return {
      data: (connected.data?.map(user => ({ ...user, id: user.uuid })) ?? []) as RecordType[],
      total: connected.indexTotal
    };
  },

  async getOne<RecordType>(_: string, { id }: GetOneParams) {
    const connected = await loadUser({ id });
    if (connected.loadFailure != null) {
      throw v3ErrorForRA("User get fetch failed", connected.loadFailure);
    }

    return { data: { ...connected.data, id: connected.data!.uuid } } as RecordType;
  },

  async getMany(_: string, params: GetManyParams) {
    try {
      const results = await Promise.all(params.ids.map(id => loadUser({ id: id as string })));
      const failed = results.find(r => r.loadFailure != null);
      if (failed != null) {
        throw v3ErrorForRA("User get fetch failed", failed.loadFailure);
      }

      const data = results
        .map(r => (r.data != null ? { ...r.data, id: r.data.uuid } : null))
        .filter((item): item is UserDto & { id: string; lightResource: boolean } => item != null);

      return { data } as GetManyResult;
    } catch (err) {
      throw v3ErrorForRA("User getMany failed", err);
    }
  },

  async delete<RecordType>(_: string, { id }: DeleteParams) {
    try {
      await deleteUser(id as string);

      return { data: { id } } as RecordType;
    } catch (err) {
      throw v3ErrorForRA("User delete failed", err);
    }
  },

  async deleteMany<RecordType>(_: string, { ids }: DeleteManyParams) {
    try {
      for (const id of ids) {
        await deleteUser(id as string);
      }

      return { data: ids } as RecordType;
    } catch (err) {
      throw v3ErrorForRA("User deleteMany failed", err);
    }
  },

  async update<RecordType>(_: string, params: UpdateParams<RecordType>) {
    const uuid = params.id as string;
    const body = params.data;

    // if (params.data.organisation?.uuid) {
    //   body.organisation = params.data.organisation.uuid;
    // } else {
    //   body.organisation = null;
    // }

    // if (!body.role) delete body.role;

    try {
      const resp = await updateUserResource(body as unknown as UserUpdateAttributes, { id: uuid });
      return { data: { ...resp, id: resp.uuid } } as RecordType;
    } catch (err) {
      throw v3ErrorForRA("User update failed", err);
    }
  }
};

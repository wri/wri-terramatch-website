import pick from "lodash/pick";
import pickBy from "lodash/pickBy";
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

/** Coerce form/API shapes to the string[] expected by `UserUpdateAttributes.directFrameworks`. */
const directFrameworksToApiSlugs = (value: unknown): string[] => {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.map(item => {
    if (item != null && typeof item === "object" && "slug" in item) {
      return String((item as { slug: string }).slug);
    }
    return String(item);
  });
};

/** Admin form defaultValues merge the full user record; only these keys may be sent on PATCH. */
const USER_ADMIN_PATCH_KEYS = [
  "organisationUuid",
  "firstName",
  "lastName",
  "emailAddress",
  "jobRole",
  "phoneNumber",
  "country",
  "program",
  "locale",
  "primaryRole",
  "directFrameworks"
] as const;

type UserAdminPatchKey = (typeof USER_ADMIN_PATCH_KEYS)[number];

/** Merge with previous for all patch fields except `directFrameworks` (always from `data` when present). */
const USER_ADMIN_PATCH_KEYS_WITHOUT_DIRECT_FRAMEWORKS = USER_ADMIN_PATCH_KEYS.filter(
  (key): key is Exclude<UserAdminPatchKey, "directFrameworks"> => key !== "directFrameworks"
);

const buildUserPatchBody = (
  data: Record<string, unknown>,
  previousData: Record<string, unknown> | undefined
): UserUpdateAttributes => {
  const previous = previousData ?? {};
  const merged: Record<string, unknown> = {
    ...pick(previous, USER_ADMIN_PATCH_KEYS_WITHOUT_DIRECT_FRAMEWORKS),
    ...pick(data, USER_ADMIN_PATCH_KEYS_WITHOUT_DIRECT_FRAMEWORKS)
  };

  // Never take `directFrameworks` from `previous`; only from the submitted record (UserEdit `transform` always sets it).
  if (Object.prototype.hasOwnProperty.call(data, "directFrameworks")) {
    merged.directFrameworks = directFrameworksToApiSlugs(data.directFrameworks);
  }

  return pickBy(merged, value => value !== undefined) as unknown as UserUpdateAttributes;
};

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

    const data = connected.data!;
    return { data: { ...data, id: data.uuid } } as RecordType;
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

    const body = buildUserPatchBody(
      params.data as Record<string, unknown>,
      params.previousData as Record<string, unknown>
    );

    try {
      const resp = await updateUserResource(body, { id: uuid });
      return { data: { ...resp, id: resp.uuid } } as RecordType;
    } catch (err) {
      throw v3ErrorForRA("User update failed", err);
    }
  }
};

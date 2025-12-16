import { omit } from "lodash";
import { CreateResult, DataProvider, DeleteParams, GetManyResult, GetOneParams, UpdateParams } from "react-admin";

import {
  createFundingProgramme,
  deleteFundingProgramme,
  loadFundingProgramme,
  loadFundingProgrammes,
  updateFundingProgramme
} from "@/connections/FundingProgramme";
import { StoreFundingProgrammeAttributes } from "@/generated/v3/entityService/entityServiceSchemas";

import { v3ErrorForRA } from "../utils/error";
import { handleUploads } from "../utils/upload";

const UPLOAD_KEYS = ["cover"];

export const fundingProgrammeDataProvider: Partial<DataProvider> = {
  async getList<RecordType>() {
    // note: we don't use any filtering, sorting or pagination on this list view
    const connection = await loadFundingProgrammes({ translated: false });
    if (connection.loadFailure != null) {
      throw v3ErrorForRA("Funding Programme index fetch failed", connection.loadFailure);
    }
    return {
      data: (connection.data?.map(fundingProgramme => ({
        ...fundingProgramme,
        id: fundingProgramme.uuid
      })) ?? []) as RecordType[],
      total: connection.data?.length ?? 0
    };
  },

  async getOne<RecordType>(_: string, { id }: GetOneParams) {
    const { loadFailure, data: fundingProgramme } = await loadFundingProgramme({ id, translated: false });
    if (loadFailure != null) {
      throw v3ErrorForRA("Funding Programme get fetch failed", loadFailure);
    }

    return { data: { ...fundingProgramme, id: fundingProgramme?.uuid } } as RecordType;
  },

  async getMany(_, params) {
    const response = await Promise.all(
      params.ids.map(id => loadFundingProgramme({ id: id as string, translated: false }))
    );
    const failed = response.find(({ loadFailure }) => loadFailure != null);
    if (failed != null) {
      throw v3ErrorForRA("Funding Programme get fetch failed", failed.loadFailure);
    }

    return {
      data: response.map(({ data }) => ({ ...data, id: data?.uuid }))
    } as GetManyResult;
  },

  async update<RecordType>(_: string, params: UpdateParams<RecordType>) {
    try {
      const attributes = omit(params.data, UPLOAD_KEYS) as unknown as StoreFundingProgrammeAttributes;

      // In update, do the cover upload first so that the update response shows the new cover media.
      await handleUploads(params, UPLOAD_KEYS, { entity: "fundingProgrammes", uuid: params.id as string });
      const programme = await updateFundingProgramme(attributes, { id: params.id as string, translated: false });

      return { data: { ...programme, id: programme.uuid } } as RecordType;
    } catch (err) {
      throw v3ErrorForRA("Funding Programme update fetch failed", err);
    }
  },

  async create(_, params) {
    try {
      const attributes = omit(params.data, UPLOAD_KEYS) as StoreFundingProgrammeAttributes;

      const fundingProgramme = await createFundingProgramme(attributes);
      await handleUploads(params, UPLOAD_KEYS, { uuid: fundingProgramme.uuid, entity: "fundingProgrammes" });

      return { data: { id: fundingProgramme.uuid } } as CreateResult;
    } catch (err) {
      throw v3ErrorForRA("Funding Programme create fetch failed", err);
    }
  },

  async delete<RecordType>(_: string, { id }: DeleteParams) {
    try {
      await deleteFundingProgramme(id as string);
      return { data: { id } } as RecordType;
    } catch (err) {
      throw v3ErrorForRA("Funding programme delete fetch failed", err);
    }
  },

  async deleteMany(_, params) {
    try {
      await Promise.all(params.ids.map(id => deleteFundingProgramme(id as string)));
      return { data: params.ids };
    } catch (err) {
      throw v3ErrorForRA("Funding programme delete fetch failed", err);
    }
  }
};

import { omit } from "lodash";
import { CreateResult, DataProvider, DeleteParams, GetManyResult, GetOneParams } from "react-admin";

import { stageDataProvider } from "@/admin/apiProvider/dataProviders/stageDataProvider";
import {
  createFundingProgramme,
  deleteFundingProgramme,
  loadFundingProgramme,
  loadFundingProgrammes
} from "@/connections/FundingProgramme";
import { fetchPutV2AdminFundingProgrammeUUID, PutV2AdminFundingProgrammeUUIDError } from "@/generated/apiComponents";
import { StoreFundingProgrammeAttributes } from "@/generated/v3/entityService/entityServiceSchemas";

import { getFormattedErrorForRA, v3ErrorForRA } from "../utils/error";
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

  async update(_, params) {
    try {
      const uuid = params.id as string;
      const uploadKeys = ["cover"];
      const { stages, ...body } = omit(params.data, uploadKeys) as any;

      await handleUploads(params, uploadKeys, { uuid, entity: "fundingProgrammes" });

      // TODO: For each stage - update

      const resp = await fetchPutV2AdminFundingProgrammeUUID({ pathParams: { uuid }, body });

      for (let index = 0; index < stages.length; index++) {
        const stage = stages[index];

        if (stage.uuid) {
          await stageDataProvider.update("", {
            id: stage.uuid,
            previousData: {},
            data: {
              ...stage,
              //@ts-ignore
              funding_programme_id: resp.data.uuid,
              order: index + 1
            }
          });
        } else {
          await stageDataProvider.create("", {
            data: {
              ...stage,
              //@ts-ignore
              funding_programme_id: resp.data.uuid,
              order: index + 1
            }
          });
        }
      }

      //@ts-ignore
      return { data: { ...resp.data, id: resp.data.uuid, framework_key: body.framework_key } };
    } catch (err) {
      throw getFormattedErrorForRA(err as PutV2AdminFundingProgrammeUUIDError);
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

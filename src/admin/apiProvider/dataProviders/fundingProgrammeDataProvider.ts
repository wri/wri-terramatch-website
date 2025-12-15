import lo from "lodash";
import { DataProvider, GetManyResult, GetOneParams } from "react-admin";

import { stageDataProvider } from "@/admin/apiProvider/dataProviders/stageDataProvider";
import { loadFundingProgramme, loadFundingProgrammes } from "@/connections/FundingProgramme";
import {
  DeleteV2AdminFundingProgrammeUUIDError,
  fetchDeleteV2AdminFundingProgrammeUUID,
  fetchPostV2AdminFundingProgramme,
  fetchPutV2AdminFundingProgrammeUUID,
  PostV2AdminFundingProgrammeError,
  PutV2AdminFundingProgrammeUUIDError
} from "@/generated/apiComponents";

import { getFormattedErrorForRA, v3ErrorForRA } from "../utils/error";
import { handleUploads } from "../utils/upload";

export interface FundingDataProvider extends DataProvider {}

export const fundingProgrammeDataProvider: FundingDataProvider = {
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
      const { stages, ...body } = lo.omit(params.data, uploadKeys) as any;

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
      const uploadKeys = ["cover"];
      const { stages, ...body } = lo.omit(params.data, uploadKeys) as any;

      const resp = await fetchPostV2AdminFundingProgramme({ body });

      for (let index = 0; index < stages.length; index++) {
        const stage = stages[index];

        await stageDataProvider.create("", {
          data: {
            ...stage,
            //@ts-ignore
            funding_programme_id: resp.data.uuid,
            order: index + 1
          }
        });
      }

      // @ts-expect-error
      const uuid = resp.data.uuid;
      await handleUploads(params, uploadKeys, { uuid, entity: "fundingProgrammes" });

      // TODO: For each stage - create

      //@ts-ignore
      return { data: { ...resp.data, id: resp.data.uuid } };
    } catch (err) {
      throw getFormattedErrorForRA(err as PostV2AdminFundingProgrammeError);
    }
  },

  // @ts-ignore
  async delete(_, params) {
    try {
      await fetchDeleteV2AdminFundingProgrammeUUID({
        pathParams: { uuid: params.id as string }
      });
      return { data: { id: params.id } };
    } catch (err) {
      throw getFormattedErrorForRA(err as DeleteV2AdminFundingProgrammeUUIDError);
    }
  },

  async deleteMany(_, params) {
    try {
      for (const id of params.ids) {
        await fetchDeleteV2AdminFundingProgrammeUUID({
          pathParams: { uuid: id as string }
        });
      }

      return { data: params.ids };
    } catch (err) {
      throw getFormattedErrorForRA(err as DeleteV2AdminFundingProgrammeUUIDError);
    }
  }
};

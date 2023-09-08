import lo from "lodash";
import { DataProvider } from "react-admin";

import {
  DeleteV2AdminOrganisationsUUIDError,
  fetchDeleteV2AdminOrganisationsUUID,
  fetchGetV2AdminOrganisations,
  fetchGetV2AdminOrganisationsExport,
  fetchGetV2AdminOrganisationsMulti,
  fetchGetV2AdminOrganisationsUUID,
  fetchPutV2AdminOrganisationsUUID,
  GetV2AdminOrganisationsError,
  GetV2AdminOrganisationsExportError,
  GetV2AdminOrganisationsMultiError,
  GetV2AdminOrganisationsUUIDError,
  PutV2AdminOrganisationsUUIDError
} from "@/generated/apiComponents";
import { V2AdminOrganisationRead } from "@/generated/apiSchemas";
import { downloadFileBlob } from "@/utils";

import { getFormattedErrorForRA } from "../utils/error";
import { apiListResponseToRAListResult, raListParamsToQueryParams } from "../utils/listing";
import { handleUploads } from "../utils/upload";

export interface OrganisationDataProvider extends DataProvider {
  export: (resource: string) => Promise<void>;
}

// TODO: Ask BED to provide sortable fields list.
export const organisationSortableList: string[] = ["name", "created_at", "type"];

const normalizeOrganisationObject = (object: V2AdminOrganisationRead) => {
  // @ts-ignore incorrect docs
  const enrolled_funding_programmes = object.data?.project_pitches
    // @ts-ignore incorrect docs
    ?.map(pitch => pitch.funding_programme?.uuid)
    // @ts-ignore
    .filter((value, index, self) => self.indexOf(value) === index);

  //@ts-ignore
  return { data: { ...object.data, id: object.data.uuid, enrolled_funding_programmes } };
};

export const organisationDataProvider: OrganisationDataProvider = {
  async getList(_, params) {
    try {
      const response = await fetchGetV2AdminOrganisations({
        queryParams: raListParamsToQueryParams(params, organisationSortableList)
      });

      return apiListResponseToRAListResult(response);
    } catch (err) {
      throw getFormattedErrorForRA(err as GetV2AdminOrganisationsError);
    }
  },

  async getOne(_, params) {
    try {
      const response = await fetchGetV2AdminOrganisationsUUID({
        pathParams: { uuid: params.id }
      });

      return normalizeOrganisationObject(response);
    } catch (err) {
      throw getFormattedErrorForRA(err as GetV2AdminOrganisationsUUIDError);
    }
  },

  async getMany(_, params) {
    try {
      const response = await fetchGetV2AdminOrganisationsMulti({ queryParams: { ids: params.ids.join(",") } });
      //@ts-ignore
      return { data: response.data?.map(item => ({ ...item, id: item.uuid })) };
    } catch (err) {
      throw getFormattedErrorForRA(err as GetV2AdminOrganisationsMultiError);
    }
  },

  //@ts-ignore
  async delete(_, params) {
    try {
      await fetchDeleteV2AdminOrganisationsUUID({
        pathParams: { uuid: params.id as string }
      });

      return { data: { id: params.id } };
    } catch (err) {
      throw getFormattedErrorForRA(err as DeleteV2AdminOrganisationsUUIDError);
    }
  },

  async deleteMany(_, params) {
    try {
      for (const id of params.ids) {
        await fetchDeleteV2AdminOrganisationsUUID({
          pathParams: { uuid: id as string }
        });
      }

      return { data: params.ids };
    } catch (err) {
      throw getFormattedErrorForRA(err as DeleteV2AdminOrganisationsUUIDError);
    }
  },

  async update(_, params) {
    const uuid = params.id as string;
    const uploadKeys = ["logo", "cover", "legal_registration", "reference", "additional"];
    const body = lo.omit(params.data, uploadKeys);

    await handleUploads(params, uploadKeys, {
      uuid,
      model: "organisation"
    });
    try {
      const resp = await fetchPutV2AdminOrganisationsUUID({ pathParams: { uuid }, body });

      //@ts-ignore
      return { data: { ...resp.data, id: resp.data.uuid } };
    } catch (err) {
      throw getFormattedErrorForRA(err as PutV2AdminOrganisationsUUIDError);
    }
  },

  export() {
    return fetchGetV2AdminOrganisationsExport({})
      .then((response: any) => {
        downloadFileBlob(response, "Organisations.csv");
      })
      .catch(e => {
        throw getFormattedErrorForRA(e as GetV2AdminOrganisationsExportError);
      });
  }
};

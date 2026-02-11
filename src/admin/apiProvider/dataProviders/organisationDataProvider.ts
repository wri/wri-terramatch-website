import lo from "lodash";
import { DataProvider } from "react-admin";

import { createOrg, deleteOrganisation, loadOrganisation, updateOrganisation } from "@/connections/Organisation";
import {
  fetchGetV2AdminOrganisations,
  fetchGetV2AdminOrganisationsExport,
  fetchGetV2AdminOrganisationsMulti,
  GetV2AdminOrganisationsError,
  GetV2AdminOrganisationsExportError,
  GetV2AdminOrganisationsMultiError
} from "@/generated/apiComponents";
import { downloadFileBlob } from "@/utils/network";

import { getFormattedErrorForRA, v3ErrorForRA } from "../utils/error";
import { apiListResponseToRAListResult, raListParamsToQueryParams } from "../utils/listing";
import { handleUploads } from "../utils/upload";

export interface OrganisationDataProvider extends DataProvider {
  export: (resource: string) => Promise<void>;
}

// TODO: Ask BED to provide sortable fields list.
export const organisationSortableList: string[] = ["name", "created_at", "type"];

const normalizeOrganisationObject = (orgData: any) => {
  // Handle both v2 and v3 response formats
  const data = orgData?.data ?? orgData;
  // @ts-ignore - project_pitches may not exist in v3
  const enrolled_funding_programmes = data?.project_pitches
    // @ts-ignore
    ?.map(pitch => pitch.funding_programme?.uuid)
    // @ts-ignore
    .filter((value, index, self) => self.indexOf(value) === index);

  //@ts-ignore
  return { data: { ...data, id: data?.uuid ?? data?.id, enrolled_funding_programmes } };
};

export const organisationDataProvider: OrganisationDataProvider = {
  // @ts-ignore
  async create(__, params) {
    try {
      const { uuid } = await createOrg(params.data);
      return { data: { id: uuid } };
    } catch (createFailure) {
      throw v3ErrorForRA("Organisation creation failed", createFailure);
    }
  },

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
      const orgData = await loadOrganisation({ id: params.id });
      return normalizeOrganisationObject(orgData);
    } catch (err) {
      throw v3ErrorForRA("Organisation fetch failed", err);
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
      await deleteOrganisation(params.id as string);
      return { data: { id: params.id } };
    } catch (err) {
      throw v3ErrorForRA("Organisation deletion failed", err);
    }
  },

  async deleteMany(_, params) {
    try {
      for (const id of params.ids) {
        await deleteOrganisation(id as string);
      }
      return { data: params.ids };
    } catch (err) {
      throw v3ErrorForRA("Organisation bulk deletion failed", err);
    }
  },

  async update(_, params) {
    const uuid = params.id as string;
    const uploadKeys = ["logo", "cover", "legal_registration", "reference", "additional"];
    const body = lo.omit(params.data, uploadKeys);
    await handleUploads(params, uploadKeys, { uuid, entity: "organisations" });
    try {
      const updatedData = await updateOrganisation(body, { id: uuid });
      //@ts-ignore
      return { data: { ...updatedData, id: updatedData?.uuid ?? uuid } };
    } catch (err) {
      throw v3ErrorForRA("Organisation update failed", err);
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

import _ from "lodash";
import { DataProvider } from "react-admin";

import {
  DeleteV2ProjectPitchesUUIDError,
  fetchDeleteV2ProjectPitchesUUID,
  fetchGetV2AdminProjectPitches,
  fetchGetV2AdminProjectPitchesExport,
  fetchGetV2ProjectPitchesUUID,
  fetchPatchV2ProjectPitchesUUID,
  GetV2AdminProjectPitchesError,
  GetV2AdminProjectPitchesExportError,
  GetV2ProjectPitchesUUIDError,
  PatchV2ProjectPitchesUUIDError
} from "@/generated/apiComponents";
import { ProjectPitchRead } from "@/generated/apiSchemas";
import { downloadFileBlob } from "@/utils/network";

import { getFormattedErrorForRA } from "../utils/error";
import { apiListResponseToRAListResult, raListParamsToQueryParams } from "../utils/listing";

export interface PitchDataProvider extends DataProvider {
  export: (resource: string) => Promise<void>;
}

export const pitchesSortableList: string[] = [
  "organisation_id",
  "project_name",
  "project_objectives",
  "project_country",
  "project_county_district",
  "restoration_intervention_types",
  "total_hectares",
  "total_trees",
  "capacity_building_needs",
  "created_at",
  "updated_at",
  "deleted_at"
];

export const pitchDataProvider: PitchDataProvider = {
  async getList(_, params) {
    try {
      const response = await fetchGetV2AdminProjectPitches({
        queryParams: raListParamsToQueryParams(params, pitchesSortableList)
      });

      return apiListResponseToRAListResult(response);
    } catch (err) {
      throw getFormattedErrorForRA(err as GetV2AdminProjectPitchesError);
    }
  },

  async getOne(_, params) {
    try {
      const response = await fetchGetV2ProjectPitchesUUID({
        //@ts-ignore
        pathParams: { uuid: params.id }
      });
      //@ts-ignore
      return { data: { ...response.data, id: response.data.uuid } };
    } catch (err) {
      throw getFormattedErrorForRA(err as GetV2ProjectPitchesUUIDError);
    }
  },

  //@ts-ignore
  async update(__, params) {
    try {
      const response = await fetchPatchV2ProjectPitchesUUID({
        body: _.pick<ProjectPitchRead, keyof ProjectPitchRead>(params.data, [
          "capacity_building_needs",
          "project_country",
          "project_county_district",
          "project_name",
          "project_objectives",
          "restoration_intervention_types",
          "total_hectares",
          "total_trees"
        ]),
        pathParams: { uuid: params.id }
      });

      // @ts-expect-error
      return { data: { ...response.data, id: response.id } };
    } catch (err) {
      throw getFormattedErrorForRA(err as PatchV2ProjectPitchesUUIDError);
    }
  },

  //@ts-ignore
  async delete(_, params) {
    try {
      await fetchDeleteV2ProjectPitchesUUID({
        pathParams: { uuid: params.id as string }
      });
      return { data: {} };
    } catch (err) {
      throw getFormattedErrorForRA(err as DeleteV2ProjectPitchesUUIDError);
    }
  },

  async deleteMany(_, params) {
    try {
      for (const id of params.ids) {
        await fetchDeleteV2ProjectPitchesUUID({
          pathParams: { uuid: id as string }
        });
      }
      return { data: [] };
    } catch (err) {
      throw getFormattedErrorForRA(err as DeleteV2ProjectPitchesUUIDError);
    }
  },
  export() {
    return fetchGetV2AdminProjectPitchesExport({})
      .then((response: any) => {
        downloadFileBlob(response, "Pitches.csv");
      })
      .catch(e => {
        throw getFormattedErrorForRA(e as GetV2AdminProjectPitchesExportError);
      });
  }
};

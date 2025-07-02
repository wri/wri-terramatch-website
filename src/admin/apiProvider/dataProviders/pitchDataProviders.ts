import _ from "lodash";
import { DataProvider } from "react-admin";

import { keysToSnakeCase } from "@/admin/utils/forms";
import { loadProjectPitch, loadProjectPitches } from "@/connections/ProjectPitch";
import {
  DeleteV2ProjectPitchesUUIDError,
  fetchDeleteV2ProjectPitchesUUID,
  fetchGetV2AdminProjectPitchesExport,
  fetchPatchV2ProjectPitchesUUID,
  GetV2AdminProjectPitchesExportError,
  PatchV2ProjectPitchesUUIDError
} from "@/generated/apiComponents";
import { ProjectPitchRead } from "@/generated/apiSchemas";
import { downloadFileBlob } from "@/utils/network";

import { getFormattedErrorForRA, v3ErrorForRA } from "../utils/error";
import { raConnectionProps } from "../utils/listing";

export interface PitchDataProvider extends DataProvider {
  export: (resource: string) => Promise<void>;
}

export const pitchDataProvider: Partial<PitchDataProvider> = {
  // @ts-expect-error until we can get the whole DataProvider on Project DTOs
  async getList(_, params) {
    const connection = await loadProjectPitches(raConnectionProps(params));
    if (connection.loadFailure != null) {
      throw v3ErrorForRA("Project Pitch index fetch failed", connection.loadFailure);
    }
    return {
      data: connection.data?.map(pitch => ({ ...pitch, id: pitch.uuid })),
      total: connection.indexTotal ?? 0
    };
  },

  //@ts-ignore
  async getOne(_, { id }) {
    const { loadFailure, data: projectPitch } = await loadProjectPitch({ id });
    if (loadFailure != null) {
      throw v3ErrorForRA("Project Pitch get fetch failed", loadFailure);
    }

    return { data: { ...projectPitch, id: projectPitch?.uuid } };
  },

  //@ts-ignore
  async update(__, params) {
    try {
      const response = await fetchPatchV2ProjectPitchesUUID({
        body: _.pick<ProjectPitchRead, keyof ProjectPitchRead>(keysToSnakeCase(params.data) as ProjectPitchRead, [
          "capacity_building_needs",
          "project_country",
          "project_county_district",
          "project_name",
          "project_objectives",
          "restoration_intervention_types",
          "total_hectares",
          "total_trees"
        ]),
        // @ts-expect-error
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

  async export() {
    try {
      const response = (await fetchGetV2AdminProjectPitchesExport({})) as Blob;
      await downloadFileBlob(response, "Pitches.csv");
    } catch (e) {
      throw getFormattedErrorForRA(e as GetV2AdminProjectPitchesExportError);
    }
  }
};

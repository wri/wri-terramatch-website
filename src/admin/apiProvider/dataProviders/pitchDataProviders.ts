import _ from "lodash";
import { DataProvider } from "react-admin";

import { loadProjectPitch, loadProjectPitchesAdmin } from "@/connections/ProjectPitch";
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
import { projectPitchesListResult, raConnectionProps } from "../utils/listing";

export interface PitchDataProvider extends DataProvider {
  export: (resource: string) => Promise<void>;
}

export const pitchDataProvider: PitchDataProvider = {
  async getList(_, params) {
    const connection = await loadProjectPitchesAdmin(raConnectionProps(params));
    if (connection.fetchFailure != null) {
      throw v3ErrorForRA("Project Pitch index fetch failed", connection.fetchFailure);
    }
    return projectPitchesListResult(connection);
  },

  async getOne(_, params) {
    const { requestFailed, projectPitch } = await loadProjectPitch({ uuid: params.id });
    console.log("getOne response", projectPitch, requestFailed);
    if (requestFailed != null) {
      throw v3ErrorForRA("Nursery get fetch failed", requestFailed);
    }
    console.log("response v3", projectPitch);

    return { data: { ...projectPitch.attributes, id: projectPitch.attributes.uuid } };
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

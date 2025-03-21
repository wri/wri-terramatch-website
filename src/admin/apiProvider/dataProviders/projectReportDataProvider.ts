import { DataProvider } from "react-admin";

import { loadFullProjectReport, loadProjectReportIndex } from "@/connections/Entity";
import { DeleteV2AdminProjectReportsUUIDError, fetchDeleteV2AdminProjectReportsUUID } from "@/generated/apiComponents";

import { getFormattedErrorForRA, v3ErrorForRA } from "../utils/error";
import { entitiesListResult, raConnectionProps } from "../utils/listing";

// @ts-ignore
export const projectReportDataProvider: DataProvider = {
  // @ts-expect-error until we can get the whole DataProvider on ProjectReportLightDto
  async getList(_, params) {
    const connection = await loadProjectReportIndex(raConnectionProps(params));
    if (connection.fetchFailure != null) {
      throw v3ErrorForRA("Project report index fetch failed", connection.fetchFailure);
    }
    return entitiesListResult(connection);
  },

  // @ts-ignore
  async getOne(_, params) {
    const { entity: projectReport, fetchFailure } = await loadFullProjectReport({ uuid: params.id });
    if (fetchFailure != null) {
      throw v3ErrorForRA("Project report get fetch failed", fetchFailure);
    }

    return { data: { ...projectReport, id: projectReport!.uuid } };
  },

  // @ts-ignore
  async delete(_, params) {
    try {
      await fetchDeleteV2AdminProjectReportsUUID({
        pathParams: { uuid: params.id as string }
      });
      return { data: { id: params.id } };
    } catch (err) {
      throw getFormattedErrorForRA(err as DeleteV2AdminProjectReportsUUIDError);
    }
  },

  async deleteMany(_, params) {
    try {
      for (const id of params.ids) {
        await fetchDeleteV2AdminProjectReportsUUID({
          pathParams: { uuid: id as string }
        });
      }

      return { data: params.ids };
    } catch (err) {
      throw getFormattedErrorForRA(err as DeleteV2AdminProjectReportsUUIDError);
    }
  }
};

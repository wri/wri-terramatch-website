import { DataProvider } from "react-admin";

import { deleteNurseryReport, loadFullNurseryReport, loadNurseryReportIndex } from "@/connections/Entity";

import { v3ErrorForRA } from "../utils/error";
import { entitiesListResult, raConnectionProps } from "../utils/listing";

// @ts-ignore
export const nurseryReportDataProvider: DataProvider = {
  // @ts-expect-error until we can get the whole DataProvider on NurseryReportLightDto
  async getList(_, params) {
    const connection = await loadNurseryReportIndex(raConnectionProps(params));
    if (connection.fetchFailure != null) {
      throw v3ErrorForRA("Nursery report index fetch failed", connection.fetchFailure);
    }
    return entitiesListResult(connection);
  },

  // @ts-ignore
  async getOne(_, params) {
    const { entity: nurseryReport, fetchFailure } = await loadFullNurseryReport({ uuid: params.id });
    if (fetchFailure != null) {
      throw v3ErrorForRA("Nursery report get fetch failed", fetchFailure);
    }

    return { data: { ...nurseryReport, id: nurseryReport!.uuid } };
  },

  // @ts-ignore
  async delete(_, params) {
    try {
      await deleteNurseryReport(params.id as string);
      return { data: { id: params.id } };
    } catch (err) {
      throw v3ErrorForRA("Nursery report delete failed", err);
    }
  },

  async deleteMany(_, params) {
    try {
      for (const id of params.ids) {
        await deleteNurseryReport(id as string);
      }

      return { data: params.ids };
    } catch (err) {
      throw v3ErrorForRA("Nursery report deleteMany failed", err);
    }
  }
};

import { DataProvider } from "react-admin";

import { deleteSiteReport, loadFullSiteReport, loadSiteReportIndex } from "@/connections/Entity";

import { v3ErrorForRA } from "../utils/error";
import { entitiesListResult, raConnectionProps } from "../utils/listing";

// @ts-ignore
export const siteReportDataProvider: DataProvider = {
  // @ts-expect-error until we can get the whole DataProvider on SiteReportLightDto
  async getList(_, params) {
    const connection = await loadSiteReportIndex(raConnectionProps(params));
    if (connection.loadFailure != null) {
      throw v3ErrorForRA("Site report index fetch failed", connection.loadFailure);
    }
    return entitiesListResult(connection);
  },
  // @ts-ignore
  async getOne(_, params) {
    const { entity: siteReport, fetchFailure } = await loadFullSiteReport({ uuid: params.id });
    if (fetchFailure != null) {
      throw v3ErrorForRA("Site report get fetch failed", fetchFailure);
    }

    return { data: { ...siteReport, id: siteReport!.uuid } };
  },

  // @ts-ignore
  async delete(_, params) {
    try {
      await deleteSiteReport(params.id as string);
      return { data: { id: params.id } };
    } catch (err) {
      throw v3ErrorForRA("Site report delete failed", err);
    }
  },

  async deleteMany(_, params) {
    try {
      for (const id of params.ids) {
        await deleteSiteReport(id as string);
      }

      return { data: params.ids };
    } catch (err) {
      throw v3ErrorForRA("Site report deleteMany failed", err);
    }
  }
};

import { DataProvider } from "react-admin";

import { loadFullSiteReport, loadSiteReportIndex } from "@/connections/Entity";
import { DeleteV2AdminSiteReportsUUIDError, fetchDeleteV2AdminSiteReportsUUID } from "@/generated/apiComponents";

import { getFormattedErrorForRA, v3ErrorForRA } from "../utils/error";
import { entitiesListResult, raConnectionProps } from "../utils/listing";

// @ts-ignore
export const siteReportDataProvider: DataProvider = {
  // @ts-expect-error until we can get the whole DataProvider on SiteReportLightDto
  async getList(_, params) {
    const connection = await loadSiteReportIndex(raConnectionProps(params));
    if (connection.fetchFailure != null) {
      throw v3ErrorForRA("Site report index fetch failed", connection.fetchFailure);
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
      await fetchDeleteV2AdminSiteReportsUUID({
        pathParams: { uuid: params.id as string }
      });
      return { data: { id: params.id } };
    } catch (err) {
      throw getFormattedErrorForRA(err as DeleteV2AdminSiteReportsUUIDError);
    }
  },

  async deleteMany(_, params) {
    try {
      for (const id of params.ids) {
        await fetchDeleteV2AdminSiteReportsUUID({
          pathParams: { uuid: id as string }
        });
      }

      return { data: params.ids };
    } catch (err) {
      throw getFormattedErrorForRA(err as DeleteV2AdminSiteReportsUUIDError);
    }
  }
};

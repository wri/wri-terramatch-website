import { DataProvider } from "react-admin";

import { loadFullNurseryReport, loadNurseryReportIndex } from "@/connections/Entity";
import { DeleteV2AdminNurseryReportsUUIDError, fetchDeleteV2AdminNurseryReportsUUID } from "@/generated/apiComponents";

import { getFormattedErrorForRA, v3ErrorForRA } from "../utils/error";
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
      await fetchDeleteV2AdminNurseryReportsUUID({
        pathParams: { uuid: params.id as string }
      });
      return { data: { id: params.id } };
    } catch (err) {
      throw getFormattedErrorForRA(err as DeleteV2AdminNurseryReportsUUIDError);
    }
  },

  async deleteMany(_, params) {
    try {
      for (const id of params.ids) {
        await fetchDeleteV2AdminNurseryReportsUUID({
          pathParams: { uuid: id as string }
        });
      }

      return { data: params.ids };
    } catch (err) {
      throw getFormattedErrorForRA(err as DeleteV2AdminNurseryReportsUUIDError);
    }
  }
};

import { DataProvider } from "react-admin";

import { deleteProjectReport, loadFullProjectReport, loadProjectReportIndex } from "@/connections/Entity";
import { EntityLightDto } from "@/connections/Entity";

import { v3ErrorForRA } from "../utils/error";
import { entitiesListResult, ExtendedGetListResult, raConnectionProps } from "../utils/listing";

export const entitiesListResultWithIncluded = <T extends EntityLightDto>({
  entities,
  indexTotal,
  included
}: {
  entities?: T[];
  indexTotal?: number;
  included?: any[];
}) => ({
  data: entities?.map(entity => ({ ...entity, id: entity.uuid })),
  total: indexTotal,
  included
});

// @ts-ignore
export const projectReportDataProvider: DataProvider = {
  // @ts-expect-error until we can get the whole DataProvider on ProjectReportLightDto
  async getList(_, params) {
    const connection = await loadProjectReportIndex(raConnectionProps(params));
    if (connection.fetchFailure != null) {
      throw v3ErrorForRA("Project report index fetch failed", connection.fetchFailure);
    }

    const included = (connection as any).included;

    if (!included) {
      return entitiesListResult(connection);
    } else {
      return entitiesListResultWithIncluded({
        entities: connection.entities,
        indexTotal: connection.indexTotal,
        included
      }) as ExtendedGetListResult;
    }
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
      await deleteProjectReport(params.id as string);
      return { data: { id: params.id } };
    } catch (err) {
      throw v3ErrorForRA("Project report delete failed", err);
    }
  },

  async deleteMany(_, params) {
    try {
      for (const id of params.ids) {
        await deleteProjectReport(id as string);
      }

      return { data: params.ids };
    } catch (err) {
      throw v3ErrorForRA("Project report deleteMany failed", err);
    }
  }
};

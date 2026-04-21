import lo from "lodash";
import { DataProvider, GetListParams, GetManyParams, GetManyResult, GetOneParams, UpdateParams } from "react-admin";

import {
  createOrg,
  deleteOrganisation,
  loadOrganisation,
  loadOrganisations,
  updateOrganisation
} from "@/connections/Organisation";
import { OrganisationFullDto, OrganisationUpdateAttributes } from "@/generated/v3/userService/userServiceSchemas";

import { v3ErrorForRA } from "../utils/error";
import { raConnectionProps } from "../utils/listing";
import { handleUploads } from "../utils/upload";

export interface OrganisationDataProvider extends Partial<DataProvider> {
  export: (resource: string) => Promise<void>;
}

// TODO: Ask BED to provide sortable fields list.
export const organisationSortableList: string[] = ["name", "created_at", "type"];

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

  async getList<RecordType>(_: string, params: GetListParams) {
    try {
      const connection = await loadOrganisations(raConnectionProps(params));
      if (connection.loadFailure != null) {
        throw v3ErrorForRA("Organisation index fetch failed", connection.loadFailure);
      }

      return {
        data: (connection.data?.map(org => ({ ...org, id: org.uuid })) ?? []) as RecordType[],
        total: connection.indexTotal ?? 0
      };
    } catch (err) {
      throw v3ErrorForRA("Organisation index fetch failed", err);
    }
  },

  async getOne<RecordType>(_: string, params: GetOneParams) {
    try {
      const { loadFailure, data: organisation } = await loadOrganisation({
        id: params.id,
        sideloads: ["media", "financialCollection", "treeSpeciesHistorical", "fundingTypes"]
      });
      if (loadFailure != null) {
        throw v3ErrorForRA("Organisation get fetch failed", loadFailure);
      }
      const org = organisation as OrganisationFullDto;
      return { data: { ...org, id: org.uuid } as RecordType };
    } catch (err) {
      throw v3ErrorForRA("Organisation get fetch failed", err);
    }
  },

  async getMany(_: string, params: GetManyParams): Promise<GetManyResult> {
    const results = await Promise.all(params.ids.map(id => loadOrganisation({ id: id as string })));
    const failed = results.find(r => r.loadFailure != null);
    if (failed != null) {
      throw v3ErrorForRA("Organisation get fetch failed", failed.loadFailure);
    }

    const data = results
      .map(r => (r.data != null ? { ...r.data, id: r.data.uuid } : null))
      .filter((item): item is OrganisationFullDto & { id: string } => item != null);

    return { data } as GetManyResult;
  },

  //@ts-ignore
  async delete(_, params) {
    try {
      await deleteOrganisation(params.id as string);
      return { data: { id: params.id } };
    } catch (err) {
      throw v3ErrorForRA("Organisation delete failed", err);
    }
  },

  async deleteMany(_, params) {
    try {
      for (const id of params.ids) {
        await deleteOrganisation(id as string);
      }

      return { data: params.ids };
    } catch (err) {
      throw v3ErrorForRA("Organisation deleteMany failed", err);
    }
  },

  async update<RecordType>(_: string, params: UpdateParams<RecordType>) {
    const uuid = params.id as string;
    const uploadKeys = ["logo", "cover", "legal_registration", "reference", "additional"];
    const attributes = lo.omit(params.data, uploadKeys) as OrganisationUpdateAttributes;

    try {
      await handleUploads(params, uploadKeys, { uuid, entity: "organisations" });

      const updatedOrg = await updateOrganisation(attributes, { id: uuid });

      return { data: { ...updatedOrg, id: updatedOrg.uuid } as RecordType };
    } catch (err) {
      throw v3ErrorForRA("Organisation update failed", err);
    }
  }
};

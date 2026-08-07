import { CreateResult, DataProvider, GetOneParams, UpdateParams } from "react-admin";

import { v3ErrorForRA } from "@/admin/apiProvider/utils/error";
import { raConnectionProps } from "@/admin/apiProvider/utils/listing";
import {
  createAboutSection,
  deleteAboutSection,
  loadAboutSection,
  loadAboutSections,
  updateAboutSection
} from "@/connections/AboutSection";
import { AboutSectionDto, StoreAboutSectionAttributes } from "@/generated/v3/entityService/entityServiceSchemas";

export const aboutSectionsDataProvider: Partial<DataProvider> = {
  async create(_, params) {
    try {
      const section = await createAboutSection(params.data as StoreAboutSectionAttributes);
      return { data: { id: section.id } } as CreateResult;
    } catch (createFailure) {
      throw v3ErrorForRA("About section creation failed", createFailure);
    }
  },

  // @ts-ignore
  async update(_: string, params: UpdateParams) {
    try {
      const section = await updateAboutSection(params.data as StoreAboutSectionAttributes, { id: params.id as string });
      return { data: section };
    } catch (updateFailure) {
      throw v3ErrorForRA("About section update failed", updateFailure);
    }
  },

  // @ts-ignore
  async getList(_, params) {
    const connection = await loadAboutSections(raConnectionProps(params));
    if (connection.loadFailure != null) {
      throw v3ErrorForRA("About section index fetch failed", connection.loadFailure);
    }
    return {
      data: connection.data,
      total: connection.indexTotal ?? 0
    };
  },

  // @ts-ignore
  async getOne(_: string, { id }: GetOneParams) {
    const connected = await loadAboutSection({ id });
    if (connected.loadFailure != null) {
      throw v3ErrorForRA("About section get fetch failed", connected.loadFailure);
    }

    return { data: connected.data as AboutSectionDto };
  },

  // @ts-ignore
  async delete(_: string, { id }: DeleteParams) {
    try {
      await deleteAboutSection(id as string);
      return { data: { id } };
    } catch (deleteFailure) {
      throw v3ErrorForRA("About section delete fetch failed", deleteFailure);
    }
  }
};

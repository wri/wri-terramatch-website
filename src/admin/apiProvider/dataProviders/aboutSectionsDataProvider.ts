import { DataProvider, GetOneParams } from "react-admin";

import { v3ErrorForRA } from "@/admin/apiProvider/utils/error";
import { raConnectionProps } from "@/admin/apiProvider/utils/listing";
import { loadAboutSection, loadAboutSections } from "@/connections/AboutSection";
import { AboutSectionDto } from "@/generated/v3/entityService/entityServiceSchemas";

export const aboutSectionsDataProvider: Partial<DataProvider> = {
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
  }
};

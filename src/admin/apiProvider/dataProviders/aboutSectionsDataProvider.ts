import { DataProvider } from "react-admin";

import { v3ErrorForRA } from "@/admin/apiProvider/utils/error";
import { raConnectionProps } from "@/admin/apiProvider/utils/listing";
import { loadAboutSections } from "@/connections/AboutSection";

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
  }
};

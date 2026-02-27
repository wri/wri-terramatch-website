import { DataProvider, GetManyParams, GetManyResult } from "react-admin";

import { deleteSite, loadFullSite, loadSiteIndex } from "@/connections/Entity";
import { SiteFullDto } from "@/generated/v3/entityService/entityServiceSchemas";

import { v3ErrorForRA } from "../utils/error";
import { connectionDataProvider } from "../utils/listing";

export const siteDataProvider: Partial<DataProvider> = {
  ...connectionDataProvider("Site", loadSiteIndex, loadFullSite, deleteSite),

  async getMany(_: string, params: GetManyParams): Promise<GetManyResult> {
    const results = await Promise.all(params.ids.map(id => loadFullSite({ id: id as string })));
    const failed = results.find(r => r.loadFailure != null);
    if (failed != null) {
      throw v3ErrorForRA("Site get fetch failed", failed.loadFailure);
    }

    const data = results
      .map(r => (r.data != null ? { ...r.data, id: r.data.uuid } : null))
      .filter((item): item is SiteFullDto & { id: string } => item != null);

    return { data } as GetManyResult;
  }
};

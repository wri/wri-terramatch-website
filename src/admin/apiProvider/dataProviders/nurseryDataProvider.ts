import { DataProvider, GetManyParams, GetManyResult } from "react-admin";

import { deleteNursery, loadFullNursery, loadNurseryIndex } from "@/connections/Entity";
import { NurseryFullDto } from "@/generated/v3/entityService/entityServiceSchemas";

import { v3ErrorForRA } from "../utils/error";
import { connectionDataProvider } from "../utils/listing";

export const nurseryDataProvider: Partial<DataProvider> = {
  ...connectionDataProvider("Nursery", loadNurseryIndex, loadFullNursery, deleteNursery),

  async getMany(_: string, params: GetManyParams): Promise<GetManyResult> {
    const results = await Promise.all(params.ids.map(id => loadFullNursery({ id: id as string })));
    const failed = results.find(r => r.loadFailure != null);
    if (failed != null) {
      throw v3ErrorForRA("Nursery get fetch failed", failed.loadFailure);
    }

    const data = results
      .map(r => (r.data != null ? { ...r.data, id: r.data.uuid } : null))
      .filter((item): item is NurseryFullDto & { id: string } => item != null);

    return { data } as GetManyResult;
  }
};

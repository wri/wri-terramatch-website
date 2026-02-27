import { DataProvider, GetManyParams, GetManyResult } from "react-admin";

import { deleteProject, loadFullProject, loadProjectIndex } from "@/connections/Entity";
import { ProjectFullDto } from "@/generated/v3/entityService/entityServiceSchemas";

import { v3ErrorForRA } from "../utils/error";
import { connectionDataProvider } from "../utils/listing";

export const projectDataProvider: Partial<DataProvider> = {
  ...connectionDataProvider("Project", loadProjectIndex, loadFullProject, deleteProject),

  async getMany(_: string, params: GetManyParams): Promise<GetManyResult> {
    const results = await Promise.all(params.ids.map(id => loadFullProject({ id: id as string })));
    const failed = results.find(r => r.loadFailure != null);
    if (failed != null) {
      throw v3ErrorForRA("Project get fetch failed", failed.loadFailure);
    }

    const data = results
      .map(r => (r.data != null ? { ...r.data, id: r.data.uuid } : null))
      .filter((item): item is ProjectFullDto & { id: string } => item != null);

    return { data } as GetManyResult;
  }
};

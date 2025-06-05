import lo from "lodash";
import { DataProvider } from "react-admin";

import { ImpactStoriesConnection, loadImpactStories, loadImpactStory } from "@/connections/ImpactStory";
import {
  DeleteV2AdminImpactStoriesIdError,
  fetchDeleteV2AdminImpactStoriesId,
  fetchPostV2AdminImpactStories,
  fetchPostV2AdminImpactStoriesBulkDelete,
  fetchPutV2AdminImpactStoriesId,
  PostV2AdminImpactStoriesBulkDeleteError,
  PostV2AdminImpactStoriesError,
  PutV2AdminImpactStoriesIdError
} from "@/generated/apiComponents";
import { ImpactStoryLightDto } from "@/generated/v3/entityService/entityServiceSchemas";

import { getFormattedErrorForRA, v3ErrorForRA } from "../utils/error";
import { raConnectionProps } from "../utils/listing";
import { handleUploads } from "../utils/upload";

export interface ImpactStoriesDataProvider extends DataProvider {
  export: (resource: string) => Promise<void>;
}

const impactStoriesListResult = ({ data, indexTotal }: ImpactStoriesConnection) => ({
  data: data?.map((impactStory: ImpactStoryLightDto) => ({ ...impactStory, id: impactStory.uuid })),
  total: indexTotal ?? 0
});
// @ts-ignore
export const impactStoriesDataProvider: DataProvider = {
  //@ts-ignore
  async getList(_, params) {
    const connection = await loadImpactStories(raConnectionProps(params));
    if (connection.fetchFailure != null) {
      throw v3ErrorForRA("Site report index fetch failed", connection.fetchFailure);
    }
    return impactStoriesListResult(connection);
  },
  // @ts-ignore
  async getOne(_, params) {
    const { requestFailed, impactStory } = await loadImpactStory({ uuid: params.id });
    if (requestFailed != null) {
      throw v3ErrorForRA("Project Pitch get fetch failed", requestFailed);
    }

    return { data: { ...impactStory, id: impactStory?.uuid } };
  },
  //@ts-ignore
  async create(__, params) {
    const uploadKeys = ["thumbnail"];
    const body: any = lo.omit(params.data, uploadKeys);
    try {
      const response = await fetchPostV2AdminImpactStories({
        body: body
      });
      // @ts-expect-error
      const uuid = response.data.uuid as string;
      await handleUploads(params, uploadKeys, {
        uuid,
        model: "impact-story"
      });
      // @ts-expect-error
      return { data: { ...response.data, id: response.id } };
    } catch (err) {
      throw getFormattedErrorForRA(err as PostV2AdminImpactStoriesError);
    }
  },
  //@ts-ignore
  async update(__, params) {
    const uuid = params.id as string;
    const uploadKeys = ["thumbnail"];
    const body = lo.omit(params.data, uploadKeys);

    try {
      await handleUploads(params, uploadKeys, {
        uuid,
        model: "impact-story"
      });

      const response = await fetchPutV2AdminImpactStoriesId({
        body,
        pathParams: { id: uuid }
      });

      // @ts-expect-error
      return { data: { ...response.data, id: response.data.uuid } };
    } catch (err) {
      throw getFormattedErrorForRA(err as PutV2AdminImpactStoriesIdError);
    }
  },

  //@ts-ignore
  async delete(__, params) {
    try {
      await fetchDeleteV2AdminImpactStoriesId({
        pathParams: { id: params.id as string }
      });
      return { data: { id: params.id } };
    } catch (err) {
      throw getFormattedErrorForRA(err as DeleteV2AdminImpactStoriesIdError);
    }
  },
  // @ts-ignore
  async deleteMany(_, params) {
    try {
      await fetchPostV2AdminImpactStoriesBulkDelete({
        body: { uuids: params.ids.map(String) }
      });
      return { data: params.ids };
    } catch (err) {
      throw getFormattedErrorForRA(err as PostV2AdminImpactStoriesBulkDeleteError);
    }
  }
};

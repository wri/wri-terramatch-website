import lo from "lodash";
import { DataProvider } from "react-admin";

import {
  DeleteV2AdminImpactStoriesIdError,
  fetchDeleteV2AdminImpactStoriesId,
  fetchGetV2AdminImpactStories,
  fetchGetV2AdminImpactStoriesId,
  fetchPostV2AdminImpactStories,
  fetchPostV2AdminImpactStoriesBulkDelete,
  fetchPutV2AdminImpactStoriesId,
  GetV2AdminImpactStoriesError,
  GetV2AdminImpactStoriesIdError,
  PostV2AdminImpactStoriesBulkDeleteError,
  PostV2AdminImpactStoriesError,
  PutV2AdminImpactStoriesIdError
} from "@/generated/apiComponents";

import { getFormattedErrorForRA } from "../utils/error";
import { apiListResponseToRAListResult, raListParamsToQueryParams } from "../utils/listing";
import { handleUploads } from "../utils/upload";

// @ts-ignore
export const impactStoriesDataProvider: DataProvider = {
  async getList(_, params) {
    try {
      const response = await fetchGetV2AdminImpactStories({
        queryParams: raListParamsToQueryParams(params, [])
      });
      return apiListResponseToRAListResult(response);
    } catch (err) {
      throw getFormattedErrorForRA(err as GetV2AdminImpactStoriesError);
    }
  },
  // @ts-ignore
  async getOne(_, params) {
    try {
      const list = await fetchGetV2AdminImpactStoriesId({
        pathParams: { id: params.id }
      });
      const response = { data: list };
      //@ts-ignore
      return { data: { ...response.data, id: response.data.id } };
    } catch (err) {
      throw getFormattedErrorForRA(err as GetV2AdminImpactStoriesIdError);
    }
  },
  //@ts-ignore
  async create(__, params) {
    try {
      const response = await fetchPostV2AdminImpactStories({
        body: params.data
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
    const uploadKeys = ["thumbnail"]; // Add any other file fields if needed
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

      console.log("Params", params.data);
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

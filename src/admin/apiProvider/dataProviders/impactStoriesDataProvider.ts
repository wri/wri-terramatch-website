import { DataProvider } from "react-admin";

import {
  DeleteV2AdminImpactStoriesIdError,
  fetchDeleteV2AdminImpactStoriesId,
  //   fetchDeleteV2AdminReportingFrameworksUUID,
  fetchGetV2AdminImpactStories,
  fetchGetV2AdminImpactStoriesId,
  fetchPostV2AdminImpactStories,
  fetchPutV2AdminImpactStoriesId,
  //   fetchGetV2AdminReportingFrameworks,
  //   fetchPostV2AdminReportingFrameworks,
  //   fetchPutV2AdminReportingFrameworksUUID,
  GetV2AdminImpactStoriesError,
  GetV2AdminImpactStoriesIdError,
  PostV2AdminImpactStoriesError,
  PutV2AdminImpactStoriesIdError
  //   GetV2AdminReportingFrameworksError
} from "@/generated/apiComponents";

import { getFormattedErrorForRA } from "../utils/error";
import { apiListResponseToRAListResult, raListParamsToQueryParams } from "../utils/listing";

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
      //To be replaced with fetchGetV2AdminReportingFrameworksUUID When implemented
      const list = await fetchGetV2AdminImpactStoriesId({
        pathParams: { id: params.id }
      });
      const response = { data: list };

      //@ts-ignore
      return { data: { ...response.data, id: response.data.uuid } };
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
    try {
      const response = await fetchPutV2AdminImpactStoriesId({
        body: params.data,
        pathParams: { id: params.id as string }
      });

      // @ts-expect-error
      return { data: { ...response.data, id: response.id } };
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
  }
};

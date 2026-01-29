import { omit } from "lodash";
import { DataProvider } from "react-admin";

import { createImpactStory, loadImpactStories, loadImpactStory } from "@/connections/ImpactStory";
import {
  DeleteV2AdminImpactStoriesIdError,
  fetchDeleteV2AdminImpactStoriesId,
  fetchPostV2AdminImpactStoriesBulkDelete,
  fetchPutV2AdminImpactStoriesId,
  PostV2AdminImpactStoriesBulkDeleteError,
  PutV2AdminImpactStoriesIdError
} from "@/generated/apiComponents";
import { CreateImpactStoryAttributes } from "@/generated/v3/entityService/entityServiceSchemas";

import { getFormattedErrorForRA, v3ErrorForRA } from "../utils/error";
import { raConnectionProps } from "../utils/listing";
import { handleUploads } from "../utils/upload";

export const impactStoriesDataProvider: Partial<DataProvider> = {
  //@ts-ignore
  async getList(_, params) {
    const connection = await loadImpactStories(raConnectionProps(params));
    if (connection.loadFailure != null) {
      throw v3ErrorForRA("Site report index fetch failed", connection.loadFailure);
    }
    return {
      data: connection.data?.map(story => ({ ...story, id: story.uuid })),
      total: connection.indexTotal ?? 0
    };
  },
  // @ts-ignore
  async getOne(_, params) {
    const { loadFailure, data: impactStory } = await loadImpactStory({ id: params.id });
    if (loadFailure != null) {
      throw v3ErrorForRA("Project Pitch get fetch failed", loadFailure);
    }

    return { data: { ...impactStory, id: impactStory?.uuid } };
  },
  //@ts-ignore
  async create(__, params) {
    const uploadKeys = ["thumbnail"];

    const { organizationUuid } = params.data;

    if (organizationUuid == null) {
      throw v3ErrorForRA("Impact story creation failed", new Error("Organization UUID is required"));
    }

    const attributes: CreateImpactStoryAttributes = {
      title: params.data.title ?? "",
      status: params.data.status ?? "draft",
      organizationUuid,
      ...(params.data.date != null && { date: params.data.date }),
      ...(params.data.category != null && { category: params.data.category }),
      ...(params.data.content != null && { content: params.data.content })
    };

    try {
      const impactStory = await createImpactStory(attributes);
      const { uuid } = impactStory;

      if (uuid == null) {
        throw v3ErrorForRA("Impact story creation failed", new Error("Created impact story missing UUID"));
      }

      await handleUploads(params, uploadKeys, { uuid, entity: "impactStories" });

      return { data: { ...impactStory, id: uuid } };
    } catch (err) {
      throw v3ErrorForRA("Impact story creation failed", err);
    }
  },
  //@ts-ignore
  async update(__, params) {
    const uuid = params.id as string;
    const uploadKeys = ["thumbnail"];
    const body = omit(params.data, uploadKeys);

    try {
      await handleUploads(params, uploadKeys, { uuid, entity: "impactStories" });

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

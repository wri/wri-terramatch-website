import { DataProvider } from "react-admin";

import {
  bulkDeleteImpactStories,
  createImpactStory,
  deleteImpactStory,
  loadImpactStories,
  loadImpactStory,
  updateImpactStory
} from "@/connections/ImpactStory";
import {
  CreateImpactStoryAttributes,
  StoreImpactStoryAttributes
} from "@/generated/v3/entityService/entityServiceSchemas";

import { v3ErrorForRA } from "../utils/error";
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

    if (uuid == null) {
      throw v3ErrorForRA("Impact story update failed", new Error("Impact story UUID is required"));
    }

    const attributes: StoreImpactStoryAttributes = {
      status: params.data.status ?? "draft",
      ...(params.data.title != null && { title: params.data.title }),
      ...(params.data.organizationUuid != null && { organizationUuid: params.data.organizationUuid }),
      ...(params.data.date != null && { date: params.data.date }),
      ...(params.data.category != null && { category: params.data.category }),
      ...(params.data.content != null && { content: params.data.content })
    };

    try {
      await handleUploads(params, uploadKeys, { uuid, entity: "impactStories" });

      const impactStory = await updateImpactStory(attributes, { id: uuid });

      if (impactStory.uuid == null) {
        throw v3ErrorForRA("Impact story update failed", new Error("Updated impact story missing UUID"));
      }

      return { data: { ...impactStory, id: impactStory.uuid } };
    } catch (err) {
      throw v3ErrorForRA("Impact story update failed", err);
    }
  },

  //@ts-ignore
  async delete(__, params) {
    const uuid = params.id as string;

    if (uuid == null) {
      throw v3ErrorForRA("Impact story delete failed", new Error("Impact story UUID is required"));
    }

    try {
      await deleteImpactStory(uuid);
      return { data: { id: params.id } };
    } catch (err) {
      throw v3ErrorForRA("Impact story delete failed", err);
    }
  },
  // @ts-ignore
  async deleteMany(_, params) {
    if (params.ids == null || params.ids.length === 0) {
      return { data: [] };
    }

    try {
      await bulkDeleteImpactStories(params.ids.map(String));
      return { data: params.ids };
    } catch (err) {
      throw v3ErrorForRA("Impact stories bulk delete failed", err);
    }
  }
};

/**
 * Application Data Provider
 * API Documentation: https://test.wrirestorationmarketplace.cubeapis.com/documentation#tag/Form-Submissions
 * An Application is another word for a Form Submission.
 */

import { DataProvider, Identifier } from "react-admin";

import {
  DeleteV2AdminFormsApplicationsUUIDError,
  fetchDeleteV2AdminFormsApplicationsUUID,
  fetchGetV2AdminFormsApplications,
  fetchGetV2AdminFormsApplicationsUUID,
  fetchPatchV2AdminFormsSubmissionsUUIDStatus,
  GetV2AdminFormsApplicationsError,
  GetV2AdminFormsApplicationsUUIDError,
  PatchV2AdminFormsSubmissionsUUIDStatusError
} from "@/generated/apiComponents";
import { ApplicationRead, FormSubmissionRead } from "@/generated/apiSchemas";

import { getFormattedErrorForRA } from "../utils/error";
import { apiListResponseToRAListResult, raListParamsToQueryParams } from "../utils/listing";
import { extractLocaleFromAdminPath } from "../utils/localeExtractor";

export const applicationSortableList: string[] = [
  "organisation_name",
  "funding_programme_name",
  "created_at",
  "updated_at"
];
export interface ApplicationDataProvider extends DataProvider {
  export: (resource: string) => Promise<void>;
  exportSubmission: (uuid: string) => Promise<void>;
}

const normalizeApplicationObject = (item: FormSubmissionRead) => ({
  ...item,
  id: item.uuid as Identifier
});

export const applicationDataProvider: ApplicationDataProvider = {
  //@ts-ignore
  async getList(_, params) {
    if (params.filter.current_submission) {
      params.filter.current_submission = params.filter.current_submission.uuid;
    }

    try {
      const response = await fetchGetV2AdminFormsApplications({
        // Sort field currently broken.
        queryParams: raListParamsToQueryParams(
          params,
          applicationSortableList,
          [{ key: "current_submission", replaceWith: "current_stage" }],
          [
            { key: "organisation_uuid", replaceWith: "organisation_name" },
            { key: "funding_programme_uuid", replaceWith: "funding_programme_name" },
            { key: "current_submission.created_at", replaceWith: "created_at" },
            { key: "current_submission.updated_at", replaceWith: "updated_at" }
          ]
        )
      });

      const result = apiListResponseToRAListResult(response);

      return {
        ...result,
        data: result.data?.map((item: FormSubmissionRead) => normalizeApplicationObject(item))
      };
    } catch (err) {
      throw getFormattedErrorForRA(err as GetV2AdminFormsApplicationsError);
    }
  },

  // @ts-ignore
  async getOne(_, params) {
    const locale = extractLocaleFromAdminPath();
    try {
      const response = await fetchGetV2AdminFormsApplicationsUUID({
        pathParams: { uuid: params.id },
        queryParams: { ...(locale == null ? {} : { lang: locale }) }
      });

      // @ts-ignore
      const application = response.data as ApplicationRead;
      const data = {
        ...application,
        // We took this field out of the BE API response to cut down the render time for this
        // massive object, but a bunch of admin code still wants it, so map it in here.
        current_submission: (application?.form_submissions ?? []).find(
          ({ uuid }) => uuid === application?.current_submission_uuid
        ),
        id: application.uuid
      };
      return { data };
    } catch (err) {
      throw getFormattedErrorForRA(err as GetV2AdminFormsApplicationsUUIDError);
    }
  },

  async getManyReference(_, params) {
    const res = await fetchGetV2AdminFormsApplications({
      queryParams: {
        ...raListParamsToQueryParams(params, applicationSortableList),
        ["filter[organisation_uuid]"]: params.id
      }
    });

    return apiListResponseToRAListResult(res);
  },

  //@ts-ignore
  async delete(_, params) {
    try {
      await fetchDeleteV2AdminFormsApplicationsUUID({
        pathParams: { uuid: params.id as string }
      });
      return { data: { id: params.id } };
    } catch (err) {
      throw getFormattedErrorForRA(err as DeleteV2AdminFormsApplicationsUUIDError);
    }
  },

  async deleteMany(_, params) {
    try {
      for (const id of params.ids) {
        await fetchDeleteV2AdminFormsApplicationsUUID({
          pathParams: { uuid: id as string }
        });
      }

      return { data: params.ids };
    } catch (err) {
      throw getFormattedErrorForRA(err as DeleteV2AdminFormsApplicationsUUIDError);
    }
  },

  async update(_, params) {
    try {
      const resp = await fetchPatchV2AdminFormsSubmissionsUUIDStatus({
        // @ts-ignore
        pathParams: { uuid: params.id },
        body: {
          feedback: params.data.feedback,
          status: params.data.status
        }
      });

      //@ts-ignore
      return { data: { ...resp.data, id: resp.data.uuid } };
    } catch (err) {
      throw getFormattedErrorForRA(err as PatchV2AdminFormsSubmissionsUUIDStatusError);
    }
  }
};

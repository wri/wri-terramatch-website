import { DataProvider, GetListParams, GetOneParams } from "react-admin";

import { loadApplication, loadApplicationIndex } from "@/connections/Application";
import { loadSubmission } from "@/connections/FormSubmission";
import { loadFundingProgramme } from "@/connections/FundingProgramme";
import {
  DeleteV2AdminFormsApplicationsUUIDError,
  fetchDeleteV2AdminFormsApplicationsUUID,
  fetchGetV2AdminFormsApplications,
  fetchPatchV2AdminFormsSubmissionsUUIDStatus,
  PatchV2AdminFormsSubmissionsUUIDStatusError
} from "@/generated/apiComponents";
import {
  ApplicationDto,
  FundingProgrammeDto,
  SubmissionDto,
  SubmissionReferenceDto
} from "@/generated/v3/entityService/entityServiceSchemas";

import { getFormattedErrorForRA, v3ErrorForRA } from "../utils/error";
import { apiListResponseToRAListResult, raConnectionProps, raListParamsToQueryParams } from "../utils/listing";

export type ApplicationShowRecord = ApplicationDto & {
  id: string;
  currentSubmission: SubmissionDto | null;
  fundingProgramme: FundingProgrammeDto | null;
};

export type ApplicationListRecord = ApplicationDto & { id: string; currentSubmission: SubmissionReferenceDto | null };

export const applicationSortableList: string[] = ["organisationName", "createdAt", "updatedAt"];
export interface ApplicationDataProvider extends DataProvider {
  export: (resource: string) => Promise<void>;
  exportSubmission: (uuid: string) => Promise<void>;
}

export const applicationDataProvider: ApplicationDataProvider = {
  async getList<RecordType>(_: string, params: GetListParams) {
    let { filter, ...props } = params;
    if (filter != null) {
      const { currentSubmission, ...rest } = filter;
      filter = rest;
      if (currentSubmission?.status != null) filter.currentSubmissionStatus = currentSubmission.status;
    }
    const connected = await loadApplicationIndex(raConnectionProps({ ...props, filter }));
    if (connected.loadFailure != null) {
      throw v3ErrorForRA("Application index fetch failed", connected.loadFailure);
    }

    const data =
      connected.data?.map((application): ApplicationListRecord => {
        const currentSubmission =
          application.submissions.length === 0 ? null : application.submissions[application.submissions.length - 1];
        return {
          ...application,
          id: application.uuid,
          currentSubmission
        };
      }) ?? [];

    return { data: data as RecordType[], total: connected.indexTotal };
  },

  async getOne<RecordType>(_: string, { id }: GetOneParams) {
    // Disable translations for admin data provider.
    const application = await loadApplication({
      id,
      translated: false,
      sideloads: ["fundingProgramme", "currentSubmission"]
    });
    if (application.loadFailure != null) {
      throw v3ErrorForRA("Application fetch failed", application.loadFailure);
    }

    const fundingProgramme = await loadFundingProgramme({
      id: application.data?.fundingProgrammeUuid ?? "",
      enabled: application.data?.fundingProgrammeUuid != null
    });
    const submissions = application.data?.submissions ?? [];
    const currentSubmissionUuid = submissions.length === 0 ? undefined : submissions[submissions.length - 1].uuid;
    const submission = await loadSubmission({
      id: currentSubmissionUuid ?? "",
      enabled: currentSubmissionUuid != null
    });

    return {
      data: {
        ...application.data,
        id: application.data?.uuid,
        currentSubmission: submission.data,
        fundingProgramme: fundingProgramme.data
      }
    } as RecordType;
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

import { DataProvider, DeleteParams, GetListParams, GetOneParams } from "react-admin";

import { deleteApplication, loadApplication, loadApplicationIndex } from "@/connections/Application";
import { loadSubmission } from "@/connections/FormSubmission";
import { loadFundingProgramme } from "@/connections/FundingProgramme";
import {
  ApplicationDto,
  EmbeddedSubmissionDto,
  FundingProgrammeDto,
  SubmissionDto
} from "@/generated/v3/entityService/entityServiceSchemas";

import { v3ErrorForRA } from "../utils/error";
import { raConnectionProps } from "../utils/listing";

export type ApplicationShowRecord = ApplicationDto & {
  id: string;
  currentSubmission: SubmissionDto | null;
  fundingProgramme: FundingProgrammeDto | null;
};

export type ApplicationListRecord = ApplicationDto & { id: string; currentSubmission: EmbeddedSubmissionDto | null };

export const applicationDataProvider: Partial<DataProvider> = {
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

  async delete<RecordType>(_: string, { id }: DeleteParams) {
    try {
      await deleteApplication(id as string);
      return { data: { id } } as RecordType;
    } catch (err) {
      throw v3ErrorForRA("Application delete fetch failed", err);
    }
  },

  async deleteMany(_, params) {
    try {
      await Promise.all(params.ids.map(id => deleteApplication(id as string)));
      return { data: params.ids };
    } catch (err) {
      throw v3ErrorForRA("Application delete fetch failed", err);
    }
  }
};

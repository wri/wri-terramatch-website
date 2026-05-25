import { DataProvider, GetListParams, GetListResult, GetOneParams, RaRecord } from "react-admin";

import {
  createReportingFramework,
  deleteReportingFramework,
  loadReportingFramework,
  loadReportingFrameworks,
  updateReportingFramework
} from "@/connections/ReportingFramework";
import type { UpdateReportingFrameworkAttributes } from "@/generated/v3/entityService/entityServiceSchemas";
import { CreateReportingFrameworkAttributes } from "@/generated/v3/entityService/entityServiceSchemas";
import { ReportingFrameworkDto } from "@/generated/v3/entityService/entityServiceSchemas";

import { v3ErrorForRA } from "../utils/error";
import { sliceRaListPage } from "../utils/listing";

type ReportingFrameworkRecord = ReportingFrameworkDto & { id: string };

function formDataToCreateAttributes(data: ReportingFrameworkRecord): CreateReportingFrameworkAttributes {
  return {
    name: data.name ?? "",
    projectFormUuid: data.projectFormUuid ?? null,
    projectReportFormUuid: data.projectReportFormUuid ?? null,
    siteFormUuid: data.siteFormUuid ?? null,
    siteReportFormUuid: data.siteReportFormUuid ?? null,
    nurseryFormUuid: data.nurseryFormUuid ?? null,
    nurseryReportFormUuid: data.nurseryReportFormUuid ?? null,
    financialReportFormUuid: data.financialReportFormUuid ?? null
  };
}

function formDataToUpdateAttributes(data: ReportingFrameworkRecord): UpdateReportingFrameworkAttributes {
  return {
    name: data.name ?? undefined,
    projectFormUuid: data.projectFormUuid ?? undefined,
    projectReportFormUuid: data.projectReportFormUuid ?? undefined,
    siteFormUuid: data.siteFormUuid ?? undefined,
    siteReportFormUuid: data.siteReportFormUuid ?? undefined,
    nurseryFormUuid: data.nurseryFormUuid ?? undefined,
    nurseryReportFormUuid: data.nurseryReportFormUuid ?? undefined,
    financialReportFormUuid: data.financialReportFormUuid ?? undefined
  };
}

export const reportingFrameworkDataProvider: DataProvider = {
  async getList(_: string, params: GetListParams): Promise<GetListResult> {
    try {
      const connected = await loadReportingFrameworks({});
      if (connected.loadFailure != null) {
        throw v3ErrorForRA("Reporting frameworks index fetch failed", connected.loadFailure);
      }

      const data = (connected.data ?? []).map((framework: ReportingFrameworkDto) => ({
        ...framework,
        id: framework.slug ?? framework.uuid
      }));

      return sliceRaListPage(data as RaRecord[], params);
    } catch (err) {
      throw v3ErrorForRA("Reporting frameworks fetch failed", err);
    }
  },

  //@ts-ignore
  async getOne(_: string, params: GetOneParams) {
    try {
      const frameworkKey = params.id as string;

      if (frameworkKey == null || frameworkKey === "") {
        throw v3ErrorForRA("Reporting framework ID is required", {
          statusCode: 400,
          message: "Framework key is required"
        });
      }

      const connected = await loadReportingFramework({ frameworkKey });

      if (connected.loadFailure != null) {
        throw v3ErrorForRA("Reporting framework fetch failed", connected.loadFailure);
      }

      return { data: { ...connected.data!, id: connected.data!.slug ?? connected.data!.uuid } };
    } catch (err) {
      throw v3ErrorForRA("Reporting framework fetch failed", err);
    }
  },
  //@ts-ignore
  async create(__, params) {
    try {
      const attributes = formDataToCreateAttributes(params.data as ReportingFrameworkRecord);
      const created = await createReportingFramework(attributes);
      return { data: { ...created, id: created.slug ?? created.uuid } };
    } catch (err) {
      throw v3ErrorForRA("Reporting framework create failed", err);
    }
  },

  //@ts-ignore
  async update(__, params) {
    try {
      const frameworkKey = params.id as string;
      const attributes = formDataToUpdateAttributes(params.data as ReportingFrameworkRecord);
      const data = await updateReportingFramework(attributes, { frameworkKey });
      return { data: { ...data, id: data.slug ?? data.uuid } };
    } catch (err) {
      throw v3ErrorForRA("Reporting framework update failed", err);
    }
  },

  //@ts-ignore
  async delete(__, params) {
    try {
      const frameworkKey = params.id as string;
      await deleteReportingFramework(frameworkKey);
      return { data: { id: params.id } };
    } catch (err) {
      throw v3ErrorForRA("Reporting framework delete failed", err);
    }
  }
};

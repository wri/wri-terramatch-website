import { DataProvider, GetListParams, GetListResult, GetOneParams } from "react-admin";

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
import ApiSlice from "@/store/apiSlice";

import { v3ErrorForRA } from "../utils/error";

type ReportingFrameworkRecord = {
  id?: string;
  uuid?: string;
  name?: string;
  accessCode?: string | null;
  projectFormUuid?: string | null;
  siteFormUuid?: string | null;
  nurseryFormUuid?: string | null;
  projectReportFormUuid?: string | null;
  siteReportFormUuid?: string | null;
  nurseryReportFormUuid?: string | null;
  totalProjectsCount?: number;
};

function toRARecord(dto: ReportingFrameworkDto): ReportingFrameworkRecord {
  return {
    id: dto.slug ?? dto.uuid,
    uuid: dto.uuid,
    name: dto.name,
    accessCode: dto.slug ?? null,
    projectFormUuid: dto.projectFormUuid,
    siteFormUuid: dto.siteFormUuid,
    nurseryFormUuid: dto.nurseryFormUuid,
    projectReportFormUuid: dto.projectReportFormUuid,
    siteReportFormUuid: dto.siteReportFormUuid,
    nurseryReportFormUuid: dto.nurseryReportFormUuid,
    totalProjectsCount: dto.totalProjectsCount
  };
}

function formDataToCreateAttributes(data: ReportingFrameworkRecord): CreateReportingFrameworkAttributes {
  return {
    name: data.name ?? "",
    accessCode: data.accessCode ?? null,
    projectFormUuid: data.projectFormUuid ?? null,
    projectReportFormUuid: data.projectReportFormUuid ?? null,
    siteFormUuid: data.siteFormUuid ?? null,
    siteReportFormUuid: data.siteReportFormUuid ?? null,
    nurseryFormUuid: data.nurseryFormUuid ?? null,
    nurseryReportFormUuid: data.nurseryReportFormUuid ?? null
  };
}

function formDataToUpdateAttributes(data: ReportingFrameworkRecord): UpdateReportingFrameworkAttributes {
  return {
    name: data.name ?? undefined,
    accessCode: data.accessCode ?? undefined,
    projectFormUuid: data.projectFormUuid ?? undefined,
    projectReportFormUuid: data.projectReportFormUuid ?? undefined,
    siteFormUuid: data.siteFormUuid ?? undefined,
    siteReportFormUuid: data.siteReportFormUuid ?? undefined,
    nurseryFormUuid: data.nurseryFormUuid ?? undefined,
    nurseryReportFormUuid: data.nurseryReportFormUuid ?? undefined
  };
}

export const reportingFrameworkDataProvider: DataProvider = {
  async getList(_: string, params: GetListParams): Promise<GetListResult> {
    try {
      const connected = await loadReportingFrameworks({});
      if (connected.loadFailure != null) {
        throw v3ErrorForRA("Reporting frameworks index fetch failed", connected.loadFailure);
      }

      const data = (connected.data ?? []).map((framework: ReportingFrameworkDto) => toRARecord(framework));

      return {
        data,
        total: connected.indexTotal ?? data.length
      };
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

      ApiSlice.pruneCache("reportingFrameworks", [frameworkKey]);

      const connected = await loadReportingFramework({ frameworkKey, enabled: true });

      if (connected.loadFailure != null) {
        throw v3ErrorForRA("Reporting framework fetch failed", connected.loadFailure);
      }

      if (connected.data == null) {
        throw v3ErrorForRA("Reporting framework not found", { statusCode: 404, message: "Not found" });
      }

      return { data: toRARecord(connected.data) };
    } catch (err) {
      throw v3ErrorForRA("Reporting framework fetch failed", err);
    }
  },
  //@ts-ignore
  async create(__, params) {
    try {
      const attributes = formDataToCreateAttributes(params.data as ReportingFrameworkRecord);
      const created = await createReportingFramework(attributes);
      ApiSlice.pruneCache("reportingFrameworks");
      return { data: toRARecord(created) };
    } catch (err) {
      throw v3ErrorForRA("Reporting framework create failed", err);
    }
  },

  //@ts-ignore
  async update(__, params) {
    try {
      const frameworkKey = params.id as string;
      let uuid = (params.data?.uuid as string | undefined) ?? null;

      if (uuid == null) {
        const connected = await loadReportingFramework({ frameworkKey, enabled: true });
        if (connected.loadFailure != null || connected.data == null) {
          throw v3ErrorForRA("Reporting framework not found", {
            statusCode: 404,
            message: `Reporting framework with slug "${frameworkKey}" not found`
          });
        }
        uuid = connected.data.uuid;
      }

      const attributes = formDataToUpdateAttributes(params.data as ReportingFrameworkRecord);
      await updateReportingFramework(uuid, attributes);

      const connected = await loadReportingFramework({ frameworkKey, enabled: true });
      if (connected.loadFailure != null || connected.data == null) {
        throw v3ErrorForRA("Reporting framework fetch after update failed", connected.loadFailure);
      }
      return { data: toRARecord(connected.data) };
    } catch (err) {
      throw v3ErrorForRA("Reporting framework update failed", err);
    }
  },

  //@ts-ignore
  async delete(__, params) {
    try {
      const frameworkKey = params.id as string;
      const connected = await loadReportingFramework({ frameworkKey, enabled: true });

      if (connected.loadFailure != null || connected.data == null) {
        throw v3ErrorForRA("Reporting framework not found", {
          statusCode: 404,
          message: `Reporting framework with slug "${frameworkKey}" not found`
        });
      }

      await deleteReportingFramework(connected.data.uuid);
      return { data: { id: params.id } };
    } catch (err) {
      throw v3ErrorForRA("Reporting framework delete failed", err);
    }
  }
};

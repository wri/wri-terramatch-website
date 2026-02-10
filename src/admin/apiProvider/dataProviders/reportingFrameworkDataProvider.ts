import { DataProvider, GetListParams, GetListResult, GetOneParams } from "react-admin";

import { loadReportingFramework, loadReportingFrameworks } from "@/connections/ReportingFramework";
import {
  fetchDeleteV2AdminReportingFrameworksUUID,
  fetchPostV2AdminReportingFrameworks,
  fetchPutV2AdminReportingFrameworksUUID,
  GetV2AdminReportingFrameworksError
} from "@/generated/apiComponents";
import { ReportingFrameworkDto } from "@/generated/v3/entityService/entityServiceSchemas";
import ApiSlice from "@/store/apiSlice";

import { v3ErrorForRA } from "../utils/error";
import { getFormattedErrorForRA } from "../utils/error";

export const reportingFrameworkDataProvider: DataProvider = {
  async getList(_: string, params: GetListParams): Promise<GetListResult> {
    try {
      const connected = await loadReportingFrameworks({});
      if (connected.loadFailure != null) {
        throw v3ErrorForRA("Reporting frameworks index fetch failed", connected.loadFailure);
      }

      const data = (connected.data ?? []).map((framework: ReportingFrameworkDto) => ({
        ...framework,
        id: framework.slug,
        uuid: framework.uuid,
        access_code: framework.slug,
        project_form_uuid: framework.projectFormUuid,
        site_form_uuid: framework.siteFormUuid,
        nursery_form_uuid: framework.nurseryFormUuid,
        project_report_form_uuid: framework.projectReportFormUuid,
        site_report_form_uuid: framework.siteReportFormUuid,
        nursery_report_form_uuid: framework.nurseryReportFormUuid,
        total_projects_count: framework.totalProjectsCount
      }));

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

      return {
        data: {
          ...connected.data,
          id: connected.data.slug,
          uuid: connected.data.uuid,
          access_code: connected.data.slug,
          project_form_uuid: connected.data.projectFormUuid,
          site_form_uuid: connected.data.siteFormUuid,
          nursery_form_uuid: connected.data.nurseryFormUuid,
          project_report_form_uuid: connected.data.projectReportFormUuid,
          site_report_form_uuid: connected.data.siteReportFormUuid,
          nursery_report_form_uuid: connected.data.nurseryReportFormUuid,
          total_projects_count: connected.data.totalProjectsCount
        }
      };
    } catch (err) {
      throw v3ErrorForRA("Reporting framework fetch failed", err);
    }
  },
  //@ts-ignore
  async create(__, params) {
    try {
      const response = await fetchPostV2AdminReportingFrameworks({
        body: params.data
      });

      // @ts-expect-error
      return { data: { ...response.data, id: response.data?.slug ?? response.id } };
    } catch (err) {
      throw getFormattedErrorForRA(err as GetV2AdminReportingFrameworksError);
    }
  },
  //@ts-ignore
  async update(__, params) {
    try {
      const uuid = (params.data?.uuid as string | undefined) ?? null;

      if (uuid == null) {
        const frameworkKey = params.id as string;
        const connected = await loadReportingFramework({ frameworkKey, enabled: true });
        if (connected.loadFailure != null || connected.data == null) {
          throw getFormattedErrorForRA({
            statusCode: 404,
            message: `Reporting framework with slug "${frameworkKey}" not found`
          } as GetV2AdminReportingFrameworksError);
        }
        const frameworkUuid = connected.data.uuid;

        const response = await fetchPutV2AdminReportingFrameworksUUID({
          body: params.data,
          pathParams: { uuid: frameworkUuid }
        });

        // @ts-expect-error
        return { data: { ...response.data, id: response.data?.slug ?? response.id } };
      } else {
        const response = await fetchPutV2AdminReportingFrameworksUUID({
          body: params.data,
          pathParams: { uuid }
        });

        // @ts-expect-error
        return { data: { ...response.data, id: response.data?.slug ?? response.id } };
      }
    } catch (err) {
      throw getFormattedErrorForRA(err as GetV2AdminReportingFrameworksError);
    }
  },
  //@ts-ignore
  async delete(__, params) {
    try {
      const frameworkKey = params.id as string;
      const connected = await loadReportingFramework({ frameworkKey, enabled: true });

      if (connected.loadFailure != null || connected.data == null) {
        throw getFormattedErrorForRA({
          statusCode: 404,
          message: `Reporting framework with slug "${frameworkKey}" not found`
        } as GetV2AdminReportingFrameworksError);
      }

      const uuid = connected.data.uuid;

      await fetchDeleteV2AdminReportingFrameworksUUID({
        pathParams: { uuid }
      });
      return { data: { id: params.id } };
    } catch (err) {
      throw getFormattedErrorForRA(err as GetV2AdminReportingFrameworksError);
    }
  }
};

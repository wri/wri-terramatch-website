import { DataProvider } from "react-admin";

import { fetchGetV2AdminAuditsENTITYUUID } from "@/generated/apiComponents";

import { apiListResponseToRAListResult, raListParamsToQueryParams } from "../utils/listing";

export interface AuditDataProvider extends DataProvider {
  export: (resource: string) => Promise<void>;
}

// @ts-ignore
export const auditDataProvider: AuditDataProvider = {
  async getManyReference(_, params) {
    const res = await fetchGetV2AdminAuditsENTITYUUID({
      queryParams: raListParamsToQueryParams(params),
      pathParams: { entity: params.filter.entity, uuid: params.id as string }
    });

    return apiListResponseToRAListResult(res);
  }
};

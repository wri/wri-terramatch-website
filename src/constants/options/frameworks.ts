import { GetListParams } from "react-admin";

import { reportingFrameworkDataProvider } from "@/admin/apiProvider/dataProviders/reportingFrameworkDataProvider";

export const useFrameworkChoices = async () => {
  const params: GetListParams = {
    pagination: {
      page: 0,
      perPage: 0
    },
    sort: {
      field: "",
      order: ""
    },
    filter: {}
  };
  const data = await reportingFrameworkDataProvider.getList("", params);

  const frameworkChoices: any = (data as any)?.data.map((framework: any) => ({
    id: framework.slug,
    name: framework.name
  }));
  return frameworkChoices;
};

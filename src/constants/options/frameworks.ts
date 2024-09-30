import { useEffect, useState } from "react";
import { GetListParams } from "react-admin";

import { reportingFrameworkDataProvider } from "@/admin/apiProvider/dataProviders/reportingFrameworkDataProvider";

async function getFrameworkChoices() {
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

  return (data as any)?.data.map((framework: any) => ({
    id: framework.slug,
    name: framework.name
  }));
}

export function useFrameworkChoices() {
  const [frameworkChoices, setFrameworkChoices] = useState<any>([]);
  const fetchFrameworkChoices = async function () {
    try {
      setFrameworkChoices(await getFrameworkChoices());
    } catch (error) {
      console.error("Error fetching framework choices", error);
    }
  };

  useEffect(() => {
    fetchFrameworkChoices();
  }, []);

  return frameworkChoices;
}

import { useGetList } from "react-admin";

import modules from "../..";

export const useGetOrganisationsTotals = (filterValues: any) => {
  const resourceName = modules.organisation.ResourceName;
  const { total: draft } = useGetList(resourceName, {
    filter: { ...filterValues, status: "draft" }
  });
  const { total: pending } = useGetList(resourceName, {
    filter: { ...filterValues, status: "pending" }
  });
  const { total: approved } = useGetList(resourceName, {
    filter: { ...filterValues, status: "approved" }
  });
  const { total: rejected } = useGetList(resourceName, {
    filter: { ...filterValues, status: "rejected" }
  });

  return {
    draft,
    pending,
    approved,
    rejected
  };
};

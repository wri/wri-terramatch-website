import { useT } from "@transifex/react";
import { useMemo } from "react";

export const useGetFundingSourcesTableColumns = () => {
  const t = useT();

  return useMemo(
    () => [
      {
        id: "id",
        header: "#",
        accessorKey: "id",
        enableSorting: true
      },
      {
        id: "fundingYear",
        header: t("Funding year"),
        accessorKey: "fundingYear",
        enableSorting: true
      },
      {
        id: "fundingType",
        header: t("Funding type"),
        accessorKey: "fundingType",
        enableSorting: true
      },
      {
        id: "fundingSource",
        header: t("Funding source"),
        accessorKey: "fundingSource",
        enableSorting: true
      },
      {
        id: "fundingAmount",
        header: t("Funding amount"),
        accessorKey: "fundingAmount",
        enableSorting: true
      }
    ],
    [t]
  );
};

import { SortingState } from "@tanstack/react-table";
import { useT } from "@transifex/react";
import { useMemo } from "react";

import { FundingProgrammeDto } from "@/generated/v3/entityService/entityServiceSchemas";

export const useFundingProgrammeToFundingCardProps = (items: FundingProgrammeDto[]) => {
  const t = useT();
  return useMemo(
    () =>
      items.map(item => ({
        title: t(item.name),
        description: t(item.description),
        deadline: item.stages?.[0]?.deadlineAt ?? undefined,
        primaryLink: item.stages?.[0]?.formUuid != null ? `/form/${item.stages?.[0]?.formUuid}` : "",
        secondaryLink: item.readMoreUrl ?? "",
        location: item.location != null ? t(item.location) : t("N/A"),
        status: item.status
      })),
    [items, t]
  );
};

export const tableSortingStateToQueryParamsSort = (sorting: SortingState) =>
  sorting?.map(s => `${s.desc ? "-" : ""}${s.id}`).join(",");

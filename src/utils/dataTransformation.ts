import { SortingState } from "@tanstack/react-table";

import { FundingCardProps, FundingStatus } from "@/components/elements/Cards/FundingCard/FundingCard";
import { FundingProgrammeDto } from "@/generated/v3/entityService/entityServiceSchemas";

export const fundingProgrammeToFundingCardProps = (item: FundingProgrammeDto): FundingCardProps => ({
  title: item.name as string,
  description: item.description as string,
  deadline: item.stages?.[0]?.deadlineAt ?? undefined,
  primaryLink: item.stages?.[0]?.formUuid != null ? `/form/${item.stages?.[0]?.formUuid}` : "",
  secondaryLink: item.readMoreUrl ?? "",
  location: item.location || "N/A",
  status: (item.status as FundingStatus) || "inactive"
});

export const tableSortingStateToQueryParamsSort = (sorting: SortingState) =>
  sorting?.map(s => `${s.desc ? "-" : ""}${s.id}`).join(",");

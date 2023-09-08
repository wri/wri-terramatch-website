import { SortingState } from "@tanstack/react-table";

import { FundingCardProps, FundingStatus } from "@/components/elements/Cards/FundingCard/FundingCard";
import { FundingProgramme } from "@/generated/apiSchemas";

export const fundingProgrammeToFundingCardProps = (item: FundingProgramme) => {
  return {
    title: item.name as string,
    description: item.description as string,
    //@ts-ignore
    deadline: item?.deadline_at,
    //@ts-ignore
    primaryLink: item.first_form_uuid ? `/form/${item.first_form_uuid}` : "",
    secondaryLink: item.read_more_url || "",
    location: item.location || "N/A",
    status: (item.status as FundingStatus) || "inactive"
  } as FundingCardProps;
};

export const tableSortingStateToQueryParamsSort = (sorting: SortingState) =>
  sorting?.map(s => `${s.desc ? "-" : ""}${s.id}`).join(",");

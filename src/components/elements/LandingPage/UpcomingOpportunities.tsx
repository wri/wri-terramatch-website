import { Fragment } from "react";

import List from "@/components/extensive/List/List";
import LandingPageSectionLayout from "@/components/generic/Layout/LandingPageSectionLayout";

import UpcomingOpportunitiesCard, {
  UpcomingOpportunitiesCardProps
} from "../Cards/UpcomingOpportunitiesCard/UpcomingOpportunitiesCard";

export interface UpcomingOpportunitiesProps {
  title: string;
  items: UpcomingOpportunitiesCardProps[];
}
const UpcomingOpportunities = (props: UpcomingOpportunitiesProps) => {
  return (
    <LandingPageSectionLayout className="pb-9 pt-9 md:pb-29 md:pt-24" title={props.title} overridePadding>
      <List
        className="mt-8 flex flex-wrap items-center justify-center gap-6"
        itemAs={Fragment}
        items={props.items}
        render={item => <UpcomingOpportunitiesCard {...item} />}
      />
    </LandingPageSectionLayout>
  );
};

export default UpcomingOpportunities;

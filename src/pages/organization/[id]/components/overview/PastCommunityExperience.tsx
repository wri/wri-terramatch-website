import { useT } from "@transifex/react";

import Text from "@/components/elements/Text/Text";
import TextRow from "@/components/extensive/TextRow/TextRow";
import {
  getFarmersEngagementStrategyOptions,
  getWomenEngagementStrategyOptions,
  getYoungerThan35EngagementStrategyOptions
} from "@/constants/options/engagementStrategy";
import { V2OrganisationRead } from "@/generated/apiSchemas";
import { formatOptionsList } from "@/utils/options";

type PastCommunityExperienceProps = {
  organization?: V2OrganisationRead;
};

const PastCommunityExperience = ({ organization }: PastCommunityExperienceProps) => {
  const t = useT();

  return (
    <section className="my-10 rounded-lg bg-neutral-150  p-8">
      <Text variant="text-heading-300">{t("Social Impact")}</Text>
      <div className="mt-10 flex flex-col gap-3">
        <TextRow
          name={t("Engagement: Farmers")}
          value={formatOptionsList(getFarmersEngagementStrategyOptions(t), organization?.engagement_farmers)}
          nameClassName="w-1/3"
        />
        <TextRow
          name={t("Engagement: Women")}
          value={formatOptionsList(getWomenEngagementStrategyOptions(t), organization?.engagement_women)}
          nameClassName="w-1/3"
        />
        <TextRow
          name={t("Engagement: Youth")}
          value={formatOptionsList(getYoungerThan35EngagementStrategyOptions(t), organization?.engagement_youth)}
          nameClassName="w-1/3"
        />
        <TextRow
          name={t("Community Engagement Experience/Approach")}
          value={organization?.community_experience}
          nameClassName="w-1/3"
        />
        <TextRow
          name={t("Community Engagement Numbers")}
          value={organization?.total_engaged_community_members_3yr}
          nameClassName="w-1/3"
        />
      </div>
    </section>
  );
};

export default PastCommunityExperience;

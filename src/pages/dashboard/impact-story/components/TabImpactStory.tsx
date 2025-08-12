import { useT } from "@transifex/react";
import { useState } from "react";

import { IMPACT_CATEGORIES } from "@/admin/modules/impactStories/components/ImpactStoryForm";
import SecondaryTabs from "@/components/elements/Tabs/Secondary/SecondaryTabs";
import { VARIANT_TABS_IMPACT_STORY } from "@/components/elements/Tabs/Secondary/SecuandaryTabsVariants";
import { useImpactStories } from "@/connections/ImpactStory";

import CardImpactStory from "./CardImpactStory";

interface TabImpactStoryProps {
  searchTerm?: string;
}

const TabImpactStory = ({ searchTerm = "" }: TabImpactStoryProps) => {
  const t = useT();
  const [activeTab, setActiveTab] = useState<number>(0);
  const currentCategory = activeTab === 0 ? null : IMPACT_CATEGORIES[activeTab - 1].value;

  const [isLoaded, { data: impactStories }] = useImpactStories({
    filter: {
      ...(searchTerm != null ? { search: searchTerm } : {}),
      ...(currentCategory != null ? { category: currentCategory, status: "published" } : {})
    }
  });

  const filteredStories = currentCategory
    ? impactStories?.filter((story: any) => story.category && story.category.includes(currentCategory))
    : impactStories;

  const transformedStories =
    filteredStories?.map((story: any) => ({
      uuid: story.uuid,
      title: story.title,
      country:
        story.organization?.countries?.length > 0
          ? story.organization.countries.map((c: any) => c.label).join(", ")
          : "No country",
      organization: story.organization?.name,
      date: story.date,
      category: story.category ? story.category : [],
      description: story.content,
      image: story.thumbnail?.url,
      tags: story.category
        ? story.category.map((cat: string) => {
            const category = IMPACT_CATEGORIES.find(c => c.value === cat);
            return category ? category.title : cat;
          })
        : [],
      facebook_url: story.organization?.facebook_url,
      instagram_url: story.organization?.instagram_url,
      linkedin_url: story.organization?.linkedin_url,
      twitter_url: story.organization?.twitter_url
    })) || [];

  const tabItems = [
    {
      key: "view-all",
      title: t("View all"),
      body: (
        <div className="w-full">
          {!isLoaded ? (
            <div className="flex h-48 items-center justify-center">
              <span className="text-gray-500">{t("Loading...")}</span>
            </div>
          ) : transformedStories.length > 0 ? (
            <CardImpactStory stories={transformedStories} />
          ) : (
            <div className="flex h-48 items-center justify-center">
              <span className="text-gray-500">{t("No impact stories found")}</span>
            </div>
          )}
        </div>
      )
    },
    ...IMPACT_CATEGORIES.map(category => ({
      key: category.value,
      title: t(category.title),
      body: (
        <div className="w-full">
          {!isLoaded ? (
            <div className="flex h-48 items-center justify-center">
              <span className="text-gray-500">{t("Loading...")}</span>
            </div>
          ) : transformedStories.length > 0 ? (
            <CardImpactStory stories={transformedStories} />
          ) : (
            <div className="flex h-48 items-center justify-center">
              <span className="text-gray-500">{t("No impact stories found for this category")}</span>
            </div>
          )}
        </div>
      )
    }))
  ];

  return (
    <div className="-mt-2 w-full overflow-visible bg-transparent">
      <SecondaryTabs
        tabItems={tabItems}
        setSelectedIndex={setActiveTab}
        variant={VARIANT_TABS_IMPACT_STORY}
        selectedIndex={activeTab}
        scrollable
      />
    </div>
  );
};

export default TabImpactStory;

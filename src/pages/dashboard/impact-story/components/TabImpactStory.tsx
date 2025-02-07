import { useT } from "@transifex/react";
import { useState } from "react";

import SecondaryTabs from "@/components/elements/Tabs/Secondary/SecondaryTabs";
import { VARIANT_TABS_IMPACT_STORY } from "@/components/elements/Tabs/Secondary/SecuandaryTabsVariants";

import CardImpactStory from "./CardImpactStory";

const TabImpactStory = () => {
  const t = useT();
  const [activeTab, setActiveTab] = useState<number>(0);

  return (
    <div className="-mt-2 w-full overflow-hidden bg-transparent">
      <SecondaryTabs
        tabItems={[
          {
            key: "impact-story-1",
            title: t("View all"),
            body: <CardImpactStory />
          },
          {
            key: "impact-story-2",
            title: t("Gender equity"),
            body: <CardImpactStory />
          },
          {
            key: "impact-story-3",
            title: t("Youth engagement"),
            body: <CardImpactStory />
          },
          {
            key: "impact-story-4",
            title: t("Ecosystem services"),
            body: <CardImpactStory />
          },
          {
            key: "impact-story-5",
            title: t("Climate resilience"),
            body: <CardImpactStory />
          },
          {
            key: "impact-story-6",
            title: t("Institutional capacity"),
            body: <CardImpactStory />
          },
          {
            key: "impact-story-7",
            title: t("Climate resilience"),
            body: <CardImpactStory />
          },
          {
            key: "impact-story-8",
            title: t("Institutional capacity"),
            body: <CardImpactStory />
          }
        ]}
        setSelectedIndex={e => {
          setActiveTab(e);
        }}
        variant={VARIANT_TABS_IMPACT_STORY}
        selectedIndex={activeTab}
        scrollable
      />
    </div>
  );
};

export default TabImpactStory;

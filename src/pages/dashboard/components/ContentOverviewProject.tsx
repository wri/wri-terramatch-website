import { useT } from "@transifex/react";
import React from "react";

import Table from "@/components/elements/Table/Table";
import { VARIANT_TABLE_DASHBOARD_COUNTRIES } from "@/components/elements/Table/TableVariants";
import Text from "@/components/elements/Text/Text";
import ToolTip from "@/components/elements/Tooltip/Tooltip";
import Icon from "@/components/extensive/Icon/Icon";
import { IconNames } from "@/components/extensive/Icon/Icon";
import PageCard from "@/components/extensive/PageElements/Card/PageCard";

import { COLUMN_ACTIVE_COUNTRY, DATA_ACTIVE_COUNTRY } from "../mockedData/dashboard";
import ImpactStoryCard from "./ImpactStoryCard";
import TooltipGridMap from "./TooltipGridMap";

const ContentOverviewProject = () => {
  const t = useT();
  const dataImpactStories = [
    {
      id: "1",
      by: "FilmsForChange",
      date: "23 Sep 2023",
      description: "Mud Floods in our village in Kasese Uganda.",
      image: "/images/pitch-placeholder.webp",
      title: "Huge mudslide Causes Damage"
    },
    {
      id: "2",
      by: "FilmsForChange",
      date: "23 Sep 2023",
      description: "Women’s Tree Nursery is doing well. After receiving trees and he Lorem ipsum dolor sit amet",
      image: "/images/landing-page-hero-banner.webp",
      title: "Kyemihoko Rural Women’s Initiative"
    },
    {
      id: "3",
      by: "FilmsForChange",
      date: "23 Sep 2023",
      description: "Mud Floods in our village in Kasese Uganda.",
      image: "/images/terrafund-afr-100-explainer.webp",
      title: "Wild Fire"
    }
  ];
  return (
    <div className="flex w-2/5 overflow-y-auto overflow-x-hidden">
      <div className="flex flex-1 flex-col gap-4 overflow-x-hidden p-0">
        <div className="shadow-lg relative">
          <img src="/images/map-img.png" alt="map" className="h-full w-full" />
          <TooltipGridMap label="Angola" learnMore={true} />
          <div className="absolute bottom-6 left-6 grid gap-2 rounded-lg bg-white px-4 py-2">
            <div className="flex gap-2">
              <Icon name={IconNames.IC_LEGEND_MAP} className="h-4.5 w-4.5 text-tertiary-800" />
              <Text variant="text-12" className="text-darkCustom">
                {t("Non-Profit Projects (32)")}
              </Text>
            </div>
            <div className="flex gap-2">
              <Icon name={IconNames.IC_LEGEND_MAP} className="h-4.5 w-4.5 text-blue-50" />
              <Text variant="text-12" className="text-darkCustom">
                {t("Enterprise Projects (457)")}
              </Text>
            </div>
          </div>
        </div>

        <PageCard title="IMPACT STORIES">
          {dataImpactStories.map(story => (
            <ImpactStoryCard
              key={story.id}
              by={story.by}
              date={story.date}
              description={story.description}
              image={story.image}
              title={story.title}
            />
          ))}
        </PageCard>

        <div className="z-10 rounded-xl bg-white p-4 shadow-all">
          <div className="flex items-center gap-2">
            <Text variant={"text-20-bold"}>{t("OTHER PROJECTS IN NIGER")}</Text>
            <ToolTip content={"tooltip table"} placement="top" width="w-44 lg:w-52">
              <Icon name={IconNames.IC_INFO} className="h-3.5 w-3.5 text-darkCustom lg:h-5 lg:w-5" />
            </ToolTip>
          </div>
          <div className="mt-2 flex h-full w-full">
            <div className="flex-1 overflow-auto">
              <Table
                columns={COLUMN_ACTIVE_COUNTRY}
                data={DATA_ACTIVE_COUNTRY}
                variant={VARIANT_TABLE_DASHBOARD_COUNTRIES}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentOverviewProject;

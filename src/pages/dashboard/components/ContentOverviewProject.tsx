import { useT } from "@transifex/react";
import React from "react";

import Table from "@/components/elements/Table/Table";
import { VARIANT_TABLE_DASHBOARD_COUNTRIES } from "@/components/elements/Table/TableVariants";
import Text from "@/components/elements/Text/Text";
import ToolTip from "@/components/elements/Tooltip/Tooltip";
import Icon from "@/components/extensive/Icon/Icon";
import { IconNames } from "@/components/extensive/Icon/Icon";
import PageCard from "@/components/extensive/PageElements/Card/PageCard";
import PageRow from "@/components/extensive/PageElements/Row/PageRow";

import {
  COLUMN_ACTIVE_COUNTRY,
  DATA_ACTIVE_COUNTRY,
  RESTORATION_STRATEGIES_REPRESENTED,
  TARGET_LAND_USE_TYPES_REPRESENTED,
  TOTAL_HECTARES_UNDER_RESTORATION,
  TOTAL_NUMBER_OF_SITES
} from "../mockedData/dashboard";
import ImpactStoryCard from "./ImpactStoryCard";
import SecDashboard from "./SecDashboard";
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
    <div className="flex w-1/2 ">
      <PageRow className="w-full gap-4 p-0">
        <div className="shadow-lg relative w-full">
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

        <PageCard title="IMPACT STORIES" gap={4}>
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
        <PageCard
          className="border-0 px-4 py-6"
          classNameSubTitle="mt-4"
          gap={8}
          subtitleMore={true}
          title={t("HECTARES UNDER RESTORATION")}
          variantSubTitle="text-14-light"
          subtitle={t(
            `The numbers and reports below display data related to Indicator 2: Hectares Under Restoration described in <span class="underline">TerraFund’s MRV framework</span>. Please refer to the linked MRV framework for details on how these numbers are sourced and verified.`
          )}
        >
          <div className="grid w-3/4 auto-cols-max grid-flow-col gap-12 divide-x divide-grey-1000">
            <SecDashboard
              title={t("Total HECTARES UNDER RESTORATION")}
              data={TOTAL_HECTARES_UNDER_RESTORATION}
              classNameBody="w-full place-content-center !justify-center"
            />
            <SecDashboard
              title={t("TOTAL NUMBER OF SITES")}
              data={TOTAL_NUMBER_OF_SITES}
              className="pl-12"
              classNameBody="w-full place-content-center !justify-center"
            />
          </div>
          <SecDashboard title={t("Restoration Strategies Represented")} data={RESTORATION_STRATEGIES_REPRESENTED} />
          <SecDashboard title={t("TARGET LAND USE TYPES REPRESENTED")} data={TARGET_LAND_USE_TYPES_REPRESENTED} />
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
      </PageRow>
    </div>
  );
};

export default ContentOverviewProject;

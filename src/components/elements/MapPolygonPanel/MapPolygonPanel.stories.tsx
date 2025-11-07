import { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

import type { SitePolygonLightDto } from "@/generated/v3/researchService/researchServiceSchemas";
import Log from "@/utils/log";

import Component from "./MapPolygonPanel";

const meta: Meta<typeof Component> = {
  title: "Components/Elements/MapPolygonPanel",
  component: Component
};

export default meta;
type Story = StoryObj<typeof Component>;

const items: SitePolygonLightDto[] = [
  {
    uuid: "1",
    lightResource: true,
    name: "Puerto Princesa Subterranean River National Park Forest Corridor",
    status: "approved",
    siteId: null,
    polygonUuid: "poly-1",
    projectId: null,
    projectShortName: null,
    plantStart: "2021-03-12T00:00:00Z",
    calcArea: null,
    lat: null,
    long: null,
    indicators: [],
    siteName: null,
    versionName: null,
    practice: null,
    targetSys: null,
    distr: null,
    numTrees: null,
    source: null,
    validationStatus: "notChecked",
    primaryUuid: null,
    disturbanceableId: null
  },
  {
    uuid: "2",
    lightResource: true,
    name: "A medium sized project site to see how it looks with 2 lines",
    status: "submitted",
    siteId: null,
    polygonUuid: "poly-2",
    projectId: null,
    projectShortName: null,
    plantStart: "2021-03-12T00:00:00Z",
    calcArea: null,
    lat: null,
    long: null,
    indicators: [],
    siteName: null,
    versionName: null,
    practice: null,
    targetSys: null,
    distr: null,
    numTrees: null,
    source: null,
    validationStatus: "notChecked",
    primaryUuid: null,
    disturbanceableId: null
  },
  {
    uuid: "3",
    lightResource: true,
    name: "A shorter project site",
    status: "draft",
    siteId: null,
    polygonUuid: "poly-3",
    projectId: null,
    projectShortName: null,
    plantStart: "2021-03-12T00:00:00Z",
    calcArea: null,
    lat: null,
    long: null,
    indicators: [],
    siteName: null,
    versionName: null,
    practice: null,
    targetSys: null,
    distr: null,
    numTrees: null,
    source: null,
    validationStatus: "notChecked",
    primaryUuid: null,
    disturbanceableId: null
  },
  {
    uuid: "4",
    lightResource: true,
    name: "Very long name A medium sized project site to see how it looks with 2 lines A medium sized project site to see how it looks with 2 lines A medium sized project site to see how it looks with 2 lines",
    status: "needs-more-information",
    siteId: null,
    polygonUuid: "poly-4",
    projectId: null,
    projectShortName: null,
    plantStart: "2021-03-12T00:00:00Z",
    calcArea: null,
    lat: null,
    long: null,
    indicators: [],
    siteName: null,
    versionName: null,
    practice: null,
    targetSys: null,
    distr: null,
    numTrees: null,
    source: null,
    validationStatus: "notChecked",
    primaryUuid: null,
    disturbanceableId: null
  },
  {
    uuid: "5",
    lightResource: true,
    name: "A shorter project site",
    status: "approved",
    siteId: null,
    polygonUuid: "poly-5",
    projectId: null,
    projectShortName: null,
    plantStart: "2021-03-12T00:00:00Z",
    calcArea: null,
    lat: null,
    long: null,
    indicators: [],
    siteName: null,
    versionName: null,
    practice: null,
    targetSys: null,
    distr: null,
    numTrees: null,
    source: null,
    validationStatus: "notChecked",
    primaryUuid: null,
    disturbanceableId: null
  },
  {
    uuid: "6",
    lightResource: true,
    name: "A shorter project site",
    status: "approved",
    siteId: null,
    polygonUuid: "poly-6",
    projectId: null,
    projectShortName: null,
    plantStart: "2021-03-12T00:00:00Z",
    calcArea: null,
    lat: null,
    long: null,
    indicators: [],
    siteName: null,
    versionName: null,
    practice: null,
    targetSys: null,
    distr: null,
    numTrees: null,
    source: null,
    validationStatus: "notChecked",
    primaryUuid: null,
    disturbanceableId: null
  }
];

export const Default: Story = {
  render: args => {
    const [query] = useState<string>();

    return (
      <div className="bg-back-map bg-cover">
        <div className="bg-[#ffffff26] p-4">
          <Component
            {...args}
            items={items.filter(item => (query != null ? (item.name ?? "").includes(query) : true))}
          />
        </div>
      </div>
    );
  },
  args: {
    title: "Project Sites",
    onSelectItem: Log.info
  }
};

export const OpenPolygonCheck: Story = {
  render: args => {
    const [query] = useState<string>();

    return (
      <div className="bg-back-map bg-cover">
        <div className="bg-[#ffffff26] p-4">
          <Component
            {...args}
            items={items.filter(item => (query != null ? (item.name ?? "").includes(query) : true))}
          />
        </div>
      </div>
    );
  },
  args: {
    title: "Project Sites",
    onSelectItem: Log.info
  }
};

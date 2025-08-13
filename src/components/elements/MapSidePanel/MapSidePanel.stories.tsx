import { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

import type { SitePolygonFullDto } from "@/generated/v3/researchService/researchServiceSchemas";

import Component from "./MapSidePanel";

const meta: Meta<typeof Component> = {
  title: "Components/Elements/MapSidePanel",
  component: Component
};

export default meta;
type Story = StoryObj<typeof Component>;

export const Default: Story = {
  render: args => {
    const [query, setQuery] = useState<string>();

    return (
      <Component
        {...args}
        items={items.filter(item => (query != null ? (item.name ?? "").includes(query) : true))}
        onSearch={setQuery}
        title="Project Sites"
      />
    );
  },
  args: {
    title: "Project Sites"
  }
};

const items: SitePolygonFullDto[] = [
  {
    uuid: "1",
    lightResource: false,
    name: "Puerto Princesa Subterranean River National Park Forest Corridor",
    status: "submitted",
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
    plantingStatus: null,
    geometry: null,
    practice: null,
    targetSys: null,
    distr: null,
    numTrees: null,
    source: null,
    validationStatus: "notChecked",
    establishmentTreeSpecies: [],
    reportingPeriods: [],
    primaryUuid: null
  },
  {
    uuid: "2",
    lightResource: false,
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
    plantingStatus: null,
    geometry: null,
    practice: null,
    targetSys: null,
    distr: null,
    numTrees: null,
    source: null,
    validationStatus: "notChecked",
    establishmentTreeSpecies: [],
    reportingPeriods: [],
    primaryUuid: null
  },
  {
    uuid: "3",
    lightResource: false,
    name: "A shorter project site",
    status: "submitted",
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
    plantingStatus: null,
    geometry: null,
    practice: null,
    targetSys: null,
    distr: null,
    numTrees: null,
    source: null,
    validationStatus: "notChecked",
    establishmentTreeSpecies: [],
    reportingPeriods: [],
    primaryUuid: null
  }
];

import { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

import Log from "@/utils/log";

import Component from "./MapPolygonPanel";

const meta: Meta<typeof Component> = {
  title: "Components/Elements/MapPolygonPanel",
  component: Component
};

export default meta;
type Story = StoryObj<typeof Component>;

const items = [
  {
    uuid: "1",
    title: "Puerto Princesa Subterranean River National Park Forest Corridor",
    subtitle: "Created 03/12/21",
    status: "success",
    refContainer: null,
    setClickedButton: () => {},
    onCheckboxChange: () => {},
    type: "sites",
    isCollapsed: false
  },
  {
    uuid: "2",
    title: "A medium sized project site to see how it looks with 2 lines",
    subtitle: "Created 03/12/21",
    status: "success",
    refContainer: null,
    setClickedButton: () => {},
    onCheckboxChange: () => {},
    type: "sites",
    isCollapsed: false
  },
  {
    uuid: "3",
    title: "A shorter project site",
    subtitle: "Created 03/12/21",
    status: "success",
    refContainer: null,
    setClickedButton: () => {},
    onCheckboxChange: () => {},
    type: "sites",
    isCollapsed: false
  },
  {
    uuid: "4",
    title:
      "Very long name A medium sized project site to see how it looks with 2 lines A medium sized project site to see how it looks with 2 lines A medium sized project site to see how it looks with 2 lines",
    subtitle: "Created 03/12/21",
    status: "success",
    refContainer: null,
    setClickedButton: () => {},
    onCheckboxChange: () => {},
    type: "sites",
    isCollapsed: false
  },
  {
    uuid: "5",
    title: "A shorter project site",
    subtitle: "Created 03/12/21",
    status: "success",
    refContainer: null,
    setClickedButton: () => {},
    onCheckboxChange: () => {},
    type: "sites",
    isCollapsed: false
  },
  {
    uuid: "6",
    title: "A shorter project site",
    subtitle: "Created 03/12/21",
    status: "success",
    refContainer: null,
    setClickedButton: () => {},
    onCheckboxChange: () => {},
    type: "sites",
    isCollapsed: false
  }
];

export const Default: Story = {
  render: args => {
    const [query] = useState<string>();

    return (
      <div className="bg-back-map bg-cover">
        <div className="bg-[#ffffff26] p-4">
          <Component {...args} items={items.filter(item => (query ? item.title.includes(query) : item))} />
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
          <Component {...args} items={items.filter(item => (query ? item.title.includes(query) : item))} />
        </div>
      </div>
    );
  },
  args: {
    title: "Project Sites",
    onSelectItem: Log.info
  }
};

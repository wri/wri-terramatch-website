import { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

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
        items={items.filter(item => (query ? item.title.includes(query) : item))}
        onSearch={setQuery}
      />
    );
  },
  args: {
    title: "Project Sites",
    onSelectItem: console.log
  }
};

const items = [
  {
    uuid: "1",
    title: "Puerto Princesa Subterranean River National Park Forest Corridor",
    subtitle: "Created 03/12/21",
    refContainer: null
  },
  {
    uuid: "2",
    title: "A medium sized project site to see how it looks with 2 lines",
    subtitle: "Created 03/12/21",
    refContainer: null
  },
  {
    uuid: "3",
    title: "A shorter project site",
    subtitle: "Created 03/12/21",
    refContainer: null
  },
  {
    uuid: "4",
    title:
      "Very long name A medium sized project site to see how it looks with 2 lines A medium sized project site to see how it looks with 2 lines A medium sized project site to see how it looks with 2 lines",
    subtitle: "Created 03/12/21",
    refContainer: null
  },
  {
    uuid: "5",
    title: "A shorter project site",
    subtitle: "Created 03/12/21",
    refContainer: null
  },
  {
    uuid: "6",
    title: "A shorter project site",
    subtitle: "Created 03/12/21",
    refContainer: null
  }
];

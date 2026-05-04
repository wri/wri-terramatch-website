import type { Meta, StoryObj } from "@storybook/react";

import { PlaceholderIcon } from "@/redesignComponents/foundations/Icons";

import LegendPanel from "./LegendPanel";

const meta: Meta<typeof LegendPanel> = {
  title: "Redesign Components/Containers/Panel/Legend Panel",
  component: LegendPanel,
  decorators: [
    Story => (
      <div className=" h-[30rem] w-full items-center justify-center gap-2 bg-theme-neutral-300 pt-[15rem] text-center">
        <Story />
      </div>
    )
  ]
};

export default meta;
type Story = StoryObj<typeof LegendPanel>;

export const Default: Story = {
  args: {
    title: "Legend",
    legendItems: [
      {
        indicatorType: "raster",
        color: "neutralActive.1",
        caption: "Caption",
        attribute: "Attribute",
        show: false
      },
      {
        indicatorType: "point",
        color: "positive.1/20",
        icon: <PlaceholderIcon boxSize={2} color={"positive.2"} />,
        caption: "Caption",
        attribute: "Attribute",
        show: true
      },
      {
        indicatorType: "line",
        color: "neutralActive.1",
        caption: "Caption",
        attribute: "Attribute",
        show: true
      }
    ]
  }
};

export const CustomTitle: Story = {
  args: {
    title: "Map Indicators",
    legendItems: [
      {
        indicatorType: "raster",
        color: "neutralActive.1",
        caption: "Caption",
        attribute: "Attribute",
        show: true
      }
    ]
  }
};

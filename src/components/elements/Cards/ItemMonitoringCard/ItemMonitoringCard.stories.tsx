import { Meta, StoryObj } from "@storybook/react";

import { IconNames } from "@/components/extensive/Icon/Icon";
import PageRow from "@/components/extensive/PageElements/Row/PageRow";

import Component, { ItemMonitoringCardsProps as Props } from "./ItemMonitoringCards";

const meta: Meta<typeof Component> = {
  title: "Components/Elements/Cards/ItemMonitoringCards",
  component: Component
};

export default meta;
type Story = StoryObj<typeof Component>;

export const Default: Story = {
  render: (args: Props) => (
    <PageRow className="mx-auto grid max-w-full grid-cols-17 gap-3">
      <Component {...args} />
    </PageRow>
  ),
  args: {
    title: "Tree Count",
    className: "col-span-4",
    value: "462"
  }
};

export const typeMap: Story = {
  render: (args: Props) => (
    <PageRow className="mx-auto grid max-w-full grid-cols-17 gap-3">
      <Component {...args} />
    </PageRow>
  ),
  args: {
    className: "col-span-4",
    type: "map"
  }
};

export const typeGraph: Story = {
  render: (args: Props) => (
    <PageRow className="mx-auto grid max-w-full grid-cols-17 gap-3">
      <Component {...args} />
    </PageRow>
  ),
  args: {
    title: "Tree Count",
    className: "col-span-4",
    type: "graph",
    img: IconNames.GRAPH1,
    leyends: [
      {
        color: "bg-blueCustom",
        title: "Average Number of Trees per hectare"
      },
      {
        color: "bg-primary",
        title: "Number of Trees"
      }
    ]
  }
};

export const typeGraphButton: Story = {
  render: (args: Props) => (
    <PageRow className="mx-auto grid max-w-full grid-cols-17 gap-3">
      <Component {...args} />
    </PageRow>
  ),
  args: {
    title: "EMA SNOVO",
    type: "graph-button",
    className: "col-span-9 row-span-2",
    img: IconNames.GRAPH2
  }
};

import { Meta, StoryObj } from "@storybook/react";

import PageCard from "@/components/extensive/PageElements/Card/PageCard";

import Component from "./PageColumn";

const meta: Meta<typeof Component> = {
  title: "Components/Extensive/Page/Column",
  component: Component
};

export default meta;
type Story = StoryObj<typeof Component>;

export const Default: Story = {
  args: {
    children: (
      <>
        <PageCard title="card title" />
        <PageCard title="card title" />
        <PageCard title="card title" />
      </>
    )
  }
};

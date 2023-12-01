import { Meta, StoryObj } from "@storybook/react";

import PageCard from "@/components/extensive/PageElements/Card/PageCard";
import PageColumn from "@/components/extensive/PageElements/Column/PageColumn";

import Component from "./PageBody";

const meta: Meta<typeof Component> = {
  title: "Components/Extensive/Page/Body",
  component: Component
};

export default meta;
type Story = StoryObj<typeof Component>;

export const Default: Story = {
  args: {
    children: (
      <>
        <PageColumn>
          <PageCard title="card title" />
        </PageColumn>
        <PageColumn>
          <PageCard title="card title" />
        </PageColumn>
      </>
    )
  }
};

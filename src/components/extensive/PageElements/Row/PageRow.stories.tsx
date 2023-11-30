import { Meta, StoryObj } from "@storybook/react";

import PageCard from "@/components/extensive/PageElements/Card/PageCard";
import PageColumn from "@/components/extensive/PageElements/Column/PageColumn";

import Component from "./PageRow";

const meta: Meta<typeof Component> = {
  title: "Components/Extensive/Page/Row",
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

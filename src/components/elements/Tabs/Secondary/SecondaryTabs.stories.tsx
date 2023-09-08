import { Meta, StoryObj } from "@storybook/react";

import Component from "./SecondaryTabs";

const meta: Meta<typeof Component> = {
  title: "Components/Elements/Tabs",
  component: Component
};

export default meta;
type Story = StoryObj<typeof Component>;

export const Secondary: Story = {
  decorators: [
    Story => (
      <div className="h-[40px] w-full bg-neutral-150">
        <Story />
      </div>
    )
  ],
  args: {
    defaultIndex: 1,
    tabItems: [
      {
        title: "Overview",
        body: <div>step 1 body</div>
      },
      {
        title: "Environmental Impact",
        body: <div>step 2 body</div>
      },
      {
        title: "Social Impact",
        body: <div>step 3 body</div>
      }
    ]
  }
};

import { Meta, StoryObj } from "@storybook/react";

import Component from "./Breadcrumbs";

const meta: Meta<typeof Component> = {
  title: "Components/Elements/Breadcrumbs",
  component: Component
};

export default meta;
type Story = StoryObj<typeof Component>;

export const Default: Story = {
  decorators: [
    Story => (
      <div className="flex items-start justify-start">
        <Story />
      </div>
    )
  ],
  args: {
    links: [
      {
        title: "My Projects",
        path: "#"
      },
      {
        title: "India Tree restoration project",
        path: "#"
      },
      {
        title: "Taj Mahal"
      }
    ]
  }
};

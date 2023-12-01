import { Meta, StoryObj } from "@storybook/react";

import RouteHistoryProvider from "@/context/routeHistory.provider";

import Component from "./PageBreadcrumbs";

const meta: Meta<typeof Component> = {
  title: "Components/Extensive/Page/Breadcrumbs",
  component: Component
};

export default meta;
type Story = StoryObj<typeof Component>;

export const Default: Story = {
  decorators: [
    Story => (
      <div className="h-[500px]">
        <RouteHistoryProvider>
          <Story />
        </RouteHistoryProvider>
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
        title: "Taj Mahal",
        path: "#"
      }
    ]
  }
};

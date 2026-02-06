import type { Meta, StoryObj } from "@storybook/react";
import { BrowserRouter, Link } from "react-router-dom";

import { ChevronRight } from "@/redesignComponents/foundations/Icons";
import { TabBarWriProps } from "@/redesignComponents/navigation/TabBar/TabBar";

import ProjectBanner, { ProjectBannerProps } from "./ProjectBanner";

const meta: Meta<typeof ProjectBanner> = {
  title: "Redesign Components/Content/Banner/Project Banner",
  component: ProjectBanner,
  parameters: {
    layout: "fullscreen"
  },
  decorators: [
    Story => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    )
  ]
};

export default meta;

type Story = StoryObj<typeof ProjectBanner>;

const mockTabBar: TabBarWriProps = {
  tabs: [
    { value: "overview", label: "Overview" },
    { value: "reports", label: "Reports" },
    { value: "team", label: "Team" }
  ],
  defaultValue: "overview",
  onTabClick: (tabValue: string) => console.log("Tab clicked:", tabValue)
};

const baseArgs: ProjectBannerProps = {
  breadcrumbs: {
    links: [
      { label: "Home", link: "/", icon: <ChevronRight /> },
      { label: "Projects", link: "/projects" },
      { label: "Sample project", link: "/projects/1" }
    ],
    linkRouter: Link,
    size: "default"
  },
  slots: [
    {
      title: "Status",
      description: "In progress"
    },
    {
      title: "Funding",
      description: "$1.5M"
    }
  ],
  title: "Restoration project in the Congo Basin",
  tag: {
    state: "in-progress"
  },
  organization: "WRI Example Organization",
  startDate: "Jan 2024",
  endDate: "Dec 2026",
  country: "Democratic Republic of the Congo",
  countryFlag: "🇨🇩",
  team: [
    {
      name: "Jane Doe",
      avatar: {
        name: "Jane Doe"
      }
    },
    {
      name: "John Smith",
      avatar: {
        name: "John Smith"
      }
    }
  ],
  toolbar: {
    tabBar: mockTabBar
  }
};

export const Default: Story = {
  args: baseArgs
};

import type { Meta, StoryObj } from "@storybook/react";

import {
  DashboardIcon,
  MessagesIcon,
  NotificationIcon,
  NurseryIcon,
  OrganizationIcon,
  ProgrammeIcon,
  ProjectIcon,
  ReportsIcon,
  SiteIcon,
  UserIcon
} from "@/redesignComponents/foundations/Icons";

import SideNavigation from "./SideNavigation";

const meta = {
  title: "Redesign Components/Navigation/SideNavigation",
  component: SideNavigation,
  tags: ["autodocs"],
  parameters: {
    layout: "padded"
  }
} satisfies Meta<typeof SideNavigation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Management Panel",
    notifications: [
      {
        icon: <NotificationIcon boxSize={4} />,
        label: "Notifications",
        value: 20
      },
      {
        icon: <MessagesIcon boxSize={4} />,
        label: "Messages",
        value: 20
      }
    ],
    links: [
      { icon: <DashboardIcon boxSize={4} />, label: "Dashboard", href: "/dashboard" },
      { icon: <OrganizationIcon boxSize={4} />, label: "Organizations", href: "/organizations" },
      { icon: <ProgrammeIcon boxSize={4} />, label: "Programmes", href: "/programmes" },
      { icon: <ProjectIcon boxSize={4} />, label: "Projects", href: "/projects" },
      { icon: <SiteIcon boxSize={4} />, label: "Sites", href: "/sites" },
      { icon: <NurseryIcon boxSize={4} />, label: "Nurseries", href: "/nurseries" },
      { icon: <ReportsIcon boxSize={4} />, label: "Reports", href: "/reports" },
      { icon: <UserIcon boxSize={4} />, label: "Users", href: "/users" }
    ]
  }
};

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

const storybookDocsPath = "/?path=/docs/redesign-components-navigation-sidenavigation-sidenavigation--docs";

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
    groups: [
      {
        links: [
          {
            icon: <NotificationIcon boxSize={4} />,
            label: "Notifications",
            href: storybookDocsPath,
            notificationValue: 20
          },
          {
            icon: <MessagesIcon boxSize={4} />,
            label: "Messages",
            href: storybookDocsPath,
            notificationValue: 20
          }
        ]
      },
      {
        links: [
          { icon: <DashboardIcon boxSize={4} />, label: "Dashboard", href: storybookDocsPath },
          { icon: <OrganizationIcon boxSize={4} />, label: "Organizations", href: storybookDocsPath },
          { icon: <ProgrammeIcon boxSize={4} />, label: "Programmes", href: storybookDocsPath },
          { icon: <ProjectIcon boxSize={4} />, label: "Projects", href: storybookDocsPath },
          { icon: <SiteIcon boxSize={4} />, label: "Sites", href: storybookDocsPath },
          { icon: <NurseryIcon boxSize={4} />, label: "Nurseries", href: storybookDocsPath },
          { icon: <ReportsIcon boxSize={4} />, label: "Reports", href: storybookDocsPath },
          { icon: <UserIcon boxSize={4} />, label: "Users", href: storybookDocsPath }
        ]
      }
    ]
  }
};

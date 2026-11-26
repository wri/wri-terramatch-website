import { action } from "@storybook/addon-actions";
import type { Meta, StoryObj } from "@storybook/react";

import { OrganizationIcon } from "@/redesignComponents/foundations/Icons";

import OrganisationBanner from "./OrganisationBanner";

const meta: Meta<typeof OrganisationBanner> = {
  title: "Redesign Components/Content/Banner/Organisation Banner",
  component: OrganisationBanner,
  parameters: {
    layout: "fullscreen"
  }
};

export default meta;

type Story = StoryObj<typeof OrganisationBanner>;

const baseArgs = {
  breadcrumbs: [{ label: "Organization", link: "/", icon: <OrganizationIcon className="!text-theme-primary-900" /> }],
  suffix: null,
  toolbar: {
    tabBar: {
      tabs: [
        { value: "overview", label: "Overview" },
        { value: "details", label: "Organization Details" },
        { value: "team", label: "Team Members" }
      ],
      defaultValue: "overview",
      onTabClick: action("Tab clicked")
    }
  }
};

const headerActions = {
  onEditClick: action("Edit clicked"),
  onDownloadClick: action("Download clicked"),
  onAddTeamClick: action("Add team clicked"),
  gotoTeamMembers: action("Go to team members")
};

export const Default: Story = {
  args: {
    ...baseArgs,
    header: {
      ...headerActions,
      name: "Bôndy",
      logoSrc: "https://i.pravatar.cc/300?img=12",
      organisationType: "Non-profit",
      country: "Madagascar",
      countryCode: "MDG",
      foundedYear: "2001",
      websiteUrl: "https://www.wri.org",
      team: [
        { name: "Ana Rakoto", avatar: { name: "Ana Rakoto", src: "https://i.pravatar.cc/150?img=5" } },
        { name: "Mia Soa", avatar: { name: "Mia Soa", src: "https://i.pravatar.cc/150?img=9" } },
        { name: "Nina Smith", avatar: { name: "Nina Smith" } },
        { name: "John Doe", avatar: { name: "John Doe" } },
        { name: "Lea Rabe", avatar: { name: "Lea Rabe", src: "https://i.pravatar.cc/150?img=20" } }
      ]
    }
  }
};

export const Incomplete: Story = {
  args: {
    ...baseArgs,
    header: {
      ...headerActions,
      name: "Organisation Name",
      team: [],
      isDownloadDisabled: true
    }
  }
};

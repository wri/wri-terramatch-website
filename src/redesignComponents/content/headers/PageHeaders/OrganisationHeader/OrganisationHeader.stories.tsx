import { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";

import OrganisationHeader, { OrganisationHeaderProps } from "./OrganisationHeader";

const meta: Meta<typeof OrganisationHeader> = {
  title: "Redesign Components/Content/Headers/Organisation Header",
  component: OrganisationHeader,
  tags: ["autodocs"],
  argTypes: {
    name: { control: "text", description: "Organisation name" },
    logoSrc: { control: "text", description: "Organisation logo URL; shows the add-logo placeholder when empty" },
    organisationType: { control: "text", description: "Organisation type label" },
    country: { control: "text", description: "Country name" },
    countryCode: { control: "text", description: "ISO country code used to render the flag" },
    foundedYear: { control: "text", description: "Year the organisation was founded" },
    websiteUrl: { control: "text", description: "Organisation website; the link is disabled when empty" },
    isDownloadDisabled: { control: "boolean", description: "Disables the Download button" }
  },
  args: {
    onLogoClick: fn(),
    onEditClick: fn(),
    onDownloadClick: fn(),
    onAddTeamClick: fn(),
    gotoTeamMembers: fn()
  }
};

export default meta;

type Story = StoryObj<OrganisationHeaderProps>;

const defaultArgs: Partial<OrganisationHeaderProps> = {
  name: "Organisation Name",
  logoSrc: "https://i.pravatar.cc/300?img=12",
  organisationType: "For-profit",
  country: "Madagascar",
  countryCode: "MDG",
  foundedYear: "2012",
  websiteUrl: "https://www.wri.org",
  team: [
    { name: "Ana Rakoto", avatar: { name: "Ana Rakoto", src: "https://i.pravatar.cc/150?img=5" } },
    { name: "Mia Soa", avatar: { name: "Mia Soa", src: "https://i.pravatar.cc/150?img=9" } },
    { name: "Nina Smith", avatar: { name: "Nina Smith" } },
    { name: "John Doe", avatar: { name: "John Doe" } },
    { name: "Lea Rabe", avatar: { name: "Lea Rabe", src: "https://i.pravatar.cc/150?img=20" } }
  ]
};

const incompleteArgs: Partial<OrganisationHeaderProps> = {
  name: "Organisation Name",
  team: [],
  isDownloadDisabled: true
};

export const Default: Story = {
  args: defaultArgs
};

export const Incomplete: Story = {
  args: incompleteArgs
};

export const AllStates: Story = {
  render: args => (
    <div className="flex flex-col gap-8">
      <OrganisationHeader {...args} {...defaultArgs} />
      <OrganisationHeader {...args} {...incompleteArgs} />
    </div>
  )
};

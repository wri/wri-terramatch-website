import { Flex } from "@chakra-ui/react";
import { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";

import OrganisationLogo, { OrganisationLogoProps } from "./OrganisationLogo";

const meta: Meta<typeof OrganisationLogo> = {
  title: "Redesign Components/Content/Images/Organisation Logo",
  component: OrganisationLogo,
  tags: ["autodocs"],
  argTypes: {
    src: { control: "text", description: "Logo URL; shows the add-logo placeholder when empty" },
    alt: { control: "text", description: "Alternative text for the logo" }
  },
  args: {
    alt: "Organisation Name",
    onEditClick: fn()
  }
};

export default meta;

type Story = StoryObj<OrganisationLogoProps>;

const LOGO_SRC = "images/logos/harit-bharat-fund.png";

export const Default: Story = {
  args: { src: LOGO_SRC }
};

export const NotAvailable: Story = {};

export const AllStates: Story = {
  render: args => (
    <Flex gap={6} alignItems="center">
      <OrganisationLogo {...args} src={LOGO_SRC} />
      <OrganisationLogo {...args} src={undefined} />
    </Flex>
  )
};

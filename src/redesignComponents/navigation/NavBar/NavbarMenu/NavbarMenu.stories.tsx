import type { Meta, StoryObj } from "@storybook/react";

import { PlaceholderIcon } from "@/redesignComponents/foundations/Icons";

import Avatar from "../../Avatar/Avatar";
import NavbarMenu from "./NavbarMenu";

const meta = {
  title: "Redesign Components/Navigation/NavbarMenu",
  component: NavbarMenu,
  tags: ["autodocs"],
  render: args => (
    <div className="bg-theme-neutral-300 p-4">
      <NavbarMenu {...args} />
    </div>
  )
} satisfies Meta<typeof NavbarMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Label",
    prefix: <PlaceholderIcon boxSize={4} />,
    suffix: <PlaceholderIcon boxSize={4} />,
    variant: "mega",
    items: [
      { caption: "Caption", label: "Label", icon: <PlaceholderIcon /> },
      { caption: "Caption", label: "Label", icon: <PlaceholderIcon /> },
      { caption: "Caption", label: "Label", icon: <PlaceholderIcon /> },
      { caption: "Caption", label: "Label", icon: <PlaceholderIcon /> },
      { caption: "Caption", label: "Label", icon: <PlaceholderIcon /> }
    ]
  }
};

export const Account: Story = {
  args: {
    label: "Label",
    prefix: <Avatar name="John Doe" size="small" />,
    suffix: <PlaceholderIcon boxSize={4} />,
    variant: "simple",
    items: [{ label: "Profile" }, { label: "Sign out" }]
  }
};

import { action } from "@storybook/addon-actions";
import type { Meta, StoryObj } from "@storybook/react";

import { PlaceholderIcon } from "@/redesignComponents/foundations/Icons";

import Avatar from "../Avatar/Avatar";
import Navbar from "./Navbar";

const meta = {
  title: "Redesign Components/Navigation/Navbar",
  component: Navbar,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen"
  },
  render: args => (
    <div className="py-20">
      <Navbar {...args} />
    </div>
  )
} satisfies Meta<typeof Navbar>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultNavLinks = [
  { label: "Home", onClick: action("nav:home") },
  { label: "Projects", onClick: action("nav:projects") },
  { label: "Organizations", onClick: action("nav:organizations") },
  { label: "Reports", onClick: action("nav:reports") },
  { label: "About", onClick: action("nav:about") }
];

export const Default: Story = {
  args: {
    navLinks: defaultNavLinks,
    languageItems: [{ label: "English" }, { label: "French" }, { label: "Portuguese" }, { label: "Spanish" }],
    onLanguageSelect: action("language:select"),
    accountItems: [{ label: "Profile" }, { label: "Settings" }, { label: "Sign out" }],
    accountLabel: "John Doe",
    accountPrefix: <Avatar name="John Doe" size="small" />,
    accountSuffix: <PlaceholderIcon boxSize={4} />,
    onAccountSelect: action("account:select")
  }
};

export const WithoutAccount: Story = {
  args: {
    navLinks: defaultNavLinks,
    languageItems: [{ label: "English" }, { label: "French" }, { label: "Portuguese" }],
    onLanguageSelect: action("language:select"),
    accountItems: []
  }
};

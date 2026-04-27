import { Box } from "@chakra-ui/react";
import type { Meta, StoryObj } from "@storybook/react";
import { BrowserRouter } from "react-router-dom";

import { PlaceholderIcon } from "@/redesignComponents/foundations/Icons";

import SideNavigationItem from "./SideNavigationItem";

const noop = () => {};
const baseMenuItems = [
  { label: "Action", value: "action", onClick: noop },
  { label: "Action 2", value: "action2", onClick: noop },
  { label: "Action 3", value: "action3", onClick: noop }
];
const currentStorybookPath =
  typeof window !== "undefined" ? `${window.location.pathname}${window.location.search}${window.location.hash}` : "/";
const getStorybookPathWithNavItem = (navItem: string) => {
  if (typeof window === "undefined") {
    return currentStorybookPath;
  }

  const nextUrl = new URL(currentStorybookPath, window.location.origin);
  nextUrl.searchParams.set("navItem", navItem);

  return `${nextUrl.pathname}${nextUrl.search}${nextUrl.hash}`;
};

const meta = {
  title: "Redesign Components/Navigation/SideNavigation/SideNavigationItem",
  component: SideNavigationItem,
  tags: ["autodocs"],
  parameters: {
    layout: "padded"
  },
  render: args => (
    <BrowserRouter>
      <Box width="20rem" backgroundColor="primary.800" padding="1.25rem" borderRadius="0.5rem">
        <SideNavigationItem {...args} />
      </Box>
    </BrowserRouter>
  )
} satisfies Meta<typeof SideNavigationItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AsLinkActive: Story = {
  args: {
    icon: <PlaceholderIcon boxSize={4} />,
    label: "Label",
    notificationValue: 2,
    onAddClick: () => alert("add click"),
    MenuItems: baseMenuItems,
    href: currentStorybookPath
  }
};

export const AsLinkInactive: Story = {
  args: {
    icon: <PlaceholderIcon boxSize={4} />,
    label: "Label",
    notificationValue: 2,
    onAddClick: () => alert("add click"),
    MenuItems: baseMenuItems,
    href: getStorybookPathWithNavItem("1")
  }
};

export const AsAccordion: Story = {
  args: {
    icon: <PlaceholderIcon boxSize={4} />,
    label: "Label",
    notificationValue: 5,
    onAddClick: () => alert("add click"),
    MenuItems: baseMenuItems,
    href: "",
    items: [
      {
        icon: <PlaceholderIcon boxSize={4} />,
        label: "Label 1",
        onAddClick: () => alert("add click"),
        href: getStorybookPathWithNavItem("1"),
        MenuItems: baseMenuItems
      },
      {
        icon: <PlaceholderIcon boxSize={4} />,
        label: "Label 2",
        onAddClick: () => alert("add click"),
        href: getStorybookPathWithNavItem("2"),
        MenuItems: baseMenuItems
      },
      {
        icon: <PlaceholderIcon boxSize={4} />,
        label: "Label 3",
        onAddClick: () => alert("add click"),
        href: getStorybookPathWithNavItem("3"),
        MenuItems: baseMenuItems
      }
    ],
    isCollapsed: false
  }
};

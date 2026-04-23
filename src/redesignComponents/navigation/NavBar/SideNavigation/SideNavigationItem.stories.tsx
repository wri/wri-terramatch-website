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
const storybookDocsPath = "/?path=/docs/redesign-components-navigation-sidenavigation-sidenavigationitem--docs";

const meta = {
  title: "Redesign Components/Navigation/SideNavigation/SideNavigationItem",
  component: SideNavigationItem,
  tags: ["autodocs"],
  parameters: {
    layout: "padded"
  },
  render: args => (
    <BrowserRouter>
      <Box backgroundColor="primary.800" padding="1.25rem" borderRadius="0.5rem">
        <SideNavigationItem {...args} />
      </Box>
    </BrowserRouter>
  )
} satisfies Meta<typeof SideNavigationItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AsLink: Story = {
  args: {
    icon: <PlaceholderIcon boxSize={4} />,
    label: "Label",
    notificationValue: 2,
    onAddClick: noop,
    MenuItems: baseMenuItems,
    href: storybookDocsPath,
    items: [],
    isCollapsed: false
  }
};

export const AsAccordion: Story = {
  args: {
    icon: <PlaceholderIcon boxSize={4} />,
    label: "Label",
    notificationValue: 5,
    onAddClick: noop,
    MenuItems: baseMenuItems,
    href: "",
    items: [
      {
        icon: <PlaceholderIcon boxSize={4} />,
        label: "Label",
        onAddClick: noop,
        href: storybookDocsPath,
        MenuItems: baseMenuItems
      },
      {
        icon: <PlaceholderIcon boxSize={4} />,
        label: "Label",
        onAddClick: noop,
        href: storybookDocsPath,
        MenuItems: baseMenuItems
      },
      {
        icon: <PlaceholderIcon boxSize={4} />,
        label: "Label",
        onAddClick: noop,
        href: storybookDocsPath,
        MenuItems: baseMenuItems
      }
    ],
    isCollapsed: false
  }
};

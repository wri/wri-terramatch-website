import type { Meta, StoryObj } from "@storybook/react";
import { BrowserRouter, Link } from "react-router-dom";

import { PlaceholderIcon } from "@/redesignComponents/foundations/Icons";

import Breadcrumb from "./Breadcrumb";

const meta = {
  title: "Redesign Components/Navigation/Breadcrumb",
  component: Breadcrumb,
  parameters: {
    layout: "centered"
  },
  tags: ["autodocs"],
  decorators: [
    Story => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    )
  ]
} satisfies Meta<typeof Breadcrumb>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    links: [
      { label: "One", link: "#" },
      { label: "Two", link: "#" },
      { label: "Three", link: "#" }
    ],
    linkRouter: Link
  }
};

export const CustomSeparator: Story = {
  args: {
    links: [
      { label: "One", link: "#" },
      { label: "Two", link: "#" },
      { label: "Three", link: "#" }
    ],
    separator: "|",
    linkRouter: Link
  }
};

export const MaxItems: Story = {
  args: {
    links: [
      { label: "One", link: "#" },
      { label: "Two", link: "#" },
      { label: "Three", link: "#" },
      { label: "Four", link: "#" }
    ],
    maxItems: 3,
    linkRouter: Link
  }
};

export const WithIcons: Story = {
  args: {
    links: [
      { label: "Settings", link: "#", icon: <PlaceholderIcon /> },
      { label: "One", link: "#", icon: <PlaceholderIcon /> },
      { label: "Two", link: "#", icon: <PlaceholderIcon /> },
      { label: "Three", link: "#", icon: <PlaceholderIcon /> }
    ],
    linkRouter: Link
  }
};

export const SmallSize: Story = {
  args: {
    links: [
      { label: "Settings", link: "#", icon: <PlaceholderIcon /> },
      { label: "One", link: "#", icon: <PlaceholderIcon /> },
      { label: "Two", link: "#", icon: <PlaceholderIcon /> },
      { label: "Three", link: "#", icon: <PlaceholderIcon /> }
    ],
    linkRouter: Link,
    size: "small"
  }
};

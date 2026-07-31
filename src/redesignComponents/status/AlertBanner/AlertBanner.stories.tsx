import { SimpleGrid } from "@chakra-ui/react";
import type { Meta, StoryObj } from "@storybook/react";
import { Tag } from "@worldresources/wri-design-systems";

import AlertBanner from "./AlertBanner";

const meta = {
  title: "Redesign Components/Status/Alert Banner",
  component: AlertBanner,
  parameters: {
    layout: "centered",

    docs: {
      description: {
        component: "Full-width or inline informational banner with optional centered content."
      }
    }
  },
  decorators: [
    Story => (
      <div style={{ width: "25rem" }}>
        <Story />
      </div>
    )
  ],
  tags: ["autodocs"],
  argTypes: {
    title: { description: "Banner title content", control: false },
    variant: {
      description: "Semantic variant — sets color and icon",
      control: { type: "select" },
      options: ["general-white", "general-grey", "information", "success", "warning", "error"]
    },
    icon: {
      description: "Custom icon element (overrides variant default)",
      control: false
    },
    isCentered: {
      description: "Centers the banner content",
      control: "boolean"
    },
    width: {
      description: "Controls whether the banner fills its container or fits its content",
      control: { type: "select" },
      options: ["full-width", "inline"]
    },
    onClose: {
      description: "Handler for dismiss button — shows button when set",
      control: false
    }
  }
} satisfies Meta<typeof AlertBanner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Information",
    variant: "information"
  }
};

export const WithLabel: Story = {
  args: {
    title: "Success",
    variant: "success",
    children: "Text label"
  }
};

export const WithChildren: Story = {
  args: {
    title: "General white",
    variant: "general-grey",
    children: <Tag label="Label" variant="info-white" />
  }
};

export const Inline: Story = {
  args: {
    title: "Information",
    variant: "information",
    width: "inline",
    children: <Tag label="Label" variant="info-white" />
  }
};

export const Centered: Story = {
  args: {
    title: "Success",
    variant: "success",
    isCentered: true,
    children: <Tag label="Label" variant="info-white" />
  }
};

export const AllVariants: Story = {
  render: () => (
    <SimpleGrid columns={1} gap={4}>
      <AlertBanner variant="general-white" title="Label" width="full-width" />
      <AlertBanner variant="general-grey" title="Label" width="full-width" />
      <AlertBanner variant="information" title="Label" width="full-width" />
      <AlertBanner variant="success" title="Label" width="full-width" />
      <AlertBanner variant="warning" title="Label" width="full-width" />
      <AlertBanner variant="error" title="Label" width="full-width" />
    </SimpleGrid>
  )
};

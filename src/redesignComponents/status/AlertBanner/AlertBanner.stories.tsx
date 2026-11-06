import { Flex, SimpleGrid, Text } from "@chakra-ui/react";
import type { Meta, StoryObj } from "@storybook/react";
import { Tag } from "@worldresources/wri-design-systems";

import AlertBanner from "./AlertBanner";

const TitleWithTag = ({ title }: { title: string }) => (
  <Flex alignItems="center" gap={2}>
    <Text textStyle="400-bold">{title}</Text>
    <Tag label="Label" variant="info-white" />
  </Flex>
);

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
    children: { description: "Banner content", control: false },
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
    variant: "information",
    children: "Information"
  }
};

export const WithLabel: Story = {
  args: {
    variant: "success",
    children: "Success"
  }
};

export const WithChildren: Story = {
  args: {
    variant: "general-grey",
    children: <TitleWithTag title="General white" />
  }
};

export const Inline: Story = {
  args: {
    variant: "information",
    width: "inline",
    children: <TitleWithTag title="Information" />
  }
};

export const Centered: Story = {
  args: {
    variant: "success",
    isCentered: true,
    children: <TitleWithTag title="Success" />
  }
};

export const AllVariants: Story = {
  args: { children: "Label" },
  render: () => (
    <SimpleGrid columns={1} gap={4}>
      <AlertBanner variant="general-white" width="full-width">
        Label
      </AlertBanner>
      <AlertBanner variant="general-grey" width="full-width">
        Label
      </AlertBanner>
      <AlertBanner variant="information" width="full-width">
        Label
      </AlertBanner>
      <AlertBanner variant="success" width="full-width">
        Label
      </AlertBanner>
      <AlertBanner variant="warning" width="full-width">
        Label
      </AlertBanner>
      <AlertBanner variant="error" width="full-width">
        Label
      </AlertBanner>
    </SimpleGrid>
  )
};

import { Box } from "@chakra-ui/react";
import type { Meta, StoryObj } from "@storybook/react";

import FloatingActionToolbar from "./FloatingActionToolbar";

const defaultItems = [
  { label: "Delete", onClick: () => {}, labelColor: "error.500" },
  { label: "Label", onClick: () => {} },
  { label: "Label", onClick: () => {} }
];

const itemsWithInfoTooltip = [
  { label: "Delete", onClick: () => {}, labelColor: "error.500" },
  { label: "Label", onClick: () => {} },
  { label: "Label", disabled: true, onClick: () => {}, infoTooltip: "This is a tooltip" }
];

const meta = {
  title: "Redesign Components/Navigation/Toolbar/Floating Action Toolbar",
  component: FloatingActionToolbar,
  tags: ["autodocs"],
  parameters: {
    layout: "centered"
  },
  decorators: [
    Story => (
      <Box backgroundColor="neutral.300" padding="1.25rem" borderRadius="0.5rem">
        <Story />
      </Box>
    )
  ],
  argTypes: {
    items: {
      description: "Toolbar actions with label, onClick, and optional labelColor"
    },
    className: {
      control: "text",
      description: "Additional Tailwind classes for the toolbar container"
    }
  }
} satisfies Meta<typeof FloatingActionToolbar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    items: defaultItems,
    className: "bg-theme-neutral-200"
  }
};

export const WithInfoTooltip: Story = {
  args: {
    items: itemsWithInfoTooltip,
    className: "bg-theme-neutral-200"
  }
};

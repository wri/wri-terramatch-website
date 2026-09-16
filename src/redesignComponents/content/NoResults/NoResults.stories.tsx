import type { Meta, StoryObj } from "@storybook/react";

import NoResults from "./NoResults";

const meta = {
  title: "Redesign Components/Content/No Results",
  component: NoResults,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    backgrounds: {
      default: "neutral-200",
      values: [{ name: "neutral-200", value: "#f6f6f6" }]
    }
  },
  args: {
    title: "No results found",
    description: "We couldn’t find any reports matching your search. Try a different keyword."
  }
} satisfies Meta<typeof NoResults>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

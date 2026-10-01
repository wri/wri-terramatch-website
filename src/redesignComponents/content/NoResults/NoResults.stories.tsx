import type { Meta, StoryObj } from "@storybook/react";

import NoResults from "./NoResults";

const meta = {
  title: "Redesign Components/Content/No Results",
  component: NoResults,
  tags: ["autodocs"]
} satisfies Meta<typeof NoResults>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "No results found",
    description: "We couldn’t find any reports matching your search. Try a different keyword.",
    className: "bg-theme-neutral-200 p-4"
  }
};

export const whiteBackground: Story = {
  args: {
    title: "No results found",
    description: "We couldn’t find any reports matching your search. Try a different keyword.",
    className: "bg-theme-neutral-100 p-4"
  }
};

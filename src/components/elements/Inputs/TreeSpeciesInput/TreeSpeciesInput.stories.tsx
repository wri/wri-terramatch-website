import { Meta, StoryObj } from "@storybook/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Log from "@/utils/log";

import Components from "./TreeSpeciesInput";

const meta: Meta<typeof Components> = {
  title: "Components/Elements/Inputs/TreeSpeciesInput",
  component: Components
};

export default meta;
type Story = StoryObj<typeof Components>;

const client = new QueryClient();

export const Default: Story = {
  decorators: [
    Story => (
      <QueryClientProvider client={client}>
        <Story />
      </QueryClientProvider>
    )
  ],
  args: {
    label: "Tree Species Grown",
    description:
      "List the tree species that you expect to restore on this project, across all sites. Please enter the scientific name for each tree species.",
    required: true,
    value: [
      {
        name: "Test",
        amount: 23
      }
    ],
    onChange: value => Log.info("onChange", value),
    clearErrors: () => Log.info("clearErrors")
  }
};

export const WithNumber: Story = { ...Default, args: { ...Default.args, withNumbers: true } };

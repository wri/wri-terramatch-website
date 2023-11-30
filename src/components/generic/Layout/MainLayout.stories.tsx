import { Meta, StoryObj } from "@storybook/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Component from "./MainLayout";

const meta: Meta<typeof Component> = {
  title: "Components/Generic/Layouts/MainLayout",
  component: Component
};

export default meta;
type Story = StoryObj<typeof Component>;

const client = new QueryClient();

export const Default: Story = {
  decorators: [
    Story => (
      <div className="border border-neutral-400">
        <QueryClientProvider client={client}>
          <Story />
        </QueryClientProvider>
      </div>
    )
  ],
  args: {
    children: <div className="h-[400px] " />
  }
};

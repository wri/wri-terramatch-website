import { Meta, StoryObj } from "@storybook/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Component from "./Navbar";

const meta: Meta<typeof Component> = {
  title: "Components/Generic/Navbar",
  component: Component
};

export default meta;
type Story = StoryObj<typeof Component>;
const client = new QueryClient();

export const LoggedIn: Story = {
  decorators: [
    Story => (
      <QueryClientProvider client={client}>
        <Story />
      </QueryClientProvider>
    )
  ],
  args: {
    isLoggedIn: true
  }
};

export const LoggedOut: Story = {
  ...LoggedIn,
  args: {
    isLoggedIn: false
  }
};

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
  parameters: {
    storeProviderProps: { authToken: "fakeauthtoken" }
  },
  decorators: [
    Story => (
      <QueryClientProvider client={client}>
        <Story />
      </QueryClientProvider>
    )
  ]
};

export const LoggedOut: Story = {
  decorators: [
    Story => (
      <QueryClientProvider client={client}>
        <Story />
      </QueryClientProvider>
    )
  ]
};

import { Meta, StoryObj } from "@storybook/react";

import { buildStore } from "@/utils/testStore";

import Component from "./Navbar";

const meta: Meta<typeof Component> = {
  title: "Components/Generic/Navbar",
  component: Component
};

export default meta;
type Story = StoryObj<typeof Component>;

export const LoggedIn: Story = {
  parameters: {
    storeBuilder: buildStore().addLogin("fakeauthtoken")
  },
  decorators: [Story => <Story />]
};

export const LoggedOut: Story = {
  decorators: [Story => <Story />]
};

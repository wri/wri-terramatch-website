import { Meta, StoryObj } from "@storybook/react";

import { IconNames } from "./Icon";
import Component from "./IconSocial";

const meta: Meta<typeof Component> = {
  title: "Components/Extensive/IconSocial",
  component: Component
};

export default meta;
type Story = StoryObj<typeof Component>;

export const Facebook: Story = {
  args: {
    name: IconNames.SOCIAL_FACEBOOK,
    url: "https://example.com"
  }
};

export const Instagram: Story = {
  args: {
    ...Facebook.args,
    name: IconNames.SOCIAL_INSTAGRAM
  }
};

export const Linkedin: Story = {
  args: {
    ...Facebook.args,
    name: IconNames.SOCIAL_LINKEDIN
  }
};

export const Twitter: Story = {
  args: {
    ...Facebook.args,
    name: IconNames.SOCIAL_TWITTER
  }
};

export const Website: Story = {
  args: {
    ...Facebook.args,
    name: IconNames.EARTH
  }
};

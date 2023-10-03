import { Meta, StoryObj } from "@storybook/react";

import { IconNames } from "../Icon/Icon";
import Component from "./BannerCard";

const meta: Meta<typeof Component> = {
  title: "Components/Extensive/Banner/BannerCard",
  component: Component
};

export default meta;
type Story = StoryObj<typeof Component>;

export const Default: Story = {
  args: {
    title: "Reforestation in Uganda",
    subtitle: "Organization Type: Government",
    buttonProps: {
      children: "View Profile"
    },
    iconProps: {
      name: IconNames.TREE,
      width: 35
    }
  }
};

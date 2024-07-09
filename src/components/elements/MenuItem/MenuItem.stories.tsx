import { Meta, StoryObj } from "@storybook/react";

import { MenuItem } from "./MenuItem";
import { MENU_ITEM_VARIANT_BLUE } from "./MenuItemVariant";

const meta: Meta<typeof MenuItem> = {
  title: "Components/Elements/MenuItem",
  component: MenuItem
};

export default meta;
type Story = StoryObj<typeof MenuItem>;

export const Primary: Story = {
  args: {
    MenuItemVariant: MENU_ITEM_VARIANT_BLUE,
    onClick: () => {},
    render: "<div>Test1</div>"
  }
};

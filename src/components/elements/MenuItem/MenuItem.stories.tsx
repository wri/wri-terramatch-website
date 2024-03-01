import { Meta, StoryObj } from "@storybook/react";

import { MenuItem } from "./MenuItem";
import { MENU_ITEM_VARIANT_BLUE, MENU_ITEM_VARIANT_BLUE_DARK, MENU_ITEM_VARIANT_DARK } from "./MenuItemVariant";

const meta: Meta<typeof MenuItem> = {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: "Components/Elements/MenuItem",
  component: MenuItem
};

export default meta;
type Story = StoryObj<typeof MenuItem>;

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/react/api/csf
 * to learn how to use render functions.
 */

export const Primary: Story = {
  args: {
    MenuItemVariant: MENU_ITEM_VARIANT_BLUE,
    onClick: () => {},
    render: () => <div>Test1</div>
  }
};
export const Secondary: Story = {
  args: {
    MenuItemVariant: MENU_ITEM_VARIANT_BLUE_DARK,
    onClick: () => {},
    render: () => <div>Test2</div>
  }
};
export const Tertiary: Story = {
  args: {
    MenuItemVariant: MENU_ITEM_VARIANT_DARK,
    onClick: () => {},
    render: () => <div>Test3</div>
  }
};

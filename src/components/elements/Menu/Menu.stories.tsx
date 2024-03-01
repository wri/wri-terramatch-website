import { Meta, StoryObj } from "@storybook/react";

import { MENU_ITEM_VARIANT_BLUE, MENU_ITEM_VARIANT_BLUE_DARK } from "../MenuItem/MenuItemVariant";
import Menu from "./Menu";

const meta: Meta<typeof Menu> = {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: "Components/Elements/Menu",
  component: Menu
};

export default meta;
type Story = StoryObj<typeof Menu>;

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/react/api/csf
 * to learn how to use render functions.
 */
const itemsPrimaryMenu = [
  { id: "1", MenuItemVariant: MENU_ITEM_VARIANT_BLUE, render: () => <div>Test1</div>, onClick: () => {} },
  { id: "2", MenuItemVariant: MENU_ITEM_VARIANT_BLUE, render: () => <div>Test2</div>, onClick: () => {} },
  { id: "2", render: () => <div>Test3</div>, onClick: () => {} }
];

export const Primary: Story = {
  args: {
    menu: itemsPrimaryMenu,
    isOpen: true,
    menuItemVariant: MENU_ITEM_VARIANT_BLUE_DARK
  },
  decorators: [
    StoryComponent => (
      <div className="h-44">
        <div className="relative z-10">
          <StoryComponent />
        </div>
      </div>
    )
  ]
};

export const Secondary: Story = {
  args: {
    menu: itemsPrimaryMenu,
    isOpen: true,
    menuItemVariant: MENU_ITEM_VARIANT_BLUE_DARK
  },
  decorators: [
    StoryComponent => (
      <div className="h-44">
        <div className="relative z-10">
          <StoryComponent />
        </div>
      </div>
    )
  ]
};

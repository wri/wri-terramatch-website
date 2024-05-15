import { Meta, StoryObj } from "@storybook/react";

import Button from "../Button/Button";
import Menu from "./Menu";
import {
  MENU_PLACEMENT_BOTTOM_LEFT,
  MENU_PLACEMENT_BOTTOM_RIGHT,
  MENU_PLACEMENT_LEFT_BOTTOM,
  MENU_PLACEMENT_RIGHT_TOP,
  MENU_VARIANT_BORDER_B_ORANGE
} from "./MenuVariant";
const meta: Meta<typeof Menu> = {
  /* :point_down: The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: "Components/Elements/Menu",
  component: Menu
};
export default meta;
type Story = StoryObj<typeof Menu>;
/*
 *:point_down: Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/react/api/csf
 * to learn how to use render functions.
 */
const itemsMenu = [
  { id: "1", render: () => <div>Test1</div>, onClick: () => {} },
  { id: "2", render: () => <div>Test2</div>, onClick: () => {} },
  { id: "2", render: () => <div>Test3</div>, onClick: () => {} }
];
const itemsLargeMenu = [
  { id: "1", render: () => <div>Test 1 this is a large text example</div>, onClick: () => {} },
  { id: "2", render: () => <div>Test 2 this is a large text example</div>, onClick: () => {} },
  { id: "2", render: () => <div>Test 3 this is a large text example</div>, onClick: () => {} }
];
export const Primary: Story = {
  args: {
    menu: itemsMenu,
    isDefaultOpen: true,
    children: <Button>Open/Close</Button>
  }
};

export const Secondary: Story = {
  args: {
    menu: itemsLargeMenu,
    isDefaultOpen: true,
    variant: MENU_VARIANT_BORDER_B_ORANGE,
    children: <Button>Open/Close</Button>
  }
};

export const PlacementBottomRight: Story = {
  args: {
    menu: itemsLargeMenu,
    isDefaultOpen: true,
    placement: MENU_PLACEMENT_BOTTOM_RIGHT,
    children: <Button>Open/Close</Button>
  }
};

export const PlacementBottomLeft: Story = {
  args: {
    menu: itemsLargeMenu,
    isDefaultOpen: true,
    placement: MENU_PLACEMENT_BOTTOM_LEFT,
    children: <Button>Open/Close</Button>
  }
};

export const PlacementRightTop: Story = {
  args: {
    menu: itemsLargeMenu,
    isDefaultOpen: true,
    placement: MENU_PLACEMENT_RIGHT_TOP,
    children: <Button>Open/Close</Button>
  }
};

export const PlacementLeftBottom: Story = {
  args: {
    menu: itemsLargeMenu,
    isDefaultOpen: true,
    placement: MENU_PLACEMENT_LEFT_BOTTOM,
    children: <Button>Open/Close</Button>
  }
};

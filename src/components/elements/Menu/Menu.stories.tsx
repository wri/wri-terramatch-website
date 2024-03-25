import { Meta, StoryObj } from "@storybook/react";

import Menu from "./Menu";
import {
  MENU_PLACEMENT_BOTTOM_LEFT,
  MENU_PLACEMENT_BOTTOM_RIGHT,
  MENU_PLACEMENT_RIGHT_TOP,
  MENU_VARIANT_BORDER_B_ORANGE
} from "./MenuVariant";

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
  { id: "1", render: () => <div>Test1</div>, onClick: () => {} },
  { id: "2", render: () => <div>Test2</div>, onClick: () => {} },
  { id: "2", render: () => <div>Test3</div>, onClick: () => {} }
];

export const Primary: Story = {
  args: {
    menu: itemsPrimaryMenu,
    isDefaultOpen: true
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
    isDefaultOpen: true,
    variant: MENU_VARIANT_BORDER_B_ORANGE
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

export const PlacementBottomRight: Story = {
  args: {
    menu: itemsPrimaryMenu,
    isDefaultOpen: true,
    placement: MENU_PLACEMENT_BOTTOM_RIGHT
  },
  decorators: [
    StoryComponent => (
      <div className="flex h-44 justify-center">
        <div className="relative z-10 h-2 w-3 rounded-lg bg-black">
          <StoryComponent />
        </div>
      </div>
    )
  ]
};

export const PlacementBottomLeft: Story = {
  args: {
    menu: itemsPrimaryMenu,
    isDefaultOpen: true,
    placement: MENU_PLACEMENT_BOTTOM_LEFT
  },
  decorators: [
    StoryComponent => (
      <div className="flex h-44 justify-center">
        <div className="relative z-10 h-2 w-3 rounded-lg bg-black">
          <StoryComponent />
        </div>
      </div>
    )
  ]
};

export const PlacementRightTop: Story = {
  args: {
    menu: itemsPrimaryMenu,
    isDefaultOpen: true,
    placement: MENU_PLACEMENT_RIGHT_TOP
  },
  decorators: [
    StoryComponent => (
      <div className="flex h-44 items-end justify-center">
        <div className="relative z-10 h-2 w-3 rounded-lg bg-black">
          <StoryComponent />
        </div>
      </div>
    )
  ]
};

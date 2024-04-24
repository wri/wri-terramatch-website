import { Meta, StoryObj } from "@storybook/react";

import ToolTip from "./Tooltip";

const meta: Meta<typeof ToolTip> = {
  /* :point_down: The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: "Components/Elements/Tooltip",
  component: ToolTip
};

export default meta;
type Story = StoryObj<typeof ToolTip>;

export const Default: Story = {
  args: {
    content: "This is a tooltip",
    width: "w-28",
    children: "Open-Hover"
  }
};

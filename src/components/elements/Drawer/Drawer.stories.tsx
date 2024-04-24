import { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

import Button from "../Button/Button";
import Drawer from "./Drawer";

const meta: Meta<typeof Drawer> = {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: "Components/Elements/Drawer",
  component: Drawer
};

export default meta;
type Story = StoryObj<typeof Drawer>;

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/react/api/csf
 * to learn how to use render functions.
 */

export const Primary: Story = () => {
  const [isOpen, setIsOpen] = useState(true); // Define isOpen state and its setter function

  return (
    <div className="relative h-full">
      <Drawer isOpen={isOpen} setIsOpen={setIsOpen} title={"Drawer Title"}>
        Primary Content
      </Drawer>
      <Button onClick={() => setIsOpen(true)}>Open</Button>
    </div>
  );
};

Primary.args = {
  children: "Primary"
};

Primary.decorators = [
  StoryComponent => (
    <div className="h-60 overflow-hidden border p-1">
      <StoryComponent />
    </div>
  )
];

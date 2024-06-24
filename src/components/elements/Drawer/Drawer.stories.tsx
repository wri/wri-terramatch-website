import { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

import Button from "../Button/Button";
import Drawer from "./Drawer";

const meta: Meta<typeof Drawer> = {
  title: "Components/Elements/Drawer",
  component: Drawer
};

export default meta;
type Story = StoryObj<typeof Drawer>;

export const Primary: Story = () => {
  const [isOpen, setIsOpen] = useState(true);

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

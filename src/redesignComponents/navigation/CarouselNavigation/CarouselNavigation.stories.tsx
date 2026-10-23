import { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

import CarouselNavigation from "./CarouselNavigation";

const meta: Meta<typeof CarouselNavigation> = {
  title: "Redesign Components/Navigation/CarouselNavigation",
  component: CarouselNavigation,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Previous / next arrows with one dot per item. The arrows are disabled on the first and last item, and every dot jumps straight to its item."
      }
    }
  }
};

export default meta;
type Story = StoryObj<typeof CarouselNavigation>;

const Controlled = ({ total, initial }: { total: number; initial: number }) => {
  const [current, setCurrent] = useState(initial);
  return <CarouselNavigation total={total} current={current} onChange={setCurrent} />;
};

export const FirstItem: Story = {
  render: () => <Controlled total={5} initial={0} />
};

export const MiddleItem: Story = {
  render: () => <Controlled total={5} initial={2} />
};

export const LastItem: Story = {
  render: () => <Controlled total={5} initial={4} />
};

import { Meta, StoryObj } from "@storybook/react";
import { Navigation, Pagination } from "swiper";

import Component, { CarouselProps } from "./Carousel";

const meta: Meta<typeof Component> = {
  title: "Components/Extensive/Carousel",
  component: Component
};

export default meta;
type Story = StoryObj<typeof Component>;

export const Default: Story = {
  //@ts-ignore
  render: ({ numberOfItems, ...args }: CarouselProps<any> & { numberOfItems: number }) => {
    const items: any[] = Array.from({ length: numberOfItems }, (_, i) => ({ key: i + 1 }));

    return (
      <Component
        {...args}
        items={items}
        carouselItem={item => (
          <div className="h-60 rounded bg-primary p-8">
            <p>{item.key}</p>
          </div>
        )}
      />
    );
  },
  args: {
    //@ts-ignore
    numberOfItems: 5,
    modules: [Navigation, Pagination],
    spaceBetween: 10,
    slidesPerView: 3
  }
};

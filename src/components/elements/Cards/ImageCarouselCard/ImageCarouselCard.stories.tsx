import { faker } from "@faker-js/faker";
import { Meta, StoryObj } from "@storybook/react";

import Component from "./ImageCarouselCard";

const meta: Meta<typeof Component> = {
  title: "Components/Elements/Cards/ImageCarouselCard",
  component: Component
};

export default meta;
type Story = StoryObj<typeof Component>;

faker.setDefaultRefDate("2023-01-01");
faker.seed(0);

const mockData = (() => {
  const data = [];
  for (let i = 1; i <= 7; i++) {
    faker.seed(i);
    data.push({
      id: `${i}`,
      url: faker.image.urlPicsumPhotos(),
      title: faker.lorem.sentence({ min: 4, max: 8 }),
      date: faker.date.anytime().toLocaleDateString("en-GB", { timeZone: "Europe/London" })
    });
  }
  return data;
})();

export const Default: Story = {
  args: {
    items: mockData
  }
};

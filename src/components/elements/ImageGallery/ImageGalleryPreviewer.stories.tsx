import { faker } from "@faker-js/faker";
import { Meta, StoryObj } from "@storybook/react";

import Component from "./ImageGalleryPreviewer";

const meta: Meta<typeof Component> = {
  title: "Components/Elements/Cards/ImageGalleryCard/Previewer",
  component: Component
};

export default meta;
type Story = StoryObj<typeof Component>;

faker.setDefaultRefDate(new Date("2023-01-01"));
faker.seed(0);

export const Default: Story = {
  decorators: [
    Story => {
      return (
        <div className="relative h-[600px] w-full">
          <Story />
        </div>
      );
    }
  ],
  args: {
    data: {
      uuid: faker.string.uuid(),
      fullImageUrl: faker.image.urlPicsumPhotos(),
      label: faker.lorem.sentence({ min: 4, max: 8 }),
      subtitle: faker.date.anytime().toLocaleDateString("en-GB", { timeZone: "Europe/London" }),
      isGeotagged: faker.datatype.boolean()
    },
    className: "!absolute",
    backdropClassName: "!absolute"
  }
};

import { faker } from "@faker-js/faker";
import { Meta, StoryObj } from "@storybook/react";

import Component from "./ImageGalleryItem";

const meta: Meta<typeof Component> = {
  title: "Components/Elements/Cards/ImageGalleryCard/Item",
  component: Component
};

export default meta;
type Story = StoryObj<typeof Component>;

faker.setDefaultRefDate("2023-01-01");
faker.seed(0);

export const Default: Story = {
  decorators: [
    Story => {
      return (
        <div className="p-4">
          <Story />
        </div>
      );
    }
  ],
  args: {
    data: {
      uuid: faker.string.uuid(),
      thumbnailImageUrl: faker.image.urlPicsumPhotos(),
      fullImageUrl: faker.image.urlPicsumPhotos(),
      label: faker.lorem.sentence({ min: 4, max: 8 }),
      subtitle: faker.date.anytime().toLocaleDateString("en-GB", { timeZone: "Europe/London" }),
      isPublic: faker.datatype.boolean()
    }
  }
};

import { faker } from "@faker-js/faker";
import { Meta, StoryObj } from "@storybook/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Component from "./ImageGalleryItem";

const meta: Meta<typeof Component> = {
  title: "Components/Elements/Cards/ImageGalleryCard/Item",
  component: Component
};

export default meta;
type Story = StoryObj<typeof Component>;

faker.setDefaultRefDate("2023-01-01");
faker.seed(0);

const queryClient = new QueryClient();

export const Default: Story = {
  decorators: [
    Story => {
      return (
        <QueryClientProvider client={queryClient}>
          <div className="p-4">
            <Story />
          </div>
        </QueryClientProvider>
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
      isPublic: faker.datatype.boolean(),
      isGeotagged: faker.datatype.boolean(),
      raw: {
        created_date: new Date("2023-01-01")
      }
    }
  }
};

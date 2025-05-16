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
      thumbUrl: faker.image.urlPicsumPhotos(),
      url: faker.image.urlPicsumPhotos(),
      name: faker.lorem.sentence({ min: 4, max: 8 }),
      createdAt: new Date("2023-01-01T12:00:00").toISOString(),
      entityType: "projects",
      entityUuid: faker.string.uuid(),
      collectionName: "images",
      lat: faker.location.latitude(),
      lng: faker.location.longitude(),
      isPublic: faker.datatype.boolean(),
      fileName: faker.system.fileName(),
      mimeType: faker.system.mimeType(),
      size: faker.number.int({ min: 100, max: 1000 }),
      isCover: faker.datatype.boolean(),
      description: faker.lorem.sentence({ min: 4, max: 8 }),
      photographer: faker.person.fullName(),
      createdByUserName: faker.person.fullName()
    }
  }
};

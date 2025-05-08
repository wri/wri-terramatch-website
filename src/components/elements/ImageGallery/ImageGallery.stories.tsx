import { faker } from "@faker-js/faker";
import { Meta, StoryObj } from "@storybook/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

import ModalRoot from "@/components/extensive/Modal/ModalRoot";
import ModalProvider from "@/context/modal.provider";
import { MediaDto } from "@/generated/v3/entityService/entityServiceSchemas";

import Component from "./ImageGallery";

const meta: Meta<typeof Component> = {
  title: "Components/Elements/ImageGallery",
  component: Component
};

export default meta;
type Story = StoryObj<typeof Component>;

faker.setDefaultRefDate(new Date("2023-01-01"));
faker.seed(0);

const mockData: MediaDto[] = (() => {
  const data: MediaDto[] = [];
  for (let i = 1; i <= 20; i++) {
    faker.seed(i);

    const imageUrl = faker.image.urlPicsumPhotos();

    data.push({
      uuid: faker.string.uuid(),
      thumbUrl: imageUrl,
      url: imageUrl,
      name: faker.lorem.sentence({ min: 4, max: 8 }),
      isPublic: faker.datatype.boolean(),
      lng: faker.location.longitude(),
      lat: faker.location.latitude(),
      createdAt: new Date("2023-01-01T12:00:00").toISOString(),
      entityType: "projects",
      entityUuid: faker.string.uuid(),
      collectionName: "images",
      fileName: faker.system.fileName(),
      mimeType: faker.system.mimeType(),
      size: faker.number.int({ min: 100, max: 1000 }),
      isCover: faker.datatype.boolean(),
      description: faker.lorem.sentence({ min: 4, max: 8 }),
      photographer: faker.person.fullName(),
      createdByUserName: faker.person.fullName()
    });
  }
  return data;
})();

const mockQuery = (page: number, pageSize: number) => {
  const pageCount = Math.ceil(mockData.length / pageSize);

  const data = pageSize > mockData.length ? mockData : mockData.slice((page - 1) * pageSize, pageSize * page);

  return {
    data,
    pageCount
  };
};

const queryClient = new QueryClient();

export const Default: Story = {
  render: args => {
    const [pagination, setPagination] = useState({ page: 1, pageSize: 5 });

    const { data, pageCount } = mockQuery(pagination.page, pagination.pageSize);

    const handleImageDelete = () => {
      window.alert("Image Deleted");
    };

    return (
      <QueryClientProvider client={queryClient}>
        <ModalProvider>
          <ModalRoot />

          <Component
            {...args}
            data={data}
            pageCount={pageCount}
            onGalleryStateChange={setPagination}
            onDeleteConfirm={handleImageDelete}
            setFilters={() => {}}
            onChangeGeotagged={() => {}}
            onChangeSearch={() => {}}
          />
        </ModalProvider>
      </QueryClientProvider>
    );
  },
  args: {
    title: "Additional Images"
  }
};

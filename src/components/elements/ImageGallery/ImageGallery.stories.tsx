import { faker } from "@faker-js/faker";
import { Meta, StoryObj } from "@storybook/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

import ModalRoot from "@/components/extensive/Modal/ModalRoot";
import ModalProvider from "@/context/modal.provider";

import Component from "./ImageGallery";
import { ImageGalleryItemData } from "./ImageGalleryItem";

const meta: Meta<typeof Component> = {
  title: "Components/Elements/ImageGallery",
  component: Component
};

export default meta;
type Story = StoryObj<typeof Component>;

faker.setDefaultRefDate(new Date("2023-01-01"));
faker.seed(0);

const mockData: ImageGalleryItemData[] = (() => {
  const data = [];
  for (let i = 1; i <= 20; i++) {
    faker.seed(i);

    const imageUrl = faker.image.urlPicsumPhotos();

    data.push({
      uuid: faker.string.uuid(),
      thumbnailImageUrl: imageUrl,
      fullImageUrl: imageUrl,
      label: faker.lorem.sentence({ min: 4, max: 8 }),
      isPublic: faker.datatype.boolean(),
      isGeotagged: faker.datatype.boolean(),
      raw: {
        created_date: new Date("2022-12-30").toISOString()
      }
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

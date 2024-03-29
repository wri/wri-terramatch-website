import { faker } from "@faker-js/faker";
import { Meta, StoryObj } from "@storybook/react";
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

faker.setDefaultRefDate("2023-01-01");

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
      value: faker.date.anytime().toLocaleDateString("en-GB", { timeZone: "Europe/London" }),
      isPublic: faker.datatype.boolean()
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

export const Default: Story = {
  render: args => {
    const [pagination, setPagination] = useState({ page: 1, pageSize: 5 });

    const { data, pageCount } = mockQuery(pagination.page, pagination.pageSize);

    const handleImageDelete = () => {
      window.alert("Image Deleted");
    };

    return (
      <ModalProvider>
        <ModalRoot />

        <Component
          {...args}
          data={data}
          pageCount={pageCount}
          onGalleryStateChange={setPagination}
          onDeleteConfirm={handleImageDelete}
        />
      </ModalProvider>
    );
  },
  args: {
    title: "Additional Images"
  }
};

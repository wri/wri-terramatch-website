import { Box } from "@chakra-ui/react";
import { Meta, StoryObj } from "@storybook/react";
import { FC } from "react";

import ImageGalleryCard, { GalleryImageType } from "./ImageGalleryCard";

const meta: Meta<typeof ImageGalleryCard> = {
  title: "Redesign Components/Content/Content Card/Image Gallery Card",
  component: ImageGalleryCard,
  tags: ["autodocs"],
  argTypes: {
    images: {
      control: "object",
      description: "Array of image URLs to display in the gallery"
    }
  }
};

export default meta;
type Story = StoryObj<typeof ImageGalleryCard>;

const sampleImages: GalleryImageType[] = [
  {
    uuid: "1",
    src: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400",
    alt: "Image 1"
  },
  {
    uuid: "2",
    src: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=400",
    alt: "Image 2"
  },
  {
    uuid: "3",
    src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
    alt: "Image 3"
  },
  {
    uuid: "4",
    src: "https://images.unsplash.com/photo-1511497584788-876760111969?w=400",
    alt: "Image 4"
  }
];

const StoryWrapper: FC<{ children: React.ReactNode }> = ({ children }) => (
  <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    minHeight="25rem"
    padding={8}
    backgroundColor="neutral.200"
  >
    {children}
  </Box>
);

export const Default: Story = {
  args: {
    images: sampleImages
  },
  render: args => (
    <StoryWrapper>
      <ImageGalleryCard {...args} />
    </StoryWrapper>
  )
};

export const ThreeImages: Story = {
  args: {
    images: sampleImages.slice(0, 3)
  },
  render: args => (
    <StoryWrapper>
      <ImageGalleryCard {...args} />
    </StoryWrapper>
  )
};

export const SingleImage: Story = {
  args: {
    images: [sampleImages[0]]
  },
  render: args => (
    <StoryWrapper>
      <ImageGalleryCard {...args} />
    </StoryWrapper>
  )
};

export const NoImages: Story = {
  args: {
    images: []
  },
  render: args => (
    <StoryWrapper>
      <ImageGalleryCard {...args} />
    </StoryWrapper>
  )
};

export const ThreeColumns: Story = {
  args: {
    images: sampleImages,
    columns: 3
  },
  render: args => (
    <StoryWrapper>
      <ImageGalleryCard {...args} />
    </StoryWrapper>
  )
};

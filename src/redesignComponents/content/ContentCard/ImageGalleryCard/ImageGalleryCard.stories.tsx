import { Box } from "@chakra-ui/react";
import { Meta, StoryObj } from "@storybook/react";
import { FC } from "react";

import ImageGalleryCard from "./ImageGalleryCard";

const meta: Meta<typeof ImageGalleryCard> = {
  title: "Redesign Components/Content/ContentCard/ImageGalleryCard",
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

const sampleImages = [
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400",
  "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=400",
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
  "https://images.unsplash.com/photo-1511497584788-876760111969?w=400"
];

const StoryWrapper: FC<{ children: React.ReactNode }> = ({ children }) => (
  <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    minHeight="400px"
    padding={8}
    backgroundColor="neutral.200"
  >
    {children}
  </Box>
);

/**
 * Default image gallery card with multiple images
 */
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

/**
 * Image gallery card with exactly 3 images
 */
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

/**
 * Image gallery card with a single image
 */
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

/**
 * Image gallery card with no images (empty state)
 */
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

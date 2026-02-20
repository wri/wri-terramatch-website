import { Box, Grid, GridItem } from "@chakra-ui/react";
import { FC } from "react";

import GalleryImage from "../../Images/GalleryImage/GalleryImage";
import { MIN_ITEMS } from "./constants";

interface IImageGalleryCardProps {
  images: string[] | undefined;
}

const ImageGalleryCard: FC<IImageGalleryCardProps> = ({ images }) => {
  const imageCount = images?.length ?? 0;
  const itemsToShow = Math.max(MIN_ITEMS, imageCount);
  const placeholderCount = itemsToShow - imageCount;
  const isEmpty = imageCount === 0;

  return (
    <Box padding={5} backgroundColor="white" borderRadius="md">
      <Grid templateColumns="repeat(2, 1fr)" gapY={5} gapX={5}>
        {images?.map((image, index) => (
          <GridItem key={`image-${index}-${image}`}>
            <GalleryImage
              src={image}
              alt="Image"
              className="bg-theme-neutral-200 h-full min-h-full w-full min-w-full"
            />
          </GridItem>
        ))}
        {Array.from({ length: placeholderCount }).map((_, index) => {
          const isFirstPlaceholder = index === 0;
          const showContent = isEmpty && isFirstPlaceholder;

          return (
            <GridItem key={`placeholder-${index}`}>
              {showContent ? (
                <GalleryImage alt="No images available" isAdd={true} />
              ) : (
                <div className="bg-theme-neutral-200 rounded-md" style={{ width: 164, height: 164 }} />
              )}
            </GridItem>
          );
        })}
      </Grid>
    </Box>
  );
};

export default ImageGalleryCard;

import { Flex, Grid, GridItem, Spinner, Text } from "@chakra-ui/react";
import React, { FC, UIEvent, useCallback } from "react";

import GalleryImage from "@/redesignComponents/content/Images/GalleryImage/GalleryImage";

import Modal from "./Modal";

interface ModalSelectGalleryImagesProps {
  open: boolean;
  onClose: () => void;
  images: { uuid: string; src: string; alt: string; url: string; name: string }[];
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
  onSelectImage: (image: { uuid: string; src: string; alt: string; url: string; name: string }) => void;
}

const ModalSelectGalleryImages: FC<ModalSelectGalleryImagesProps> = ({
  open,
  onClose,
  images,
  hasMore,
  isLoading,
  onLoadMore,
  onSelectImage
}) => {
  const handleScroll = useCallback(
    (event: UIEvent<HTMLDivElement>) => {
      const target = event.currentTarget;
      const threshold = 80; // px from bottom

      if (hasMore && !isLoading && target.scrollTop + target.clientHeight >= target.scrollHeight - threshold) {
        onLoadMore();
      }
    },
    [hasMore, isLoading, onLoadMore]
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="large"
      header={
        <Text textStyle="400-bold" color="neutral.800">
          Select Images from Gallery
        </Text>
      }
      maxHeight="100vh"
      content={
        <Flex direction="column" maxHeight="70vh">
          <Grid
            templateColumns="repeat(3, 1fr)"
            gap="4"
            alignItems="center"
            overflowY="auto"
            maxHeight="70vh"
            paddingRight="4"
            onScroll={handleScroll}
          >
            {images?.map(image => (
              <GridItem key={image.uuid} as="button" onClick={() => onSelectImage(image)}>
                <GalleryImage
                  src={image.url ?? ""}
                  alt={image.name ?? ""}
                  className="max-h-[140px] min-w-full"
                  hoverContent=" "
                />
              </GridItem>
            ))}
          </Grid>
          {isLoading && (
            <Flex justifyContent="center" alignItems="center" py={4}>
              <Spinner />
            </Flex>
          )}
        </Flex>
      }
    />
  );
};

export default ModalSelectGalleryImages;

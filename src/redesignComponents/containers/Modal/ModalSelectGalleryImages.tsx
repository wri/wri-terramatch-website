import { Flex, Spinner, Text } from "@chakra-ui/react";
import React, { FC, UIEvent, useCallback } from "react";

import ImageGalleryCard, {
  GalleryImageType
} from "@/redesignComponents/content/ContentCard/ImageGalleryCard/ImageGalleryCard";

import Modal from "./Modal";

interface ModalSelectGalleryImagesProps {
  open: boolean;
  onClose: () => void;
  images: GalleryImageType[];
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
  onSelectImage: (image: GalleryImageType) => void;
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
          <ImageGalleryCard
            className="overflow-y-auto py-0 pr-4 pl-0"
            images={images}
            columns={3}
            onScroll={handleScroll}
            onSelectImage={onSelectImage}
          />
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

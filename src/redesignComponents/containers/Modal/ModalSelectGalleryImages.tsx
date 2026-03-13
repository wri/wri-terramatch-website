import { Grid, GridItem, Text } from "@chakra-ui/react";
import React, { FC } from "react";

import GalleryImage from "@/redesignComponents/content/Images/GalleryImage/GalleryImage";

import Modal from "./Modal";

interface ModalSelectGalleryImagesProps {
  open: boolean;
  onClose: () => void;
}

const ModalSelectGalleryImages: FC<ModalSelectGalleryImagesProps> = ({ open, onClose }) => {
  const mockedImages = [
    {
      src: "https://i.pravatar.cc/300?img=4",
      alt: "Image 1"
    },
    {
      src: "https://i.pravatar.cc/300?img=5",
      alt: "Image 2"
    },
    {
      src: "https://i.pravatar.cc/300?img=6",
      alt: "Image 3"
    },
    {
      src: "https://i.pravatar.cc/300?img=7",
      alt: "Image 4"
    },
    {
      src: "https://i.pravatar.cc/300?img=8",
      alt: "Image 5"
    },
    {
      src: "https://i.pravatar.cc/300?img=9",
      alt: "Image 6"
    },
    {
      src: "https://i.pravatar.cc/300?img=10",
      alt: "Image 7"
    },
    {
      src: "https://i.pravatar.cc/300?img=11",
      alt: "Image 8"
    },
    {
      src: "https://i.pravatar.cc/300?img=12",
      alt: "Image 9"
    },
    {
      src: "https://i.pravatar.cc/300?img=13",
      alt: "Image 10"
    },
    {
      src: "https://i.pravatar.cc/300?img=14",
      alt: "Image 11"
    },
    {
      src: "https://i.pravatar.cc/300?img=15",
      alt: "Image 12"
    },
    {
      src: "https://i.pravatar.cc/300?img=16",
      alt: "Image 13"
    },
    {
      src: "https://i.pravatar.cc/300?img=17",
      alt: "Image 14"
    }
  ];

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
        <Grid
          templateColumns="repeat(3, 1fr)"
          gap="4"
          alignItems="center"
          overflowY="auto"
          maxHeight="70vh"
          paddingRight="4"
        >
          {mockedImages.map(image => (
            <GridItem key={image.src}>
              <GalleryImage src={image.src} alt={image.alt} className="max-h-[140px] min-w-full" hoverContent=" " />
            </GridItem>
          ))}
        </Grid>
      }
    />
  );
};

export default ModalSelectGalleryImages;

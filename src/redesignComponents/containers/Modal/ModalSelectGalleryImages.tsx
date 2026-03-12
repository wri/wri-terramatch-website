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
      src: "/images/about-us-2.png",
      alt: "Image 1"
    },
    {
      src: "/images/about-us-2.png",
      alt: "Image 2"
    },
    {
      src: "/images/about-us-2.png",
      alt: "Image 3"
    },
    {
      src: "/images/about-us-2.png",
      alt: "Image 4"
    },
    {
      src: "/images/about-us-2.png",
      alt: "Image 5"
    },
    {
      src: "/images/about-us-2.png",
      alt: "Image 6"
    },
    {
      src: "/images/about-us-2.png",
      alt: "Image 7"
    },
    {
      src: "/images/about-us-2.png",
      alt: "Image 8"
    },
    {
      src: "/images/about-us-2.png",
      alt: "Image 9"
    },
    {
      src: "/images/about-us-2.png",
      alt: "Image 10"
    },
    {
      src: "/images/about-us-2.png",
      alt: "Image 11"
    },
    {
      src: "/images/about-us-2.png",
      alt: "Image 12"
    },
    {
      src: "/images/about-us-2.png",
      alt: "Image 13"
    },
    {
      src: "/images/about-us-2.png",
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

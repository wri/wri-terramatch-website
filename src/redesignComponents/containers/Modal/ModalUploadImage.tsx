import { Box, Flex, Text } from "@chakra-ui/react";
import Image from "next/image";
import React, { FC, useState } from "react";

import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import Slider from "@/redesignComponents/Forms/Controls/Slider";
import { DeleteIcon, MinusIcon, PhotoLibraryIcon, PlusIcon, UploadIcon } from "@/redesignComponents/foundations/Icons";

import Modal from "./Modal";

interface ModalUploadImageProps {
  open: boolean;
  onClose: () => void;
  imgSrc?: string;
}

const ModalUploadImage: FC<ModalUploadImageProps> = ({ open, onClose, imgSrc }) => {
  const [sliderValue, setSliderValue] = useState(33);
  const mockedImgSrc = "/images/about-us-2.png";
  return (
    <Modal
      open={open}
      onClose={onClose}
      header={
        <Text textStyle="400-bold" color="neutral.800">
          Project Profile Image
        </Text>
      }
      content={
        <Flex direction="column" gap="4" alignItems="center">
          <Box className="relative h-[300px] w-[300px] overflow-hidden">
            <Image
              src={imgSrc ?? mockedImgSrc}
              alt="Project Profile Image"
              width={300}
              height={300}
              style={{
                objectFit: "cover",
                scale: 1 + sliderValue / 100
              }}
              className="h-full w-full"
            />
            <Box
              className="absolute inset-0"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.6)",
                maskImage: "radial-gradient(circle at center, transparent 0 70%, black 61%)",
                WebkitMaskImage: "radial-gradient(circle at center, transparent 0 70%, black 61%)"
              }}
            />
            <Box className="border-theme-neutral-100 absolute top-0 right-0 h-full w-full rounded-full border-2 bg-transparent" />
          </Box>
          <Flex direction="row" gap="4" alignItems="center" width="100%" justifyContent="center">
            <Button
              variant="borderless"
              size="small"
              className="w-fit"
              onClick={() => setSliderValue(Math.max(sliderValue - 1, 0))}
            >
              <MinusIcon />
            </Button>
            <Slider
              className="w-fit"
              width="160px"
              max={100}
              value={[sliderValue]}
              onValueChangeEnd={(details: { value: number[] }) => setSliderValue(details.value[0])}
            />
            <Button
              variant="borderless"
              size="small"
              className="w-fit"
              onClick={() => setSliderValue(Math.min(sliderValue + 1, 100))}
            >
              <PlusIcon />
            </Button>
          </Flex>
          <Flex alignItems="center" gap="4">
            <Button
              size="small"
              leftIcon={<DeleteIcon />}
              className="!border-theme-error-300 !bg-theme-error-100 !text-theme-error-900"
            >
              Remove Image
            </Button>
            <Button variant="secondary" size="small" leftIcon={<PhotoLibraryIcon />}>
              Select from Gallery
            </Button>
            <Button variant="secondary" size="small" leftIcon={<UploadIcon />}>
              Upload New
            </Button>
          </Flex>
          <Text textStyle="200" color="neutral.800">
            Upload a JPG or PNG image (max XX MB).
          </Text>
        </Flex>
      }
      footer={
        <Flex direction="row" gap="4" alignItems="center" width="100%">
          <Button variant="secondary" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button onClick={onClose} className="flex-1">
            Save
          </Button>
        </Flex>
      }
    />
  );
};

export default ModalUploadImage;

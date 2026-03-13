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
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragState, setDragState] = useState({
    dragging: false,
    startX: 0,
    startY: 0,
    startOffsetX: 0,
    startOffsetY: 0
  });

  const scale = 1 + sliderValue / 100;

  const handleMouseDown: React.MouseEventHandler<HTMLDivElement> = event => {
    event.preventDefault();
    setDragState({
      dragging: true,
      startX: event.clientX,
      startY: event.clientY,
      startOffsetX: offset.x,
      startOffsetY: offset.y
    });
  };

  const handleMouseMove: React.MouseEventHandler<HTMLDivElement> = event => {
    if (!dragState.dragging) return;

    const deltaX = event.clientX - dragState.startX;
    const deltaY = event.clientY - dragState.startY;

    // Clamp so you can't drag the image completely out of view.
    const viewportHalf = 150; // half of 300px container
    const scaledHalf = viewportHalf * scale;
    const maxOffset = Math.max(0, scaledHalf - viewportHalf);

    const nextX = dragState.startOffsetX + deltaX;
    const nextY = dragState.startOffsetY + deltaY;

    const clamp = (value: number) => Math.max(-maxOffset, Math.min(maxOffset, value));

    setOffset({
      x: clamp(nextX),
      y: clamp(nextY)
    });
  };

  const endDrag = () => {
    if (!dragState.dragging) return;
    setDragState(prev => ({ ...prev, dragging: false }));
  };

  const mockedImgSrc = "https://i.pravatar.cc/300?img=4";
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
          <Box
            className="relative h-[300px] w-[300px] cursor-grab overflow-hidden active:cursor-grabbing"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={endDrag}
            onMouseLeave={endDrag}
          >
            <Image
              src={imgSrc ?? mockedImgSrc}
              alt="Project Profile Image"
              width={300}
              height={300}
              style={{
                objectFit: "cover",
                transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
                transformOrigin: "center center"
              }}
              className="h-full w-full select-none"
              draggable={false}
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

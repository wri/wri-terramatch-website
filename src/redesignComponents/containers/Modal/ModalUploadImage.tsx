import { Box, Flex, Text } from "@chakra-ui/react";
import Image from "next/image";
import React, { FC, useEffect, useRef, useState } from "react";

import { updateMedia } from "@/connections/Media";
import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import Slider from "@/redesignComponents/Forms/Controls/Slider";
import { DeleteIcon, MinusIcon, PhotoLibraryIcon, PlusIcon, UploadIcon } from "@/redesignComponents/foundations/Icons";
import { FileType } from "@/types/common";

import Modal from "./Modal";

interface ModalUploadImageProps {
  open: boolean;
  onClose: () => void;
  imgSrc?: string;
  mediaUuid?: string;
  scale?: number;
  onOpenModalImageGallery?: (open: boolean) => void;
  onUploadFile?: (file: File, scale: number) => Promise<void> | void;
  onRemoveFile?: () => void;
  selectedGalleryImage?: { uuid: string; src: string; alt: string; url: string; name: string } | null;
  onConfirmGalleryImage?: (
    image: { uuid: string; src: string; alt: string; url: string; name: string },
    scale: number
  ) => Promise<void> | void;
  onUpdateExistingScale?: (scale: number) => void;
}

const ModalUploadImage: FC<ModalUploadImageProps> = ({
  open,
  onClose,
  imgSrc,
  mediaUuid,
  scale,
  onOpenModalImageGallery,
  onUploadFile,
  onRemoveFile,
  selectedGalleryImage,
  onConfirmGalleryImage,
  onUpdateExistingScale
}) => {
  const [sliderValue, setSliderValue] = useState(0);
  const mockedImgSrc = "https://i.pravatar.cc/300?img=4";
  const [localImgSrc, setLocalImgSrc] = useState<string | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);

  useEffect(() => {
    if (!open) return;
    if (scale != null && !Number.isNaN(scale)) {
      const initial = Math.round((scale - 1) * 100);
      const clamped = Math.min(100, Math.max(0, initial));
      setSliderValue(clamped);
    } else {
      setSliderValue(0);
    }
  }, [open, scale]);

  useEffect(() => {
    if (!open) {
      setLocalImgSrc(undefined);
      setPendingFile(null);
    }
  }, [open]);

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
          <Box className="relative h-[300px] w-[300px] cursor-grab overflow-hidden active:cursor-grabbing">
            <Image
              src={localImgSrc ?? selectedGalleryImage?.url ?? imgSrc ?? mockedImgSrc}
              alt="Project Profile Image"
              width={300}
              height={300}
              style={{
                objectFit: "cover",
                transform: `scale(${1 + sliderValue / 100})`
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
            <Box className="absolute top-0 right-0 h-full w-full rounded-full border-2 border-theme-neutral-100 bg-transparent" />
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
              min={0}
              max={100}
              value={[sliderValue]}
              onChange={(newValue: unknown) => {
                let next: number | undefined;

                if (Array.isArray(newValue)) {
                  const arr = newValue as number[];
                  next = arr[0];
                } else if (typeof newValue === "number") {
                  next = newValue;
                } else {
                  const maybeTargetValue = (newValue as any)?.target?.value;
                  if (typeof maybeTargetValue !== "undefined") {
                    const numericValue = Number(maybeTargetValue);
                    if (!Number.isNaN(numericValue)) {
                      next = numericValue;
                    }
                  }
                }

                if (typeof next === "number") {
                  const clamped = Math.min(100, Math.max(0, next));
                  setSliderValue(clamped);
                }
              }}
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
              onClick={() => {
                setLocalImgSrc(undefined);
                setPendingFile(null);
                onRemoveFile?.();
              }}
            >
              Remove Image
            </Button>
            <Button
              variant="secondary"
              size="small"
              leftIcon={<PhotoLibraryIcon />}
              onClick={() => onOpenModalImageGallery?.(true)}
            >
              Select from Gallery
            </Button>
            <Button
              variant="secondary"
              size="small"
              leftIcon={<UploadIcon />}
              onClick={() => fileInputRef.current?.click()}
            >
              Upload New
            </Button>
          </Flex>
          <input
            ref={fileInputRef}
            type="file"
            accept={FileType.Image}
            className="hidden"
            onChange={event => {
              const file = event.target.files?.[0];
              if (!file) return;
              const objectUrl = URL.createObjectURL(file);
              setLocalImgSrc(objectUrl);
              setPendingFile(file);
            }}
          />
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
          <Button
            onClick={async () => {
              const scale = 1 + sliderValue / 100;

              if (pendingFile) {
                await onUploadFile?.(pendingFile, scale);
              } else if (selectedGalleryImage && onConfirmGalleryImage) {
                await onConfirmGalleryImage(selectedGalleryImage, scale);
              } else if (mediaUuid) {
                await updateMedia(
                  {
                    isCover: true,
                    profileImageScale: scale
                  },
                  { id: mediaUuid }
                );
                onUpdateExistingScale?.(scale);
              }

              setPendingFile(null);
              onClose();
            }}
            className="flex-1"
          >
            Save
          </Button>
        </Flex>
      }
    />
  );
};

export default ModalUploadImage;

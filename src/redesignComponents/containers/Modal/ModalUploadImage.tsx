import { Box, Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import React, { FC, useEffect, useRef, useState } from "react";

import { updateMedia } from "@/connections/Media";
import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import BaseImage from "@/redesignComponents/content/Images/Image";
import Slider from "@/redesignComponents/Forms/Controls/Slider";
import {
  DeleteIcon,
  MinusIcon,
  PhotoLibraryIcon,
  PlaceholderIcon,
  PlusIcon,
  UploadIcon
} from "@/redesignComponents/foundations/Icons";
import { FileType } from "@/types/common";

import Modal from "./Modal";

interface ModalUploadImageProps {
  open: boolean;
  onClose: () => void;
  imgSrc?: string;
  mediaUuid?: string;
  scale?: number;
  initialFile?: File;
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
  initialFile,
  onOpenModalImageGallery,
  onUploadFile,
  onRemoveFile,
  selectedGalleryImage,
  onConfirmGalleryImage,
  onUpdateExistingScale
}) => {
  const t = useT();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [sliderValue, setSliderValue] = useState(0);
  const [activeImgSrc, setActiveImgSrc] = useState<string | undefined>(imgSrc);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [isMarkedForRemoval, setIsMarkedForRemoval] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (scale != null && !Number.isNaN(scale)) {
      const clamped = Math.min(100, Math.max(0, Math.round((scale - 1) * 100)));
      setSliderValue(clamped);
    } else {
      setSliderValue(0);
    }
  }, [open, scale]);

  useEffect(() => {
    if (!open) {
      setActiveImgSrc(undefined);
      setPendingFile(null);
      setIsMarkedForRemoval(false);
      return;
    }

    setActiveImgSrc(imgSrc);
    setPendingFile(null);
    setIsMarkedForRemoval(false);
  }, [open, imgSrc]);

  useEffect(() => {
    if (!open || initialFile == null) return;

    const objectUrl = URL.createObjectURL(initialFile);
    setActiveImgSrc(objectUrl);
    setPendingFile(initialFile);
    setIsMarkedForRemoval(false);
  }, [open, initialFile]);

  useEffect(() => {
    if (!open || selectedGalleryImage?.url == null) return;
    setActiveImgSrc(selectedGalleryImage.url);
    setPendingFile(null);
    setIsMarkedForRemoval(false);
  }, [open, selectedGalleryImage]);

  const handleSliderChange = (newValue: unknown) => {
    let next: number | undefined;

    if (Array.isArray(newValue)) {
      next = (newValue as number[])[0];
    } else if (typeof newValue === "number") {
      next = newValue;
    } else {
      const maybeTargetValue = (newValue as any)?.target?.value;
      if (typeof maybeTargetValue !== "undefined") {
        const parsed = Number(maybeTargetValue);
        if (!Number.isNaN(parsed)) next = parsed;
      }
    }

    if (typeof next === "number") {
      setSliderValue(Math.min(100, Math.max(0, next)));
    }
  };

  const handleLocalFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file == null) return;
    setActiveImgSrc(URL.createObjectURL(file));
    setPendingFile(file);
    setIsMarkedForRemoval(false);
    event.target.value = "";
  };

  const handleRemove = () => {
    setActiveImgSrc(undefined);
    setPendingFile(null);
    setIsMarkedForRemoval(true);
  };

  const handleSave = async () => {
    const currentScale = 1 + sliderValue / 100;

    if (isMarkedForRemoval && onRemoveFile != null) {
      await onRemoveFile();
    } else if (pendingFile != null && onUploadFile != null) {
      await onUploadFile(pendingFile, currentScale);
    } else if (selectedGalleryImage != null && onConfirmGalleryImage != null) {
      await onConfirmGalleryImage(selectedGalleryImage, currentScale);
    } else if (mediaUuid != null) {
      await updateMedia({ isCover: true, profileImageScale: currentScale }, { id: mediaUuid });
      onUpdateExistingScale?.(currentScale);
    }

    setPendingFile(null);
    onClose();
  };

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
          {activeImgSrc != null ? (
            <Box className="relative h-[300px] w-[300px] cursor-grab overflow-hidden active:cursor-grabbing">
              <BaseImage
                src={activeImgSrc}
                alt="Project Profile Image"
                scale={1 + sliderValue / 100}
                className="!h-full !w-full select-none"
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
          ) : (
            <Box className="relative h-[300px] w-[300px] overflow-hidden">
              <Flex className="h-full w-full items-center justify-center bg-theme-neutral-200">
                <PlaceholderIcon boxSize={8} color="neutral.600" />
              </Flex>
              <Box
                className="absolute inset-0 bg-image-background bg-cover bg-center"
                style={{
                  maskImage: "radial-gradient(circle at center, transparent 0 70%, black 61%)",
                  WebkitMaskImage: "radial-gradient(circle at center, transparent 0 70%, black 61%)"
                }}
              />
            </Box>
          )}

          <Flex direction="row" gap="4" alignItems="center" width="100%" justifyContent="center">
            <Button
              variant="borderless"
              size="small"
              className="w-fit"
              onClick={() => setSliderValue(v => Math.max(v - 1, 0))}
            >
              <MinusIcon />
            </Button>
            <Slider
              className="w-fit"
              width="160px"
              min={0}
              max={100}
              value={[sliderValue]}
              onChange={handleSliderChange}
            />
            <Button
              variant="borderless"
              size="small"
              className="w-fit"
              onClick={() => setSliderValue(v => Math.min(v + 1, 100))}
            >
              <PlusIcon />
            </Button>
          </Flex>

          <Flex alignItems="center" gap="4">
            <Button
              size="small"
              leftIcon={<DeleteIcon />}
              className="!border-theme-error-300 !bg-theme-error-100 !text-theme-error-900"
              onClick={handleRemove}
            >
              {t("Remove Image")}
            </Button>
            <Button
              variant="secondary"
              size="small"
              leftIcon={<PhotoLibraryIcon />}
              onClick={() => onOpenModalImageGallery?.(true)}
            >
              {t("Select from Gallery")}
            </Button>
            <Button
              variant="secondary"
              size="small"
              leftIcon={<UploadIcon />}
              onClick={() => fileInputRef.current?.click()}
            >
              {t("Upload New")}
            </Button>
          </Flex>

          <input
            ref={fileInputRef}
            type="file"
            accept={FileType.Image}
            className="hidden"
            onChange={handleLocalFileChange}
          />

          <Text textStyle="200" color="neutral.800">
            {t("Upload a JPG or PNG image (max 10 MB).")}
          </Text>
        </Flex>
      }
      footer={
        <Flex direction="row" gap="4" alignItems="center" width="100%">
          <Button variant="secondary" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button onClick={handleSave} className="flex-1">
            {t("Save")}
          </Button>
        </Flex>
      }
    />
  );
};

export default ModalUploadImage;

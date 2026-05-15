import { Box, Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import React, { FC, useCallback, useEffect, useRef, useState } from "react";

import { updateMedia } from "@/connections/Media";
import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import ButtonGroup from "@/redesignComponents/actions/Buttons/ButtonGroup/ButtonGroup";
import BaseImage from "@/redesignComponents/content/Images/Image";
import Slider from "@/redesignComponents/Forms/Controls/Slider";
import {
  CheckIndeterminateIcon,
  DeleteIcon,
  PhotoLibraryIcon,
  PlaceholderIcon,
  PlusIcon,
  UploadIcon
} from "@/redesignComponents/foundations/Icons";
import InlineMessage from "@/redesignComponents/status/InlineMessage/InlineMessage";
import { FileType } from "@/types/common";

import Modal from "./Modal";

interface ModalUploadImageProps {
  open: boolean;
  onClose: () => void;
  imgSrc?: string;
  mediaUuid?: string;
  scale?: number;
  positionActive?: { x: number; y: number };
  initialFile?: File;
  onOpenModalImageGallery?: (open: boolean) => void;
  onUploadFile?: (file: File, scale: number, position: { x: number; y: number }) => Promise<void> | void;
  onRemoveFile?: () => void;
  selectedGalleryImage?: { uuid: string; src: string; alt: string; url: string; name: string } | null;
  onConfirmGalleryImage?: (
    image: { uuid: string; src: string; alt: string; url: string; name: string },
    scale: number,
    position: { x: number; y: number }
  ) => Promise<void> | void;
  onUpdateExistingScale?: (scale: number) => void;
  onUpdateExistingPosition?: (position: { x: number; y: number }) => void;
}

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

const ModalUploadImage: FC<ModalUploadImageProps> = ({
  open,
  onClose,
  imgSrc,
  mediaUuid,
  scale,
  positionActive,
  initialFile,
  onOpenModalImageGallery,
  onUploadFile,
  onRemoveFile,
  selectedGalleryImage,
  onConfirmGalleryImage,
  onUpdateExistingScale,
  onUpdateExistingPosition
}) => {
  const t = useT();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const ref = useRef<HTMLDivElement | null>(null);
  const [sliderValue, setSliderValue] = useState(0);
  const [activeImgSrc, setActiveImgSrc] = useState<string | undefined>(imgSrc);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [isMarkedForRemoval, setIsMarkedForRemoval] = useState(false);
  const [hasClearedSelection, setHasClearedSelection] = useState(false);
  const [fileSizeError, setFileSizeError] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const startRef = useRef({ x: 0, y: 0 });

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
      setHasClearedSelection(false);
      setPosition({ x: 0, y: 0 });
      return;
    }

    setActiveImgSrc(imgSrc);
    setPendingFile(null);
    setIsMarkedForRemoval(false);
    setHasClearedSelection(false);
    setPosition(positionActive ?? { x: 0, y: 0 });
  }, [open, imgSrc, positionActive]);

  useEffect(() => {
    if (!open || initialFile == null) return;

    const objectUrl = URL.createObjectURL(initialFile);
    setActiveImgSrc(objectUrl);
    setPendingFile(initialFile);
    setIsMarkedForRemoval(false);
    setHasClearedSelection(false);
  }, [open, initialFile]);

  useEffect(() => {
    if (!open || selectedGalleryImage?.url == null) return;
    setActiveImgSrc(selectedGalleryImage.url);
    setPendingFile(null);
    setIsMarkedForRemoval(false);
    setHasClearedSelection(false);
  }, [open, selectedGalleryImage]);

  const handleSliderChange = (details: { value: number[] }) => {
    const value = details.value?.[0] ?? 0;
    setSliderValue(Math.min(100, Math.max(0, value)));
  };

  const handleLocalFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file == null) return;

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setFileSizeError(true);
      event.target.value = "";
      return;
    }

    setFileSizeError(false);
    setActiveImgSrc(URL.createObjectURL(file));
    setPendingFile(file);
    setIsMarkedForRemoval(false);
    event.target.value = "";
  };

  const handleRemove = () => {
    if (pendingFile != null || selectedGalleryImage != null || initialFile != null) {
      setActiveImgSrc(imgSrc);
      setPendingFile(null);
      setIsMarkedForRemoval(false);
      setHasClearedSelection(true);
      return;
    }

    setActiveImgSrc(undefined);
    setPendingFile(null);
    setIsMarkedForRemoval(true);
    setHasClearedSelection(false);
  };

  const baseScale = scale != null && !Number.isNaN(scale) ? scale : 1;
  const zoomFactor = 1 + sliderValue / 100;
  const effectiveScale = baseScale * zoomFactor;

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    startRef.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    };
  };

  useEffect(() => {
    if (positionActive != null) {
      setPosition(positionActive);
    } else {
      setPosition({ x: 0, y: 0 });
    }
  }, [activeImgSrc, positionActive]);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;

      const newX = e.clientX - startRef.current.x;
      const newY = e.clientY - startRef.current.y;

      const containerSize = ref.current?.getBoundingClientRect().width ?? 0;
      const scaledSize = containerSize * effectiveScale;

      const maxOffset = (scaledSize - containerSize) / 2;

      setPosition({
        x: Math.max(-maxOffset, Math.min(maxOffset, newX)),
        y: Math.max(-maxOffset, Math.min(maxOffset, newY))
      });
    },
    [effectiveScale, isDragging]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  useEffect(() => {
    const containerSize = ref.current?.getBoundingClientRect().width ?? 0;
    const scaledSize = containerSize * effectiveScale;
    const maxOffset = (scaledSize - containerSize) / 2;

    setPosition(prev => ({
      x: Math.max(-maxOffset, Math.min(maxOffset, prev.x)),
      y: Math.max(-maxOffset, Math.min(maxOffset, prev.y))
    }));
  }, [effectiveScale]);

  const handleSave = async () => {
    const currentScale = 1 + sliderValue / 100;

    if (isMarkedForRemoval && onRemoveFile != null) {
      await onRemoveFile();
    } else if (pendingFile != null && onUploadFile != null) {
      await onUploadFile(pendingFile, currentScale, position);
    } else if (!hasClearedSelection && selectedGalleryImage != null && onConfirmGalleryImage != null) {
      await onConfirmGalleryImage(selectedGalleryImage, currentScale, position);
    } else if (mediaUuid != null) {
      await updateMedia(
        { isCover: true, profileImageScale: currentScale, profileImagePosition: position },
        { id: mediaUuid }
      );
      onUpdateExistingScale?.(currentScale);
      onUpdateExistingPosition?.(position);
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
          {fileSizeError && (
            <InlineMessage
              label={t("Upload failed. File size exceeds 10 MB.")}
              caption={t("To continue, reduce the file size or select a different image.")}
              variant="error"
              size="small"
              className="inline-message-full-width"
            />
          )}
          {activeImgSrc != null ? (
            <Box
              onMouseDown={handleMouseDown}
              onMouseLeave={() => setIsDragging(false)}
              ref={ref}
              className="no-ghost-dragging relative h-[18.75rem] w-[18.75rem] cursor-grab overflow-hidden active:cursor-grabbing "
            >
              <BaseImage
                src={activeImgSrc}
                alt="Project Profile Image"
                className="!h-full !w-full"
                draggable={false}
                style={{
                  transform: `translate(${position.x}px, ${position.y}px) scale(${1 + sliderValue / 100})`,
                  WebkitUserSelect: "none",
                  KhtmlUserSelect: "none",
                  MozUserSelect: "none",
                  userSelect: "none"
                }}
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
          ) : (
            <Box className="relative h-[18.75rem] w-[18.75rem] overflow-hidden">
              <Flex className="bg-theme-neutral-200 h-full w-full items-center justify-center">
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
              <CheckIndeterminateIcon />
            </Button>
            <Slider
              className="w-fit"
              width="10rem"
              min={0}
              max={100}
              value={[sliderValue]}
              onValueChange={handleSliderChange}
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
        <ButtonGroup
          buttons={[
            {
              id: "cancel",
              children: t("Cancel"),
              onClick: onClose,
              variant: "secondary"
            },
            {
              id: "save",
              children: t("Save"),
              onClick: handleSave
            }
          ]}
        />
      }
    />
  );
};

export default ModalUploadImage;

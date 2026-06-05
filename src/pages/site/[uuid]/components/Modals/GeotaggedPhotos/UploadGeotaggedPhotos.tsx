import { Box, Flex, Grid, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { showToast } from "@worldresources/wri-design-systems";
import { ChangeEvent, DragEvent, FC, useCallback, useEffect, useMemo, useRef, useState } from "react";

import { prepareFileForUpload } from "@/connections/Media";
import { useMapAreaContext } from "@/context/mapArea.provider";
import { uploadFile } from "@/generated/v3/entityService/entityServiceComponents";
import { useFileSize } from "@/hooks/useFileSize";
import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import ButtonGroup from "@/redesignComponents/actions/Buttons/ButtonGroup/ButtonGroup";
import Modal from "@/redesignComponents/containers/Modal/Modal";
import GalleryImage from "@/redesignComponents/content/Images/GalleryImage/GalleryImage";
import { UploadIcon } from "@/redesignComponents/foundations/Icons";
import Log from "@/utils/log";

const ACCEPTED_FORMATS = ".jpg,.jpeg,.png";
const ACCEPTED_IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png"] as const;

const isAcceptedImageFile = (file: File): boolean => {
  const lowerName = file.name.toLowerCase();
  return ACCEPTED_IMAGE_EXTENSIONS.some(extension => lowerName.endsWith(extension));
};

const collectAcceptedImageFiles = (fileList: FileList | null): File[] => {
  if (fileList == null) {
    return [];
  }

  return Array.from(fileList).filter(isAcceptedImageFile);
};

const mergeSelectedFiles = (currentFiles: File[], incomingFiles: File[]): File[] => {
  const existingNames = new Set(currentFiles.map(file => file.name));
  const mergedFiles = [...currentFiles];

  for (const file of incomingFiles) {
    if (existingNames.has(file.name)) {
      continue;
    }
    existingNames.add(file.name);
    mergedFiles.push(file);
  }

  return mergedFiles;
};

const MEDIA_COLLECTION = "media";
const MEDIA_ENTITY = "sites" as const;

export interface UploadGeotaggedPhotosProps {
  open: boolean;
  siteUuid: string;
  onOpenChange: (open: boolean) => void;
}

const UploadGeotaggedPhotos: FC<UploadGeotaggedPhotosProps> = ({ open, siteUuid, onOpenChange }) => {
  const t = useT();
  const { format: formatFileSize } = useFileSize();
  const { setShouldRefetchMediaData } = useMapAreaContext();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const filePreviewUrls = useMemo(
    () => new Map(selectedFiles.map(file => [file.name, URL.createObjectURL(file)])),
    [selectedFiles]
  );

  useEffect(() => {
    return () => {
      filePreviewUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [filePreviewUrls]);

  const addFiles = useCallback((files: File[]) => {
    if (files.length === 0) {
      return;
    }
    setSelectedFiles(currentFiles => mergeSelectedFiles(currentFiles, files));
  }, []);

  const handleClose = useCallback(() => {
    onOpenChange(false);
    setSelectedFiles([]);
    setIsDragging(false);
  }, [onOpenChange]);

  const handleFileChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      addFiles(collectAcceptedImageFiles(e.target.files));
      e.target.value = "";
    },
    [addFiles]
  );

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      addFiles(collectAcceptedImageFiles(e.dataTransfer.files));
    },
    [addFiles]
  );

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => setIsDragging(false), []);

  const handleUploadClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleSave = useCallback(async () => {
    if (selectedFiles.length === 0 || siteUuid === "") {
      return;
    }

    setIsUploading(true);
    try {
      const results = await Promise.allSettled(
        selectedFiles.map(async file =>
          uploadFile.fetchParallel({
            pathParams: { entity: MEDIA_ENTITY, collection: MEDIA_COLLECTION, uuid: siteUuid },
            body: { data: { type: "media", attributes: await prepareFileForUpload(file) } }
          })
        )
      );

      const failedCount = results.filter(result => result.status === "rejected").length;
      const successCount = results.length - failedCount;

      if (successCount === 0) {
        showToast({
          label: t("Upload Failed"),
          type: "error",
          placement: "bottom",
          duration: 5000
        });
        return;
      }

      setShouldRefetchMediaData(true);

      if (failedCount > 0) {
        showToast({
          label: t("Partial upload"),
          caption: t("{count} of {total} photos uploaded successfully.", {
            count: successCount,
            total: results.length
          }),
          type: "warning",
          placement: "bottom",
          duration: 5000
        });
      } else {
        showToast({
          label: t("Upload Complete"),
          type: "success",
          placement: "bottom",
          duration: 5000
        });
      }

      handleClose();
    } catch (error) {
      Log.error("Failed to upload geotagged photos:", error);
      showToast({
        label: t("Upload Failed"),
        type: "error",
        placement: "bottom",
        duration: 5000
      });
    } finally {
      setIsUploading(false);
    }
  }, [handleClose, selectedFiles, setShouldRefetchMediaData, siteUuid, t]);

  const hasSelectedFiles = selectedFiles.length > 0;
  const canSave = hasSelectedFiles && siteUuid !== "" && !isUploading;

  return (
    <Modal
      open={open}
      onClose={handleClose}
      size="large"
      header={<b className="text-theme-neutral-800">{t("Upload geotagged photos")}</b>}
      content={
        <Box pl={4} w="full">
          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPTED_FORMATS}
            multiple
            style={{ display: "none" }}
            onChange={handleFileChange}
          />

          {hasSelectedFiles ? (
            <Flex
              flexDirection="column"
              gap={3}
              w="full"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <Flex justifyContent="space-between" alignItems="center" gap={2} w="full" pr={4}>
                <Text textStyle="300-bold" color="neutral.900" display="flex" gap={0.5}>
                  {selectedFiles.length}
                  <Text textStyle="300" color="neutral.700" as="span">
                    {selectedFiles.length === 1 ? t("Photo") : t("Photos")}
                  </Text>
                </Text>
                <Button variant="borderless" size="small" leftIcon={<UploadIcon />} onClick={handleUploadClick}>
                  {t("Click to Upload")}
                </Button>
              </Flex>
              <Box overflow="auto" maxW="100%" h="24.5rem" mr={-4} pr={4}>
                <Grid templateColumns="repeat(3, 1fr)" gap={4} w="full">
                  {selectedFiles.map(file => (
                    <Box key={file.name} w="full" maxW="11.5rem">
                      <GalleryImage
                        alt={file.name}
                        className="!h-[8.75rem] !w-[11.5rem] object-cover"
                        src={filePreviewUrls.get(file.name) ?? ""}
                      />

                      <Text textStyle="300" color="neutral.800" mt={1} w="11.5rem" truncate>
                        {file.name}
                      </Text>

                      <Text textStyle="200" color="neutral.700">
                        {formatFileSize(file.size)}
                      </Text>
                    </Box>
                  ))}
                </Grid>
              </Box>
            </Flex>
          ) : (
            <Box pr={4} w="full">
              <Flex
                flexDirection="column"
                gap={4}
                bg={isDragging ? "primary.100" : "neutral.200"}
                justifyContent="center"
                alignItems="center"
                py={4}
                rounded={2}
                transition="background-color 0.15s ease-in-out"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                <Flex justifyContent="center" alignItems="center" flexDirection="column" gap={0}>
                  <Text color="neutral.900" textStyle="400">
                    {t("Drag and drop your files here or")}
                  </Text>
                  <Button leftIcon={<UploadIcon />} variant="borderless" onClick={handleUploadClick}>
                    {t("Click to upload")}
                  </Button>
                </Flex>

                <Flex justifyContent="center" alignItems="center" flexDirection="column" gap={0}>
                  <Text textStyle="300" color="neutral.700" display="flex" gap={0.5}>
                    {t("Upload JPG or PNG images")}
                    <Text as="span" textStyle="300-bold" color="neutral.700">
                      {t("with location only")}
                    </Text>
                    {t(" (max ")}
                    <Text as="span" textStyle="300-bold" color="neutral.700">
                      {t("XX MB")}
                    </Text>
                    {t(")")}
                  </Text>
                </Flex>
              </Flex>
            </Box>
          )}
        </Box>
      }
      footer={
        <ButtonGroup
          buttons={[
            {
              id: "cancel",
              variant: "secondary",
              children: t("Cancel"),
              onClick: handleClose
            },
            {
              id: "save",
              children: isUploading ? t("Saving...") : t("Save"),
              loading: isUploading,
              disabled: !canSave,
              onClick: () => void handleSave()
            }
          ]}
        />
      }
    />
  );
};

export default UploadGeotaggedPhotos;

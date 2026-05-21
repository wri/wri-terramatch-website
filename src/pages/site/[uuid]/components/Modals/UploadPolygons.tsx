import { Box, Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { ChangeEvent, DragEvent, FC, useCallback, useRef, useState } from "react";

import { useModalScrollFix } from "@/hooks/useModalScrollFix";
import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import ButtonGroup from "@/redesignComponents/actions/Buttons/ButtonGroup/ButtonGroup";
import Modal from "@/redesignComponents/containers/Modal/Modal";
import RadioButtonGroup from "@/redesignComponents/Forms/Actions/RadioButton/Radio";
import { UploadIcon } from "@/redesignComponents/foundations/Icons";

import { UploadMode } from "../../hooks/useUploadPolygons";

const ACCEPTED_FORMATS = ".geojson,.kml,.zip";
const UPLOAD_LIMIT_MB = 50;

export interface UploadPolygonsProps {
  open: boolean;
  siteUuid: string;
  isUploading: boolean;
  onOpenChange: (open: boolean) => void;
  onUpload: (mode: UploadMode, file: File) => void;
}

const UploadPolygons: FC<UploadPolygonsProps> = ({
  open,
  siteUuid: _siteUuid,
  isUploading,
  onOpenChange,
  onUpload
}) => {
  const t = useT();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<UploadMode>("new-polygons");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  useModalScrollFix(open);

  const resetState = useCallback(() => {
    setMode("new-polygons");
    setSelectedFile(null);
    setIsDragging(false);
  }, []);

  const handleClose = useCallback(() => {
    onOpenChange(false);
    resetState();
  }, [onOpenChange, resetState]);

  const handleSave = useCallback(() => {
    if (selectedFile == null) return;
    onUpload(mode, selectedFile);
    onOpenChange(false);
    resetState();
  }, [selectedFile, mode, onUpload, onOpenChange, resetState]);

  const handleFileChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setSelectedFile(file);
    e.target.value = "";
  }, []);

  const handleDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0] ?? null;
    setSelectedFile(file);
  }, []);

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => setIsDragging(false), []);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      size="medium"
      blocking
      header={<b className="text-theme-neutral-800">{t("Upload Polygons")}</b>}
      content={
        <Box px={4}>
          <Text mb={3} textStyle="400-bold" color="neutral.900">
            {t("Choose an upload option:")}
          </Text>
          <RadioButtonGroup
            name="upload-mode"
            value={mode}
            onChange={(_name, value) => setMode(value as UploadMode)}
            options={[
              { label: t("New polygons"), value: "new-polygons" },
              { label: t("Update existing polygons"), value: "update-existing-polygons" }
            ]}
          />
          <Text mt={2} mb={4} textStyle="300" color="neutral.900">
            {t("To update existing polygons, the files must have the original UUID")}
          </Text>

          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPTED_FORMATS}
            style={{ display: "none" }}
            onChange={handleFileChange}
          />

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
              <Button leftIcon={<UploadIcon />} variant="borderless" onClick={() => fileInputRef.current?.click()}>
                {t("Click to upload")}
              </Button>
            </Flex>

            {selectedFile != null && (
              <Text textStyle="300-bold" color="primary.700">
                {selectedFile.name}
              </Text>
            )}

            <Flex justifyContent="center" alignItems="center" flexDirection="column" gap={0}>
              <Text textStyle="300" color="neutral.700">
                {t("Accepted formats: GeoJSON, Shapefile, and KML.")}
              </Text>
              <Text textStyle="300" color="neutral.700" display="flex" gap={0.5}>
                {t("Upload size limit:")}{" "}
                <Text textStyle="300-bold" color="neutral.700">
                  {UPLOAD_LIMIT_MB} MB
                </Text>
                .
              </Text>
            </Flex>
          </Flex>
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
              id: "upload",
              children: isUploading ? t("Uploading...") : t("Upload"),
              disabled: selectedFile == null || isUploading,
              onClick: handleSave
            }
          ]}
        />
      }
    />
  );
};

export default UploadPolygons;

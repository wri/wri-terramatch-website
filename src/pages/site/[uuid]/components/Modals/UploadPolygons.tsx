import { Box, Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { ChangeEvent, DragEvent, FC, useCallback, useRef, useState } from "react";

import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import ButtonGroup from "@/redesignComponents/actions/Buttons/ButtonGroup/ButtonGroup";
import Modal from "@/redesignComponents/containers/Modal/Modal";
import RadioButtonGroup from "@/redesignComponents/Forms/Actions/RadioButton/Radio";
import { UploadIcon } from "@/redesignComponents/foundations/Icons";

import { GeometryUploadComparisonResult, UploadMode, useUploadPolygons } from "../../hooks/useUploadPolygons";
import MatchingPolygonsContent from "./MatchingPolygonsContent";

const ACCEPTED_FORMATS = ".geojson,.kml,.zip";
const UPLOAD_LIMIT_MB = 50;

type UploadStep = "form" | "confirm";

export interface UploadPolygonsProps {
  open: boolean;
  siteUuid: string;
  onOpenChange: (open: boolean) => void;
  onUploadSuccess: () => void;
  onUploadError: () => void;
}

const UploadPolygons: FC<UploadPolygonsProps> = ({ open, siteUuid, onOpenChange, onUploadSuccess, onUploadError }) => {
  const t = useT();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState<UploadStep>("form");
  const [mode, setMode] = useState<UploadMode>("new-polygons");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [comparison, setComparison] = useState<GeometryUploadComparisonResult | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const { uploadNew, compareFile, uploadWithVersions, isComparing } = useUploadPolygons({
    siteUuid,
    onUploadSuccess,
    onError: () => onUploadError()
  });

  const resetState = useCallback(() => {
    setStep("form");
    setMode("new-polygons");
    setSelectedFile(null);
    setComparison(null);
    setIsDragging(false);
  }, []);

  const handleClose = useCallback(() => {
    onOpenChange(false);
    resetState();
  }, [onOpenChange, resetState]);

  const handleBack = useCallback(() => {
    setStep("form");
    setComparison(null);
  }, []);

  const handleUpload = useCallback(async () => {
    if (selectedFile == null) return;

    if (mode === "new-polygons") {
      const file = selectedFile;
      handleClose();
      uploadNew(file);
      return;
    }

    try {
      const result = await compareFile(selectedFile);
      setComparison(result);
      setStep("confirm");
    } catch {
      // Error surfaced via onUploadError.
    }
  }, [selectedFile, mode, uploadNew, compareFile, handleClose]);

  const handleConfirmVersions = useCallback(() => {
    if (selectedFile == null) return;
    const file = selectedFile;
    handleClose();
    uploadWithVersions(file);
  }, [selectedFile, uploadWithVersions, handleClose]);

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

  const isConfirmStep = step === "confirm";
  const isUpdateMode = mode === "update-existing-polygons";
  const hasVersioning = (comparison?.featuresForVersioning ?? 0) > 0;

  const formPrimaryLabel = isComparing ? t("Checking...") : isUpdateMode ? t("Next") : t("Upload");
  const confirmPrimaryLabel = hasVersioning ? t("Create new versions") : t("Upload");

  return (
    <Modal
      open={open}
      onClose={handleClose}
      size="medium"
      header={
        <b className="text-theme-neutral-800">{isConfirmStep ? t("Matching polygons found") : t("Upload Polygons")}</b>
      }
      content={
        isConfirmStep && comparison != null ? (
          <MatchingPolygonsContent siteUuid={siteUuid} comparison={comparison} />
        ) : (
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
                <Flex
                  justifyContent="center"
                  alignItems="center"
                  flexDirection="column"
                  gap={0}
                  bg="neutral.300"
                  px={5}
                  py={2}
                  rounded={2}
                  mt={-2}
                >
                  <Text textStyle="300-bold" color="primary.700">
                    {selectedFile.name}
                  </Text>
                </Flex>
              )}

              <Flex justifyContent="center" alignItems="center" flexDirection="column" gap={0}>
                <Text textStyle="300" color="neutral.700">
                  {t("Accepted formats: GeoJSON, Shapefile, and KML.")}
                </Text>
                <Text textStyle="300" color="neutral.700" display="flex" gap={0.5}>
                  {t("Upload size limit:")}{" "}
                  <Text as="span" textStyle="300-bold" color="neutral.700">
                    {UPLOAD_LIMIT_MB} MB
                  </Text>
                  .
                </Text>
              </Flex>
            </Flex>
          </Box>
        )
      }
      footer={
        <ButtonGroup
          buttons={
            isConfirmStep
              ? [
                  {
                    id: "back",
                    variant: "secondary",
                    children: t("Back"),
                    disabled: isComparing,
                    onClick: handleBack
                  },
                  {
                    id: "create-new-versions",
                    children: confirmPrimaryLabel,
                    onClick: handleConfirmVersions
                  }
                ]
              : [
                  {
                    id: "cancel",
                    variant: "secondary",
                    children: t("Cancel"),
                    disabled: isComparing,
                    onClick: handleClose
                  },
                  {
                    id: "upload",
                    children: formPrimaryLabel,
                    disabled: selectedFile == null || isComparing,
                    onClick: handleUpload
                  }
                ]
          }
        />
      }
    />
  );
};

export default UploadPolygons;

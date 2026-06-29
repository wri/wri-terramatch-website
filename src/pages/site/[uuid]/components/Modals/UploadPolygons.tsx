import { Box, Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { ChangeEvent, DragEvent, FC, useCallback, useRef, useState } from "react";

import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import ButtonGroup from "@/redesignComponents/actions/Buttons/ButtonGroup/ButtonGroup";
import Modal from "@/redesignComponents/containers/Modal/Modal";
import RadioButtonGroup from "@/redesignComponents/Forms/Actions/RadioButton/Radio";
import { UploadIcon } from "@/redesignComponents/foundations/Icons";

import {
  type UploadPolygonsSuccessResult,
  collectAcceptedUploadFiles,
  GeometryUploadComparisonResult,
  UploadMode,
  useUploadPolygons
} from "../../hooks/useUploadPolygons";
import MatchingPolygonsContent from "./MatchingPolygonsContent";

const ACCEPTED_FORMATS = ".geojson,.kml,.zip";
const UPLOAD_LIMIT_MB = 50;

type UploadStep = "form" | "confirm";

export interface UploadPolygonsProps {
  open: boolean;
  siteUuid: string;
  siteHasExistingPolygons?: boolean;
  onOpenChange: (open: boolean) => void;
  onUploadSuccess: (result: UploadPolygonsSuccessResult) => void;
  onUploadError: () => void;
}

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

const UploadPolygons: FC<UploadPolygonsProps> = ({
  open,
  siteUuid,
  siteHasExistingPolygons = false,
  onOpenChange,
  onUploadSuccess,
  onUploadError
}) => {
  const t = useT();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState<UploadStep>("form");
  const [mode, setMode] = useState<UploadMode>("new-polygons");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [comparison, setComparison] = useState<GeometryUploadComparisonResult | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const { uploadNewFiles, compareFiles, uploadWithVersionsFiles, isComparing } = useUploadPolygons({
    siteUuid,
    siteHasExistingPolygons,
    onUploadSuccess,
    onError: () => onUploadError()
  });

  const resetState = useCallback(() => {
    setStep("form");
    setMode("new-polygons");
    setSelectedFiles([]);
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
    if (selectedFiles.length === 0) return;

    if (mode === "new-polygons") {
      const files = selectedFiles;
      handleClose();
      uploadNewFiles(files);
      return;
    }

    try {
      const result = await compareFiles(selectedFiles);
      setComparison(result);
      setStep("confirm");
    } catch {
      // Error surfaced via onUploadError.
    }
  }, [selectedFiles, mode, uploadNewFiles, compareFiles, handleClose]);

  const handleConfirmVersions = useCallback(() => {
    if (selectedFiles.length === 0) return;
    const files = selectedFiles;
    const polygonCount =
      comparison != null && comparison.featuresForVersioning > 0
        ? comparison.featuresForVersioning
        : comparison?.totalFeatures ?? files.length;
    handleClose();
    uploadWithVersionsFiles(files, polygonCount);
  }, [selectedFiles, comparison, uploadWithVersionsFiles, handleClose]);

  const handleFileChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const files = collectAcceptedUploadFiles(e.target.files);
    setSelectedFiles(currentFiles => mergeSelectedFiles(currentFiles, files));
    e.target.value = "";
  }, []);

  const handleDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const files = collectAcceptedUploadFiles(e.dataTransfer.files);
    setSelectedFiles(currentFiles => mergeSelectedFiles(currentFiles, files));
  }, []);

  const handleRemoveFile = useCallback((fileName: string) => {
    setSelectedFiles(currentFiles => currentFiles.filter(file => file.name !== fileName));
  }, []);

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => setIsDragging(false), []);

  const isConfirmStep = step === "confirm";
  const isUpdateMode = mode === "update-existing-polygons";
  const hasVersioning = (comparison?.featuresForVersioning ?? 0) > 0;
  const hasSelectedFiles = selectedFiles.length > 0;

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
              multiple
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

              {hasSelectedFiles && (
                <Flex
                  justifyContent="center"
                  alignItems="stretch"
                  flexDirection="column"
                  gap={2}
                  bg="neutral.300"
                  px={5}
                  py={2}
                  rounded={2}
                  mt={-2}
                  w="full"
                  maxW="24rem"
                >
                  {selectedFiles.map(file => (
                    <Flex key={file.name} justifyContent="space-between" alignItems="center" gap={2}>
                      <Text textStyle="300-bold" color="primary.700" lineClamp={1}>
                        {file.name}
                      </Text>
                      <Button variant="borderless" size="small" onClick={() => handleRemoveFile(file.name)}>
                        {t("Remove")}
                      </Button>
                    </Flex>
                  ))}
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
                    disabled: !hasSelectedFiles || isComparing,
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

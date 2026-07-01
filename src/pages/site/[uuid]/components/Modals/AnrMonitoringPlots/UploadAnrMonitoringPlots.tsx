import { Box, Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { ChangeEvent, DragEvent, FC, useCallback, useRef, useState } from "react";

import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import ButtonGroup from "@/redesignComponents/actions/Buttons/ButtonGroup/ButtonGroup";
import Modal from "@/redesignComponents/containers/Modal/Modal";
import { UploadIcon } from "@/redesignComponents/foundations/Icons";

import { ANR_ACCEPTED_UPLOAD_FORMATS, isAcceptedAnrUploadFile } from "./useAnrMonitoringPlotActions";

type UploadAnrMonitoringPlotsMode = "upload" | "replace";

type UploadAnrMonitoringPlotsProps = {
  isSaving?: boolean;
  mode: UploadAnrMonitoringPlotsMode;
  onOpenChange: (open: boolean) => void;
  onSave: (file: File) => Promise<boolean>;
  open: boolean;
};

const UploadAnrMonitoringPlots: FC<UploadAnrMonitoringPlotsProps> = ({
  isSaving = false,
  mode,
  onOpenChange,
  onSave,
  open
}) => {
  const t = useT();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleClose = useCallback(() => {
    onOpenChange(false);
    setSelectedFile(null);
    setIsDragging(false);
    if (fileInputRef.current != null) {
      fileInputRef.current.value = "";
    }
  }, [onOpenChange]);

  const setFileIfValid = useCallback((file: File | null | undefined) => {
    if (file == null) {
      return;
    }
    if (!isAcceptedAnrUploadFile(file)) {
      return;
    }
    setSelectedFile(file);
  }, []);

  const handleFileChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setFileIfValid(event.target.files?.[0]);
      event.target.value = "";
    },
    [setFileIfValid]
  );

  const handleDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragging(false);
      setFileIfValid(event.dataTransfer.files?.[0]);
    },
    [setFileIfValid]
  );

  const handleSave = useCallback(async () => {
    if (selectedFile == null) {
      return;
    }
    const isSaved = await onSave(selectedFile);
    if (isSaved) {
      handleClose();
    }
  }, [handleClose, onSave, selectedFile]);

  const title = mode === "replace" ? t("Update monitoring plots") : t("Upload monitoring plots");
  const primaryLabel = mode === "replace" ? t("Update") : t("Save");

  return (
    <Modal
      open={open}
      onClose={handleClose}
      size="medium"
      header={<b className="text-theme-neutral-800">{title}</b>}
      content={
        <Box px={4}>
          <Text mb={3} textStyle="400-bold" color="neutral.900">
            {t("Choose your ANR monitoring plot file")}
          </Text>
          <Text mb={4} textStyle="300" color="neutral.700">
            {t("Accepted format: GeoJSON (.geojson)")}
          </Text>

          <input
            ref={fileInputRef}
            type="file"
            accept={ANR_ACCEPTED_UPLOAD_FORMATS}
            style={{ display: "none" }}
            onChange={handleFileChange}
          />

          <Flex
            flexDirection="column"
            gap={4}
            bg={isDragging ? "primary.100" : "neutral.200"}
            justifyContent="center"
            alignItems="center"
            py={6}
            px={4}
            rounded={2}
            transition="background-color 0.15s ease-in-out"
            onDrop={handleDrop}
            onDragOver={event => {
              event.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
          >
            <Flex justifyContent="center" alignItems="center" flexDirection="column" gap={0}>
              <Text color="neutral.900" textStyle="400">
                {t("Drag and drop your file here or")}
              </Text>
              <Button leftIcon={<UploadIcon />} variant="borderless" onClick={() => fileInputRef.current?.click()}>
                {t("Click to upload")}
              </Button>
            </Flex>

            {selectedFile != null ? (
              <Flex
                justifyContent="space-between"
                alignItems="center"
                gap={2}
                bg="neutral.300"
                px={4}
                py={2}
                rounded={2}
                w="full"
              >
                <Text textStyle="300-bold" color="primary.700" lineClamp={1}>
                  {selectedFile.name}
                </Text>
                <Button variant="borderless" size="small" onClick={() => setSelectedFile(null)}>
                  {t("Remove")}
                </Button>
              </Flex>
            ) : null}
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
              disabled: isSaving,
              onClick: handleClose
            },
            {
              id: "save",
              children: isSaving ? t("Saving...") : primaryLabel,
              loading: isSaving,
              disabled: selectedFile == null || isSaving,
              onClick: () => void handleSave()
            }
          ]}
        />
      }
    />
  );
};

export default UploadAnrMonitoringPlots;

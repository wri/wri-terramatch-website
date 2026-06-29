import { Box, Flex, Image, Text, Textarea } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { showToast } from "@worldresources/wri-design-systems";
import React, { FC, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";

import { AuditStatusEntityType, useCreateAuditStatus } from "@/connections/AuditStatus";
import { prepareFileForUpload } from "@/connections/Media";
import { uploadFile } from "@/generated/v3/entityService/entityServiceComponents";
import { AuditStatusDto } from "@/generated/v3/entityService/entityServiceSchemas";
import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import CloseButton from "@/redesignComponents/actions/Buttons/CloseButton/CloseButton";
import IconButton from "@/redesignComponents/actions/Buttons/IconButton/IconButton";
import { AttachFileIcon, SendIcon } from "@/redesignComponents/foundations/Icons";
import Avatar from "@/redesignComponents/navigation/Avatar/Avatar";
import ApiSlice from "@/store/apiSlice";
import Log from "@/utils/log";

const VALID_FILE_TYPES = [
  "application/pdf",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "image/png",
  "image/tiff"
];
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MAX_FILES = 5;
const TEXTAREA_LINE_HEIGHT_REM = 1.5;
const TEXTAREA_MIN_ROWS = 1;
const TEXTAREA_MAX_ROWS = 3;
const TEXTAREA_MIN_HEIGHT = `${TEXTAREA_LINE_HEIGHT_REM * TEXTAREA_MIN_ROWS}rem`;
const TEXTAREA_MAX_HEIGHT = `${TEXTAREA_LINE_HEIGHT_REM * TEXTAREA_MAX_ROWS}rem`;

const FALLBACK_ROOT_FONT_SIZE_PX = 16;
const getRootFontSize = () =>
  parseFloat(getComputedStyle(document.documentElement).fontSize) || FALLBACK_ROOT_FONT_SIZE_PX;

interface CommentInputFile {
  name: string;
  url: string;
  onRemoveFile: () => void;
}

interface CommentInputProps {
  label?: string;
  caption?: string;
  name: string;
  src?: string;
  placeholder?: string;
  isEditing?: boolean;
  defaultIsEditing?: boolean;
  onEditingChange?: (isEditing: boolean) => void;
  files?: CommentInputFile[];
  onCancel?: () => void;
  onCancelEditing?: () => void;
  onSaveEditing?: () => void;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onAttachFile?: () => void;
  onSend?: () => void;
  auditEntity?: AuditStatusEntityType;
  auditEntityUuid?: string;
  auditEntityStatus?: string | null;
  onCommentCreated?: () => void;
  showOptionalLabel?: boolean;
  showSendIcon?: boolean;
  showAttachFileIcon?: boolean;
  className?: string;
}

const CommentInput: FC<CommentInputProps> = (props: CommentInputProps) => {
  const {
    label,
    caption,
    name,
    src,
    placeholder,
    isEditing,
    defaultIsEditing = false,
    onEditingChange,
    files,
    value,
    defaultValue = "",
    onValueChange,
    onChange,
    onAttachFile,
    onSend,
    onCancelEditing,
    onSaveEditing,
    auditEntity,
    auditEntityUuid,
    auditEntityStatus,
    onCommentCreated,
    showOptionalLabel = false,
    showSendIcon = true,
    showAttachFileIcon = true,
    className
  } = props;

  const t = useT();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [internalIsEditing, setInternalIsEditing] = useState(defaultIsEditing);
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [error, setError] = useState("");
  const [isUploadingFiles, setIsUploadingFiles] = useState(false);

  const isAuditMode = auditEntity != null && auditEntityUuid != null && auditEntityUuid !== "";

  const isEditingControlled = isEditing !== undefined;
  const currentIsEditing = isEditingControlled ? isEditing : internalIsEditing;
  const isValueControlled = value !== undefined;
  const currentValue = isValueControlled ? value : internalValue;

  const pendingFileUrlsRef = useRef<Map<File, string>>(new Map());

  const getPendingFileUrl = useCallback((file: File): string => {
    const existingUrl = pendingFileUrlsRef.current.get(file);
    if (existingUrl != null) {
      return existingUrl;
    }

    const nextUrl = URL.createObjectURL(file);
    pendingFileUrlsRef.current.set(file, nextUrl);
    return nextUrl;
  }, []);

  const revokePendingFileUrl = useCallback((file: File) => {
    const fileUrl = pendingFileUrlsRef.current.get(file);
    if (fileUrl != null) {
      URL.revokeObjectURL(fileUrl);
      pendingFileUrlsRef.current.delete(file);
    }
  }, []);

  useEffect(() => {
    const pendingFileUrls = pendingFileUrlsRef.current;
    return () => {
      pendingFileUrls.forEach(fileUrl => URL.revokeObjectURL(fileUrl));
      pendingFileUrls.clear();
    };
  }, []);

  const removePendingFile = useCallback(
    (file: File) => {
      revokePendingFileUrl(file);
      setPendingFiles(currentFiles => currentFiles.filter(currentFile => currentFile !== file));
    },
    [revokePendingFileUrl]
  );

  const pendingFileDisplay = useMemo<CommentInputFile[]>(
    () =>
      pendingFiles.map(file => ({
        name: file.name,
        url: getPendingFileUrl(file),
        onRemoveFile: () => removePendingFile(file)
      })),
    [getPendingFileUrl, pendingFiles, removePendingFile]
  );

  const resetAuditInput = useCallback(() => {
    if (!isValueControlled) {
      setInternalValue("");
    }
    onValueChange?.("");
    pendingFiles.forEach(revokePendingFileUrl);
    setPendingFiles([]);
    setError("");
    if (fileInputRef.current != null) {
      fileInputRef.current.value = "";
    }
  }, [isValueControlled, onValueChange, pendingFiles, revokePendingFileUrl]);

  const onAuditCommentSuccess = useCallback(
    async (createdAuditStatus: AuditStatusDto) => {
      try {
        if (pendingFiles.length > 0) {
          setIsUploadingFiles(true);
          await Promise.all(
            pendingFiles.map(async file =>
              uploadFile.fetchParallel({
                pathParams: { entity: "auditStatuses", collection: "attachments", uuid: createdAuditStatus.uuid },
                body: { data: { type: "media", attributes: await prepareFileForUpload(file) } }
              })
            )
          );
        }

        showToast({
          label: t("Your comment was just added!"),
          type: "success",
          placement: "bottom",
          duration: 5000,
          maxWidth: "auto"
        });
        resetAuditInput();
        ApiSlice.pruneCache("auditStatuses");
        onCommentCreated?.();
      } catch (uploadError) {
        showToast({
          label: t("Failed to upload files. Your comment was added but files may be missing."),
          type: "error",
          placement: "bottom",
          duration: 5000,
          maxWidth: "auto"
        });
        Log.error("Error uploading files after comment creation", uploadError);
        resetAuditInput();
        ApiSlice.pruneCache("auditStatuses");
        onCommentCreated?.();
      } finally {
        setIsUploadingFiles(false);
      }
    },
    [onCommentCreated, pendingFiles, resetAuditInput, t]
  );

  const { create: sendAuditComment, isCreating } = useCreateAuditStatus(
    {
      entity: auditEntity ?? "sitePolygons",
      uuid: auditEntityUuid ?? ""
    },
    onAuditCommentSuccess,
    t("Failed to add comment. Please try again.")
  );

  const setEditingState = useCallback(
    (nextIsEditing: boolean) => {
      if (!isEditingControlled) {
        setInternalIsEditing(nextIsEditing);
      }
      onEditingChange?.(nextIsEditing);
    },
    [isEditingControlled, onEditingChange]
  );

  const handleCancelEditing = useCallback(() => {
    onCancelEditing?.();
    setEditingState(false);
  }, [onCancelEditing, setEditingState]);

  const handleSaveEditing = useCallback(() => {
    onSaveEditing?.();
    setEditingState(false);
  }, [onSaveEditing, setEditingState]);

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file == null) {
        return;
      }

      if (pendingFiles.length >= MAX_FILES) {
        setError(t("You can upload a maximum of 5 files."));
        return;
      }

      if (!VALID_FILE_TYPES.includes(file.type)) {
        setError(t("Invalid file type. Only PDF, XLS, DOC, XLSX, DOCX, JPG, PNG, and TIFF are allowed."));
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        setError(t("File size must be less than 10MB."));
        return;
      }

      setPendingFiles(currentFiles => [...currentFiles, file]);
      setError("");
      event.target.value = "";
    },
    [pendingFiles.length, t]
  );

  const handleAttachFile = useCallback(() => {
    if (currentIsEditing) {
      onAttachFile?.();
      return;
    }

    if (isAuditMode) {
      fileInputRef.current?.click();
      return;
    }

    onAttachFile?.();
  }, [currentIsEditing, isAuditMode, onAttachFile]);

  const submitAuditComment = useCallback(() => {
    if (!isAuditMode) {
      return;
    }

    const trimmedComment = currentValue.trim();
    if (trimmedComment === "" && pendingFiles.length === 0) {
      setError(t("Please enter a message or attach a file."));
      return;
    }

    setError("");
    sendAuditComment({
      type: "comment",
      comment: trimmedComment,
      status: auditEntityStatus ?? null
    });
  }, [auditEntityStatus, currentValue, isAuditMode, pendingFiles.length, sendAuditComment, t]);

  const handleSend = useCallback(() => {
    if (currentIsEditing) {
      return;
    }

    if (isAuditMode) {
      submitAuditComment();
      return;
    }

    onSend?.();
  }, [currentIsEditing, isAuditMode, onSend, submitAuditComment]);

  const effectiveFiles = files ?? (isAuditMode ? pendingFileDisplay : undefined);
  const hasFiles = (effectiveFiles?.length ?? 0) > 0;
  const hasContent = currentValue.trim().length > 0;
  const isSubmitting = isCreating || isUploadingFiles;
  const shouldShowSendIcon = showSendIcon && !currentIsEditing && (isAuditMode ? hasContent || hasFiles : !hasFiles);

  const adjustTextareaHeight = useCallback((target?: HTMLTextAreaElement | null) => {
    const textarea = target ?? textareaRef.current;
    if (!textarea) return;

    const rootFontSize = getRootFontSize();
    const computedStyles = getComputedStyle(textarea);
    const lineHeightPx = parseFloat(computedStyles.lineHeight) || TEXTAREA_LINE_HEIGHT_REM * rootFontSize;
    const lineHeightRem = lineHeightPx / rootFontSize;
    const chromeHeightRem =
      (parseFloat(computedStyles.paddingTop) +
        parseFloat(computedStyles.paddingBottom) +
        parseFloat(computedStyles.borderTopWidth) +
        parseFloat(computedStyles.borderBottomWidth)) /
      rootFontSize;
    const minHeightRem = lineHeightRem * TEXTAREA_MIN_ROWS + chromeHeightRem;
    const maxHeightRem = lineHeightRem * TEXTAREA_MAX_ROWS + chromeHeightRem;

    textarea.style.height = "auto";
    const scrollHeightRem = textarea.scrollHeight / rootFontSize;
    const nextHeightRem = Math.min(Math.max(scrollHeightRem, minHeightRem), maxHeightRem);

    textarea.style.height = `${nextHeightRem}rem`;
    textarea.style.overflowY = scrollHeightRem > maxHeightRem ? "auto" : "hidden";
  }, []);

  useLayoutEffect(() => {
    adjustTextareaHeight();
  }, [currentValue, adjustTextareaHeight]);

  return (
    <Flex className={twMerge("w-full flex-col gap-2", className)}>
      <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileChange} />
      {label && (
        <Text textStyle="400-bold" color="primary.900">
          {label}
          {showOptionalLabel && (
            <Text as="span" textStyle="300" color="neutral.700">
              {" "}
              {"(optional)"}
            </Text>
          )}
        </Text>
      )}
      {caption && (
        <Text textStyle="400" color="neutral.900">
          {caption}
        </Text>
      )}
      <Flex className="items-start gap-3">
        <Avatar size="small" className="mt-3" name={name} src={src} />
        <Box
          className="w-full"
          bg="neutral.100"
          border="0.063rem solid"
          borderColor="neutral.400"
          borderRadius="0.25rem"
          boxShadow="0 0.063rem 0.063rem 0 rgba(0, 0, 0, 0.05)"
          p={3}
          display="flex"
          flexDirection="column"
          position="relative"
        >
          <Textarea
            ref={textareaRef}
            value={currentValue}
            wrap="soft"
            rows={TEXTAREA_MIN_ROWS}
            onChange={event => {
              const nextValue = event.target.value;

              if (!isValueControlled) {
                setInternalValue(nextValue);
              }

              onValueChange?.(nextValue);
              onChange?.(event);
              adjustTextareaHeight(event.currentTarget);
            }}
            placeholder={placeholder}
            resize="none"
            disabled={isSubmitting}
            w="100%"
            maxW="100%"
            minW={0}
            minH={TEXTAREA_MIN_HEIGHT}
            maxH={TEXTAREA_MAX_HEIGHT}
            p={0}
            border="none"
            outline="none"
            boxShadow="none"
            bg="transparent"
            color="neutral.800"
            fontSize="400"
            lineHeight="600"
            whiteSpace="pre-wrap"
            overflowWrap="anywhere"
            wordBreak="break-word"
            overflowX="hidden"
            _placeholder={{ color: "neutral.800" }}
            _focus={{ border: "none", boxShadow: "none", outline: "none" }}
            _focusVisible={{ border: "none", boxShadow: "none", outline: "none" }}
            _disabled={{ opacity: 0.6, cursor: "not-allowed" }}
          />

          <Flex className="items-start justify-between gap-2">
            {hasFiles && (
              <Flex className="mt-3 flex-wrap gap-3">
                {effectiveFiles?.map(file => (
                  <Box key={file.name} position="relative" h="4.6875rem" w="5.625rem">
                    <Image
                      border="0.063rem solid"
                      borderColor="neutral.300"
                      borderRadius="0.25rem"
                      src={file.url}
                      alt={file.name}
                      className="h-full w-full object-cover"
                    />
                    {(currentIsEditing || isAuditMode) && (
                      <CloseButton
                        className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 !rounded-full"
                        onClick={file.onRemoveFile}
                      />
                    )}
                  </Box>
                ))}
              </Flex>
            )}
            <Flex className="mt-auto ml-auto shrink-0 items-center gap-1">
              {showAttachFileIcon && (
                <IconButton icon={<AttachFileIcon color="neutral.500" />} onClick={handleAttachFile} />
              )}
              {shouldShowSendIcon && <IconButton icon={<SendIcon color="neutral.500" />} onClick={handleSend} />}
            </Flex>
          </Flex>
        </Box>
      </Flex>
      {error && (
        <Text textStyle="200" color="red.500">
          {error}
        </Text>
      )}
      {currentIsEditing && (
        <Flex className="items-center justify-end gap-2">
          <Button variant="secondary" size="small" className="w-fit" onClick={handleCancelEditing}>
            Cancel
          </Button>
          <Button size="small" className="w-fit" onClick={handleSaveEditing}>
            Save
          </Button>
        </Flex>
      )}
    </Flex>
  );
};

export default CommentInput;

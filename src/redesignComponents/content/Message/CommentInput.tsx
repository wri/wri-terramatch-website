import { Box, Flex, Image, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import classNames from "classnames";
import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";

import { AuditStatusEntityType, useCreateAuditStatus } from "@/connections/AuditStatus";
import { prepareFileForUpload } from "@/connections/Media";
import { useNotificationContext } from "@/context/notification.provider";
import { uploadFile } from "@/generated/v3/entityService/entityServiceComponents";
import { AuditStatusDto } from "@/generated/v3/entityService/entityServiceSchemas";
import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import CloseButton from "@/redesignComponents/actions/Buttons/CloseButton/CloseButton";
import IconButton from "@/redesignComponents/actions/Buttons/IconButton/IconButton";
import Textarea from "@/redesignComponents/Forms/Inputs/Textarea";
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

interface CommentInputFile {
  name: string;
  url: string;
  onRemoveFile: () => void;
}

interface CommentInputProps {
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
}

const CommentInput: FC<CommentInputProps> = (props: CommentInputProps) => {
  const {
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
    onCommentCreated
  } = props;

  const t = useT();
  const { openNotification } = useNotificationContext();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [internalIsEditing, setInternalIsEditing] = useState(defaultIsEditing);
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [isFocused, setIsFocused] = useState(false);
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

        openNotification("success", t("Success!"), t("Your comment was just added!"));
        resetAuditInput();
        ApiSlice.pruneCache("auditStatuses");
        onCommentCreated?.();
      } catch (uploadError) {
        openNotification(
          "error",
          t("Error!"),
          t("Failed to upload files. Your comment was added but files may be missing.")
        );
        Log.error("Error uploading files after comment creation", uploadError);
        resetAuditInput();
        ApiSlice.pruneCache("auditStatuses");
        onCommentCreated?.();
      } finally {
        setIsUploadingFiles(false);
      }
    },
    [onCommentCreated, openNotification, pendingFiles, resetAuditInput, t]
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
  const isTextareaExpanded = currentIsEditing || isFocused;
  const shouldShowSendIcon = !currentIsEditing && (isAuditMode ? hasContent || hasFiles : !hasFiles);

  return (
    <Flex className="w-full flex-col gap-2">
      <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileChange} />
      <Flex className="items-start gap-3">
        <Avatar size="small" name={name} src={src} className="mt-2" />
        <div className="relative w-full">
          <Textarea
            value={currentValue}
            onChange={event => {
              const nextValue = event.target.value;

              if (!isValueControlled) {
                setInternalValue(nextValue);
              }

              onValueChange?.(nextValue);
              onChange?.(event as React.ChangeEvent<HTMLTextAreaElement>);
            }}
            placeholder={placeholder}
            resize="none"
            disabled={isSubmitting}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={classNames("transition-[max-height] duration-200 ease-out", {
              "max-h-[3.125rem]": !isTextareaExpanded,
              "max-h-[9.375rem]": isTextareaExpanded
            })}
          />
          <Flex className="absolute top-0 right-0 -translate-x-[0.5rem] translate-y-[1rem] items-center gap-1">
            <IconButton
              icon={<AttachFileIcon color="neutral.500" />}
              disabled={isSubmitting}
              onClick={handleAttachFile}
            />
            {shouldShowSendIcon && (
              <IconButton icon={<SendIcon color="neutral.500" />} disabled={isSubmitting} onClick={handleSend} />
            )}
          </Flex>
        </div>
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
      {effectiveFiles?.map(file => (
        <Flex key={file.name} className="flex-col gap-2">
          <Box className="relative h-[8.75rem] w-[10.625rem]">
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
        </Flex>
      ))}
    </Flex>
  );
};

export default CommentInput;

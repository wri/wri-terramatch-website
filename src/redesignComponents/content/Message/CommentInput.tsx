import { Box, Flex, Image, Textarea } from "@chakra-ui/react";
import React, { FC, useCallback, useLayoutEffect, useRef, useState } from "react";

import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import CloseButton from "@/redesignComponents/actions/Buttons/CloseButton/CloseButton";
import IconButton from "@/redesignComponents/actions/Buttons/IconButton/IconButton";
import { AttachFileIcon, SendIcon } from "@/redesignComponents/foundations/Icons";
import Avatar from "@/redesignComponents/navigation/Avatar/Avatar";

interface CommentInputProps {
  name: string;
  src?: string;
  placeholder?: string;
  isEditing?: boolean;
  defaultIsEditing?: boolean;
  onEditingChange?: (isEditing: boolean) => void;
  files?: { name: string; url: string; onRemoveFile: () => void }[];
  onCancel?: () => void;
  onCancelEditing?: () => void;
  onSaveEditing?: () => void;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onAttachFile?: () => void;
  onSend?: () => void;
}

const TEXTAREA_LINE_HEIGHT_REM = 1.5;
const TEXTAREA_MIN_ROWS = 1;
const TEXTAREA_MAX_ROWS = 3;
const TEXTAREA_MIN_HEIGHT = `${TEXTAREA_LINE_HEIGHT_REM * TEXTAREA_MIN_ROWS}rem`;
const TEXTAREA_MAX_HEIGHT = `${TEXTAREA_LINE_HEIGHT_REM * TEXTAREA_MAX_ROWS}rem`;

const getRootFontSize = () => parseFloat(getComputedStyle(document.documentElement).fontSize);

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
    onSaveEditing
  } = props;
  const [internalIsEditing, setInternalIsEditing] = useState(defaultIsEditing);
  const [internalValue, setInternalValue] = useState(defaultValue);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isEditingControlled = isEditing !== undefined;
  const currentIsEditing = isEditingControlled ? isEditing : internalIsEditing;
  const isValueControlled = value !== undefined;
  const currentValue = isValueControlled ? value : internalValue;

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

  const hasFiles = (files?.length ?? 0) > 0;
  const shouldShowSendIcon = !currentIsEditing;

  const adjustTextareaHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const rootFontSize = getRootFontSize();
    const minHeightRem = TEXTAREA_LINE_HEIGHT_REM * TEXTAREA_MIN_ROWS;
    const maxHeightRem = TEXTAREA_LINE_HEIGHT_REM * TEXTAREA_MAX_ROWS;

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
    <Flex className="flex-col gap-2">
      <Flex className="items-center gap-3">
        <Avatar size="small" name={name} src={src} />
        <Box
          className="w-full"
          bg="neutral.100"
          border="0.063rem solid"
          borderColor="neutral.700"
          borderRadius="0.25rem"
          boxShadow="0 0.063rem 0.063rem 0 rgba(0, 0, 0, 0.05)"
          p={3}
          display="flex"
          flexDirection="column"
          gap={3}
        >
          <Flex className="items-start justify-between gap-2">
            <Textarea
              ref={textareaRef}
              value={currentValue}
              rows={TEXTAREA_MIN_ROWS}
              onChange={event => {
                const nextValue = event.target.value;

                if (!isValueControlled) {
                  setInternalValue(nextValue);
                }

                onValueChange?.(nextValue);
                onChange?.(event);
                adjustTextareaHeight();
              }}
              placeholder={placeholder}
              resize="none"
              flex={1}
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
              overflowY="hidden"
              _placeholder={{ color: "neutral.800" }}
              _focus={{ border: "none", boxShadow: "none", outline: "none" }}
              _focusVisible={{ border: "none", boxShadow: "none", outline: "none" }}
            />
            <Flex className="mt-auto shrink-0 items-center gap-1">
              <IconButton icon={<AttachFileIcon color="neutral.500" />} onClick={onAttachFile} />
              {shouldShowSendIcon && <IconButton icon={<SendIcon color="neutral.500" />} onClick={onSend} />}
            </Flex>
          </Flex>
          {hasFiles && (
            <Flex className="flex-wrap gap-3">
              {files?.map(file => (
                <Box key={file.name} position="relative" h="4.6875rem" w="5.625rem">
                  <Image
                    border="0.063rem solid"
                    borderColor="neutral.300"
                    borderRadius="0.25rem"
                    src={file.url}
                    alt={file.name}
                    className="h-full w-full object-cover"
                  />
                  {currentIsEditing && (
                    <CloseButton
                      className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 !rounded-full"
                      onClick={file.onRemoveFile}
                    />
                  )}
                </Box>
              ))}
            </Flex>
          )}
        </Box>
      </Flex>
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

import { Box, Flex, Image } from "@chakra-ui/react";
import classNames from "classnames";
import React, { FC, useCallback, useState } from "react";

import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import CloseButton from "@/redesignComponents/actions/Buttons/CloseButton/CloseButton";
import IconButton from "@/redesignComponents/actions/Buttons/IconButton/IconButton";
import Textarea from "@/redesignComponents/Forms/Inputs/Textarea";
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
  const [isFocused, setIsFocused] = useState(false);

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
  const shouldShowSendIcon = !currentIsEditing && !hasFiles;
  const isTextareaExpanded = currentIsEditing || isFocused;

  return (
    <Flex className="flex-col gap-2">
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
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={classNames("transition-[max-height] duration-200 ease-out", {
              "max-h-[3.125rem]": !isTextareaExpanded,
              "max-h-[9.375rem]": isTextareaExpanded
            })}
          />
          <Flex className="absolute top-0 right-0 -translate-x-[0.5rem] translate-y-[1rem] items-center gap-1">
            <IconButton icon={<AttachFileIcon color="neutral.500" />} onClick={onAttachFile} />
            {shouldShowSendIcon && <IconButton icon={<SendIcon color="neutral.500" />} onClick={onSend} />}
          </Flex>
        </div>
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
      {files &&
        files.map(file => (
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
              {currentIsEditing && (
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

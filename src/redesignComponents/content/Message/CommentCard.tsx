import { Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import NextImage from "next/image";
import { FC, useCallback, useMemo, useState } from "react";
import { twMerge } from "tailwind-merge";

import IconButton from "@/redesignComponents/actions/Buttons/IconButton/IconButton";
import MenuCustom from "@/redesignComponents/actions/Buttons/Menu/MenuCustom";
import type { MenuItemOption } from "@/redesignComponents/actions/Buttons/Menu/MenuCustom.types";
import CommentInput from "@/redesignComponents/content/Message/CommentInput";
import { CommentIcon, MoreVertIcon, UnreadIcon } from "@/redesignComponents/foundations/Icons";
import Avatar from "@/redesignComponents/navigation/Avatar/Avatar";

export type CommentCardParticipantType = "other-user" | "current-user" | "empty";
export type CommentCardState = "view" | "edit";

export interface CommentCardAttachment {
  name: string;
  url: string;
  onRemoveFile?: () => void;
}

interface CommentCardProps {
  participantType?: CommentCardParticipantType;
  state?: CommentCardState;
  authorName?: string;
  createdAt?: string;
  message?: string;
  avatarSrc?: string;
  attachments?: CommentCardAttachment[];
  showUnreadIcon?: boolean;
  showContextOptions?: boolean;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onAttachFile?: () => void;
  onSend?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onMarkRead?: () => void;
  onCancelEditing?: () => void;
  onSaveEditing?: () => void;
  className?: string;
}

const CommentCard: FC<CommentCardProps> = ({
  participantType = "other-user",
  state = "view",
  authorName: authorNameProp,
  createdAt: createdAtProp,
  message = "",
  avatarSrc,
  attachments = [],
  showUnreadIcon = true,
  showContextOptions = true,
  value,
  defaultValue = "",
  onValueChange,
  onChange,
  onAttachFile,
  onSend,
  onEdit,
  onDelete,
  onMarkRead,
  onCancelEditing,
  onSaveEditing,
  className
}) => {
  const t = useT();
  const authorName = authorNameProp ?? t("Name Surname");
  const createdAt = createdAtProp ?? t("dd/mm/yyyy");
  const [internalValue, setInternalValue] = useState(defaultValue);
  const isValueControlled = value != null;
  const currentValue = isValueControlled ? value : internalValue;

  const isEmpty = participantType === "empty";
  const isCurrentUser = participantType === "current-user";
  const hasAttachments = attachments.length > 0;

  const contextMenuItems = useMemo<MenuItemOption[]>(() => {
    if (participantType === "current-user") {
      return [
        { label: t("Edit"), value: "edit", onClick: onEdit },
        { label: t("Delete"), value: "delete", onClick: onDelete }
      ];
    }

    return [
      { label: t("Mark Read"), value: "mark-read", onClick: onMarkRead },
      { label: t("Delete"), value: "delete", onClick: onDelete }
    ];
  }, [onDelete, onEdit, onMarkRead, participantType, t]);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      const nextValue = event.target.value;
      if (!isValueControlled) {
        setInternalValue(nextValue);
      }
      onValueChange?.(nextValue);
      onChange?.(event);
    },
    [isValueControlled, onChange, onValueChange]
  );

  if (isEmpty) {
    return (
      <Flex className="items-center gap-3 bg-theme-neutral-100 px-6 py-5">
        <CommentIcon color="neutral.600" boxSize={5} />
        <Text textStyle="600-bold" color="neutral.900">
          {t("No comments yet.")}
        </Text>
      </Flex>
    );
  }

  return (
    <Flex
      className={twMerge(
        "flex-col gap-2 bg-theme-neutral-100 px-6 py-5",
        isCurrentUser && "bg-theme-primary-100",
        className
      )}
      position="relative"
    >
      {state === "view" && (
        <Flex className="items-start gap-2">
          <Avatar size="small" name={authorName} src={avatarSrc} />
          <Flex className="min-w-0 flex-1 flex-col">
            <Text textStyle="400-bold" color="neutral.900">
              {authorName}
            </Text>
            <Text textStyle="200" color="neutral.700">
              {createdAt}
            </Text>
          </Flex>
          <Flex className="items-center gap-2">
            {!isCurrentUser && showUnreadIcon && (
              <IconButton
                variant="borderless"
                className="!h-6 !w-6 !bg-transparent hover:!bg-theme-primary-500/20"
                icon={<UnreadIcon color="neutral.900" boxSize={4} />}
                onClick={onMarkRead}
                aria-label={t("Mark as read")}
              />
            )}
            {showContextOptions && (
              <MenuCustom
                label={t("Comment options")}
                items={contextMenuItems}
                customTrigger={
                  <IconButton
                    variant="borderless"
                    className="!h-6 !w-6 !bg-transparent hover:!bg-theme-primary-500/20"
                    icon={<MoreVertIcon color="primary.800" boxSize={4} />}
                  />
                }
              />
            )}
          </Flex>
        </Flex>
      )}

      {state === "view" ? (
        <Flex className="flex-col gap-4">
          <Text textStyle="300" color="neutral.900">
            {message}
          </Text>
          {hasAttachments && (
            <Flex className="flex-wrap gap-3">
              {attachments.map(file => (
                <NextImage
                  key={file.url}
                  src={file.url}
                  alt={file.name}
                  width={170}
                  height={140}
                  unoptimized
                  className="h-[8.75rem] w-[10.625rem] rounded border border-theme-neutral-300 object-cover"
                />
              ))}
            </Flex>
          )}
        </Flex>
      ) : (
        <CommentInput
          name={authorName}
          src={avatarSrc}
          value={currentValue}
          onChange={handleChange}
          onValueChange={onValueChange}
          isEditing
          files={attachments.map(file => ({
            name: file.name,
            url: file.url,
            onRemoveFile: file.onRemoveFile ?? (() => {})
          }))}
          onAttachFile={onAttachFile}
          onSend={onSend}
          onCancelEditing={onCancelEditing}
          onSaveEditing={onSaveEditing}
        />
      )}
    </Flex>
  );
};

export default CommentCard;

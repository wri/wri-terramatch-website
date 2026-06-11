import { Flex, Spinner } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";

import { deleteAuditStatusAsync, updateAuditStatusAsync, useAuditStatuses } from "@/connections/AuditStatus";
import { deleteMedia, prepareFileForUpload } from "@/connections/Media";
import { useMyUser } from "@/connections/User";
import { useNotificationContext } from "@/context/notification.provider";
import { uploadFile } from "@/generated/v3/entityService/entityServiceComponents";
import { AuditStatusDto } from "@/generated/v3/entityService/entityServiceSchemas";
import CommentCard, { CommentCardAttachment } from "@/redesignComponents/content/Message/CommentCard";
import CommentInput from "@/redesignComponents/content/Message/CommentInput";
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

interface PolygonCommentContentProps {
  polygonUuid?: string;
  polygonStatus?: string | null;
}

type ExistingDraftAttachment = {
  uuid: string;
  name: string;
  url: string;
};

const formatAuthorName = (firstName?: string | null, lastName?: string | null): string =>
  firstName == null && lastName == null ? "Unknown User" : `${firstName ?? ""} ${lastName ?? ""}`.trim();

const formatCommentDate = (dateCreated: string | null): string => {
  if (dateCreated == null) {
    return "";
  }

  const date = new Date(dateCreated);
  const day = date.getUTCDate().toString().padStart(2, "0");
  const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
  const year = date.getUTCFullYear();

  return `${day}/${month}/${year}`;
};

const isCommentByCurrentUser = (
  comment: AuditStatusDto,
  currentUser?: { firstName?: string | null; lastName?: string | null }
): boolean => {
  if (currentUser == null) {
    return false;
  }

  return comment.firstName === currentUser.firstName && comment.lastName === currentUser.lastName;
};

const mapCommentAttachments = (comment: AuditStatusDto): ExistingDraftAttachment[] =>
  comment.attachments
    ?.filter(attachment => attachment.url != null)
    .map(attachment => ({
      uuid: attachment.uuid,
      name: attachment.fileName ?? attachment.uuid,
      url: attachment.url!
    })) ?? [];

const PolygonCommentContent: FC<PolygonCommentContentProps> = ({ polygonUuid = "", polygonStatus }) => {
  const t = useT();
  const { openNotification } = useNotificationContext();
  const [, { user }] = useMyUser();
  const editFileInputRef = useRef<HTMLInputElement>(null);

  const [editingCommentUuid, setEditingCommentUuid] = useState<string | null>(null);
  const [draftMessage, setDraftMessage] = useState("");
  const [draftAttachments, setDraftAttachments] = useState<ExistingDraftAttachment[]>([]);
  const [originalAttachments, setOriginalAttachments] = useState<ExistingDraftAttachment[]>([]);
  const [pendingEditFiles, setPendingEditFiles] = useState<File[]>([]);
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  const pendingEditFileUrlsRef = useRef<Map<File, string>>(new Map());

  const hasValidPolygonUuid = polygonUuid !== "";

  const [isLoaded, { data: auditStatusesData, refetch }] = useAuditStatuses({
    entity: "sitePolygons",
    uuid: polygonUuid,
    enabled: hasValidPolygonUuid
  });

  const comments = useMemo(() => {
    if (auditStatusesData == null) {
      return [];
    }

    return auditStatusesData.filter(audit => audit.type === "comment");
  }, [auditStatusesData]);

  const getPendingEditFileUrl = useCallback((file: File): string => {
    const existingUrl = pendingEditFileUrlsRef.current.get(file);
    if (existingUrl != null) {
      return existingUrl;
    }

    const nextUrl = URL.createObjectURL(file);
    pendingEditFileUrlsRef.current.set(file, nextUrl);
    return nextUrl;
  }, []);

  const revokePendingEditFileUrl = useCallback((file: File) => {
    const fileUrl = pendingEditFileUrlsRef.current.get(file);
    if (fileUrl != null) {
      URL.revokeObjectURL(fileUrl);
      pendingEditFileUrlsRef.current.delete(file);
    }
  }, []);

  useEffect(() => {
    const pendingEditFileUrls = pendingEditFileUrlsRef.current;
    return () => {
      pendingEditFileUrls.forEach(fileUrl => URL.revokeObjectURL(fileUrl));
      pendingEditFileUrls.clear();
    };
  }, []);

  const resetEditingState = useCallback(() => {
    pendingEditFiles.forEach(revokePendingEditFileUrl);
    setEditingCommentUuid(null);
    setDraftMessage("");
    setDraftAttachments([]);
    setOriginalAttachments([]);
    setPendingEditFiles([]);
    if (editFileInputRef.current != null) {
      editFileInputRef.current.value = "";
    }
  }, [pendingEditFiles, revokePendingEditFileUrl]);

  const handleStartEditing = useCallback((comment: AuditStatusDto) => {
    const attachments = mapCommentAttachments(comment);
    setEditingCommentUuid(comment.uuid);
    setDraftMessage(comment.comment ?? "");
    setDraftAttachments(attachments);
    setOriginalAttachments(attachments);
    setPendingEditFiles([]);
    if (editFileInputRef.current != null) {
      editFileInputRef.current.value = "";
    }
  }, []);

  const handleEditFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file == null) {
        return;
      }

      const totalFiles = draftAttachments.length + pendingEditFiles.length;
      if (totalFiles >= MAX_FILES) {
        openNotification("error", t("Error!"), t("You can upload a maximum of 5 files."));
        return;
      }

      if (!VALID_FILE_TYPES.includes(file.type)) {
        openNotification(
          "error",
          t("Error!"),
          t("Invalid file type. Only PDF, XLS, DOC, XLSX, DOCX, JPG, PNG, and TIFF are allowed.")
        );
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        openNotification("error", t("Error!"), t("File size must be less than 10MB."));
        return;
      }

      setPendingEditFiles(currentFiles => [...currentFiles, file]);
      event.target.value = "";
    },
    [draftAttachments.length, openNotification, pendingEditFiles.length, t]
  );

  const handleRemoveDraftAttachment = useCallback((attachmentUrl: string) => {
    setDraftAttachments(currentAttachments =>
      currentAttachments.filter(attachment => attachment.url !== attachmentUrl)
    );
  }, []);

  const handleRemovePendingEditFile = useCallback(
    (file: File) => {
      revokePendingEditFileUrl(file);
      setPendingEditFiles(currentFiles => currentFiles.filter(currentFile => currentFile !== file));
    },
    [revokePendingEditFileUrl]
  );

  const getEditAttachments = useCallback((): CommentCardAttachment[] => {
    return [
      ...draftAttachments.map(attachment => ({
        name: attachment.name,
        url: attachment.url,
        onRemoveFile: () => handleRemoveDraftAttachment(attachment.url)
      })),
      ...pendingEditFiles.map(file => ({
        name: file.name,
        url: getPendingEditFileUrl(file),
        onRemoveFile: () => handleRemovePendingEditFile(file)
      }))
    ];
  }, [
    draftAttachments,
    getPendingEditFileUrl,
    handleRemoveDraftAttachment,
    handleRemovePendingEditFile,
    pendingEditFiles
  ]);

  const uploadCommentAttachments = useCallback(async (auditUuid: string, files: File[]) => {
    if (files.length === 0) {
      return;
    }

    await Promise.all(
      files.map(async file =>
        uploadFile.fetchParallel({
          pathParams: { entity: "auditStatuses", collection: "attachments", uuid: auditUuid },
          body: { data: { type: "media", attributes: await prepareFileForUpload(file) } }
        })
      )
    );
  }, []);

  const handleSaveEditing = useCallback(
    async (commentUuid: string) => {
      if (!hasValidPolygonUuid || isSavingEdit) {
        return;
      }

      const trimmedMessage = draftMessage.trim();
      if (trimmedMessage === "" && draftAttachments.length === 0 && pendingEditFiles.length === 0) {
        openNotification("error", t("Error!"), t("Please enter a message or attach a file."));
        return;
      }

      setIsSavingEdit(true);

      try {
        await updateAuditStatusAsync(commentUuid, "sitePolygons", polygonUuid, {
          type: "comment",
          comment: trimmedMessage,
          status: polygonStatus ?? null
        });

        const removedAttachments = originalAttachments.filter(
          original => !draftAttachments.some(attachment => attachment.uuid === original.uuid)
        );
        await Promise.all(removedAttachments.map(attachment => deleteMedia(attachment.uuid)));

        await uploadCommentAttachments(commentUuid, pendingEditFiles);

        refetch?.();
        resetEditingState();
        openNotification("success", t("Success!"), t("Your comment was updated."));
      } catch (error) {
        Log.error("Failed to update comment", error);
        openNotification("error", t("Error!"), t("Failed to update comment. Please try again."));
      } finally {
        setIsSavingEdit(false);
      }
    },
    [
      draftAttachments,
      draftMessage,
      hasValidPolygonUuid,
      isSavingEdit,
      openNotification,
      originalAttachments,
      pendingEditFiles,
      polygonStatus,
      polygonUuid,
      refetch,
      resetEditingState,
      t,
      uploadCommentAttachments
    ]
  );

  const handleMarkCommentRead = useCallback(
    async (commentUuid: string) => {
      if (!hasValidPolygonUuid) {
        return;
      }

      try {
        await updateAuditStatusAsync(commentUuid, "sitePolygons", polygonUuid, {
          type: "comment",
          isRead: true
        });
        refetch?.();
      } catch (error) {
        Log.error("Failed to mark comment as read", error);
        openNotification("error", t("Error!"), t("Failed to mark comment as read. Please try again."));
      }
    },
    [hasValidPolygonUuid, openNotification, polygonUuid, refetch, t]
  );

  const handleDeleteComment = useCallback(
    async (auditUuid: string) => {
      if (!hasValidPolygonUuid) {
        return;
      }

      if (editingCommentUuid === auditUuid) {
        resetEditingState();
      }

      try {
        await deleteAuditStatusAsync(auditUuid, "sitePolygons", polygonUuid);
        ApiSlice.pruneCache("auditStatuses");
        refetch?.();
        openNotification("success", t("Success!"), t("Comment deleted successfully."));
      } catch {
        openNotification("error", t("Error!"), t("Failed to delete comment. Please try again."));
      }
    },
    [editingCommentUuid, hasValidPolygonUuid, openNotification, polygonUuid, refetch, resetEditingState, t]
  );

  const currentUserName = formatAuthorName(user?.firstName, user?.lastName);
  const isLoading = hasValidPolygonUuid && !isLoaded;

  return (
    <Flex className="min-h-0 flex-1 flex-col gap-2">
      <input ref={editFileInputRef} type="file" className="hidden" onChange={handleEditFileChange} />
      <Flex className="mr-[0.25rem] min-h-0 flex-1 flex-col gap-2 overflow-y-auto overflow-x-hidden">
        {isLoading && (
          <Flex className="items-center justify-center py-8">
            <Spinner />
          </Flex>
        )}
        {!isLoading && comments.length === 0 && <CommentCard participantType="empty" />}
        {!isLoading &&
          comments.map(comment => {
            const isCurrentUser = isCommentByCurrentUser(comment, user);
            const isEditing = editingCommentUuid === comment.uuid;

            return (
              <CommentCard
                key={comment.uuid}
                className="py-5 px-2 pl-6 pr-7"
                participantType={isCurrentUser ? "current-user" : "other-user"}
                state={isEditing ? "edit" : "view"}
                authorName={formatAuthorName(comment.firstName, comment.lastName)}
                createdAt={formatCommentDate(comment.dateCreated)}
                message={comment.comment ?? ""}
                value={isEditing ? draftMessage : undefined}
                onValueChange={isEditing ? setDraftMessage : undefined}
                attachments={
                  isEditing
                    ? getEditAttachments()
                    : mapCommentAttachments(comment).map(attachment => ({
                        name: attachment.name,
                        url: attachment.url
                      }))
                }
                showUnreadIcon={!comment.isRead}
                onMarkRead={() => void handleMarkCommentRead(comment.uuid)}
                onEdit={isCurrentUser ? () => handleStartEditing(comment) : undefined}
                onCancelEditing={isEditing ? resetEditingState : undefined}
                onSaveEditing={isEditing ? () => void handleSaveEditing(comment.uuid) : undefined}
                onAttachFile={isEditing ? () => editFileInputRef.current?.click() : undefined}
                onDelete={() => void handleDeleteComment(comment.uuid)}
              />
            );
          })}
      </Flex>
      <Flex className="py-5 pl-4 pr-7">
        <CommentInput
          name={currentUserName}
          placeholder={t("Write a message...")}
          auditEntity="sitePolygons"
          auditEntityUuid={polygonUuid}
          auditEntityStatus={polygonStatus}
          onCommentCreated={() => refetch?.()}
        />
      </Flex>
    </Flex>
  );
};

export default PolygonCommentContent;

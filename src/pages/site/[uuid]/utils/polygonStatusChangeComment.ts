export type PolygonStatusChangeComment = {
  authorName: string;
  message: string;
  createdAt: string;
};

export const formatCommentAuthorName = (firstName?: string | null, lastName?: string | null): string =>
  firstName == null && lastName == null ? "Unknown User" : `${firstName ?? ""} ${lastName ?? ""}`.trim();

export const buildStatusChangeComment = (
  comment: string,
  authorName: string,
  createdAt: string | null
): PolygonStatusChangeComment | null => {
  const trimmedComment = comment.trim();
  if (trimmedComment === "") {
    return null;
  }

  return { authorName, message: trimmedComment, createdAt: createdAt ?? "" };
};

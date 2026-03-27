export type ParsedFile = {
  fileName: string;
  fileType: string;
  fileUrl: string;
};

export const IMAGE_EXTENSIONS = new Set(["jpg", "jpeg", "png", "gif", "webp", "svg"]);
export const VIDEO_EXTENSIONS = new Set(["mp4", "mov", "avi", "webm", "mkv"]);
export const MEDIA_EXTENSIONS = new Set([...IMAGE_EXTENSIONS, ...VIDEO_EXTENSIONS]);

export const parseFilesFromHtml = (value: string): ParsedFile[] => {
  const anchorRegex = /<a[^>]*href="([^"]+)"[^>]*>([^<]+)<\/a>/g;
  const files: ParsedFile[] = [];
  let match: RegExpExecArray | null;

  while ((match = anchorRegex.exec(value)) !== null) {
    const url = match[1] ?? "";
    const text = match[2] ?? "";
    const lastDot = text.lastIndexOf(".");
    const fileName = lastDot > 0 ? text.slice(0, lastDot) : text;
    const fileType = lastDot > 0 ? text.slice(lastDot + 1) : "";

    files.push({
      fileName,
      fileType,
      fileUrl: url
    });
  }

  return files;
};

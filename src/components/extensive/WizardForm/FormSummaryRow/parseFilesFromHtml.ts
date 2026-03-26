export type ParsedFile = {
  fileName: string;
  fileType: string;
  fileUrl: string;
};

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

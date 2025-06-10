export function parseImpactStoryContent(content: string | undefined): string {
  if (!content) return "";

  try {
    const onceParsed = JSON.parse(content);

    if (typeof onceParsed === "string") {
      try {
        const twiceParsed = JSON.parse(onceParsed);
        return twiceParsed;
      } catch {
        return onceParsed;
      }
    }

    return onceParsed;
  } catch {
    return content;
  }
}

import { FC } from "react";

import {
  IMAGE_EXTENSIONS,
  MEDIA_EXTENSIONS,
  parseFilesFromHtml,
  VIDEO_EXTENSIONS
} from "@/components/extensive/WizardForm/FormSummaryRow/parseFilesFromHtml";

import DocumentsSection from "./DocumentsSection";
import MediaSection from "./MediaSection";

type AdditionalDocumentationSectionProps = {
  value: string;
  entityName?: "projects" | "sites";
  entityUUID?: string;
};

const AdditionalDocumentationSection: FC<AdditionalDocumentationSectionProps> = ({ value, entityName, entityUUID }) => {
  const files = parseFilesFromHtml(value);

  if (files.length === 0) return null;

  const photos = files.filter(f => IMAGE_EXTENSIONS.has(f.fileType.toLowerCase()));
  const videos = files.filter(f => VIDEO_EXTENSIONS.has(f.fileType.toLowerCase()));
  const documentFiles = files.filter(f => !MEDIA_EXTENSIONS.has(f.fileType.toLowerCase()));

  return (
    <>
      {photos.length > 0 && (
        <MediaSection label="Photos" files={photos} entityName={entityName} entityUUID={entityUUID} />
      )}
      {videos.length > 0 && (
        <MediaSection label="Videos" files={videos} entityName={entityName} entityUUID={entityUUID} />
      )}
      {documentFiles.length > 0 && <DocumentsSection files={documentFiles} />}
    </>
  );
};

export default AdditionalDocumentationSection;

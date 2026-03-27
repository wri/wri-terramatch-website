import { FC } from "react";

import {
  IMAGE_EXTENSIONS,
  parseFilesFromHtml,
  VIDEO_EXTENSIONS
} from "@/components/extensive/WizardForm/FormSummaryRow/parseFilesFromHtml";

import MediaSection from "./MediaSection";

type PhotosAndVideosSectionProps = {
  value: string;
  entityName?: "projects" | "sites";
  entityUUID?: string;
};

const PhotosAndVideosSection: FC<PhotosAndVideosSectionProps> = ({ value, entityName, entityUUID }) => {
  const files = parseFilesFromHtml(value);
  const photos = files.filter(f => IMAGE_EXTENSIONS.has(f.fileType.toLowerCase()));
  const videos = files.filter(f => VIDEO_EXTENSIONS.has(f.fileType.toLowerCase()));

  if (photos.length === 0 && videos.length === 0) {
    return <MediaSection label="Photos" files={[]} entityName={entityName} entityUUID={entityUUID} />;
  }

  return (
    <>
      {photos.length > 0 && (
        <MediaSection label="Photos" files={photos} entityName={entityName} entityUUID={entityUUID} />
      )}
      {videos.length > 0 && (
        <MediaSection label="Videos" files={videos} entityName={entityName} entityUUID={entityUUID} />
      )}
    </>
  );
};

export default PhotosAndVideosSection;

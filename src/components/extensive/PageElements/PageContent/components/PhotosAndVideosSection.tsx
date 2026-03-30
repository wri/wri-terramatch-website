import { Flex } from "@chakra-ui/react";
import { FC } from "react";

import {
  IMAGE_EXTENSIONS,
  parseFilesFromHtml,
  VIDEO_EXTENSIONS
} from "@/components/extensive/WizardForm/FormSummaryRow/parseFilesFromHtml";
import { PlayCircleIcon } from "@/redesignComponents/foundations/Icons";

import MediaSection from "./MediaSection";
import SimpleDivider from "@/redesignComponents/miscellaneous/Dividers/SimpleDivider";

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
    <Flex direction="column" gap={6}>
      {photos.length > 0 && (
        <MediaSection label="Photos" files={photos} entityName={entityName} entityUUID={entityUUID} />
      )}
      {photos.length > 0 && videos.length > 0 && <SimpleDivider />}
      {videos.length > 0 && (
        <MediaSection
          label="Videos"
          files={videos}
          entityName={entityName}
          entityUUID={entityUUID}
          type="video"
          icon={<PlayCircleIcon boxSize={3.5} color="primary.900" />}
        />
      )}
    </Flex>
  );
};

export default PhotosAndVideosSection;

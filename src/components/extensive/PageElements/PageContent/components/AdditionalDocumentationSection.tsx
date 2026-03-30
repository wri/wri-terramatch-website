import { Flex } from "@chakra-ui/react";
import { FC } from "react";

import {
  IMAGE_EXTENSIONS,
  MEDIA_EXTENSIONS,
  parseFilesFromHtml,
  VIDEO_EXTENSIONS
} from "@/components/extensive/WizardForm/FormSummaryRow/parseFilesFromHtml";

import DocumentsSection from "./DocumentsSection";
import MediaSection from "./MediaSection";
import { PlayCircleIcon } from "@/redesignComponents/foundations/Icons";
import SimpleDivider from "@/redesignComponents/miscellaneous/Dividers/SimpleDivider";

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
    <Flex direction="column" gap={6}>
      {documentFiles.length > 0 && <DocumentsSection files={documentFiles} showTitle={entityName === "projects"} />}
      {photos.length > 0 && videos.length > 0 && <SimpleDivider />}
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
          icon={<PlayCircleIcon boxSize={3.5} color="primary.900" />}
        />
      )}
    </Flex>
  );
};

export default AdditionalDocumentationSection;

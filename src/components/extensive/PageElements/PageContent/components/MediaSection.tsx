import { Flex, Grid, Text } from "@chakra-ui/react";
import { FC } from "react";

import { ParsedFile } from "@/components/extensive/WizardForm/FormSummaryRow/parseFilesFromHtml";
import { MediaType } from "@/redesignComponents/content/Images/Image";
import { PhotosIcon } from "@/redesignComponents/foundations/Icons";

import GalleryEntryItem from "./GalleryEntryItem";

export type MediaSectionProps = {
  label: string;
  files: ParsedFile[];
  entityName?: "projects" | "sites";
  entityUUID?: string;
  type?: MediaType;
  icon?: React.ReactNode;
};

const MediaSection: FC<MediaSectionProps> = ({ label, files, entityName, entityUUID, type, icon }) => (
  <Flex direction="column" gap={1}>
    <Text display="flex" alignItems="center" gap={1} lineHeight="normal" textStyle="300-bold" color="primary.900">
      {icon ?? <PhotosIcon boxSize={3.5} color="primary.900" />}
      {label}
    </Text>
    {files.length === 0 ? (
      <Text textStyle="400" color="neutral.900">
        -
      </Text>
    ) : (
      <Grid templateColumns="repeat(4, minmax(0, 1fr))" gap={2}>
        {files.map(file => (
          <GalleryEntryItem
            key={file.fileUrl}
            src={file.fileUrl}
            name={file.fileType != null ? `${file.fileName}.${file.fileType}` : file.fileName}
            entityName={entityName}
            entityUUID={entityUUID}
            type={type}
            url={file.fileUrl}
          />
        ))}
      </Grid>
    )}
  </Flex>
);

export default MediaSection;

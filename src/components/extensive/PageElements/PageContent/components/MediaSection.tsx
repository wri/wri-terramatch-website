import { Flex, Grid, Text } from "@chakra-ui/react";
import { FC } from "react";

import { ParsedFile } from "@/components/extensive/WizardForm/FormSummaryRow/parseFilesFromHtml";
import { PhotosIcon } from "@/redesignComponents/foundations/Icons";

import GalleryEntryItem from "./GalleryEntryItem";

export type MediaSectionProps = {
  label: string;
  files: ParsedFile[];
  entityName: "projects" | "sites";
  entityUUID: string;
};

const MediaSection: FC<MediaSectionProps> = ({ label, files, entityName, entityUUID }) => (
  <Flex direction="column" gap={1}>
    <Text display="flex" alignItems="center" gap={1} lineHeight="normal" textStyle="300-bold" color="primary.900">
      <PhotosIcon boxSize={3.5} color="primary.900" />
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
            name={file.fileType ? `${file.fileName}.${file.fileType}` : file.fileName}
            entityName={entityName}
            entityUUID={entityUUID}
          />
        ))}
      </Grid>
    )}
  </Flex>
);

export default MediaSection;

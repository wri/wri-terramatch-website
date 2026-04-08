import { Flex, Grid, GridItem, Text } from "@chakra-ui/react";
import { FC } from "react";

import { ParsedFile } from "@/components/extensive/WizardForm/FormSummaryRow/parseFilesFromHtml";
import { MediaType } from "@/redesignComponents/content/Images/Image";
import { PhotosIcon } from "@/redesignComponents/foundations/Icons";
import { EntityName, SingularEntityName } from "@/types/common";

import GalleryEntryItem from "./GalleryEntryItem";

export type MediaSectionProps = {
  label: string;
  files: ParsedFile[];
  entityName?: EntityName | SingularEntityName;
  entityUUID?: string;
  type?: MediaType;
  icon?: React.ReactNode;
};

const MediaSection: FC<MediaSectionProps> = ({ label, files, entityName, entityUUID, type, icon }) => (
  <Flex direction="column" gap={3}>
    <Text display="flex" alignItems="center" gap={1} lineHeight="normal" textStyle="300-bold" color="primary.900">
      {icon ?? <PhotosIcon boxSize={3.5} color="primary.900" />}
      {label}
    </Text>
    {files.length === 0 ? (
      <Text textStyle="400" color="neutral.900">
        -
      </Text>
    ) : (
      <Grid templateColumns="repeat(4, minmax(0, 1fr))" gap={4}>
        {files.map(file => {
          const count = files.length;
          const colSpan = count === 1 ? 4 : count === 2 ? 2 : 1;

          return (
            <GridItem key={file.fileUrl} colSpan={colSpan}>
              <GalleryEntryItem
                src={file.fileUrl}
                name={file.fileType != null ? `${file.fileName}.${file.fileType}` : file.fileName}
                entityName={entityName}
                entityUUID={entityUUID}
                type={type}
                url={file.fileUrl}
              />
            </GridItem>
          );
        })}
      </Grid>
    )}
  </Flex>
);

export default MediaSection;

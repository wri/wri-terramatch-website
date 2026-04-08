import { Flex, Text } from "@chakra-ui/react";
import { FC } from "react";

import { FormEntry } from "@/components/extensive/WizardForm/FormSummaryRow/types";
import { EntityName, SingularEntityName } from "@/types/common";

import AdditionalDocumentationSection from "./AdditionalDocumentationSection";
import PhotosAndVideosSection from "./PhotosAndVideosSection";
import { PlantTableEntryRenderer } from "./PlantTableEntryRenderer";

export const SPECIAL_ENTRY_TITLES = new Set([
  "Photos and videos",
  "Additional Documentation",
  "If you have any additional documentation on your site you would like to share, please add it below.",
  "Additional Information",
  "Tree Species - Additional Information"
]);

type SpecialEntryRendererProps = {
  entry: FormEntry;
  entityName?: EntityName | SingularEntityName;
  entityUUID?: string;
};

const SpecialEntryRenderer: FC<SpecialEntryRendererProps> = ({ entry, entityName, entityUUID }) => {
  const value = typeof entry.value === "string" ? entry.value : "";

  if (entry.title === "Photos and videos") {
    return <PhotosAndVideosSection value={value} entityName={entityName} entityUUID={entityUUID} />;
  }

  if (entry.inputType === "treeSpecies") {
    const plants = entry.value?.props?.plants;

    if (plants == null || plants.length === 0) {
      return null;
    }

    return (
      <Flex direction="column" gap={1}>
        {entityName === "projects" && (
          <Text textStyle="300-bold" color="primary.900">
            {entry.title}:
          </Text>
        )}
        <PlantTableEntryRenderer rawValue={{ props: { tableType: "noCount", plants } }} />
      </Flex>
    );
  }

  if (entry.title === "Additional Information" || entry.title === "Tree Species - Additional Information") {
    return null;
  }

  return <AdditionalDocumentationSection value={value} entityName={entityName} entityUUID={entityUUID} />;
};

export default SpecialEntryRenderer;

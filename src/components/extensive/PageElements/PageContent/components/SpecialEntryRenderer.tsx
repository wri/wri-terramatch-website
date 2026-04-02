import { FC } from "react";

import { FormEntry } from "@/components/extensive/WizardForm/FormSummaryRow/types";
import { EntityName, SingularEntityName } from "@/types/common";

import AdditionalDocumentationSection from "./AdditionalDocumentationSection";
import PhotosAndVideosSection from "./PhotosAndVideosSection";
import { PlantTableEntryRenderer } from "./PlantTableEntryRenderer";

export const SPECIAL_ENTRY_TITLES = new Set([
  "Photos and videos",
  "Additional Documentation",
  "If you have any additional documentation on your site you would like to share, please add it below."
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
    return <PlantTableEntryRenderer rawValue={{ props: { tableType: "noCount", plants } }} />;
  }

  return <AdditionalDocumentationSection value={value} entityName={entityName} entityUUID={entityUUID} />;
};

export default SpecialEntryRenderer;

import { FC } from "react";

import { FormEntry } from "@/components/extensive/WizardForm/FormSummaryRow/types";
import { EntityName, SingularEntityName } from "@/types/common";

import AdditionalDocumentationSection from "./AdditionalDocumentationSection";
import { EntryDefaultValueRenderer } from "./EntryDefaultValueRenderer";
import PhotosAndVideosSection from "./PhotosAndVideosSection";

export const SPECIAL_ENTRY_TITLES = new Set([
  "Photos and videos",
  "Additional Documentation",
  "If you have any additional documentation on your site you would like to share, please add it below.",
  "Additional Information"
]);

type SpecialEntryRendererProps = {
  entry: FormEntry;
  entityName?: EntityName | SingularEntityName;
  entityUUID?: string;
  stepId?: string;
};

const SpecialEntryRenderer: FC<SpecialEntryRendererProps> = ({ entry, entityName, entityUUID, stepId }) => {
  const value = typeof entry.value === "string" ? entry.value : "";

  if (entry.title === "Photos and videos") {
    return <PhotosAndVideosSection value={value} entityName={entityName} entityUUID={entityUUID} stepId={stepId} />;
  }

  if (entry.title === "Additional Information" || entry.title === "Tree Species - Additional Information") {
    return <EntryDefaultValueRenderer entry={entry} />;
  }

  return <AdditionalDocumentationSection value={value} entityName={entityName} entityUUID={entityUUID} />;
};

export default SpecialEntryRenderer;

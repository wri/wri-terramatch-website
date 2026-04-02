import { FC } from "react";

import { FormEntry } from "@/components/extensive/WizardForm/FormSummaryRow/types";

import AdditionalDocumentationSection from "./AdditionalDocumentationSection";
import PhotosAndVideosSection from "./PhotosAndVideosSection";

export const SPECIAL_ENTRY_TITLES = new Set([
  "Photos and videos",
  "Additional Documentation",
  "If you have any additional documentation on your site you would like to share, please add it below."
]);

type SpecialEntryRendererProps = {
  entry: FormEntry;
  entityName?: "projects" | "sites";
  entityUUID?: string;
};

const SpecialEntryRenderer: FC<SpecialEntryRendererProps> = ({ entry, entityName, entityUUID }) => {
  const value = typeof entry.value === "string" ? entry.value : "";

  if (entry.title === "Photos and videos") {
    return <PhotosAndVideosSection value={value} entityName={entityName} entityUUID={entityUUID} />;
  }

  return <AdditionalDocumentationSection value={value} entityName={entityName} entityUUID={entityUUID} />;
};

export default SpecialEntryRenderer;

import { isEmpty } from "lodash";
import { useRecordContext } from "react-admin";

import { AboutSectionConstants } from "@/generated/v3/entityService/entityServiceConstants";
import { AboutSectionDto } from "@/generated/v3/entityService/entityServiceSchemas";

export const SECTION_TYPE_CHOICES = AboutSectionConstants.TYPES.map(type => ({ id: type, name: type }));

export const sectionTitle = (section: AboutSectionDto) =>
  `About Section for type "${section?.type}" in frameworks ${
    isEmpty(section?.frameworks) ? "(default)" : `(${section?.frameworks?.join(", ")})`
  }`;

export const useSectionTitle = () => {
  const record = useRecordContext();
  if (record == null) return "";

  return sectionTitle(record as AboutSectionDto);
};

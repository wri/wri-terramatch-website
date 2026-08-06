import { AboutSectionConstants } from "@/generated/v3/entityService/entityServiceConstants";

export const SECTION_TYPE_CHOICES = AboutSectionConstants.TYPES.map(type => ({ id: type, name: type }));

import { LocalStep } from "@/context/wizardForm.provider";
import { FormFullDto } from "@/generated/v3/entityService/entityServiceSchemas";

export type FormBuilderData = Omit<FormFullDto, "sections"> & {
  id: string;
  steps: LocalStep[];
};

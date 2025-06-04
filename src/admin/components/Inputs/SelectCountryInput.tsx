import { SelectInput, SelectInputProps } from "react-admin";

import { useGadmChoices } from "@/connections/Gadm";

export const SelectCountryInput = (props: SelectInputProps) => (
  <SelectInput {...props} choices={useGadmChoices({ level: 0 })} />
);

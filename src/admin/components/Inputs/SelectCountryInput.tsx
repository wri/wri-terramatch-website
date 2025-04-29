import { Loader } from "@storybook/components";
import { SelectInput, SelectInputProps } from "react-admin";

import { useGadmOptions } from "@/connections/Gadm";
import { optionToChoices } from "@/utils/options";

export const SelectCountryInput = (props: SelectInputProps) => {
  const options = useGadmOptions({ level: 0 });
  return options == null ? <Loader /> : <SelectInput {...props} choices={optionToChoices(options)} />;
};

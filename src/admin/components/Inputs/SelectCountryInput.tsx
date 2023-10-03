import { SelectInput, SelectInputProps } from "react-admin";

import { getCountriesOptions } from "@/constants/options/countries";
import { optionToChoices } from "@/utils/options";

export const SelectCountryInput = (props: SelectInputProps) => {
  return <SelectInput {...props} choices={optionToChoices(getCountriesOptions())} />;
};

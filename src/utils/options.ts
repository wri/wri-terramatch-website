import { Choice } from "@/admin/types/common";
import { Option } from "@/types/common";
import { toArray } from "@/utils/array";

/**
 * formatOptionsList
 * @param options original list to search from
 * @param values an string array or string of selected items from list
 * @returns Comma separated values as string.
 */

export const getMetaData = (options: Option[], values?: string | string[]): any => {
  if (!values) return undefined;
  if (options.length === 0) return undefined;

  return options.find(o => o.value === values[0])?.meta;
};

export const formatOptionsList = (options: Option[], values?: string | string[]): string => {
  if (!values) return "";
  if (options.length === 0) return toArray(values).join(",");

  return toArray(values)
    .map(c => options.find(o => o.value === c)?.title || c)
    .filter(c => !!c)
    .join(", ");
};

export const optionToChoices = (options: Option[]): Choice[] =>
  options.map(item => ({ id: item.value, name: item.title }));

export const valuesToOptions = (values: string | string[], options: Option[]): Option[] => {
  if (!values) return [];

  return options.filter(option => {
    if (typeof values === "string") {
      return option.value === values;
    } else {
      return values.includes(`${option.value}`);
    }
  });
};

export const getOptionTitle = (value: string, options: Option[]) => {
  return options.find(option => option.value === value)?.title;
};

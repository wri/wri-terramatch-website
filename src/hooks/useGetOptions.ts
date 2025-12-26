import { useOptionLabels } from "@/connections/Form";
import { Option } from "@/types/common";
import { toArray } from "@/utils/array";

/**
 * Get options object from backend via option keys, used in custom forms
 * @param keys option keys
 * @returns Option[]
 */
export const useGetOptions = (keys?: string[] | null): Option[] => {
  const [, { data: optionsData }] = useOptionLabels({ ids: toArray(keys) });

  return Object.values(optionsData ?? {}).map(
    option => ({ title: option.label, value: option.slug, meta: { image_url: option.imageUrl } } as Option)
  );
};

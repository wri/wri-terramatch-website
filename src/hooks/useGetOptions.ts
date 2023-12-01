import { useRouter } from "next/router";

import { useGetV2FormsOptionLabels } from "@/generated/apiComponents";
import { Option } from "@/types/common";
import { toArray } from "@/utils/array";

export const useGetOptions = (keys: string[]) => {
  const { locale } = useRouter();
  const _keys = toArray(keys);

  const { data: optionsData } = useGetV2FormsOptionLabels(
    {
      queryParams: {
        keys: _keys?.join(","),
        lang: locale
      }
    },
    {
      enabled: _keys?.length > 0
    }
  );
  return (
    // @ts-ignore
    optionsData?.data?.map(
      (option: any) => ({ title: option.label, value: option.slug, meta: { image_url: option.image_url } } as Option)
    ) || []
  );
};

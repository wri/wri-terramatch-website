import { useT } from "@transifex/react";
import { useMemo } from "react";

interface Option {
  title: string;
  value: string;
  options?: Option[];
}

export const useTranslatedOptions = (options: Option[]): Option[] => {
  const t = useT();

  return useMemo(() => {
    return options.map(option => ({
      ...option,
      options: option.options
        ? option.options.map(subOption => ({
            ...subOption,
            title: t(subOption.title)
          }))
        : undefined,
      title: t(option.title)
    }));
  }, [options, t]);
};

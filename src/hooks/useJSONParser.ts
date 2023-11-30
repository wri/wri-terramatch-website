import { useMemo } from "react";

export const useJSONParser = (jsonString: string) => {
  return useMemo(() => {
    try {
      if (jsonString) {
        return JSON.parse(jsonString);
      }
    } catch (e) {
      return undefined;
    }
    return undefined;
  }, [jsonString]);
};

import { useMemo } from "react";

/**
 * To safely parse json string
 * @param jsonString
 * @returns json object or undefined
 */
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

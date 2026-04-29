import { useShowContext } from "react-admin";

import { useBaseMap } from "./useBaseMap";

export const useMap = (onSave?: (geojson: unknown, record: unknown) => void) => {
  const { record } = useShowContext();
  return useBaseMap(onSave, record);
};

import { useShowContext } from "react-admin";

import { type MapDrawSaveHandler, type MapDrawSaveRecord, useBaseMap } from "./useBaseMap";

export const useMap = (onSave?: MapDrawSaveHandler) => {
  const { record } = useShowContext();
  return useBaseMap(onSave, record as MapDrawSaveRecord | undefined);
};

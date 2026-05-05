import { type ReactNode, createContext, useContext } from "react";

const ChampionsMapContext = createContext(false);

export function ChampionsMapProvider({ championsMap, children }: { championsMap: boolean; children: ReactNode }) {
  return <ChampionsMapContext.Provider value={championsMap}>{children}</ChampionsMapContext.Provider>;
}

/** Whether the map uses the champions (non-admin) layout and controls. */
export function useChampionsMap(): boolean {
  return useContext(ChampionsMapContext);
}

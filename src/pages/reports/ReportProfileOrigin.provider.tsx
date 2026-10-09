import { createContext, FC, PropsWithChildren, useContext, useMemo } from "react";

import { ReportProfileOrigin, ReportsIndexSource } from "./reportIndex.utils";

export type ReportProfileOriginWithContext = ReportProfileOrigin & {
  contextOrigin?: string;
};

const ReportProfileOriginContext = createContext<ReportProfileOriginWithContext | undefined>(undefined);

/** The profile (project / site / nursery) whose Reports tab is listing the reports, if any. */
export const useReportProfileOrigin = () => useContext(ReportProfileOriginContext);

type ReportProfileOriginProviderProps = {
  source: ReportsIndexSource;
  uuid: string;
  origin?: string;
};

const ReportProfileOriginProvider: FC<PropsWithChildren<ReportProfileOriginProviderProps>> = ({
  source,
  uuid,
  origin,
  children
}) => {
  const value = useMemo(() => ({ source, uuid, contextOrigin: origin }), [source, uuid, origin]);
  return <ReportProfileOriginContext.Provider value={value}>{children}</ReportProfileOriginContext.Provider>;
};

export default ReportProfileOriginProvider;

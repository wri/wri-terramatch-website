import { createContext, FC, PropsWithChildren, useContext, useMemo } from "react";

import { ReportProfileOrigin, ReportsIndexSource } from "./reportIndex.utils";

export type ReportProfileOriginWithContext = ReportProfileOrigin & {
  contextOrigin?: string;
  projectName?: string | null;
};

const ReportProfileOriginContext = createContext<ReportProfileOriginWithContext | undefined>(undefined);

/** The profile (project / site / nursery) whose Reports tab is listing the reports, if any. */
export const useReportProfileOrigin = () => useContext(ReportProfileOriginContext);

type ReportProfileOriginProviderProps = {
  source: ReportsIndexSource;
  uuid: string;
  origin?: string;
  projectName?: string | null;
};

const ReportProfileOriginProvider: FC<PropsWithChildren<ReportProfileOriginProviderProps>> = ({
  source,
  uuid,
  origin,
  projectName,
  children
}) => {
  const value = useMemo(
    () => ({ source, uuid, contextOrigin: origin, projectName }),
    [source, uuid, origin, projectName]
  );
  return <ReportProfileOriginContext.Provider value={value}>{children}</ReportProfileOriginContext.Provider>;
};

export default ReportProfileOriginProvider;

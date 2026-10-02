import { createContext, FC, PropsWithChildren, useContext, useMemo } from "react";

import { ReportProfileOrigin, ReportsIndexSource } from "./reportIndex.utils";

const ReportProfileOriginContext = createContext<ReportProfileOrigin | undefined>(undefined);

/** The profile (project / site / nursery) whose Reports tab is listing the reports, if any. */
export const useReportProfileOrigin = () => useContext(ReportProfileOriginContext);

type ReportProfileOriginProviderProps = {
  source: ReportsIndexSource;
  uuid: string;
};

const ReportProfileOriginProvider: FC<PropsWithChildren<ReportProfileOriginProviderProps>> = ({
  source,
  uuid,
  children
}) => {
  const origin = useMemo(() => ({ source, uuid }), [source, uuid]);
  return <ReportProfileOriginContext.Provider value={origin}>{children}</ReportProfileOriginContext.Provider>;
};

export default ReportProfileOriginProvider;

import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from "react";
import { useNotify } from "react-admin";

import ExportProcessingAlert from "@/admin/components/Alerts/ExportProcessingAlert";
import {
  formSubmissionsExportCsv,
  fundingProgrammeExportAll
} from "@/generated/v3/entityService/entityServiceComponents";

type ExportType = {
  loading: boolean;
  error?: string;
  exportApplications: (data: { fundingProgrammeUuid: string } | { formUuid: string }) => Promise<void>;
};

export const ExportContext = createContext<ExportType>({
  loading: false,
  error: undefined,
  exportApplications: async () => {}
});

type ExportProviderProps = {
  children: ReactNode;
};

const ExportProvider = ({ children }: ExportProviderProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>();
  const notify = useNotify();

  const exportApplications = useCallback(
    async ({ fundingProgrammeUuid, formUuid }: { fundingProgrammeUuid?: string; formUuid?: string }) => {
      try {
        setLoading(true);
        if (formUuid != null) {
          await formSubmissionsExportCsv.downloadFile({ pathParams: { uuid: formUuid } });
        } else if (fundingProgrammeUuid != null) {
          await fundingProgrammeExportAll.downloadFile({ pathParams: { uuid: fundingProgrammeUuid } });
        }
      } catch (err: any) {
        setError(err.message);
        notify(err.message ?? "Export Error", { undoable: false, type: "error" });
      } finally {
        setLoading(false);
      }

      throw new Error("Incorrect Props supplied to export applications");
    },
    [notify]
  );

  const value = useMemo(() => ({ loading, error, exportApplications }), [error, exportApplications, loading]);

  return (
    <ExportContext.Provider value={value}>
      {children}
      <ExportProcessingAlert show={loading} />
    </ExportContext.Provider>
  );
};

export const useExportContext = () => useContext(ExportContext);

export default ExportProvider;

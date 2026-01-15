import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from "react";
import { useNotify } from "react-admin";

import ExportProcessingAlert from "@/admin/components/Alerts/ExportProcessingAlert";
import {
  fetchGetV2AdminFormsApplicationsUUIDExport,
  fetchGetV2AdminFormsSubmissionsUUIDExport
} from "@/generated/apiComponents";
import { downloadFileBlob, downloadPresignedUrl } from "@/utils/network";

type ExportType = {
  loading: boolean;
  error?: string;
  exportApplications: (
    data: { fundingProgrammeUuid: string } | { formUuid: string },
    fileName: string
  ) => Promise<void>;
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
    async (
      { fundingProgrammeUuid, formUuid }: { fundingProgrammeUuid?: string; formUuid?: string },
      fileName: string
    ) => {
      const exporter = async (fileName: string, fn: () => Promise<any>) => {
        try {
          setLoading(true);
          const res = await fn();
          if (res?.url) {
            await downloadPresignedUrl(res.url, fileName);
          } else {
            await downloadFileBlob(res, fileName);
          }
          setLoading(false);
          return res;
        } catch (err: any) {
          setLoading(false);
          setError(err.message);
          notify(err.message ?? "Export Error", { undoable: false, type: "error" });
        }
      };

      if (formUuid != null) {
        return exporter(fileName, () => fetchGetV2AdminFormsSubmissionsUUIDExport({ pathParams: { uuid: formUuid } }));
      } else if (fundingProgrammeUuid != null) {
        return exporter(fileName, () =>
          fetchGetV2AdminFormsApplicationsUUIDExport({ pathParams: { uuid: fundingProgrammeUuid } })
        );
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

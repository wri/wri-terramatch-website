import { isString } from "lodash";
import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from "react";
import { useNotify } from "react-admin";

import ExportProcessingAlert from "@/admin/components/Alerts/ExportProcessingAlert";
import { downloadApplicationExport } from "@/connections/FundingProgramme";
import { formSubmissionsExportCsv } from "@/generated/v3/entityService/entityServiceComponents";
import { downloadFileBlob, downloadFileUrl } from "@/utils/network";

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
      const exporter = async (fn: () => Promise<{ fileName?: string; response: Blob | string }>) => {
        try {
          setLoading(true);
          const { fileName, response } = await fn();
          if (isString(response)) {
            downloadFileUrl(response, fileName);
          } else {
            await downloadFileBlob(response, fileName ?? "Applications.csv");
          }
          setLoading(false);
        } catch (err: any) {
          setLoading(false);
          setError(err.message);
          notify(err.message ?? "Export Error", { undoable: false, type: "error" });
        }
      };

      if (formUuid != null) {
        return exporter(async () => {
          const { fileName, blob } = await formSubmissionsExportCsv.fetchBlob({ pathParams: { uuid: formUuid } });
          return { fileName, response: blob };
        });
      } else if (fundingProgrammeUuid != null) {
        return exporter(async () => {
          const { data, loadFailure } = await downloadApplicationExport(fundingProgrammeUuid);
          if (loadFailure != null) {
            throw loadFailure;
          }
          return { response: data?.url as string };
        });
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

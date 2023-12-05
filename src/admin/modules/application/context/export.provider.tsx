import { createContext, ReactNode, useContext, useMemo, useState } from "react";
import { useNotify } from "react-admin";

import { fetchGetV2AdminFormsUUIDExport } from "@/admin/apiProvider/dataProviders/applicationDataProvider";
import ExportProcessingAlert from "@/admin/components/Alerts/ExportProcessingAlert";
import { fetchGetV2AdminFormsApplicationsUUIDExport } from "@/generated/apiComponents";
import { downloadFileBlob } from "@/utils/network";

type ExportType = {
  loading: boolean;
  error?: string;
  exportApplications: (
    data: { funding_programme_uuid?: string; export_choice: "funding-programme" | "stage"; form_uuid?: string },
    fileName: string
  ) => Promise<void>;
};

/* eslint-disable */
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

  /**
   * PRIVATE function, to be reused in local context export functions
   * @param fileName
   * @param fn Fetcher Function
   * @returns Blob
   */
  const exporter = async (fileName: string, fn: () => Promise<any>) => {
    try {
      setLoading(true);
      const res = await fn();
      const blob = await downloadFileBlob(res, fileName);
      setLoading(false);
      return blob;
    } catch (err: any) {
      setLoading(false);
      setError(err.message);
      notify(err.message ?? "Export Error", { undoable: false, type: "error" });
    }
  };

  /**
   * Exports Applications filtered by funding programme uuid
   * @param data { funding_programme_uuid?: string, export_choice: "funding-programme" | "stage", form_uuid?: string }
   * @param fileName string
   * @returns Exporter Function
   */
  const exportApplications = async (
    data: { funding_programme_uuid?: string; export_choice: "funding-programme" | "stage"; form_uuid?: string },
    fileName: string
  ) => {
    if (data.export_choice === "funding-programme" && data.funding_programme_uuid) {
      return exporter(fileName, () =>
        fetchGetV2AdminFormsApplicationsUUIDExport({
          pathParams: {
            uuid: data.funding_programme_uuid || ""
          }
        })
      );
    } else if (data.export_choice === "stage" && data.form_uuid) {
      return exporter(fileName, () =>
        fetchGetV2AdminFormsUUIDExport({
          pathParams: {
            uuid: data.form_uuid || ""
          }
        })
      );
    }

    throw new Error("Incorrect Props supplied to export applications");
  };

  // All exported values go here
  const value = useMemo(
    () => ({
      loading,
      error,
      exportApplications
    }),
    // eslint-disable-next-line
    []
  );

  return (
    <ExportContext.Provider value={value}>
      {children}
      <ExportProcessingAlert show={loading} />
    </ExportContext.Provider>
  );
};

export const useExportContext = () => useContext(ExportContext);

export default ExportProvider;

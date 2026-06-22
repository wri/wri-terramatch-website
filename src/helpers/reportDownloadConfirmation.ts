export const REPORT_DOWNLOAD_CONFIRMATION_MODELS = ["projectReports", "siteReports", "nurseryReports"] as const;
export type ReportDownloadConfirmationModel = (typeof REPORT_DOWNLOAD_CONFIRMATION_MODELS)[number];

export const isReportDownloadConfirmationModel = (model?: string): model is ReportDownloadConfirmationModel =>
  REPORT_DOWNLOAD_CONFIRMATION_MODELS.includes(model as ReportDownloadConfirmationModel);

export const getReportModelLabel = (model: ReportDownloadConfirmationModel) => {
  const labels: Record<ReportDownloadConfirmationModel, string> = {
    projectReports: "Project Report",
    siteReports: "Site Report",
    nurseryReports: "Nursery Report"
  };

  return labels[model];
};

export const getReportExportConfirmationCopy = (entityLabel: string) => ({
  title: `Download ${entityLabel}`,
  content:
    "Click the button below to download this report. All available attributes - including the report identifier (UUID) - are included."
});

export const getReportFormAnswersConfirmationCopy = (entityLabel: string) => ({
  title: `Download ${entityLabel}`,
  content:
    "Click the button below to download the answers for this report. All available attributes - including the report identifier (UUID) - are included."
});

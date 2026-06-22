type TranslateFn = (key: string, params?: Record<string, unknown>) => string;

export const REPORT_DOWNLOAD_CONFIRMATION_MODELS = ["projectReports", "siteReports", "nurseryReports"] as const;

export type ReportDownloadConfirmationModel = (typeof REPORT_DOWNLOAD_CONFIRMATION_MODELS)[number];

export const isReportDownloadConfirmationModel = (model?: string): model is ReportDownloadConfirmationModel =>
  REPORT_DOWNLOAD_CONFIRMATION_MODELS.includes(model as ReportDownloadConfirmationModel);

export const getReportModelLabel = (model: ReportDownloadConfirmationModel, t: TranslateFn) => {
  const labels: Record<ReportDownloadConfirmationModel, string> = {
    projectReports: t("Project Report"),
    siteReports: t("Site Report"),
    nurseryReports: t("Nursery Report")
  };

  return labels[model];
};

export const getReportExportConfirmationCopy = (entityLabel: string, t: TranslateFn) => ({
  title: t("Download {entityLabel}", { entityLabel }),
  content: t(
    "Click the button below to download this report. All available attributes - including the report identifier (UUID) - are included."
  )
});

export const getReportFormAnswersConfirmationCopy = (entityLabel: string, t: TranslateFn) => ({
  title: t("Download {entityLabel}", { entityLabel }),
  content: t(
    "Click the button below to download the answers for this report. All available attributes - including the report identifier (UUID) - are included."
  )
});

import { useT } from "@transifex/react";
import { Dictionary } from "lodash";
import { useCallback } from "react";
import { UseFormReturn } from "react-hook-form";

import { downloadAnswersCSV } from "@/components/extensive/WizardForm/utils";
import { FormFieldsProvider } from "@/context/wizardForm.provider";
import {
  getReportFormAnswersConfirmationCopy,
  getReportModelLabel,
  isReportDownloadConfirmationModel
} from "@/helpers/reportDownloadConfirmation";
import { useOpenDownloadConfirmation } from "@/hooks/useOpenDownloadConfirmation";
import { runWithDownloadToast } from "@/utils/downloadToast";

type UseDownloadFormAnswersParams = {
  fieldsProvider: FormFieldsProvider;
  formHook: UseFormReturn;
  formModel?: string;
};

export const useDownloadFormAnswers = ({ fieldsProvider, formHook, formModel }: UseDownloadFormAnswersParams) => {
  const t = useT();
  const openDownloadConfirmation = useOpenDownloadConfirmation();

  const downloadAnswers = useCallback(() => {
    runWithDownloadToast(
      {
        downloading: t("Downloading Answers..."),
        complete: t("Download Complete"),
        error: t("Something went wrong!")
      },
      () => downloadAnswersCSV(fieldsProvider, formHook.getValues() as Dictionary<unknown>),
      "wizardFormDownloadToast"
    );
  }, [fieldsProvider, formHook, t]);

  const requestDownloadAnswers = useCallback(() => {
    if (!isReportDownloadConfirmationModel(formModel)) {
      downloadAnswers();
      return;
    }

    const entityLabel = getReportModelLabel(formModel);
    const { title, content } = getReportFormAnswersConfirmationCopy(entityLabel);

    openDownloadConfirmation({
      title,
      content,
      onConfirm: downloadAnswers
    });
  }, [downloadAnswers, formModel, openDownloadConfirmation]);

  return requestDownloadAnswers;
};

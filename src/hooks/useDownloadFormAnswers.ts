import { useT } from "@transifex/react";
import { Dictionary } from "lodash";
import { useCallback } from "react";
import { UseFormReturn } from "react-hook-form";

import { downloadAnswersCSV } from "@/components/extensive/WizardForm/utils";
import { FormFieldsProvider } from "@/context/wizardForm.provider";
import { useDownloadToastMessages } from "@/hooks/translation/useDownloadToastMessages";
import { runWithDownloadToast } from "@/utils/downloadToast";

type UseDownloadFormAnswersParams = {
  fieldsProvider: FormFieldsProvider;
  formHook: UseFormReturn;
};

export const useDownloadFormAnswers = ({ fieldsProvider, formHook }: UseDownloadFormAnswersParams) => {
  const t = useT();
  const downloadToastMessages = useDownloadToastMessages();

  return useCallback(() => {
    runWithDownloadToast(
      {
        downloading: t("Downloading Answers"),
        complete: downloadToastMessages.complete,
        error: downloadToastMessages.error
      },
      () => downloadAnswersCSV(fieldsProvider, formHook.getValues() as Dictionary<unknown>),
      "wizardFormDownloadToast"
    );
  }, [downloadToastMessages, fieldsProvider, formHook, t]);
};

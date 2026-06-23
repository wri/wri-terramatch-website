import { useT } from "@transifex/react";
import { Dictionary } from "lodash";
import { useCallback } from "react";
import { UseFormReturn } from "react-hook-form";

import { downloadAnswersCSV } from "@/components/extensive/WizardForm/utils";
import { FormFieldsProvider } from "@/context/wizardForm.provider";
import { DOWNLOAD_COMPLETE_MESSAGE, DOWNLOAD_ERROR_MESSAGE, runWithDownloadToast } from "@/utils/downloadToast";

type UseDownloadFormAnswersParams = {
  fieldsProvider: FormFieldsProvider;
  formHook: UseFormReturn;
};

export const useDownloadFormAnswers = ({ fieldsProvider, formHook }: UseDownloadFormAnswersParams) => {
  const t = useT();

  return useCallback(() => {
    runWithDownloadToast(
      {
        downloading: t("Downloading Answers..."),
        complete: t(DOWNLOAD_COMPLETE_MESSAGE),
        error: t(DOWNLOAD_ERROR_MESSAGE)
      },
      () => downloadAnswersCSV(fieldsProvider, formHook.getValues() as Dictionary<unknown>),
      "wizardFormDownloadToast"
    );
  }, [fieldsProvider, formHook, t]);
};

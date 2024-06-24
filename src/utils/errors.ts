import { useT } from "@transifex/react";
import { ErrorOption } from "react-hook-form";

export const getErrorMessages = (t: typeof useT, errorCode: string, variables: any) => {
  const errorMapping: { [index: string]: ErrorOption } = {
    MIMES: {
      message: t("The {label} must be a file of type: {values}.", variables),
      type: "validate"
    },
    FILE_SIZE: {
      message: t("Maximum file allowed is {max}Mb", variables),
      type: "max"
    },
    UPLOAD_ERROR: {
      message: t(
        "The maximum upload size is 10 MB. Please compress this file and try again, or upload a different file.",
        variables
      ),
      type: "max"
    }
  };

  return errorMapping[errorCode];
};

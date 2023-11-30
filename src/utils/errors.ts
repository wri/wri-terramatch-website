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
    }
  };

  return errorMapping[errorCode];
};

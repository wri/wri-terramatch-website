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

export const getErrorMessageFromPayload = (payload: any): string => {
  try {
    if (typeof payload === "object" && payload.error) {
      try {
        const parsedError = JSON.parse(payload.error);
        return parsedError.message || parsedError.error || payload.error;
      } catch {
        return payload.error;
      }
    }

    if (typeof payload === "string") {
      const parsedPayload = JSON.parse(payload);
      return parsedPayload.message || parsedPayload.error || payload;
    }

    return String(payload);
  } catch (e) {
    return String(payload);
  }
};

import { useT } from "@transifex/react";
import * as yup from "yup";

export default function (t: typeof useT = (t: string) => t) {
  yup.setLocale({
    mixed: {
      required(params) {
        return t(`This field is required`);
      },
      notType(params) {
        switch (params.type) {
          case "date": {
            return t("Please use correct format for the date entered above. It should be MM/DD/YYYY");
          }
          case "number": {
            return t("Please enter a number");
          }
          default: {
            return t("Type is not valid");
          }
        }
      }
    },
    array: {
      min(params) {
        return t(`At least {min} item is required`, { min: params.min });
      }
    }
  });
}

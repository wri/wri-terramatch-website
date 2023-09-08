import { useT } from "@transifex/react";
import * as yup from "yup";

export const UrlRegex =
  /^(http:\/\/|https:\/\/|www\.)[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/gi;

export const urlValidation = (t: typeof useT) =>
  yup.string().matches(UrlRegex, { message: t("URL is not valid."), excludeEmptyString: true });

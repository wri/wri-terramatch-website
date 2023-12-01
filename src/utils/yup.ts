import { useT } from "@transifex/react";
import * as yup from "yup";

export const UrlRegex =
  /^(https?:\/\/)?((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3}))(:\d+)?(\/[-a-z\d%_.~+]*)*(\?[;&a-z\d%_.~+=-]*)?(#[-a-z\d_]*)?(\/.+)?$/gi;

export const urlValidation = (t: typeof useT) =>
  yup.string().matches(UrlRegex, { message: t("URL is not valid."), excludeEmptyString: true });

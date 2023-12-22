/* eslint-disable no-unused-vars */

export type Colors = "white" | "black" | "neutral" | "secondary" | "tertiary" | "primary" | "success" | "error";
export type ColorCodes = "none" | 50 | 100 | 150 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
export type TextSizes = "xs" | "sm" | "base" | "md" | "m" | "lg";
export type TextWeights = "regular" | "bold";
export type TextVariants = HeadingTextVariants | BodyTextVariants | ButtonTextVariants | CaptionTextVariants;

export type Color = PrimaryColor | SecondaryColor | SuccessColor | NeutralColor | TertiaryColor | ErrorColor;

export type PrimaryColor = "primary" | "primary-100" | "primary-200" | "primary-300" | "primary-400" | "primary-500";
export type SecondaryColor =
  | "secondary"
  | "secondary-100"
  | "secondary-200"
  | "secondary-300"
  | "secondary-400"
  | "secondary-500";
export type SuccessColor = "success" | "success-100" | "success-200" | "success-300" | "success-400" | "success-500";
export type NeutralColor =
  | "neutral"
  | "neutral-50"
  | "neutral-100"
  | "neutral-150"
  | "neutral-200"
  | "neutral-300"
  | "neutral-400"
  | "neutral-500"
  | "neutral-600"
  | "neutral-700"
  | "neutral-800"
  | "neutral-900"
  | "neutral-1000";
export type TertiaryColor =
  | "tertiary"
  | "tertiary-100"
  | "tertiary-200"
  | "tertiary-300"
  | "tertiary-400"
  | "tertiary-500";
export type ErrorColor = "error" | "error-100" | "error-200" | "error-300" | "error-400" | "error-500";

export type HeadingTextVariants =
  | "text-heading-2000"
  | "text-heading-1000"
  | "text-bold-headline-800"
  | "text-bold-headline-1000"
  | "text-heading-700"
  | "text-heading-600"
  | "text-heading-500"
  | "text-heading-400"
  | "text-heading-300"
  | "text-heading-200"
  | "text-heading-100"
  | "text-bold-subtitle-600"
  | "text-bold-subtitle-500"
  | "text-light-subtitle-400"
  | "text-bold-subtitle-400";

export type BodyTextVariants =
  | "text-body-1200"
  | "text-body-1100"
  | "text-body-1000"
  | "text-body-900"
  | "text-body-800"
  | "text-body-700"
  | "text-body-600"
  | "text-body-500"
  | "text-body-400"
  | "text-body-300"
  | "text-body-200"
  | "text-body-100"
  | "text-light-body-300"
  | "text-bold-body-300";

export type CaptionTextVariants = "text-bold-caption-200" | "text-light-caption-200" | "text-bold-caption-100";

export type ButtonTextVariants =
  | "text-button-400"
  | "text-button-300"
  | "text-button-200"
  | "text-button-100"
  | "text-button-700";

export type Option = {
  title: string;
  value: OptionValue;
  meta?: any;
};
export type OptionValue = string | number;

export type OptionWithBoolean = {
  title: string;
  value: OptionValueWithBoolean;
  meta?: any;
};
export type OptionValueWithBoolean = string | number | boolean;

export enum FileType {
  ImagesAndDocs = "image/png, image/jpeg, application/pdf, application/msword",
  Image = "image/png, image/jpeg",
  Media = "image/png, image/jpeg, image/gif, video/mp4, video/quicktime",
  ImageTiff = "image/tiff",
  ImagePdf = "application/pdf, image/png, image/jpeg",
  Pdf = "application/pdf",
  Video = "video/mp4, video/quicktime",
  Csv = "text/csv",
  ShapeFiles = "application/zip, application/x-zip-compressed, .kml, .json, .geojson, .kml, .shp, .dbf, .shx",
  Document = "application/pdf, application/msword",
  Xlsx = "application/xlsx, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel",
  CsvExcel = "application/xlsx, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, text/csv"
}

export type UploadedFile = {
  //Server side data
  uuid: string;
  url: string;
  size: number;
  file_name: string;
  mime_type: string;
  title: string;
  created_at: string;
  collection_name: string;
  is_public?: boolean;

  //Client side data
  rawFile?: File;
  uploadState?: {
    isLoading?: boolean;
    isSuccess?: boolean;
    isDeleting?: boolean;
    error?: string;
  };
};

export type Status = "edit" | "error" | "success" | "awaiting" | "warning";

export type EntityName = BaseModelNames | ReportsModelNames;
export type BaseModelNames = "projects" | "sites" | "nurseries";
export type ReportsModelNames = "project-reports" | "site-reports" | "nursery-reports";

export type SingularEntityName = SingularBaseModelNames | SingularReportsModelNames;
export type SingularBaseModelNames = "project" | "site" | "nursery";
export type SingularReportsModelNames = "project-report" | "site-report" | "nursery-report";

export type Entity = {
  entityName: EntityName | SingularEntityName;
  entityUUID: string;
};

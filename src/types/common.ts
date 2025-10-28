import pluralize from "pluralize";
import { ReactNode } from "react";

import { MediaDto } from "@/generated/v3/entityService/entityServiceSchemas";

export type Colors =
  | "white"
  | "black"
  | "neutral"
  | "secondary"
  | "tertiary"
  | "primary"
  | "success"
  | "error"
  | "success-600";
export type ColorCodes = "none" | 50 | 100 | 150 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
export type TextVariants =
  | HeadingTextVariants
  | BodyTextVariants
  | ButtonTextVariants
  | CaptionTextVariants
  | TextVariantNew;

export type TextVariantNew =
  | "text-8-light"
  | "text-8"
  | "text-8-semibold"
  | "text-8-bold"
  | "text-10-light"
  | "text-10"
  | "text-10-semibold"
  | "text-10-bold"
  | "text-12-light"
  | "text-12"
  | "text-12-semibold"
  | "text-12-bold"
  | "text-13-light"
  | "text-13"
  | "text-13-semibold"
  | "text-13-bold"
  | "text-14-light"
  | "text-14"
  | "text-14-semibold"
  | "text-14-bold"
  | "text-16-light"
  | "text-16"
  | "text-16-semibold"
  | "text-16-bold"
  | "text-18-light"
  | "text-18"
  | "text-18-semibold"
  | "text-18-bold"
  | "text-20-light"
  | "text-20"
  | "text-20-semibold"
  | "text-20-bold"
  | "text-24-light"
  | "text-24"
  | "text-24-semibold"
  | "text-24-bold"
  | "text-22-light"
  | "text-22"
  | "text-22-semibold"
  | "text-22-bold"
  | "text-26-light"
  | "text-26"
  | "text-26-semibold"
  | "text-26-bold"
  | "text-28-light"
  | "text-28"
  | "text-28-semibold"
  | "text-28-bold"
  | "text-32-light"
  | "text-32"
  | "text-32-semibold"
  | "text-32-bold"
  | "text-36-light"
  | "text-36"
  | "text-36-semibold"
  | "text-36-bold"
  | "text-40-light"
  | "text-40"
  | "text-40-semibold"
  | "text-40-bold"
  | "text-48-light"
  | "text-48"
  | "text-48-semibold"
  | "text-48-bold"
  | "text-56-light"
  | "text-56"
  | "text-56-semibold"
  | "text-56-bold"
  | "text-72-light"
  | "text-72"
  | "text-72-semibold"
  | "text-72-bold";

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
  | "text-normal-subtitle-400"
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
  | "text-bold-body-300"
  | "text-14-light"
  | "text-14-bold"
  | "text-dark-500"
  | "text-32-bold"
  | "text-12-light"
  | "text-12-bold";

export type CaptionTextVariants = "text-bold-caption-200" | "text-light-caption-200" | "text-bold-caption-100";

export type ButtonTextVariants =
  | "text-button-400"
  | "text-button-300"
  | "text-button-200"
  | "text-button-100"
  | "text-button-700";

export type Option = {
  prefix?: ReactNode;
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
  ImagePdf = "application/pdf, image/png, image/jpeg",
  Pdf = "application/pdf",
  Video = "video/mp4, video/quicktime",
  Csv = "text/csv",
  AcceptedShapefiles = ".zip, .kml, .geojson",
  Document = "application/pdf, application/msword",
  CsvExcel = "application/xlsx, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, text/csv"
}

export const mediaToUploadedFile = (media: MediaDto, rawFile?: File, uploadState?: UploadState): UploadedFile => ({
  uuid: media.uuid,
  url: media.url ?? "",
  thumbUrl: media.thumbUrl ?? undefined,
  size: media.size,
  fileName: media.fileName,
  mimeType: media.mimeType ?? "",
  createdAt: media.createdAt,
  collectionName: media.collectionName,
  isPublic: media.isPublic,
  isCover: media.isCover,
  lat: media.lat ?? undefined,
  lng: media.lng ?? undefined,
  rawFile,
  uploadState
});

export type UploadState = {
  isLoading?: boolean;
  isSuccess?: boolean;
  isDeleting?: boolean;
  error?: string;
};

export type UploadedFile = {
  // Server side data
  uuid: string;
  url: string;
  thumbUrl?: string;
  size: number;
  fileName: string;
  mimeType: string;
  createdAt: string;
  collectionName: string;
  isPublic?: boolean;
  isCover?: boolean;
  lat?: number;
  lng?: number;

  // Client side data
  rawFile?: File;
  uploadState?: UploadState;
};

export type Status = "edit" | "error" | "success" | "awaiting" | "warning" | "restoration";

export type EntityName = BaseModelNames | ReportsModelNames;
export type BaseModelNames = "projects" | "sites" | "nurseries" | "project-pitches";
export type ReportsModelNames =
  | "project-reports"
  | "site-reports"
  | "nursery-reports"
  | "projectReports"
  | "nurseryReports"
  | "financial-reports"
  | "siteReports"
  | "financialReports"
  | "disturbanceReports"
  | "disturbance-reports"
  | "srp-reports";

export const isReportModelName = (name: EntityName): name is ReportsModelNames => name.endsWith("-reports");

export type SingularEntityName = SingularBaseModelNames | SingularReportsModelNames;
export type SingularBaseModelNames = "project" | "site" | "nursery" | "project-pitch";
export type SingularReportsModelNames =
  | "project-report"
  | "site-report"
  | "nursery-report"
  | "projectReport"
  | "nurseryReport"
  | "financialReport"
  | "financial-report"
  | "siteReport"
  | "disturbanceReport"
  | "disturbance-report";

export const isSingularEntityName = (name: EntityName | SingularEntityName): name is SingularEntityName =>
  pluralize.isSingular(name);

export type Entity = {
  entityName: EntityName | SingularEntityName;
  entityUUID: string;
};

export type OptionInputType = {
  id: OptionValue;
  name: string;
};

import { IconNames } from "@/components/extensive/Icon/Icon";
import { TextVariants } from "@/types/common";

export interface FileCardContentVariant {
  iconContainer: string;
  iconClassName: string;
  iconName: IconNames;
  iconHasPreview: string;
  titleVariant: TextVariants;
  titleClassName: string;
  subTitletitleVariant: TextVariants;
  subTitleClassName: string;
  bodyTextVariant?: string;
  status?: boolean;
}

export interface FilePreviewCardVariant {
  fileWrapper: string;
  fileCardContent: string;
  fileCardContentVariant: FileCardContentVariant;
  type?: "geoFile" | "image";
  typeModal?: "UploadImage" | "WithMap";
}

export interface FileInputVariant {
  container?: string;
  snapshotPanel?: boolean;
  listPreview?: string;
  listPreviewDescription?: string;
  filePreviewVariant?: FilePreviewCardVariant;
}
export const VARIANT_FILE_CARD_DEFAULT: FileCardContentVariant = {
  iconContainer: "flex h-15 w-15 items-center justify-center rounded-lg bg-cover bg-no-repeat",
  iconClassName: "w-6 h-8",
  iconName: IconNames.DOCUMENT,
  iconHasPreview: "hidden",
  titleVariant: "text-bold-subtitle-400",
  titleClassName: "mb-1 line-clamp-1",
  subTitletitleVariant: "text-light-body-300",
  subTitleClassName: "line-clamp-1"
};

export const VARIANT_FILE_CARD_MODAL_ADD: FileCardContentVariant = {
  iconContainer: "rounded-lg bg-neutral-150 p-2",
  iconClassName: "h-6 w-6 text-grey-720",
  iconName: IconNames.POLYGON,
  iconHasPreview: "",
  titleVariant: "text-12",
  titleClassName: "",
  subTitletitleVariant: "text-12",
  subTitleClassName: "opacity-50"
};
export const VARIANT_FILE_CARD_MODAL_ADD_IMAGES: FileCardContentVariant = {
  iconContainer: "rounded-lg bg-neutral-150 p-2",
  iconClassName: "h-6 w-6 text-grey-720",
  iconName: IconNames.IMAGE,
  iconHasPreview: "",
  titleVariant: "text-12",
  titleClassName: "w-full truncate",
  subTitletitleVariant: "text-12",
  subTitleClassName: "opacity-50",
  bodyTextVariant: "w-[50%] flex-none",
  status: true
};

export const VARIANT_FILE_PREVIEW_CARD_DEFAULT: FilePreviewCardVariant = {
  fileWrapper: "flex w-full items-center justify-between gap-4 rounded-xl bg-white p-4 shadow w-[400px]",
  fileCardContent: "flex items-center justify-center gap-3 ",
  fileCardContentVariant: VARIANT_FILE_CARD_MODAL_ADD
};

export const VARIANT_FILE_PREVIEW_CARD_MODAL: FilePreviewCardVariant = {
  fileWrapper:
    "border-grey-75 flex items-center justify-between rounded-lg border border-grey-750 py-[10px] pr-6 pl-4 w-full",
  fileCardContent: "flex items-center justify-center gap-3",
  fileCardContentVariant: VARIANT_FILE_CARD_MODAL_ADD,
  type: "geoFile",
  typeModal: "UploadImage"
};

export const VARIANT_FILE_PREVIEW_CARD_MODAL_ADD_IMAGES: FilePreviewCardVariant = {
  fileWrapper:
    "border-grey-75 flex items-center justify-start rounded-lg border border-grey-750 py-4 lg:py-[10px] lg:px-4 px-3  w-full",
  fileCardContent: "flex items-center justify-start gap-3 contents",
  fileCardContentVariant: VARIANT_FILE_CARD_MODAL_ADD_IMAGES,
  type: "image",
  typeModal: "UploadImage"
};

export const VARIANT_FILE_PREVIEW_CARD_MODAL_ADD_IMAGES_WITH_MAP: FilePreviewCardVariant = {
  fileWrapper:
    "border-grey-75 flex items-center justify-start rounded-lg border border-grey-750 py-4 lg:py-[10px] lg:px-4 px-3  w-full",
  fileCardContent: "flex items-center justify-start gap-3 contents",
  fileCardContentVariant: VARIANT_FILE_CARD_MODAL_ADD_IMAGES,
  type: "image",
  typeModal: "WithMap"
};

export const VARIANT_FILE_INPUT_DEFAULT: FileInputVariant = {
  container: "border-dashed-2 relative cursor-pointer rounded-xl p-10",
  snapshotPanel: false,
  listPreview: "mt-8 flex flex-col items-center justify-center gap-8"
};

export const VARIANT_FILE_INPUT_MODAL_ADD: FileInputVariant = {
  container: "flex flex-col items-center justify-center rounded-lg border border-grey-750 py-8",
  snapshotPanel: true,
  listPreview: "flex flex-col gap-4 w-full mt-2 mb-4",
  listPreviewDescription: "flex items-center justify-between",
  filePreviewVariant: VARIANT_FILE_PREVIEW_CARD_MODAL
};

export const VARIANT_FILE_INPUT_MODAL_ADD_IMAGES: FileInputVariant = {
  container: "flex flex-col items-center justify-center rounded-lg border border-grey-750 py-8",
  snapshotPanel: true,
  listPreview: "flex flex-col gap-4 w-full mt-2 mb-4",
  listPreviewDescription: "flex items-center justify-between",
  filePreviewVariant: VARIANT_FILE_PREVIEW_CARD_MODAL_ADD_IMAGES
};

export const VARIANT_FILE_INPUT_MODAL_ADD_IMAGES_WITH_MAP: FileInputVariant = {
  container: "flex flex-col items-center justify-center rounded-lg border border-grey-750 py-8",
  snapshotPanel: true,
  listPreview: "flex flex-col gap-4 w-full mt-2 mb-4",
  listPreviewDescription: "flex items-center justify-between",
  filePreviewVariant: VARIANT_FILE_PREVIEW_CARD_MODAL_ADD_IMAGES_WITH_MAP
};

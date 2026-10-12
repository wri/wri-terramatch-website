import { MediaMapEntryDto } from "@/generated/v3/entityService/entityServiceSchemas";

export type MapMedia = MediaMapEntryDto;

// Callbacks shared by both media rendering strategies (champions photo layer + legacy admin symbol layer).
export type MediaCallbacks = {
  setImageCover: (uuid: string) => void;
  handleDownload: (uuid: string, fileName: string) => void;
  handleDelete: (uuid: string) => void;
  openModalImageDetail: (uuid: string) => void;
  isProjectPath: boolean;
};

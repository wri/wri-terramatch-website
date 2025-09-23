import { connectionHook, connectionSelector } from "@/connections/util/connectionShortcuts";
import { uploadFile } from "@/generated/v3/entityService/entityServiceComponents";
import { MediaDto } from "@/generated/v3/entityService/entityServiceSchemas";

import { v3Resource } from "./util/apiConnectionFactory";

export type UploadFileProps = {
  entity:
    | "projects"
    | "sites"
    | "nurseries"
    | "projectReports"
    | "siteReports"
    | "nurseryReports"
    | "organisations"
    | "auditStatuses"
    | "forms"
    | "formQuestionOptions"
    | "fundingProgrammes"
    | "impactStories"
    | "financialIndicators";
  collection: string;
  uuid: string;
};

export const uploadFileConnection = v3Resource("media", uploadFile)
  .create<MediaDto, UploadFileProps>(({ entity, collection, uuid }: UploadFileProps) => ({
    pathParams: { entity, collection, uuid }
  }))
  .buildConnection();

export const useUploadFile = connectionHook(uploadFileConnection);
export const selectUploadFile = connectionSelector(uploadFileConnection);

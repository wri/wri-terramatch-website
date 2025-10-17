import { uploadFile } from "@/generated/v3/entityService/entityServiceComponents";
import { parallelRequestHook } from "@/utils/parallelRequestHook";

export const useUploadFile = parallelRequestHook("media", uploadFile);

import { CreateParams, UpdateParams } from "react-admin";

import {
  fetchPostV2FileUploadMODELCOLLECTIONUUID,
  PostV2FileUploadMODELCOLLECTIONUUIDPathParams
} from "@/generated/apiComponents";

export const upload = (file: File, pathParams: PostV2FileUploadMODELCOLLECTIONUUIDPathParams) => {
  const body = new FormData();
  body.append("upload_file", file);
  //@ts-ignore
  return fetchPostV2FileUploadMODELCOLLECTIONUUID({ pathParams, body });
};

export const handleUploads = (
  params: CreateParams<any> | UpdateParams<any>,
  uploadKeys: string[],
  pathParams: Omit<PostV2FileUploadMODELCOLLECTIONUUIDPathParams, "collection">
) => {
  let uploads: { file: File; key: string }[] = [];

  uploadKeys.forEach(key => {
    const field = params.data[key];
    if (Array.isArray(field)) {
      //Expand multi-upload keys
      uploads = [...uploads, ...field.map(field => ({ file: field?.rawFile, key }))];
    } else {
      return uploads.push({ file: field?.rawFile, key });
    }
  });

  return Promise.all(
    uploads
      .filter(({ file }) => file && file instanceof File)
      .map(({ file, key }) => upload(file, { ...pathParams, collection: key }))
  );
};

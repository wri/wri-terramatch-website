import { CreateParams, UpdateParams } from "react-admin";

import {
  uploadFile,
  UploadFilePathParams
} from "@/generated/v3/entityService/entityServiceComponents";

export const upload = (file: File, pathParams: UploadFilePathParams) => {
  const body = new FormData();
  body.append("uploadFile", file);
  //@ts-ignore
  return uploadFile({ pathParams, body, headers: { "Content-Type": "multipart/form-data" } });
};

export const handleUploads = (
  params: CreateParams<any> | UpdateParams<any>,
  uploadKeys: string[],
  pathParams: Omit<UploadFilePathParams, "collection">
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

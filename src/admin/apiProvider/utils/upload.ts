import { CreateParams, UpdateParams } from "react-admin";

import { prepareFileForUpload } from "@/connections/Media";
import { uploadFile, UploadFileVariables } from "@/generated/v3/entityService/entityServiceComponents";

export const upload = async (file: File, pathParams: UploadFileVariables["pathParams"]) => {
  return await uploadFile.fetchParallel({
    pathParams,
    body: { data: { type: "media", attributes: await prepareFileForUpload(file) } }
  });
};

export const handleUploads = (
  params: CreateParams | UpdateParams,
  uploadKeys: string[],
  pathParams: Omit<UploadFileVariables["pathParams"], "collection">
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

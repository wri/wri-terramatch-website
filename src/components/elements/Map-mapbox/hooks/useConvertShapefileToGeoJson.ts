import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import JSZip from "jszip";

export const useConvertShapeFileToGeoJson = (
  options?: Omit<UseMutationOptions<Response, any, { file: File }>, "mutationFn">
) => {
  return useMutation<any, any, { file: File }>({
    mutationFn: async variables => {
      const formData = new FormData();

      if (variables.file.type === "application/zip") {
        const zipFile = variables.file;
        const zip = await JSZip.loadAsync(zipFile);

        const files = Object.values(zip.files);

        const convertedZip = new JSZip();

        for (const file of files) {
          if (!file.dir) {
            const fileName = file.name.split("/").pop() ?? "";
            const content = await file.async("arraybuffer");
            convertedZip.file(fileName, content, { binary: true });
          }
        }
        const convertedZipBlob = await convertedZip.generateAsync({ type: "blob" });
        formData.append("upload", convertedZipBlob, "convertedZip.zip");
      } else {
        formData.append("upload", variables.file);
      }

      formData.append("rfc7946", "true");

      return fetch("https://ogre.adc4gis.com/convert", {
        method: "POST",
        body: formData
      });
    },
    ...options
  });
};

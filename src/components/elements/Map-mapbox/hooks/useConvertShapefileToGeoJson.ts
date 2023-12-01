import { useMutation, UseMutationOptions } from "@tanstack/react-query";

export const useConvertShapeFileToGeoJson = (
  options?: Omit<UseMutationOptions<Response, any, { file: File }>, "mutationFn">
) => {
  return useMutation<any, any, { file: File }>({
    mutationFn: variables => {
      const formData = new FormData();
      formData.append("upload", variables.file);
      formData.append("rfc7946", "true");

      return fetch("https://ogre.adc4gis.com/convert", {
        method: "POST",
        body: formData
      });
    },
    ...options
  });
};

import { useMemo } from "react";

import { useGetV2MODELUUIDImageLocations } from "@/generated/apiComponents";
import { EntityName } from "@/types/common";

/**
 * To compile list of images for an entity into a FeatureCollection to be used in on the map
 * @param modelName EntityName
 * @param uuid string
 * @returns GeoJSON(FeatureCollection)
 */
export const useGetImagesGeoJSON = (modelName: EntityName, uuid: string) => {
  const { data } = useGetV2MODELUUIDImageLocations({
    pathParams: { model: modelName, uuid }
  });

  return useMemo(() => {
    return data?.data?.length! > 0
      ? {
          type: "FeatureCollection",
          features: data?.data?.map(image => ({
            type: "Feature",
            properties: {
              id: image.uuid,
              thumb_url: image.thumb_url,
              //@ts-expect-error
              image_url: image.file_url
            },
            geometry: {
              type: "Point",
              coordinates: [image.location?.lng, image.location?.lat]
            }
          }))
        }
      : undefined;
  }, [data]);
};

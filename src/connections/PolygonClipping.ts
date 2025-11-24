import {
  createClippedVersions,
  createPolygonListClippedVersions
} from "@/generated/v3/researchService/researchServiceComponents";
import { PolygonListClippingRequestBody } from "@/generated/v3/researchService/researchServiceSchemas";

export const clipPolygonsForSite = (siteUuid: string): void => {
  createClippedVersions.fetch({
    queryParams: { siteUuid }
  });
};

export const clipPolygonsForProject = (projectUuid: string): void => {
  createClippedVersions.fetch({
    queryParams: { projectUuid }
  });
};

export const clipPolygonList = (polygonUuids: string[]): void => {
  const body: PolygonListClippingRequestBody = {
    data: {
      type: "polygon-clipping",
      attributes: {
        polygonUuids
      }
    }
  };

  createPolygonListClippedVersions.fetch({ body });
};

export const clipSinglePolygon = (polygonUuid: string): void => {
  return clipPolygonList([polygonUuid]);
};

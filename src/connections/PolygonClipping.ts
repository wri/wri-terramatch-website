import {
  createClippedVersions,
  createPolygonListClippedVersions
} from "@/generated/v3/researchService/researchServiceComponents";
import { PolygonListClippingRequestBody } from "@/generated/v3/researchService/researchServiceSchemas";

export const clipPolygonsForSite = (siteUuid: string): void => {
  createClippedVersions.fetchParallel({
    queryParams: { siteUuid }
  });
};

export const clipPolygonsForProject = (projectUuid: string): void => {
  createClippedVersions.fetchParallel({
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

  createPolygonListClippedVersions.fetchParallel({ body });
};

export const clipSinglePolygon = (polygonUuid: string): void => {
  return clipPolygonList([polygonUuid]);
};

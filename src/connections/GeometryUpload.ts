import {
  compareGeometryFile,
  uploadGeometryFile,
  uploadGeometryFileWithVersions,
  uploadVersionForSitePolygon
} from "@/generated/v3/researchService/researchServiceComponents";
import { GeometryUploadAttributesDto } from "@/generated/v3/researchService/researchServiceSchemas";
import { WithFormData } from "@/generated/v3/utils";
import { parallelRequestHook } from "@/utils/parallelRequestHook";

export const prepareGeometryForUpload = (file: File, siteId: string): WithFormData<GeometryUploadAttributesDto> => {
  const formData = new FormData();
  formData.append("file", file);
  return { siteId, formData };
};

export const useUploadGeometry = parallelRequestHook("sitePolygons", uploadGeometryFile);
export const useCompareGeometry = parallelRequestHook("sitePolygons", compareGeometryFile);
export const useUploadGeometryWithVersions = parallelRequestHook("sitePolygons", uploadGeometryFileWithVersions);

export const uploadVersionForPolygon = async (polygonUuid: string, file: File, siteId: string): Promise<void> => {
  const attributes = prepareGeometryForUpload(file, siteId);
  await uploadVersionForSitePolygon.fetchParallel({
    pathParams: { uuid: polygonUuid },
    body: {
      data: {
        type: "sitePolygons",
        attributes
      }
    }
  });
};

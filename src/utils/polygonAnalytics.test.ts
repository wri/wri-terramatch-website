import type { ValidationDto } from "@/generated/v3/researchService/researchServiceSchemas";

import {
  classifyUploadFailureErrorType,
  formatPolygonTargetId,
  inferUploadFileFormat,
  isFirstPassValidation,
  resolveActivePolygonFilterTypes,
  resolveValidationErrorTypes
} from "./polygonAnalytics";

describe("polygonAnalytics", () => {
  describe("formatPolygonTargetId", () => {
    it("returns bulk for empty and multi selections", () => {
      expect(formatPolygonTargetId([])).toBe("bulk");
      expect(formatPolygonTargetId(["a", "b"])).toBe("bulk");
    });

    it("returns the polygon id for a single selection", () => {
      expect(formatPolygonTargetId(["polygon-1"])).toBe("polygon-1");
    });
  });

  describe("inferUploadFileFormat", () => {
    it("maps supported upload extensions", () => {
      expect(inferUploadFileFormat("site.geojson")).toBe("geojson");
      expect(inferUploadFileFormat("site.kml")).toBe("kml");
      expect(inferUploadFileFormat("site.zip")).toBe("shapefile");
    });
  });

  describe("classifyUploadFailureErrorType", () => {
    it("classifies common upload failures", () => {
      expect(classifyUploadFailureErrorType("Unsupported file format")).toBe("file_format");
      expect(classifyUploadFailureErrorType("File exceeds size limit")).toBe("size_limit");
      expect(classifyUploadFailureErrorType("Invalid geometry")).toBe("geometry");
    });
  });

  describe("resolveValidationErrorTypes", () => {
    it("maps failed criteria ids to error types", () => {
      const validation: ValidationDto = {
        polygonUuid: "polygon-1",
        criteriaList: [
          {
            criteriaId: 3,
            validationType: "OVERLAPPING",
            valid: false,
            createdAt: "2025-11-28T20:41:50.060Z"
          },
          {
            criteriaId: 14,
            validationType: "DATA_COMPLETENESS",
            valid: false,
            createdAt: "2025-11-28T20:41:50.060Z"
          }
        ]
      };

      expect(resolveValidationErrorTypes(validation)).toEqual(["overlap", "incomplete"]);
    });
  });

  describe("isFirstPassValidation", () => {
    it("detects unchecked validation states", () => {
      expect(isFirstPassValidation(undefined)).toBe(true);
      expect(isFirstPassValidation("not_checked")).toBe(true);
      expect(isFirstPassValidation("passed")).toBe(false);
    });
  });

  describe("resolveActivePolygonFilterTypes", () => {
    it("returns canonical filter type names", () => {
      expect(
        resolveActivePolygonFilterTypes({
          polygonStatus: ["draft"],
          validationStatus: ["failed"],
          plantStartFrom: "",
          plantStartTo: "",
          practice: [],
          targetSys: [],
          submissionCycle: [],
          hasOverlap: true
        })
      ).toEqual(["status", "validation_result", "overlap"]);
    });
  });
});

import {
  getPolygonUploadErrorCopy,
  resolvePolygonUploadErrorVariant,
  resolvePolygonUploadErrorVariantFromUnknown
} from "./polygonUploadErrors";

const identityTranslate = (message: string) => message;

describe("polygonUploadErrors", () => {
  describe("resolvePolygonUploadErrorVariant", () => {
    it("maps backend messages to dedicated upload error variants", () => {
      expect(resolvePolygonUploadErrorVariant("ZIP file must contain a .shp file.")).toBe("shapefile_not_found");
      expect(resolvePolygonUploadErrorVariant("File contains 3D coordinates")).toBe("coordinate_system");
      expect(resolvePolygonUploadErrorVariant("Unsupported coordinate projection")).toBe("projection");
      expect(resolvePolygonUploadErrorVariant("Invalid Geometry: Linear Ring Error")).toBe("linear_ring");
      expect(resolvePolygonUploadErrorVariant("File exceeds maximum upload size of 50MB")).toBe("size_limit");
      expect(resolvePolygonUploadErrorVariant("Unsupported file format. Supported formats: KML (.kml)...")).toBe(
        "unsupported_format"
      );
      expect(resolvePolygonUploadErrorVariant("File contains both points and polygons")).toBe("mixed_geometry_types");
    });

    it("returns fallback for unknown backend messages", () => {
      expect(resolvePolygonUploadErrorVariant("Database connection not available")).toBe("fallback");
      expect(resolvePolygonUploadErrorVariant("")).toBe("fallback");
    });
  });

  describe("getPolygonUploadErrorCopy", () => {
    it("returns ticket copy for shapefile missing errors", () => {
      const copy = getPolygonUploadErrorCopy("shapefile_not_found", identityTranslate);

      expect(copy.summary).toContain(".shp file");
      expect(copy.bullets).toEqual(["A .shp file", "Its associated .dbf and .prj files"]);
    });

    it("returns ticket copy for mixed geometry errors", () => {
      const copy = getPolygonUploadErrorCopy("mixed_geometry_types", identityTranslate);

      expect(copy.summary).toContain("both points and polygons");
      expect(copy.emphasis).toBe("Files must contain only one geometry type.");
      expect(copy.bullets).toEqual(["Points only", "Polygons or multipolygons only"]);
    });

    it("uses instructions line before bullets for projection errors", () => {
      const copy = getPolygonUploadErrorCopy("projection", identityTranslate);

      expect(copy.summary).toBe("This file uses an unsupported coordinate projection.");
      expect(copy.instructions).toBe("Please re-export your file using:");
      expect(copy.bullets).toEqual(["WGS-84 projection (EPSG:4326)"]);
    });

    it("returns fallback copy for unexpected errors", () => {
      const copy = getPolygonUploadErrorCopy("fallback", identityTranslate);

      expect(copy.summary).toBe("Something went wrong with your upload. Please check your file and try again.");
    });
  });

  describe("resolvePolygonUploadErrorVariantFromUnknown", () => {
    it("maps API error payloads with array messages", () => {
      expect(
        resolvePolygonUploadErrorVariantFromUnknown({
          statusCode: 400,
          message: ["File contains 3D coordinates"]
        })
      ).toBe("coordinate_system");
    });
  });
});

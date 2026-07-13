import { extractErrorMessage } from "@/utils/errors";

export type PolygonUploadErrorVariant =
  | "shapefile_not_found"
  | "coordinate_system"
  | "projection"
  | "linear_ring"
  | "size_limit"
  | "unsupported_format"
  | "mixed_geometry_types"
  | "fallback";

type UploadErrorPattern = {
  variant: Exclude<PolygonUploadErrorVariant, "fallback">;
  pattern: RegExp;
};

const UPLOAD_ERROR_PATTERNS: UploadErrorPattern[] = [
  { variant: "shapefile_not_found", pattern: /zip file must contain a \.(shp|dbf)|invalid shapefile format/i },
  { variant: "coordinate_system", pattern: /3d coordinate|contains 3d coordinates/i },
  { variant: "projection", pattern: /unsupported coordinate projection|unsupported projection/i },
  { variant: "linear_ring", pattern: /linear ring error|invalid geometry: linear ring/i },
  {
    variant: "size_limit",
    pattern: /50\s*mb|file exceeds maximum upload size|payload too large|entity too large|413/i
  },
  { variant: "unsupported_format", pattern: /unsupported file format/i },
  {
    variant: "mixed_geometry_types",
    pattern: /both points and polygons|only one geometry type|contains both points and polygons/i
  }
];

export const resolvePolygonUploadErrorVariant = (backendMessage: string): PolygonUploadErrorVariant => {
  const normalizedMessage = backendMessage.trim();
  if (normalizedMessage === "") {
    return "fallback";
  }

  for (const { variant, pattern } of UPLOAD_ERROR_PATTERNS) {
    if (pattern.test(normalizedMessage)) {
      return variant;
    }
  }

  return "fallback";
};

export const resolvePolygonUploadErrorVariantFromUnknown = (error: unknown): PolygonUploadErrorVariant => {
  return resolvePolygonUploadErrorVariant(extractErrorMessage(error));
};

export type PolygonUploadErrorCopy = {
  summary: string;
  emphasis?: string;
  instructions?: string;
  bullets?: string[];
};

type TranslateFn = (message: string) => string;

export const getPolygonUploadErrorCopy = (
  variant: PolygonUploadErrorVariant,
  t: TranslateFn
): PolygonUploadErrorCopy => {
  switch (variant) {
    case "shapefile_not_found":
      return {
        summary: t("This ZIP file does not contain a valid .shp file. Please check your file and try again."),
        instructions: t("Upload a ZIP file that includes:"),
        bullets: [t("A .shp file"), t("Its associated .dbf and .prj files")]
      };
    case "coordinate_system":
      return {
        summary: t("This file contains 3D coordinates (x, y, z). Only 2D coordinates are supported."),
        instructions: t("Please re-export your file using:"),
        bullets: [t("2D coordinates (x, y) only")]
      };
    case "projection":
      return {
        summary: t("This file uses an unsupported coordinate projection."),
        instructions: t("Please re-export your file using:"),
        bullets: [t("WGS-84 projection (EPSG:4326)")]
      };
    case "linear_ring":
      return {
        summary: t("This file contains one or more polygons with invalid linear-ring geometry."),
        instructions: t("Upload polygons that:"),
        bullets: [t("Have at least 4 coordinates"), t("The first and last coordinates are the same")]
      };
    case "size_limit":
      return {
        summary: t("This file exceeds the maximum upload size of 50MB."),
        instructions: t("Please try one of the following:"),
        bullets: [
          t("Split the file into smaller uploads"),
          t("Simplify polygon geometries to reduce file size"),
          t("Remove unnecessary attributes or metadata from the file")
        ]
      };
    case "unsupported_format":
      return {
        summary: t("This file format is not supported. Upload a valid: .shp, .kml, or .geojson file.")
      };
    case "mixed_geometry_types":
      return {
        summary: t("This file contains both points and polygons. "),
        emphasis: t("Files must contain only one geometry type."),
        instructions: t("Upload either:"),
        bullets: [t("Points only"), t("Polygons or multipolygons only")]
      };
    case "fallback":
      return {
        summary: t("Something went wrong with your upload. Please check your file and try again.")
      };
  }
};

export const getPolygonUploadErrorTitle = (t: TranslateFn): string => t("Upload error");

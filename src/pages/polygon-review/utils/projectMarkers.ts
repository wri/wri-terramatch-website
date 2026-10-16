import { BBox } from "@/components/elements/Map-mapbox/GeoJSON";
import type { ProjectMarkerPoint } from "@/components/elements/Map-mapbox/layers/projectMarkerLayer";
import { ProjectMapEntryDto } from "@/generated/v3/researchService/researchServiceSchemas";

/** Projects without polygons have no centroid; they stay selectable in the picker but get no marker. */
export const toProjectMarkerPoints = (projects: ProjectMapEntryDto[]): ProjectMarkerPoint[] =>
  projects.flatMap(({ uuid, lat, long }) => (lat == null || long == null ? [] : [{ uuid, lat, lng: long }]));

export const getProjectMarkersBbox = (points: ProjectMarkerPoint[]): BBox | undefined => {
  if (points.length === 0) return undefined;

  const lngs = points.map(({ lng }) => lng);
  const lats = points.map(({ lat }) => lat);
  return [Math.min(...lngs), Math.min(...lats), Math.max(...lngs), Math.max(...lats)];
};

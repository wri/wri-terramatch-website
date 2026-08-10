import type { FeatureCollection } from "geojson";
import mapboxgl from "mapbox-gl";
import { useEffect, useRef } from "react";

import { mapboxToken } from "@/constants/environment";

/**
 * A read-only map for the drill-down, on its own Mapbox instance.
 *
 * Deliberately isolated from the app's shared map context: this map answers one question — "where
 * is the thing I am currently looking at, and what can I descend into" — and coupling it to the
 * editing map would drag in selection state and tooling that would only get in the way.
 *
 * Selection is driven by the URL, not by internal state, so the map and the indicator panel can
 * never disagree about which level is being shown.
 */
// Pulled from the WRI palette (tailwind.theme.js) rather than picked by eye, so the map agrees
// with the panel beside it.
const POLYGON_FILL = "#78CAED"; // primary.500
const POLYGON_LINE = "#11688D"; // primary.700
const SELECTED = "#A88100"; // warning.500

const SOURCE_ID = "semantic-zoom-polygons";
const FILL_LAYER = "semantic-zoom-fill";
const LINE_LAYER = "semantic-zoom-line";

export interface DrilldownMapProps {
  featureCollection?: FeatureCollection | null;
  /** Polygon uuid currently selected, if any. */
  selectedId?: string | null;
  /**
   * Receives the polygon's site as well, because a click at project scope has to establish both
   * halves of the path — the panel cannot resolve a polygon without knowing its site.
   */
  onSelectPolygon?: (uuid: string, siteId?: string | null) => void;
  loading?: boolean;
}

/** Walks coordinates rather than pulling in turf for one bounding box. */
const boundsOf = (collection: FeatureCollection): mapboxgl.LngLatBounds | null => {
  let west = Infinity;
  let south = Infinity;
  let east = -Infinity;
  let north = -Infinity;

  const visit = (coords: unknown): void => {
    if (!Array.isArray(coords)) return;
    if (typeof coords[0] === "number" && typeof coords[1] === "number") {
      const [lng, lat] = coords as [number, number];
      if (!Number.isFinite(lng) || !Number.isFinite(lat)) return;
      west = Math.min(west, lng);
      east = Math.max(east, lng);
      south = Math.min(south, lat);
      north = Math.max(north, lat);
      return;
    }
    for (const child of coords) visit(child);
  };

  for (const feature of collection.features) {
    if (feature.geometry != null && "coordinates" in feature.geometry) visit(feature.geometry.coordinates);
  }

  if (west === Infinity) return null;
  return new mapboxgl.LngLatBounds([west, south], [east, north]);
};

const DrilldownMap = ({ featureCollection, selectedId, onSelectPolygon, loading }: DrilldownMapProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const onSelectRef = useRef(onSelectPolygon);
  onSelectRef.current = onSelectPolygon;
  // Kept so a resize can re-frame. fitBounds computed against a stale canvas size frames wrongly,
  // and the framing is the whole point of a zoom view.
  const boundsRef = useRef<mapboxgl.LngLatBounds | null>(null);

  useEffect(() => {
    if (containerRef.current == null || mapRef.current != null) return;

    mapboxgl.accessToken = mapboxToken;
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/satellite-streets-v12",
      center: [0, 0],
      zoom: 1,
      attributionControl: false
    });
    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "top-right");
    mapRef.current = map;

    // The tab mounts inside a flex row that settles after first paint, so the canvas can be
    // created at zero width and stay blank. Watch the container and resize with it.
    const observer = new ResizeObserver(() => {
      map.resize();
      if (boundsRef.current != null) map.fitBounds(boundsRef.current, { padding: 32, duration: 0, maxZoom: 17 });
    });
    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (map == null || featureCollection == null) return;

    const apply = () => {
      const existing = map.getSource(SOURCE_ID) as mapboxgl.GeoJSONSource | undefined;
      if (existing != null) {
        existing.setData(featureCollection);
      } else {
        map.addSource(SOURCE_ID, { type: "geojson", data: featureCollection, promoteId: "uuid" });
        map.addLayer({
          id: FILL_LAYER,
          type: "fill",
          source: SOURCE_ID,
          paint: {
            "fill-color": ["case", ["boolean", ["feature-state", "selected"], false], SELECTED, POLYGON_FILL],
            "fill-opacity": ["case", ["boolean", ["feature-state", "selected"], false], 0.5, 0.3]
          }
        });
        map.addLayer({
          id: LINE_LAYER,
          type: "line",
          source: SOURCE_ID,
          paint: {
            "line-color": ["case", ["boolean", ["feature-state", "selected"], false], SELECTED, POLYGON_LINE],
            "line-width": ["case", ["boolean", ["feature-state", "selected"], false], 2.5, 0.7]
          }
        });

        map.on("click", FILL_LAYER, event => {
          const properties = event.features?.[0]?.properties;
          const uuid = properties?.uuid;
          const siteId = properties?.siteId;
          if (typeof uuid === "string") onSelectRef.current?.(uuid, typeof siteId === "string" ? siteId : null);
        });
        map.on("mouseenter", FILL_LAYER, () => (map.getCanvas().style.cursor = "pointer"));
        map.on("mouseleave", FILL_LAYER, () => (map.getCanvas().style.cursor = ""));
      }

      // Refit on every level change: the framing IS the zoom metaphor. When a single polygon is
      // selected, frame that polygon — descending has to be visible on the map, not just in the
      // panel.
      const focused =
        selectedId == null ? null : featureCollection.features.find(feature => feature.properties?.uuid === selectedId);
      const bounds = boundsOf(focused == null ? featureCollection : { type: "FeatureCollection", features: [focused] });
      boundsRef.current = bounds;
      if (bounds != null) map.fitBounds(bounds, { padding: 32, duration: 600, maxZoom: 17 });
    };

    if (map.isStyleLoaded()) apply();
    else map.once("load", apply);
  }, [featureCollection, selectedId]);

  useEffect(() => {
    const map = mapRef.current;
    if (map == null || featureCollection == null || map.getSource(SOURCE_ID) == null) return;

    for (const feature of featureCollection.features) {
      const uuid = feature.properties?.uuid;
      if (typeof uuid !== "string") continue;
      map.setFeatureState({ source: SOURCE_ID, id: uuid }, { selected: uuid === selectedId });
    }
  }, [selectedId, featureCollection]);

  return (
    <div className="relative h-full min-h-[420px] overflow-hidden rounded-lg border border-theme-neutral-200">
      <div ref={containerRef} className="h-full w-full" />
      {loading === true && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/70 text-sm text-theme-neutral-700">
          Loading polygons…
        </div>
      )}
      {loading !== true && (featureCollection?.features.length ?? 0) === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/70 text-sm text-theme-neutral-500">
          No polygon geometry at this level
        </div>
      )}
    </div>
  );
};

export default DrilldownMap;

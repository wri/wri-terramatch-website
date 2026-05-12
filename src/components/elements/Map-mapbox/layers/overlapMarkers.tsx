import { Map as MapboxMap, Marker as MapboxMarker } from "mapbox-gl";
import { FC, memo, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { createRoot, Root } from "react-dom/client";

import { OverlapPolygonPoint } from "./overlapTypes";

type OverlapOverlayMount = {
  root: Root;
  update: (points: OverlapPolygonPoint[]) => void;
};

const OVERLAP_MARKER_BG = "#D32F2F";
const MARKER_CLASS = "overlap-indicator-marker";

const overlayMounts = new WeakMap<MapboxMap, OverlapOverlayMount>();

const scheduleUnmount = (root: Root): void => {
  queueMicrotask(() => root.unmount());
};

const stopPropagation = (event: Event): void => event.stopPropagation();

/** Screen-fixed size: DOM Marker does not scale with map zoom (unlike zoom-interpolated symbol layers). */
const OverlapMarkerView: FC = () => (
  <div
    aria-hidden
    style={{
      width: "1.125rem",
      height: "1.125rem",
      borderRadius: "50%",
      backgroundColor: OVERLAP_MARKER_BG,
      border: "0.0625rem solid rgba(255,255,255,0.9)",
      boxShadow: "0 0.0625rem 0.125rem rgba(0,0,0,0.25)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      pointerEvents: "none"
    }}
  >
    <svg width="10" height="10" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="7" y="3" width="2" height="6" rx="1" fill="#FFFFFF" />
      <rect x="7" y="10.5" width="2" height="2" rx="1" fill="#FFFFFF" />
    </svg>
  </div>
);

type OverlapMarkerPortalProps = {
  map: MapboxMap;
  point: OverlapPolygonPoint;
};

const OverlapMarkerPortal: FC<OverlapMarkerPortalProps> = ({ map, point }) => {
  const [el] = useState<HTMLDivElement>(() => {
    const div = document.createElement("div");
    div.className = MARKER_CLASS;
    div.addEventListener("click", stopPropagation);
    div.addEventListener("mousedown", stopPropagation);
    div.addEventListener("touchstart", stopPropagation);
    return div;
  });

  useEffect(() => {
    let marker: MapboxMarker | null = null;
    let cancelled = false;
    let rafId = 0;

    const attach = (): boolean => {
      if (cancelled) return true;
      if (marker != null) return true;
      const canvasContainer = map.getCanvasContainer?.();
      if (canvasContainer == null) return false;
      marker = new MapboxMarker({ element: el }).setLngLat([point.lng, point.lat]).addTo(map);
      return true;
    };

    const retryUntilAttached = (): void => {
      if (cancelled || attach()) return;
      rafId = window.requestAnimationFrame(retryUntilAttached);
    };

    const onMapLoad = (): void => {
      if (attach()) return;
      retryUntilAttached();
    };

    if (attach()) {
      return () => {
        cancelled = true;
        marker?.remove();
      };
    }

    map.once("load", onMapLoad);
    if (map.loaded()) {
      queueMicrotask(onMapLoad);
    }

    return () => {
      cancelled = true;
      map.off("load", onMapLoad);
      window.cancelAnimationFrame(rafId);
      marker?.remove();
    };
  }, [map, el, point.lng, point.lat]);

  return createPortal(<OverlapMarkerView />, el);
};

const MemoOverlapMarkerPortal = memo(OverlapMarkerPortal);

type OverlapMarkersOverlayProps = {
  map: MapboxMap;
  points: OverlapPolygonPoint[];
};

const OverlapMarkersOverlay: FC<OverlapMarkersOverlayProps> = ({ map, points }) => (
  <>
    {points.map(point => (
      <MemoOverlapMarkerPortal key={point.polygonUuid} map={map} point={point} />
    ))}
  </>
);

const createOverlayMount = (map: MapboxMap): OverlapOverlayMount => {
  const host = document.createElement("div");
  const root = createRoot(host);

  let lastPoints: OverlapPolygonPoint[] = [];
  const render = (): void => {
    root.render(<OverlapMarkersOverlay map={map} points={lastPoints} />);
  };

  return {
    root,
    update: points => {
      lastPoints = points;
      render();
    }
  };
};

export const addOverlapMarkers = (map: MapboxMap, points: OverlapPolygonPoint[]): void => {
  let mount = overlayMounts.get(map);
  if (mount == null) {
    mount = createOverlayMount(map);
    overlayMounts.set(map, mount);
  }
  mount.update(points);
};

export const removeOverlapMarkers = (map: MapboxMap): void => {
  const mount = overlayMounts.get(map);
  if (mount == null) return;
  scheduleUnmount(mount.root);
  overlayMounts.delete(map);
};

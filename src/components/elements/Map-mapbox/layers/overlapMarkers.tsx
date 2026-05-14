import { Map as MapboxMap } from "mapbox-gl";
import { createRoot, Root } from "react-dom/client";

import { OverlapMarkersOverlay } from "./overlapMarkersOverlay";
import { OverlapPolygonPoint } from "./overlapTypes";

type OverlapOverlayMount = {
  root: Root;
  update: (points: OverlapPolygonPoint[]) => void;
};

const overlayMounts = new WeakMap<MapboxMap, OverlapOverlayMount>();

const scheduleUnmount = (root: Root): void => {
  queueMicrotask(() => root.unmount());
};

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

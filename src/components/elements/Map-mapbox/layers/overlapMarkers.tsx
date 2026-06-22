import { Map as MapboxMap } from "mapbox-gl";
import { createRoot, Root } from "react-dom/client";

import PopupProviders from "../components/PopupProviders";
import { MemoOverlapMarkersOverlay } from "./overlapMarkersOverlay";
import { OverlapPolygonPoint } from "./overlapTypes";

type OverlapOverlayMount = {
  root: Root;
  update: (points: OverlapPolygonPoint[]) => void;
};

const overlayMounts = new WeakMap<MapboxMap, OverlapOverlayMount>();

const scheduleUnmount = (root: Root): void => {
  queueMicrotask(() => root.unmount());
};

const areOverlapPointsEqual = (a: OverlapPolygonPoint[], b: OverlapPolygonPoint[]): boolean => {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i += 1) {
    const left = a[i];
    const right = b[i];
    if (left.polygonUuid !== right.polygonUuid || left.lat !== right.lat || left.lng !== right.lng) {
      return false;
    }
  }
  return true;
};

const createOverlayMount = (map: MapboxMap): OverlapOverlayMount => {
  const host = document.createElement("div");
  const root = createRoot(host);

  let lastPoints: OverlapPolygonPoint[] = [];
  const render = (): void => {
    root.render(
      <PopupProviders>
        <MemoOverlapMarkersOverlay map={map} points={lastPoints} />
      </PopupProviders>
    );
  };

  return {
    root,
    update: points => {
      if (areOverlapPointsEqual(lastPoints, points)) return;
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

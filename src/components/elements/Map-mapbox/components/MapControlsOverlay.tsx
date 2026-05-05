import { useChampionsMap } from "../championsMap.context";
import type { MapControlsOverlayProps } from "./MapControlsOverlay.types";
import MapControlsOverlayChampions from "./MapControlsOverlayChampions";
import MapControlsOverlayLegacy from "./MapControlsOverlayLegacy";

export type {
  AdminControlsProps,
  CameraResetProps,
  DownloadProps,
  DrawControlsProps,
  FormControlsProps,
  FullscreenProps,
  GalleryProps,
  MapControlsOverlayProps,
  StyleControlsProps
} from "./MapControlsOverlay.types";

const MapControlsOverlay = (props: MapControlsOverlayProps) => {
  const championsMap = useChampionsMap();
  return championsMap ? <MapControlsOverlayChampions {...props} /> : <MapControlsOverlayLegacy {...props} />;
};

export default MapControlsOverlay;

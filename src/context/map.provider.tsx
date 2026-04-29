import MapboxDraw, { MapboxDrawOptions } from "@mapbox/mapbox-gl-draw";
import classNames from "classnames";
import { Map as MapboxMap, MapboxOptions } from "mapbox-gl";
import {
  createContext,
  DetailedHTMLProps,
  HTMLAttributes,
  PropsWithChildren,
  useContext,
  useEffect,
  useId,
  useState
} from "react";
interface IMapContext {
  map?: MapboxMap;
  draw?: MapboxDraw;
}

export const MapContext = createContext<IMapContext>({
  map: undefined,
  draw: undefined
});

interface MapProviderProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  mapOptions?: Omit<MapboxOptions, "container">;
  drawOptions?: MapboxDrawOptions;
  onLoadMap?: (map: MapboxMap, draw?: MapboxDraw) => void;
  onDrawSet?: (featureCollection: GeoJSON.FeatureCollection, map: MapboxMap, draw?: MapboxDraw) => void;
  initialState?: { geoJson?: any };
}

const MapProvider = ({
  mapOptions,
  children,
  drawOptions,
  onLoadMap,
  onDrawSet,
  initialState,
  ...containerProps
}: PropsWithChildren<MapProviderProps>) => {
  const mapId = useId();
  const [map, setMap] = useState<MapboxMap>();
  const [draw, setDraw] = useState<any>();

  useEffect(() => {
    let onLoadListener: (() => void) | undefined;

    if (!map || !draw) {
      const map = new MapboxMap({ ...mapOptions, container: mapId });
      let draw: MapboxDraw | undefined = undefined;

      if (drawOptions) {
        draw = new MapboxDraw(drawOptions);
        setDraw(draw);
        //@ts-ignore
        map.addControl(draw, "bottom-left");
      }

      setMap(map);

      onLoadListener = function () {
        onLoadMap?.(map, draw);
      };
      map.on("load", onLoadListener);
    }

    return () => {
      if (map != null && onLoadListener != null) {
        map.off("load", onLoadListener);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <MapContext.Provider value={{ map, draw }}>
      <div {...containerProps} id={mapId} className={classNames(containerProps?.className, "relative")}>
        {children}
      </div>
    </MapContext.Provider>
  );
};

export const useMapContext = () => useContext(MapContext);

export default MapProvider;

import MapboxDraw, { MapboxDrawOptions } from "@mapbox/mapbox-gl-draw";
import classNames from "classnames";
import mapboxgl, { EventData, Map, MapboxEvent, MapboxOptions } from "mapbox-gl";
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
  map?: Map;
  draw?: MapboxDraw;
}

export const MapContext = createContext<IMapContext>({
  map: undefined,
  draw: undefined
});

interface AuthProviderProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  mapOptions?: Omit<MapboxOptions, "container">;
  drawOptions?: MapboxDrawOptions;
  onLoadMap?: (map: Map, draw?: MapboxDraw) => void;
  onDrawSet?: (featureCollection: GeoJSON.FeatureCollection, map: Map, draw?: MapboxDraw) => void;
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
}: PropsWithChildren<AuthProviderProps>) => {
  const mapId = useId();
  const [map, setMap] = useState<Map>();
  const [draw, setDraw] = useState<any>();

  useEffect(() => {
    let onLoadListener: (ev: MapboxEvent & EventData) => void;

    if (!map || !draw) {
      const map = new mapboxgl.Map({ ...mapOptions, container: mapId });
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
      map?.off("load", onLoadListener);
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

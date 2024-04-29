import { Map } from "mapbox-gl";
import mapboxgl from "mapbox-gl";
import { createRoot } from "react-dom/client";

import TooltipMap from "../TooltipMap/TooltipMap";

const MAPBOX_TOKEN =
  process.env.REACT_APP_MAPBOX_TOKEN ||
  "pk.eyJ1IjoidGVycmFtYXRjaCIsImEiOiJjbHN4b2drNnAwNHc0MnBtYzlycmQ1dmxlIn0.ImQurHBtutLZU5KAI5rgng";
const GEOSERVER = "https://geoserver-prod.wri-restoration-marketplace-api.com";

class MapService {
  constructor() {
    this.map = null;
    this.styleLoaded = false;
    this.sourceQueue = [];
    this.centroids = null;
  }

  initMap(mapId) {
    if (this.map !== null) {
      this.map.remove();
    }
    this.map = new Map({
      accessToken: MAPBOX_TOKEN,
      container: mapId,
      style: "mapbox://styles/terramatch/clv3bkxut01y301pk317z5afu",
      zoom: 2.5
    });
    this.map.on("style.load", () => {
      this.styleLoaded = true;
      this.addCentroidsLayers(this.centroids);
    });
    return this.map;
  }

  addSource(layer, polygonData) {
    const { name, styles } = layer;
    if (!this.styleLoaded) {
      this.sourceQueue.push(layer);
      return;
    }

    if (this.map.getSource(name)) {
      console.warn(`Source with name '${name}' already exists.`);
      return;
    }
    const URL_GEOSERVER = `${GEOSERVER}/geoserver/gwc/service/wmts?REQUEST=GetTile&SERVICE=WMTS
    &VERSION=1.0.0&LAYER=wri:${name}&STYLE=&TILEMATRIX=EPSG:900913:{z}&TILEMATRIXSET=EPSG:900913&FORMAT=application/vnd.mapbox-vector-tile&TILECOL={x}&TILEROW={y}`;
    this.map.addSource(name, {
      type: "vector",
      tiles: [URL_GEOSERVER]
    });
    styles?.forEach((style, index) => {
      this.addLayerStyle(name, style, index);
    });
    this.onclickGeom(layer, polygonData);
  }

  addLayerStyle(sourceName, style, index) {
    this.map.addLayer({
      id: `${sourceName}-${index}`,
      source: sourceName,
      "source-layer": sourceName,
      ...style
    });
  }
  onclickGeom(layer, polygonData) {
    let popup;
    const { name, styles } = layer;
    const layersNames = styles.map((_, index) => `${name}-${index}`);
    this.map.on("click", layersNames, e => {
      if (e.features.length > 0) {
        const feature = e.features[0];
        const { lng, lat } = e.lngLat;
        const uuidPolygon = feature.properties?.uuid;
        const polygon = polygonData && polygonData.find(data => data.poly_id === uuidPolygon);
        const plantStartDate = polygon?.plantstart ? new Date(polygon?.plantstart) : null;
        const formattedPlantStartDate =
          plantStartDate != null
            ? plantStartDate.toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric"
              })
            : "Unknown";
        const popupContent = document.createElement("div");
        const containerElement = document.createElement("div");
        popupContent.appendChild(containerElement);
        const root = createRoot(containerElement);
        root.render(
          <TooltipMap
            polygon={polygon}
            formattedPlantStartDate={formattedPlantStartDate}
            setTooltipOpen={() => {
              if (popup) {
                popup.remove();
              }
            }}
          />
          // <div
          //   className={`absolute z-20 w-[280px] rounded border-t-4 ${topBorderColorPopup[polygon.status]} bg-white p-3`}
          //   style={{
          //     top: "-100%",
          //     left: "-50%",
          //     transform: "translate(-40%, -77%)" //modify this based on style
          //   }}
          // >
          //   <button
          //     onClick={() => {
          //       if (popup) {
          //         popup.remove();
          //       }
          //     }}
          //     className="absolute right-2 top-2 ml-2 rounded p-1 hover:bg-grey-800"
          //   >
          //     <Icon name={IconNames.CLEAR} className="h-3 w-3 text-grey-400" />
          //   </button>

          //   <div className="text-10 flex items-center justify-center gap-1">
          //     <Text variant="text-10 uppercase"> {polygon?.site_name} SITE </Text>
          //     <div className="text-10">&#8226;</div>
          //     <Text variant="text-10 uppercase"> {polygon?.proj_name} PROJECT</Text>
          //   </div>
          //   <Text variant="text-10-bold" className="text-center">
          //     {polygon?.poly_name ? polygon?.poly_name : "Unnamed Polygon"}
          //   </Text>
          //   <hr className="my-2 border border-grey-750" />
          //   <div className="grid grid-cols-2 gap-4">
          //     <div>
          //       <Text variant="text-10-light">Restoration Practice</Text>
          //       <Text variant="text-10-bold">{polygon?.practice ? polygon?.practice : "unknown"}</Text>
          //     </div>
          //     <div>
          //       <Text variant="text-10-light">Target Land Use System</Text>
          //       <Text variant="text-10-bold">{polygon?.target_sys ? polygon?.target_sys : "unknown"}</Text>
          //     </div>
          //     <div>
          //       <Text variant="text-10-light">Tree Distribution</Text>
          //       <Text variant="text-10-bold">{polygon?.dist ? polygon?.dist : "unknown"}</Text>
          //     </div>
          //     <div>
          //       <Text variant="text-10-light">Planting Start Date</Text>
          //       <Text variant="text-10-bold">{formattedPlantStartDate}</Text>
          //     </div>
          //   </div>

          //   <hr className="my-2 border border-grey-750" />
          // </div>
        );
        popup = new mapboxgl.Popup().setLngLat([lng, lat]).setDOMContent(popupContent).addTo(this.map);
      }
    });
  }
  zoomTo(bounds) {
    if (bounds && Array.isArray(bounds) && bounds.length >= 2) {
      this.map.fitBounds(bounds[1], { padding: 100 });
    } else {
      console.error(`Bounds not found`);
    }
  }

  zoomIn() {
    this.map.zoomIn();
  }

  zoomOut() {
    this.map.zoomOut();
  }

  addFilterOnLayer(layer, polygonData, field) {
    const { name, styles } = layer;
    styles.forEach((style, index) => {
      const layerName = `${name}-${index}`;
      if (!this.map.getLayer(layerName)) {
        console.error(`Layer ${layerName} does not exist.`);
        return;
      }
      const polygonStatus = style?.metadata?.polygonStatus;
      const filter = [
        "in",
        ["get", field],
        ["literal", polygonData[polygonStatus] === undefined ? "" : polygonData[polygonStatus]]
      ];

      this.map.setFilter(layerName, filter);
      this.map.setLayoutProperty(layerName, "visibility", "visible");
    });
  }

  addCentroidsLayers(centroids) {
    if (centroids) {
      if (!this.styleLoaded) {
        this.sourceQueue.push({ type: "centroids", centroids });
        return;
      }

      if (this.map.getSource("centroids")) {
        this.map.removeLayer("centroids");
        this.map.removeSource("centroids");
      }

      const addSourceAndLayer = () => {
        this.map?.addSource("centroids", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: centroids?.map(centroid => ({
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: [centroid.long, centroid.lat]
              },
              properties: {
                id: centroid.id,
                name: centroid.name
              }
            }))
          }
        });

        this.map.addLayer({
          id: "centroids",
          type: "circle",
          source: "centroids",
          paint: {
            "circle-radius": 6,
            "circle-color": "#B42222"
          }
        });
      };
      addSourceAndLayer();
    }
  }
}

const _MapService = new MapService();

export default _MapService;

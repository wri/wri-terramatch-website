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

  addSource(layer, polygonData, setIsOpenEditPolygon) {
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
    this.onclickGeom(layer, polygonData, setIsOpenEditPolygon);
  }

  addLayerStyle(sourceName, style, index) {
    this.map.addLayer({
      id: `${sourceName}-${index}`,
      source: sourceName,
      "source-layer": sourceName,
      ...style
    });
  }
  onclickGeom(layer, polygonData, setIsOpenEditPolygon) {
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
                year: "numeric",
                timeZone: "UTC"
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
                setIsOpenEditPolygon({ isOpen: false, uuid: "" });
              }
            }}
            setEditPolygon={() => {
              setIsOpenEditPolygon({ isOpen: true, uuid: uuidPolygon });
            }}
          />
        );
        popup = new mapboxgl.Popup().setLngLat([lng, lat]).setDOMContent(popupContent).addTo(this.map);
        if (!popup) {
          setIsOpenEditPolygon({ isOpen: false, uuid: "" });
        }
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

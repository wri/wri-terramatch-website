import MapboxDraw from "@mapbox/mapbox-gl-draw";
import { Map } from "mapbox-gl";
import mapboxgl from "mapbox-gl";
import { createRoot } from "react-dom/client";

import TooltipMap from "../TooltipMap/TooltipMap";
// import { LAYERS_NAMES, layersList } from "./MapSites";

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
    this.currentPolygonUuid = null;
    this.draw = null;
  }

  initMap(mapId) {
    console.log("initMap", mapId);
    this.map = new Map({
      accessToken: MAPBOX_TOKEN,
      container: mapId,
      style: "mapbox://styles/terramatch/clv3bkxut01y301pk317z5afu",
      zoom: 2.5
    });

    this.draw = new MapboxDraw({
      controls: {
        point: false,
        line_string: false,
        polygon: false,
        trash: false,
        combine_features: false,
        uncombine_features: false
      }
    });
    this.map.on("style.load", () => {
      this.styleLoaded = true;
      this.addCentroidsLayers(this.centroids);
      this.map.addControl(this.draw, "top-right");
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
        console.log("uuidPolygon", uuidPolygon);
        if (uuidPolygon) {
          this.currentPolygonUuid = uuidPolygon;
        }
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
              if (popup) {
                popup.remove();
              }
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
      const completeFilter = ["all", filter];
      this.map.setFilter(layerName, completeFilter);
      this.map.setLayoutProperty(layerName, "visibility", "visible");
    });
  }

  convertToAcceptedGEOJSON(geojson) {
    const templateGeoJSON = {
      type: "Feature",
      properties: {},
      geometry: geojson
    };
    const geojsonFormatted = {
      type: "FeatureCollection",
      features: [templateGeoJSON]
    };
    return geojsonFormatted;
  }

  // addSingleFilterOnPolygonLayer(field, value) {
  //   const polygonLayer = layersList.find(layer => layer.name === LAYERS_NAMES.POLYGON_GEOMETRY);
  //   if (!polygonLayer) {
  //     console.error(`Layer ${LAYERS_NAMES.POLYGON_GEOMETRY} does not exist in layer list.`);
  //     return;
  //   }
  //   const { name, styles } = polygonLayer;
  //   styles.forEach((style, index) => {
  //     const layerName = `${name}-${index}`;
  //     if (!this.map.getLayer(layerName)) {
  //       console.error(`Layer ${layerName} does not exist in map.`);
  //       return;
  //     }
  //   });
  // }
  addGeojsonToDraw(geojson, uuid, cb) {
    console.log("Add geojson", geojson);
    if (geojson) {
      const geojsonFormatted = this.convertToAcceptedGEOJSON(geojson);
      const addToDrawAndFilter = () => {
        if (this.draw) {
          const featureGeojson = this.draw.set(geojsonFormatted);
          if (featureGeojson.length) {
            this.draw.changeMode("direct_select", { featureId: featureGeojson[0] });
          }

          cb(uuid);
        }
      };
      addToDrawAndFilter();
    }
  }

  removePreviousGeojsonFromDraw(layer, polygonData, field) {
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
  setDraw(draw) {
    this.draw = draw;
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

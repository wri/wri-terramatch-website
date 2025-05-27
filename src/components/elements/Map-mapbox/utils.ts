import MapboxDraw from "@mapbox/mapbox-gl-draw";
import bbox from "@turf/bbox";
import * as turfHelper from "@turf/helpers";
import _ from "lodash";
import mapboxgl, { LngLat } from "mapbox-gl";
import { createElement } from "react";
import { createRoot } from "react-dom/client";

import { geoserverUrl, geoserverWorkspace } from "@/constants/environment";
import { LAYERS_NAMES, layersList } from "@/constants/layers";
import {
  fetchGetV2DashboardGetBboxProject,
  fetchGetV2SitesSiteBbox,
  fetchGetV2TerrafundGeojsonSite,
  fetchGetV2TypeEntity,
  fetchPostV2TerrafundPolygon,
  fetchPostV2TerrafundProjectPolygonUuidEntityUuidEntityType,
  fetchPostV2TerrafundSitePolygonUuidSiteUuid,
  useGetV2SitesSiteBbox,
  useGetV2TerrafundPolygonBboxUuid
} from "@/generated/apiComponents";
import { SitePolygon, SitePolygonsDataResponse } from "@/generated/apiSchemas";
import { MediaDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { createQueryParams } from "@/utils/dashboardUtils";
import Log from "@/utils/log";

import { MediaPopup } from "./components/MediaPopup";
import { BBox, Feature, FeatureCollection, GeoJsonProperties, Geometry } from "./GeoJSON";
import { DashboardGetProjectsData } from "./Map";
import type { LayerType, LayerWithStyle, TooltipType } from "./Map.d";
import { MapStyle } from "./MapControls/types";
import { getPulsingDot } from "./pulsing.dot";
type DataPolygonOverview = {
  status: string;
  count: number;
}[];

export const getFeatureProperties = <T extends any>(properties: any, key: string): T | undefined => {
  return properties[key] ?? properties[`user_${key}`];
};

export const convertToGeoJSON = (featureCollection: FeatureCollection) => {
  const { features } = featureCollection;
  return features.reduce((acc: turfHelper.Feature[], feature) => {
    const { geometry, properties } = feature;
    const coordinates = geometry.coordinates;
    const type = geometry.type;
    const featureGeoJSON = turfHelper.feature({ type, coordinates }, properties);
    acc.push(featureGeoJSON);
    return acc;
  }, []);
};

export const convertToAcceptedGEOJSON = (geojson: any) => {
  if (geojson.type !== "FeatureCollection" && geojson.type !== "GeometryCollection") {
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
  } else if (geojson.type === "GeometryCollection") {
    const geojsonFormatted = {
      type: "FeatureCollection",
      features: geojson.geometries.map((geometry: any) => ({
        type: "Feature",
        properties: {},
        geometry
      }))
    };
    return geojsonFormatted;
  }
  return geojson;
};

export const startDrawing = (draw: MapboxDraw, map: mapboxgl.Map) => {
  draw.changeMode("draw_polygon");
  map.getCanvas().style.cursor = "crosshair";
};

export const stopDrawing = (draw: MapboxDraw, map: mapboxgl.Map) => {
  draw.changeMode("simple_select");
  map.getCanvas().style.cursor = "auto";
};

export const addFilterOnLayer = (layer: any, parsedPolygonData: Record<string, string[]>, map: mapboxgl.Map) => {
  addSourceToLayer(layer, map, parsedPolygonData);
};
const showPolygons = (
  styles: LayerWithStyle[],
  name: string,
  map: mapboxgl.Map,
  field: string,
  parsedPolygonData: any,
  zoomFilter?: number | undefined
) => {
  styles.forEach((style: LayerWithStyle, index: number) => {
    const layerName = `${name}-${index}`;
    if (!map.getLayer(layerName)) {
      Log.warn(`Layer ${layerName} does not exist.`);
      return;
    }
    const polygonStatus = style?.metadata?.polygonStatus;
    const uuidFilter = [
      "in",
      ["get", field],
      ["literal", parsedPolygonData?.[polygonStatus] === undefined ? "" : parsedPolygonData[polygonStatus]]
    ];

    const completeFilter = zoomFilter ? ["all", uuidFilter, [">", ["zoom"], zoomFilter]] : ["all", uuidFilter];

    map.setFilter(layerName, completeFilter);
    map.setLayoutProperty(layerName, "visibility", "visible");
  });
};

let popupAttachedMap: Record<string, mapboxgl.Popup[]> = {
  POLYGON: [],
  MEDIA: []
};

export const loadLayersInMap = (
  map: mapboxgl.Map,
  polygonsData: Record<string, string[]> | undefined,
  layer: any,
  zoomFilter?: number | undefined
) => {
  if (map) {
    showPolygons(layer.styles, layer.name, map, "uuid", polygonsData, zoomFilter);
  }
};

const handleLayerClick = (
  e: any,
  PopupComponent: any,
  map: mapboxgl.Map,
  setPolygonFromMap: any,
  sitePolygonData: SitePolygonsDataResponse | undefined,
  type: TooltipType,
  editPolygon: { isOpen: boolean; uuid: string; primary_uuid?: string },
  setEditPolygon: (value: { isOpen: boolean; uuid: string; primary_uuid?: string }) => void,
  layerName?: string,
  isDashboard?: string | undefined,
  setFilters?: any,
  dashboardCountries?: any,
  setLoader?: (value: boolean) => void,
  setMobilePopupData?: (value: any) => void
) => {
  const { lngLat, features } = e;
  const feature = features?.[0];
  if (!feature) {
    Log.warn("No feature found in click event");
    return;
  }

  // Handle mobile/dashboard popups
  if (setMobilePopupData && isDashboard) {
    const popupData = {
      feature,
      layerName,
      type,
      setPolygonFromMap,
      sitePolygonData,
      isDashboard,
      editPolygon,
      setEditPolygon,
      setFilters,
      dashboardCountries
    };
    setMobilePopupData(popupData);
    return;
  }

  // Handle regular popups for non-dashboard/non-mobile views
  removePopups("POLYGON");
  const isCentroidLayer = layerName === LAYERS_NAMES.CENTROIDS;
  const popupOptions: mapboxgl.PopupOptions = {
    className: isCentroidLayer ? "popup-map no-tip" : "popup-map",
    offset: isCentroidLayer
      ? {
          top: [0, 9],
          "top-left": [0, 9],
          "top-right": [0, 9],
          bottom: [0, -9],
          "bottom-left": [0, -9],
          "bottom-right": [0, -9],
          left: [9, 0],
          right: [-9, 0]
        }
      : 0
  };

  const popupContent = document.createElement("div");
  popupContent.className = "popup-content-map";
  const root = createRoot(popupContent);

  const createPopup = (lngLat: mapboxgl.LngLat) =>
    new mapboxgl.Popup(popupOptions).setLngLat(lngLat).setDOMContent(popupContent);

  const newPopup = createPopup(lngLat);

  const commonProps = {
    feature,
    popup: newPopup,
    setPolygonFromMap,
    sitePolygonData,
    type,
    editPolygon,
    setEditPolygon
  };
  newPopup.addTo(map);
  popupAttachedMap["POLYGON"].push(newPopup);
  root.render(createElement(PopupComponent, commonProps));
};

export const removePopups = (key: "POLYGON" | "MEDIA") => {
  if (!popupAttachedMap[key]) return;
  popupAttachedMap[key].forEach(popup => {
    popup.remove();
  });
  popupAttachedMap[key] = [];
};

export const removeMediaLayer = (map: mapboxgl.Map) => {
  const layerName = LAYERS_NAMES.MEDIA_IMAGES;
  map.getLayer(layerName) && map.removeLayer(layerName);
  map.getSource(layerName) && map.removeSource(layerName);
};

export const addFilterOfPolygonsData = (map: mapboxgl.Map, polygonsData: Record<string, string[]> | undefined) => {
  if (map && polygonsData) {
    if (map.isStyleLoaded() || map.loaded()) {
      layersList.forEach((layer: LayerType) => {
        loadLayersInMap(map, polygonsData, layer);
      });
    } else {
      map.on("style.load", () => {
        layersList.forEach((layer: LayerType) => {
          loadLayersInMap(map, polygonsData, layer);
        });
      });
      map.on("load", () => {
        layersList.forEach((layer: LayerType) => {
          loadLayersInMap(map, polygonsData, layer);
        });
      });
    }
  }
};

export const addGeojsonToDraw = (
  geojson: any,
  uuid: string,
  cb: Function,
  currentDraw: MapboxDraw,
  map?: mapboxgl.Map
) => {
  if (geojson) {
    const geojsonFormatted = convertToAcceptedGEOJSON(geojson);
    const addToDrawAndFilter = () => {
      if (currentDraw) {
        currentDraw.add(geojsonFormatted);
        const currentDrawFeatures = currentDraw.getAll();
        currentDraw.set(currentDrawFeatures);
        const featureId = currentDrawFeatures.features[0].id;
        currentDraw.changeMode("direct_select", { featureId: featureId as string });
        if (map) {
          zoomToBbox(bbox(geojsonFormatted) as BBox, map, false);
        }
        cb(uuid);
      }
    };
    addToDrawAndFilter();
  }
};

export const addMediaSourceAndLayer = (
  map: mapboxgl.Map,
  modelFilesData: MediaDto[],
  setImageCover: Function,
  handleDownload: Function,
  handleDelete: Function,
  openModalImageDetail: Function,
  isProjectPath: boolean
) => {
  const layerName = LAYERS_NAMES.MEDIA_IMAGES;
  removeMediaLayer(map);
  removePopups("MEDIA");
  const modelFilesGeolocalized = modelFilesData!.filter(modelFile => modelFile.lat != null && modelFile.lng != null);
  if (modelFilesGeolocalized.length === 0) {
    return;
  }

  const features: Feature<Geometry, GeoJsonProperties>[] = modelFilesGeolocalized.map(modelFile => ({
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [modelFile.lng, modelFile.lat]
    },
    properties: {
      uuid: modelFile.uuid,
      name: modelFile.name,
      created_date: modelFile.createdAt,
      file_url: modelFile.url,
      location: {
        lat: modelFile.lat,
        lng: modelFile.lng
      },
      is_cover: modelFile.isCover,
      is_public: modelFile.isPublic,
      photographer: modelFile.photographer,
      description: modelFile.description,
      mime_type: modelFile.mimeType,
      file_name: modelFile.fileName
    }
  }));

  const pulsingDot = getPulsingDot(map, 120);

  map.addImage("pulsing-dot", pulsingDot, { pixelRatio: 4 });

  map.addSource(layerName, {
    type: "geojson",
    data: {
      type: "FeatureCollection",
      features
    }
  });

  map.addLayer({
    id: layerName,
    type: "symbol",
    source: layerName,
    layout: {
      "icon-image": "pulsing-dot"
    }
  });

  map.moveLayer(layerName);

  map.on("click", layerName, e => {
    e.preventDefault();
    e.features!.forEach((feature: any) => {
      let popupContent = document.createElement("div");
      popupContent.className = "popup-content-media";
      const root = createRoot(popupContent);

      const coverImage = () => {
        setImageCover(feature?.properties?.uuid);
      };
      const handleDownloadFunction = () => {
        handleDownload(feature?.properties?.uuid, feature?.properties?.name);
      };
      const handleDeleteFunction = () => {
        handleDelete(feature?.properties?.uuid);
      };
      const openModalImageDetailFunction = () => {
        openModalImageDetail(feature?.properties);
      };
      root.render(
        createElement(MediaPopup, {
          ...feature.properties,
          onClose: () => {
            removePopups("MEDIA");
          },
          handleDownload: handleDownloadFunction,
          coverImage: coverImage,
          handleDelete: handleDeleteFunction,
          openModalImageDetail: openModalImageDetailFunction,
          isProjectPath: isProjectPath
        })
      );
      const mediaPopup = new mapboxgl.Popup({ className: "popup-media", closeButton: false })
        .setLngLat(feature.geometry.coordinates)
        .setDOMContent(popupContent)
        .addTo(map);
      popupAttachedMap["MEDIA"].push(mediaPopup);
    });
  });
};

export const addSourcesToLayers = (
  map: mapboxgl.Map,
  polygonsData: Record<string, string[]> | undefined,
  centroids: DashboardGetProjectsData[] | undefined,
  zoomFilter?: number | undefined,
  isDashboard?: string | undefined,
  polygonsCentroids?: any[] | undefined
) => {
  if (map) {
    layersList.forEach((layer: LayerType) => {
      if (layer.name === LAYERS_NAMES.POLYGON_GEOMETRY) {
        addSourceToLayer(layer, map, polygonsData, zoomFilter, isDashboard);
      }
      if (layer.name === LAYERS_NAMES.WORLD_COUNTRIES && isDashboard) {
        addSourceToLayer(layer, map, undefined, undefined);
      }
      if (layer.name === LAYERS_NAMES.CENTROIDS && isDashboard) {
        addGeojsonSourceToLayer(centroids, map, layer, zoomFilter, !_.isEmpty(polygonsData));
      }
    });
    if (isDashboard) {
      addPolygonCentroidsLayer(map, polygonsCentroids ?? [], zoomFilter);
    }
  }
};
export const addPolygonCentroidsLayer = (
  map: mapboxgl.Map,
  centroids: { uuid: string; long: number; lat: number }[],
  zoomFilterValue?: number
) => {
  const layerName = LAYERS_NAMES.POLYGON_CENTROIDS;
  if (map.getSource(layerName)) {
    map.removeLayer(`${layerName}`);
    map.removeSource(layerName);
  }

  if (map.hasImage("pulsing-dot-centroids")) {
    map.removeImage("pulsing-dot-centroids");
  }

  const features: GeoJSON.Feature[] = centroids.map(centroid => ({
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [centroid.long, centroid.lat]
    },
    properties: {
      uuid: centroid.uuid
    }
  }));
  const pulsingDot = getPulsingDot(map, 120, "#72D961");
  map.addImage("pulsing-dot-centroids", pulsingDot, { pixelRatio: 4 });

  map.addSource(layerName, {
    type: "geojson",
    data: {
      type: "FeatureCollection",
      features: features
    }
  });

  map.addLayer({
    id: layerName,
    type: "symbol",
    source: layerName,
    layout: {
      "icon-image": "pulsing-dot-centroids"
    },
    paint: {},
    filter: zoomFilterValue ? ["<=", ["zoom"], zoomFilterValue] : [">=", ["zoom"], 0]
  });
};
export const addPopupsToMap = (
  map: mapboxgl.Map,
  popupComponent: any,
  setPolygonFromMap: any,
  sitePolygonData: SitePolygonsDataResponse | undefined,
  type: TooltipType,
  editPolygon: { isOpen: boolean; uuid: string; primary_uuid?: string },
  setEditPolygon: (value: { isOpen: boolean; uuid: string; primary_uuid?: string }) => void,
  draw: MapboxDraw,
  isDashboard?: string | undefined,
  setFilters?: any,
  dashboardCountries?: any,
  setLoader?: (value: boolean) => void,
  selectedCountry?: string | null,
  setMobilePopupData?: (value: any) => void
) => {
  if (popupComponent) {
    layersList.forEach((layer: LayerType) => {
      addPopupToLayer(
        map,
        popupComponent,
        layer,
        setPolygonFromMap,
        sitePolygonData,
        type,
        editPolygon,
        setEditPolygon,
        draw,
        isDashboard,
        setFilters,
        dashboardCountries,
        setLoader,
        selectedCountry,
        setMobilePopupData
      );
    });
  }
};
const activeClickHandlers: Record<string, any> = {};

export const addPopupToLayer = (
  map: mapboxgl.Map,
  popupComponent: any,
  layer: any,
  setPolygonFromMap: any,
  sitePolygonData: SitePolygonsDataResponse | undefined,
  type: TooltipType,
  editPolygon: { isOpen: boolean; uuid: string; primary_uuid?: string },
  setEditPolygon: (value: { isOpen: boolean; uuid: string; primary_uuid?: string }) => void,
  draw: MapboxDraw,
  isDashboard?: string | undefined,
  setFilters?: any,
  dashboardCountries?: any,
  setLoader?: (value: boolean) => void,
  selectedCountry?: string | null,
  setMobilePopupData?: (value: any) => void
) => {
  if (!popupComponent) return;

  const { name } = layer;
  let layers = map.getStyle().layers;
  let targetLayers = layers.filter(layer => layer.id.startsWith(name));

  if (name === LAYERS_NAMES.CENTROIDS && targetLayers.length > 0) {
    targetLayers = targetLayers.filter(layer => (layer as any)?.metadata?.type === "big-circle");
  }

  const clickHandler = (e: any) => {
    const currentMode = draw?.getMode();
    if (currentMode === "draw_polygon" || currentMode === "draw_line_string") return;
    if (name === LAYERS_NAMES.WORLD_COUNTRIES) return;

    handleLayerClick(
      e,
      popupComponent,
      map,
      setPolygonFromMap,
      sitePolygonData,
      type,
      editPolygon,
      setEditPolygon,
      name,
      isDashboard,
      setFilters,
      dashboardCountries,
      setLoader,
      setMobilePopupData
    );
  };

  targetLayers.forEach(targetLayer => {
    if (activeClickHandlers[targetLayer.id]) {
      map.off("click", targetLayer.id, activeClickHandlers[targetLayer.id]);
      map.off("touchend", targetLayer.id, activeClickHandlers[targetLayer.id]);
      delete activeClickHandlers[targetLayer.id];
    }

    activeClickHandlers[targetLayer.id] = clickHandler;
    map.on("click", targetLayer.id, clickHandler);
    map.on("touchend", targetLayer.id, clickHandler);
  });
};

const getGeoserverURL = (layerName: string, isDashboard?: string | undefined) => {
  const workspace = isDashboard ? `${geoserverWorkspace}_db` : geoserverWorkspace;
  return `${geoserverUrl}/geoserver/gwc/service/wmts?REQUEST=GetTile&SERVICE=WMTS
      &VERSION=1.0.0&LAYER=${workspace}:${layerName}&STYLE=&TILEMATRIX=EPSG:900913:{z}&TILEMATRIXSET=EPSG:900913&FORMAT=application/vnd.mapbox-vector-tile&TILECOL={x}&TILEROW={y}&RND=${Math.random()}`;
};
export const addHoverEvent = (layer: LayerType, map: mapboxgl.Map) => {
  const { name, styles } = layer;
  const layersToHover = styles.map((_, index) => `${name}-${index}`);
  if (name === LAYERS_NAMES.WORLD_COUNTRIES) {
    let hoveredPolygonId: any = null;
    map.on("mousemove", layersToHover, e => {
      const zoomLevel = map.getZoom();
      if (zoomLevel <= 4.5) {
        if (e.features && e.features.length > 0) {
          if (hoveredPolygonId !== null) {
            map.setFeatureState({ source: name, sourceLayer: name, id: hoveredPolygonId }, { hover: false });
          }
          hoveredPolygonId = e.features[0].id;
          map.setFeatureState({ source: name, sourceLayer: name, id: hoveredPolygonId }, { hover: true });
        }
      } else {
        if (hoveredPolygonId !== null) {
          map.setFeatureState({ source: name, sourceLayer: name, id: hoveredPolygonId }, { hover: false });
        }
        hoveredPolygonId = null;
      }
    });
    map.on("mouseleave", layersToHover, () => {
      if (hoveredPolygonId !== null) {
        map.setFeatureState({ source: name, sourceLayer: name, id: hoveredPolygonId }, { hover: false });
      }
      hoveredPolygonId = null;
    });
  }
};
export const addGeojsonSourceToLayer = (
  centroids: DashboardGetProjectsData[] | undefined,
  map: mapboxgl.Map,
  layer: LayerType,
  zoomFilterValue: number | undefined,
  existsPolygons: boolean
) => {
  const { name, styles } = layer;
  if (map && centroids && centroids.length > 0) {
    if (map.getSource(name)) {
      styles?.forEach((_: unknown, index: number) => {
        map.removeLayer(`${name}-${index}`);
      });
      map.removeSource(name);
    }

    if (existsPolygons) {
      return;
    }

    const features: GeoJSON.Feature[] = centroids.map((centroid: any) => ({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [centroid.long || centroid.centroid?.long, centroid.lat || centroid.centroid?.lat]
      },
      properties: {
        uuid: centroid.uuid,
        name: centroid.name || centroid.uuid,
        type: centroid.type || "polygon_centroid"
      }
    }));

    // Add new source
    map.addSource(name, {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: features
      }
    });

    // Add layers with styles
    styles?.forEach((style: LayerWithStyle, index: number) => {
      addLayerGeojsonStyle(map, name, name, style, index);
    });
  }
};
export const addSourceToLayer = (
  layer: LayerType,
  map: mapboxgl.Map,
  polygonsData: Record<string, string[]> | undefined,
  zoomFilter?: number | undefined,
  isDashboard?: string | undefined
) => {
  const { name, geoserverLayerName, styles } = layer;
  try {
    if (map) {
      if (map.getSource(name)) {
        styles?.forEach((_: unknown, index: number) => {
          map.removeLayer(`${name}-${index}`);
        });
        map.removeSource(name);
      }
      const GEOSERVER_TILE_URL = getGeoserverURL(geoserverLayerName, isDashboard);
      map.addSource(name, {
        type: "vector",
        tiles: [GEOSERVER_TILE_URL]
      });
      styles?.forEach((style: LayerWithStyle, index: number) => {
        addLayerStyle(map, name, geoserverLayerName, style, index, zoomFilter);
      });
      if (polygonsData) {
        loadLayersInMap(map, polygonsData, layer, zoomFilter);
      }
      // commented for future possible use
      // if (name === LAYERS_NAMES.WORLD_COUNTRIES) {
      //   addHoverEvent(layer, map);
      // }
    }
  } catch (e) {
    console.warn(e);
  }
};
const loadDeleteLayer = (layer: any, map: mapboxgl.Map, polygonsData: Record<string, string[]> | undefined) => {
  const { name, geoserverLayerName, styles } = layer;
  styles?.forEach((style: LayerWithStyle, index: number) => {
    if (map.getLayer(`${name}-${index}`)) {
      map.removeLayer(`${name}-${index}`);
    }
    map.addLayer({
      ...style,
      id: `${name}-${index}`,
      source: name,
      "source-layer": geoserverLayerName
    } as mapboxgl.AnyLayer);
  });
  loadLayersInMap(map, polygonsData, layer);
};
export const addDeleteLayer = (layer: any, map: mapboxgl.Map, polygonsData: Record<string, string[]> | undefined) => {
  const { name, geoserverLayerName, styles } = layer;
  try {
    if (map) {
      if (map.getSource(name)) {
        styles?.forEach((_: unknown, index: number) => {
          map.removeLayer(`${name}-${index}`);
        });
        map.removeSource(name);
      }
      const GEOSERVER_TILE_URL = getGeoserverURL(geoserverLayerName);
      map.addSource(name, {
        type: "vector",
        tiles: [GEOSERVER_TILE_URL]
      });
      loadDeleteLayer(layer, map, polygonsData);
    }
  } catch (e) {
    console.warn(e);
  }
};
const moveDeleteLayers = (map: mapboxgl.Map) => {
  const layers = layersList.filter(layer => layer.name === LAYERS_NAMES.DELETED_GEOMETRIES);
  layers.forEach(layer => {
    const { name, styles } = layer;
    styles?.forEach((_: unknown, index: number) => {
      if (map?.getLayer(`${name}-${index}`)) {
        map?.moveLayer(`${name}-${index}`);
      }
    });
  });
};
export const addLayerGeojsonStyle = (
  map: mapboxgl.Map,
  layerName: string,
  sourceName: string,
  style: LayerWithStyle,
  index: number
) => {
  const beforeLayer = map.getLayer(LAYERS_NAMES.MEDIA_IMAGES) ? LAYERS_NAMES.MEDIA_IMAGES : undefined;
  if (map.getLayer(`${layerName}-${index}`)) {
    map.removeLayer(`${layerName}-${index}`);
  }
  map.addLayer(
    {
      ...style,
      id: `${layerName}-${index}`,
      source: sourceName
    } as mapboxgl.AnyLayer,
    beforeLayer
  );
  moveDeleteLayers(map);
};
export const setFilterCountry = (map: mapboxgl.Map, layerName: string, country: string) => {
  const filter = ["==", ["get", "iso"], country];
  map.setFilter(layerName, filter);
};
export const setFilterLandscape = (map: mapboxgl.Map, layerName: string, landscapes: string[]) => {
  const filter = ["in", ["get", "landscape"], ["literal", landscapes]];
  map.setFilter(layerName, filter);
};
export const addBorderCountry = (map: mapboxgl.Map, country: string) => {
  if (!country || !map) return;
  try {
    const styleName = `${LAYERS_NAMES.WORLD_COUNTRIES}-line`;
    const countryLayer = layersList.find(layer => layer.name === styleName);
    if (!countryLayer) return;
    const countryStyles = countryLayer.styles || [];
    const sourceName = countryLayer.name;
    const GEOSERVER_TILE_URL = getGeoserverURL(countryLayer.geoserverLayerName);

    if (!map.getSource(sourceName)) {
      map.addSource(sourceName, {
        type: "vector",
        tiles: [GEOSERVER_TILE_URL]
      });
    }
    if (map.getLayer(sourceName)) {
      map.removeLayer(sourceName);
    }
    const style = countryStyles[0];
    map.addLayer({
      ...style,
      id: sourceName,
      source: sourceName,
      "source-layer": countryLayer.geoserverLayerName
    } as mapboxgl.AnyLayer);
    setFilterCountry(map, sourceName, country);
  } catch (e) {
    console.warn(e);
  }
};
export const addBorderLandscape = (map: mapboxgl.Map, landscapes: string[]) => {
  if (!landscapes || !map) return;

  const styleName = `${LAYERS_NAMES.LANDSCAPES}`;
  const landscapeLayer = layersList.find(layer => layer.name === styleName);
  if (!landscapeLayer) return;
  const countryStyles = landscapeLayer.styles || [];
  const sourceName = landscapeLayer.name;
  const GEOSERVER_TILE_URL = getGeoserverURL(landscapeLayer.geoserverLayerName);

  if (!map.getSource(sourceName)) {
    map.addSource(sourceName, {
      type: "vector",
      tiles: [GEOSERVER_TILE_URL]
    });
  }
  if (map.getLayer(sourceName)) {
    map.removeLayer(sourceName);
  }
  const style = countryStyles[0];
  map.addLayer({
    ...style,
    id: sourceName,
    source: sourceName,
    "source-layer": landscapeLayer.geoserverLayerName
  } as mapboxgl.AnyLayer);
  setFilterLandscape(map, sourceName, landscapes);
};
export const removeBorderLandscape = (map: mapboxgl.Map) => {
  const layerName = `${LAYERS_NAMES.LANDSCAPES}`;
  if (map.getLayer(layerName)) {
    map.removeLayer(layerName);
  }
  if (map.getSource(layerName)) {
    map.removeSource(layerName);
  }
};

export const removeBorderCountry = (map: mapboxgl.Map) => {
  const layerName = `${LAYERS_NAMES.WORLD_COUNTRIES}-line`;
  if (map.getLayer(layerName)) {
    map.removeLayer(layerName);
  }
  if (map.getSource(layerName)) {
    map.removeSource(layerName);
  }
};

export const addLayerStyle = (
  map: mapboxgl.Map,
  layerName: string,
  sourceName: string,
  style: LayerWithStyle,
  index_suffix: number | string,
  zoomFilter?: number | undefined
) => {
  const beforeLayer = map.getLayer(LAYERS_NAMES.MEDIA_IMAGES) ? LAYERS_NAMES.MEDIA_IMAGES : undefined;
  if (map.getLayer(`${layerName}-${index_suffix}`)) {
    map.removeLayer(`${layerName}-${index_suffix}`);
  }
  map.addLayer(
    {
      ...style,
      id: `${layerName}-${index_suffix}`,
      source: sourceName,
      "source-layer": sourceName,
      ...(zoomFilter && {
        filter: ["all", style.filter || ["==", true, true], [">=", ["zoom"], zoomFilter]]
      })
    } as mapboxgl.AnyLayer,
    beforeLayer
  );
  moveDeleteLayers(map);
};

export const updateMapProjection = (map: mapboxgl.Map, currentStyle: MapStyle) => {
  if (currentStyle === MapStyle.Street) {
    map.setProjection("mercator");
  } else if (currentStyle === MapStyle.Satellite) {
    map.setProjection("globe");
  }
};

export const zoomToBbox = (bbox: BBox, map: mapboxgl.Map, hasControls: boolean, currentStyle = MapStyle.Satellite) => {
  if (map && bbox) {
    map.fitBounds(bbox, {
      padding: hasControls ? 100 : 30,
      linear: false,
      animate: true
    });
  }
};

export const formatPlannedStartDate = (plantStartDate: Date | null | undefined): string => {
  return plantStartDate != null
    ? plantStartDate.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
        timeZone: "UTC"
      })
    : "Unknown";
};

export const formatCommentaryDate = (date: Date | null | undefined): string => {
  return date != null
    ? date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
        timeZone: "UTC",
        hour: "numeric",
        minute: "numeric"
      })
    : "Unknown";
};

export function parsePolygonData(sitePolygonData: SitePolygonsDataResponse | undefined) {
  return (sitePolygonData ?? []).reduce((acc: Record<string, string[]>, data: SitePolygon) => {
    if (data.status && data.poly_id !== undefined) {
      if (!acc[data.status]) {
        acc[data.status] = [];
      }
      acc[data.status].push(data.poly_id);
    }
    return acc;
  }, {});
}

export function getPolygonsData(
  uuid: string,
  statusFilter: string | undefined,
  sortOrder: string,
  type: string,
  cb: Function
) {
  const queryParams: any = {
    uuid: uuid,
    type: type,
    [`sort[${sortOrder}]`]: sortOrder === "created_at" ? "desc" : "asc"
  };
  if (statusFilter) {
    queryParams.status = statusFilter;
  }
  fetchGetV2TypeEntity({ queryParams }).then(result => {
    cb(result);
  });
}

export const countStatuses = (sitePolygonData: SitePolygon[]): DataPolygonOverview => {
  const statusOrder = ["Draft", "Submitted", "Needs Info", "Approved"];

  const statusCountMap: Record<string, number> = {};

  sitePolygonData.forEach(item => {
    let statusKey = item.status?.toLowerCase();

    if (statusKey) {
      if (statusKey === "needs-more-information") {
        statusKey = "Needs Info";
      } else {
        statusKey = statusKey.replace(/\b\w/g, char => char.toUpperCase());
      }

      statusCountMap[statusKey] = (statusCountMap[statusKey] || 0) + 1;
    }
  });

  const unorderedData = Object.entries(statusCountMap).map(([status, count]) => ({
    status,
    count
  }));

  const orderedData = unorderedData.sort((a, b) => statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status));

  return orderedData;
};

export const formatFileName = (inputString: string) => {
  return inputString.toLowerCase().replace(/\s+/g, "_");
};

export async function callEntityBbox(type: string, entityModel: any): Promise<BBox | null> {
  try {
    if (type === "sites") {
      const siteBbox = await fetchGetV2SitesSiteBbox({ pathParams: { site: entityModel.uuid } });

      if (Array.isArray(siteBbox.bbox) && siteBbox.bbox.length > 1) {
        return siteBbox.bbox as BBox;
      }
    } else if (type === "projects") {
      const projectBbox = await fetchGetV2DashboardGetBboxProject({
        queryParams: createQueryParams({ projectUuid: entityModel.uuid }) as any
      });

      if (Array.isArray(projectBbox.bbox) && projectBbox.bbox.length > 1) {
        return projectBbox.bbox as BBox;
      }
    }

    return null;
  } catch (error) {
    console.error("Error fetching entity BBox:", error);
    return null;
  }
}

export async function downloadSiteGeoJsonPolygons(siteUuid: string, siteName: string): Promise<void> {
  const polygonGeojson = await fetchGetV2TerrafundGeojsonSite({
    queryParams: { uuid: siteUuid }
  });
  const blob = new Blob([JSON.stringify(polygonGeojson)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${formatFileName(siteName)}.geojson`;
  link.click();
  URL.revokeObjectURL(url);
}

export async function storePolygon(
  geojson: any,
  record: any,
  refetch: any,
  setPolygonFromMap?: any,
  refreshEntity?: any
) {
  if (geojson?.length) {
    const response = await fetchPostV2TerrafundPolygon({
      body: { geometry: JSON.stringify(geojson[0].geometry) }
    });
    const polygonUUID = response.uuid;
    if (polygonUUID) {
      const site_id = record.uuid;
      fetchPostV2TerrafundSitePolygonUuidSiteUuid({
        body: {},
        pathParams: { uuid: polygonUUID, siteUuid: site_id }
      }).then(() => {
        refreshEntity?.();
        refetch();
        setPolygonFromMap?.({ uuid: polygonUUID, isOpen: true });
      });
    }
  }
}

export async function storePolygonProject(
  geojson: any,
  entity_uuid: string,
  entity_type: string,
  refetch: any,
  setPolygonFromMap: any
) {
  if (geojson?.length) {
    const response = await fetchPostV2TerrafundPolygon({
      body: { geometry: JSON.stringify(geojson[0].geometry) }
    });
    const polygonUUID = response.uuid;
    if (polygonUUID) {
      fetchPostV2TerrafundProjectPolygonUuidEntityUuidEntityType({
        pathParams: { uuid: polygonUUID, entityUuid: entity_uuid, entityType: entity_type }
      }).then(res => {
        refetch?.();
        setPolygonFromMap?.({ uuid: polygonUUID, isOpen: true });
      });
    }
  }
}
export const drawTemporaryPolygon = (geojson: any, cb: Function, map: mapboxgl.Map, polygonVersion?: any) => {
  if (geojson) {
    const geojsonFormatted = convertToAcceptedGEOJSON(geojson);
    if (polygonVersion?.poly_id && !polygonVersion?.is_active) {
      map.addSource("temp-polygon-source", {
        type: "geojson",
        data: geojsonFormatted
      });

      map?.addLayer({
        id: `temp-polygon-source`,
        type: "fill",
        source: `temp-polygon-source`,
        layout: {},
        paint: {
          "fill-color": getPolygonColor(polygonVersion?.status),
          "fill-opacity": 0
        }
      });
      map.addLayer({
        id: `temp-polygon-source-line`,
        type: "line",
        source: `temp-polygon-source`,
        layout: {},
        paint: {
          "line-color": getPolygonColor(polygonVersion?.status),
          "line-width": 2,
          "line-dasharray": [4, 2]
        }
      });
    }
    zoomToBbox(bbox(geojsonFormatted) as BBox, map, false);
    cb(polygonVersion?.poly_id as string);
  }
};

const getPolygonColor = (polygonStatus: string) => {
  switch (polygonStatus) {
    case "draft":
      return "#E468EF";
    case "submitted":
      return "#2398d8";
    case "approved":
      return "#72d961";
    case "needs-more-information":
      return "#ff8938";
    default:
      return "#000000";
  }
};

export const getPolygonBbox = (polygon_uuid: any) => {
  const { data } = useGetV2TerrafundPolygonBboxUuid(
    {
      pathParams: { uuid: polygon_uuid }
    },
    {
      enabled: !!polygon_uuid
    }
  );
  const bbox = data?.bbox;
  return bbox;
};

export const getSiteBbox = (record: any) => {
  const { data: sitePolygonBbox } = useGetV2SitesSiteBbox(
    { pathParams: { site: record?.uuid } },
    { enabled: record?.uuid != null }
  );
  return sitePolygonBbox?.bbox;
};
export const addMarkerAndZoom = (map: mapboxgl.Map, location: { lng: number; lat: number }) => {
  if (map) {
    const { lng, lat } = location;
    const lngLat = new mapboxgl.LngLat(lng, lat);
    createMarker(lngLat, map);
    map.setCenter([lng, lat]);
    map.setZoom(14);
  }
};

export const createMarker = (lngLat: LngLat, map: mapboxgl.Map) => {
  return new mapboxgl.Marker({
    color: "#ba5856"
  })
    .setLngLat(lngLat)
    .addTo(map);
};

export const setMapStyle = (
  style: MapStyle,
  map: mapboxgl.Map,
  setCurrentStyle: (style: MapStyle) => void,
  currentStyle: string
) => {
  if (map && currentStyle !== style) {
    map.setStyle(style);
    updateMapProjection(map, style);
    setCurrentStyle(style);
  }
};

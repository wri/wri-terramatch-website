import * as turfHelper from "@turf/helpers";
import mapboxgl from "mapbox-gl";
import { createElement } from "react";
import { createRoot } from "react-dom/client";

import { LAYERS_NAMES, layersList } from "@/constants/layers";
import {
  fetchGetV2TerrafundGeojsonSite,
  fetchGetV2TypeEntity,
  fetchPostV2TerrafundPolygon,
  fetchPostV2TerrafundSitePolygonUuidSiteUuid,
  GetV2MODELUUIDFilesResponse
} from "@/generated/apiComponents";
import { SitePolygon, SitePolygonsDataResponse } from "@/generated/apiSchemas";

import { MediaPopup } from "./components/MediaPopup";
import { BBox, Feature, FeatureCollection, GeoJsonProperties, Geometry } from "./GeoJSON";
import type { LayerType, LayerWithStyle, TooltipType } from "./Map.d";
import { getPulsingDot } from "./pulsing.dot";

const GEOSERVER = process.env.NEXT_PUBLIC_GEOSERVER_URL;
const WORKSPACE = process.env.NEXT_PUBLIC_GEOSERVER_WORKSPACE;

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

export const addFilterOnLayer = (
  layer: any,
  field: string,
  parsedPolygonData: Record<string, string[]>,
  map: mapboxgl.Map
) => {
  addSourceToLayer(layer, map, parsedPolygonData);
  const { name, styles } = layer;
  showPolygons(styles, name, map, field, parsedPolygonData);
};

const showPolygons = (
  styles: LayerWithStyle[],
  name: string,
  map: mapboxgl.Map,
  field: string,
  parsedPolygonData: any
) => {
  styles.forEach((style: LayerWithStyle, index: number) => {
    const layerName = `${name}-${index}`;
    if (!map.getLayer(layerName)) {
      console.error(`Layer ${layerName} does not exist.`);
      return;
    }
    const polygonStatus = style?.metadata?.polygonStatus;
    const filter = [
      "in",
      ["get", field],
      ["literal", parsedPolygonData?.[polygonStatus] === undefined ? "" : parsedPolygonData[polygonStatus]]
    ];
    const completeFilter = ["all", filter];
    map.setFilter(layerName, completeFilter);
    map.setLayoutProperty(layerName, "visibility", "visible");
  });
};

let popup: mapboxgl.Popup | null = null;
let popupAttachedMap: Record<string, mapboxgl.Popup[]> = {
  POLYGON: [],
  MEDIA: []
};

export const loadLayersInMap = (map: mapboxgl.Map, polygonsData: Record<string, string[]> | undefined) => {
  layersList.forEach((layer: any) => {
    if (map) {
      showPolygons(layer.styles, layer.name, map, "uuid", polygonsData);
    }
  });
};

const handleLayerClick = (
  e: any,
  popupComponent: any,
  map: mapboxgl.Map,
  setPolygonFromMap: any,
  sitePolygonData: SitePolygonsDataResponse | undefined,
  type: TooltipType
) => {
  removePopups("POLYGON");
  const { lng, lat } = e.lngLat;
  const feature = e.features[0];

  let popupContent = document.createElement("div");
  popupContent.className = "popup-content-map";
  const root = createRoot(popupContent);
  root.render(createElement(popupComponent, { feature, popup, setPolygonFromMap, sitePolygonData, type }));

  popup = new mapboxgl.Popup({ className: "popup-map" }).setLngLat([lng, lat]).setDOMContent(popupContent).addTo(map);

  popupAttachedMap["POLYGON"].push(popup);
};

export const removePopups = (key: "POLYGON" | "MEDIA") => {
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
      loadLayersInMap(map, polygonsData);
    } else {
      map.on("style.load", () => {
        loadLayersInMap(map, polygonsData);
      });
      map.on("load", () => {
        loadLayersInMap(map, polygonsData);
      });
    }
  }
};

export const addGeojsonToDraw = (geojson: any, uuid: string, cb: Function, currentDraw: MapboxDraw) => {
  if (geojson) {
    const geojsonFormatted = convertToAcceptedGEOJSON(geojson);
    const addToDrawAndFilter = () => {
      if (currentDraw) {
        const featureGeojson = currentDraw.set(geojsonFormatted);
        if (featureGeojson.length) {
          currentDraw.changeMode("direct_select", { featureId: featureGeojson[0] });
        }
        cb(uuid);
      }
    };
    addToDrawAndFilter();
  }
};

export const addMediaSourceAndLayer = (map: mapboxgl.Map, modelFilesData: GetV2MODELUUIDFilesResponse["data"]) => {
  const layerName = LAYERS_NAMES.MEDIA_IMAGES;
  removeMediaLayer(map);
  removePopups("MEDIA");
  const modelFilesGeolocalized = modelFilesData!.filter(
    modelFile => modelFile.location?.lat && modelFile.location?.lng
  );
  if (modelFilesGeolocalized.length === 0) {
    return;
  }

  const features: Feature<Geometry, GeoJsonProperties>[] = modelFilesGeolocalized.map(modelFile => ({
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [modelFile.location!.lng, modelFile.location!.lat]
    },
    properties: {
      uuid: modelFile.uuid,
      name: modelFile.file_name,
      created_date: modelFile.created_date,
      file_url: modelFile.file_url
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
      root.render(
        createElement(MediaPopup, {
          ...feature.properties,
          onClose: () => {
            removePopups("MEDIA");
          }
        })
      );
      popup = new mapboxgl.Popup({ className: "popup-media", closeButton: false })
        .setLngLat(feature.geometry.coordinates)
        .setDOMContent(popupContent)
        .addTo(map);
      popupAttachedMap["MEDIA"].push(popup);
    });
  });
};

export const addSourcesToLayers = (map: mapboxgl.Map, polygonsData: Record<string, string[]> | undefined) => {
  layersList.forEach((layer: LayerType) => {
    if (map) {
      addSourceToLayer(layer, map, polygonsData);
    }
  });
};

export const addPopupsToMap = (
  map: mapboxgl.Map,
  popupComponent: any,
  setPolygonFromMap: any,
  sitePolygonData: SitePolygonsDataResponse | undefined,
  type: TooltipType
) => {
  if (popupComponent) {
    layersList.forEach((layer: LayerType) => {
      addPopupToLayer(map, popupComponent, layer, setPolygonFromMap, sitePolygonData, type);
    });
  }
};

export const addPopupToLayer = (
  map: mapboxgl.Map,
  popupComponent: any,
  layer: any,
  setPolygonFromMap: any,
  sitePolygonData: SitePolygonsDataResponse | undefined,
  type: TooltipType
) => {
  if (popupComponent) {
    const { name } = layer;

    let layers = map.getStyle().layers;

    let targetLayers = layers.filter(layer => layer.id.startsWith(name));
    console.log("targetLayers", targetLayers);

    targetLayers.forEach(targetLayer => {
      map.on("click", targetLayer.id, (e: any) =>
        handleLayerClick(e, popupComponent, map, setPolygonFromMap, sitePolygonData, type)
      );
    });
  }
};

export const addSourceToLayer = (layer: any, map: mapboxgl.Map, polygonsData: Record<string, string[]> | undefined) => {
  const { name, styles } = layer;
  if (map) {
    if (map.getSource(name)) {
      styles?.forEach((_: unknown, index: number) => {
        map.removeLayer(`${name}-${index}`);
      });
      map.removeSource(name);
    }
    const URL_GEOSERVER = `${GEOSERVER}/geoserver/gwc/service/wmts?REQUEST=GetTile&SERVICE=WMTS
      &VERSION=1.0.0&LAYER=${WORKSPACE}:${name}&STYLE=&TILEMATRIX=EPSG:900913:{z}&TILEMATRIXSET=EPSG:900913&FORMAT=application/vnd.mapbox-vector-tile&TILECOL={x}&TILEROW={y}&RND=${Math.random()}`;
    map.addSource(name, {
      type: "vector",
      tiles: [URL_GEOSERVER]
    });
    styles?.forEach((style: LayerWithStyle, index: number) => {
      addLayerStyle(map, name, style, index);
    });
    loadLayersInMap(map, polygonsData);
  }
};

export const addLayerStyle = (map: mapboxgl.Map, sourceName: string, style: LayerWithStyle, index: number) => {
  const beforeLayer = map.getLayer(LAYERS_NAMES.MEDIA_IMAGES) ? LAYERS_NAMES.MEDIA_IMAGES : undefined;
  map.addLayer(
    {
      ...style,
      id: `${sourceName}-${index}`,
      source: sourceName,
      "source-layer": sourceName
    } as mapboxgl.AnyLayer,
    beforeLayer
  );
};

export const zoomToBbox = (bbox: BBox, map: mapboxgl.Map, hasControls: boolean) => {
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

export function mapPolygonData(sitePolygonData: SitePolygonsDataResponse | undefined) {
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

export function getPolygonsData(uuid: string, statusFilter: string, sortOrder: string, type: string, cb: Function) {
  fetchGetV2TypeEntity({
    queryParams: {
      uuid: uuid,
      type: type,
      status: statusFilter,
      [`sort[${sortOrder}]`]: sortOrder === "created_at" ? "desc" : "asc"
    }
  }).then(result => {
    cb(result);
  });
}

export async function downloadSiteGeoJsonPolygons(siteUuid: string): Promise<void> {
  const polygonGeojson = await fetchGetV2TerrafundGeojsonSite({
    queryParams: { uuid: siteUuid }
  });
  const blob = new Blob([JSON.stringify(polygonGeojson)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `SitePolygons.geojson`;
  link.click();
  URL.revokeObjectURL(url);
}

export async function storePolygon(geojson: any, record: any, refetch: any, setPolygonFromMap?: any) {
  if (geojson?.length) {
    const response = await fetchPostV2TerrafundPolygon({
      body: { geometry: JSON.stringify(geojson[0].geometry) }
    });
    const polygonUUID = response.uuid;
    if (polygonUUID) {
      const site_id = record.uuid;
      await fetchPostV2TerrafundSitePolygonUuidSiteUuid({
        body: {},
        pathParams: { uuid: polygonUUID, siteUuid: site_id }
      }).then(() => {
        refetch();
        setPolygonFromMap?.({ uuid: polygonUUID, isOpen: true });
      });
    }
  }
}

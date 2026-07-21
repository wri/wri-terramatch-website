export type OverlapPolygonPoint = {
  polygonUuid: string;
  lat: number;
  lng: number;
  tooltip?: string;
};

export type CrossSiteOverlapPolygon = {
  polygonUuid: string;
  polyName: string;
  siteName: string;
  geometry: GeoJSON.Geometry;
};

export as namespace GeoJSON;
export type GeoJsonGeometryTypes = Geometry["type"];

export type GeoJsonTypes = GeoJSON["type"];

export type BBox = [number, number, number, number];

export type Position = number[];

export interface GeoJsonObject {
  type: GeoJsonTypes;
  bbox?: BBox | undefined;
}
export type GeoJSON = Geometry | Feature | FeatureCollection;
export type Geometry = Point | MultiPoint | LineString | MultiLineString | Polygon | MultiPolygon | GeometryCollection;
export type GeometryObject = Geometry;

export interface Point extends GeoJsonObject {
  type: "Point";
  coordinates: Position;
}

export interface MultiPoint extends GeoJsonObject {
  type: "MultiPoint";
  coordinates: Position[];
}

export interface LineString extends GeoJsonObject {
  type: "LineString";
  coordinates: Position[];
}

export interface MultiLineString extends GeoJsonObject {
  type: "MultiLineString";
  coordinates: Position[][];
}
export interface Polygon extends GeoJsonObject {
  type: "Polygon";
  coordinates: Position[][];
}

export interface MultiPolygon extends GeoJsonObject {
  type: "MultiPolygon";
  coordinates: Position[][][];
}

export type GeoJsonProperties = { [name: string]: unknown } | null;

export interface Feature<G extends Geometry | null = Geometry, P = GeoJsonProperties> extends GeoJsonObject {
  type: "Feature";
  geometry: G;
  id?: string | number | undefined;
  properties: P;
}

export interface FeatureCollection<G extends Geometry | null = Geometry, P = GeoJsonProperties> extends GeoJsonObject {
  type: "FeatureCollection";
  features: Array<Feature<G, P>>;
}

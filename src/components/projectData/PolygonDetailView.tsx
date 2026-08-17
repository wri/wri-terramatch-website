import type { FeatureCollection } from "geojson";
import Link from "next/link";
import { useMemo } from "react";

import { usePolygonGeoJson } from "@/connections/GeoJsonExport";
import { useSitePolygons } from "@/connections/SitePolygons";

import { aggregatePolygon, polygonMeasurementsFrom } from "../semanticZoom/aggregate";
import DrilldownMap from "../semanticZoom/DrilldownMap";
import IndicatorRow from "../semanticZoom/IndicatorRow";
import { INDICATOR_ORDER, LEVEL_CONTRACT } from "../semanticZoom/levelContract";

/**
 * The standardised single-polygon entity page.
 *
 * It is deliberately read-first: the polygon is fetched by uuid, its own recorded indicator values
 * are rolled through the same `aggregatePolygon` seam the Semantic Zoom panel uses, and every
 * figure keeps the provenance and coverage treatment defined once in `IndicatorRow`. Nothing here
 * recomputes an indicator by hand, so the polygon page and the drill-down can never disagree about
 * what a number means.
 *
 * A polygon is the native level of the contract — nothing is aggregated — so the point of the page
 * is to show the values that were actually recorded against this one boundary, beside the shape it
 * was measured over.
 */
export interface PolygonDetailViewProps {
  projectUuid: string;
  polygonUuid: string;
}

const STATUS_LABELS: Record<string, string> = {
  draft: "Draft",
  "pending-approval": "Pending approval",
  "information-required": "Information required",
  approved: "Approved"
};

// Status is where a polygon sits in the review workflow; validation is whether its geometry passed
// the automated checks. They are different axes and are pilled separately so neither is read as the
// other. Colours are drawn from the same theme tokens the provenance chips use.
const STATUS_STYLES: Record<string, string> = {
  draft: "bg-theme-neutral-200 text-theme-neutral-800",
  "pending-approval": "bg-theme-warning-100 text-theme-warning-900",
  "information-required": "bg-theme-warning-100 text-theme-warning-900",
  approved: "bg-theme-success-100 text-theme-success-900"
};

const VALIDATION_STYLES: Record<string, string> = {
  passed: "bg-theme-success-100 text-theme-success-900",
  partial: "bg-theme-warning-100 text-theme-warning-900",
  failed: "bg-theme-error-100 text-theme-error-900"
};

const Pill = ({ label, value, className }: { label: string; value: string; className: string }) => (
  <span className="inline-flex items-center gap-1.5">
    <span className="text-[11px] uppercase tracking-wide text-theme-neutral-400">{label}</span>
    <span
      className={`inline-flex items-center rounded px-1.5 py-0.5 text-[11px] font-medium leading-none ${className}`}
    >
      {value}
    </span>
  </span>
);

// "—" for anything absent — never 0, never an empty string. Absent data is a state, not a value.
const orDash = (value: string | number | null | undefined) =>
  value == null || value === "" ? "—" : typeof value === "number" ? value.toLocaleString() : value;

const orDashList = (value: string[] | null | undefined) =>
  value == null || value.length === 0 ? "—" : value.join(", ");

const formatDate = (value: string | null | undefined) => {
  if (value == null || value === "") return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleDateString();
};

const Attribute = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col gap-0.5">
    <span className="text-[11px] uppercase tracking-wide text-theme-neutral-400">{label}</span>
    <span className="text-sm tabular-nums text-theme-neutral-900">{value}</span>
  </div>
);

const PolygonDetailView = ({ projectUuid, polygonUuid }: PolygonDetailViewProps) => {
  // Fetched by uuid rather than paged: the same access pattern the drill-down uses, because a site
  // can hold thousands of polygons and the one being viewed is rarely on the first page.
  const [polygonLoaded, { data: polygonRows }] = useSitePolygons({
    enabled: polygonUuid != null,
    filter: polygonUuid == null ? undefined : { "uuid[]": [polygonUuid] },
    pageSize: 1,
    pageNumber: 1
  });
  const polygon = polygonRows?.[0] ?? null;

  const [geoLoaded, { data: geo }] = usePolygonGeoJson({
    uuid: polygonUuid,
    geometryOnly: false,
    enabled: polygonUuid != null
  });

  // One feature, framed by DrilldownMap. The uuid property is what the map keys selection on, so it
  // is stamped explicitly even when the export omits it — otherwise the shape would draw but never
  // frame as "selected".
  const featureCollection = useMemo<FeatureCollection | null>(() => {
    if (geo?.features == null || geo.features.length === 0) return null;
    return {
      type: "FeatureCollection",
      features: geo.features.map(feature => ({
        type: "Feature",
        geometry: feature.geometry as FeatureCollection["features"][number]["geometry"],
        properties: { ...(feature.properties ?? {}), uuid: feature.properties?.uuid ?? polygonUuid }
      }))
    } as FeatureCollection;
  }, [geo, polygonUuid]);

  const geoProps = geo?.features?.[0]?.properties ?? null;

  const aggregate = useMemo(
    () =>
      polygon == null ? null : aggregatePolygon(polygonMeasurementsFrom(polygon.indicators, polygon.calcArea ?? null)),
    [polygon]
  );

  const name = polygon?.name ?? (geoProps?.polyName as string | undefined) ?? "Polygon";
  const siteUuid = polygon?.siteId ?? (geoProps?.siteId as string | undefined) ?? null;
  const siteName = polygon?.siteName ?? null;
  const projectName = polygon?.projectName ?? null;

  const status = polygon?.status ?? null;
  const validationStatus = polygon?.validationStatus ?? null;

  // Not found is only asserted once both requests have settled and neither carries the polygon.
  // Asserting it earlier would flash "not found" over data that is merely in flight.
  const settled = polygonLoaded && geoLoaded;
  if (settled && polygon == null && featureCollection == null) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-10">
        <nav className="mb-6 flex flex-wrap items-center gap-1.5 text-xs text-theme-neutral-500">
          <Link href={`/project/${projectUuid}`} className="hover:text-theme-primary-500 hover:underline">
            Project
          </Link>
        </nav>
        <div className="rounded-lg border border-theme-neutral-200 bg-white px-6 py-10 text-center">
          <h1 className="text-base font-semibold text-theme-neutral-900">Polygon not found</h1>
          <p className="mt-1 text-sm text-theme-neutral-500">
            No polygon matches this link. It may have been deleted, or the address is incorrect.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6">
      <nav className="mb-4 flex flex-wrap items-center gap-1.5 text-xs text-theme-neutral-500">
        <Link href={`/project/${projectUuid}`} className="hover:text-theme-primary-500 hover:underline">
          {orDash(projectName) === "—" ? "Project" : projectName}
        </Link>
        <span className="text-theme-neutral-300">/</span>
        {siteUuid == null ? (
          <span>{siteName ?? "Site"}</span>
        ) : (
          <Link href={`/site/${siteUuid}`} className="hover:text-theme-primary-500 hover:underline">
            {siteName ?? "Site"}
          </Link>
        )}
        <span className="text-theme-neutral-300">/</span>
        <span className="text-theme-neutral-700">{name}</span>
      </nav>

      <header className="mb-4 flex flex-col gap-2">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <div className="flex flex-col gap-1">
            <p className="text-[11px] uppercase tracking-wide text-theme-neutral-400">Polygon</p>
            <h1 className="text-xl font-semibold text-theme-neutral-900" title={name}>
              {name}
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Pill
              label="Status"
              value={status == null ? "—" : STATUS_LABELS[status] ?? status}
              className={
                status == null
                  ? "bg-theme-neutral-100 text-theme-neutral-500"
                  : STATUS_STYLES[status] ?? "bg-theme-neutral-200 text-theme-neutral-800"
              }
            />
            <Pill
              label="Validation"
              value={validationStatus == null || validationStatus === "" ? "—" : validationStatus}
              className={
                validationStatus == null
                  ? "bg-theme-neutral-100 text-theme-neutral-500"
                  : VALIDATION_STYLES[validationStatus.toLowerCase()] ?? "bg-theme-neutral-200 text-theme-neutral-800"
              }
            />
          </div>
        </div>

        {/* TODO(anomaly-actions): per-polygon anomaly + action controls wire in here */}
      </header>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="min-h-[420px]">
          <DrilldownMap featureCollection={featureCollection} selectedId={polygonUuid} loading={!geoLoaded} />
        </div>

        <section className="flex flex-col overflow-hidden rounded-lg border border-theme-neutral-200 bg-white">
          <header className="border-b border-theme-neutral-200 px-4 py-3">
            <p className="text-[11px] uppercase tracking-wide text-theme-neutral-400">Indicators</p>
            <p className="mt-1 text-xs text-theme-neutral-700">As measured on this polygon</p>
          </header>
          <div className="flex-1 overflow-y-auto px-4">
            {aggregate == null ? (
              // The same honest treatment the panel uses: while the record is loading, say so; if it
              // never arrives, an em-dash per row would imply a measurement that does not exist, so a
              // single neutral line is the truthful state.
              <p className="py-6 text-sm text-theme-neutral-500">
                {polygonLoaded ? "This polygon's record could not be loaded." : "Loading indicators…"}
              </p>
            ) : (
              <ul>
                {INDICATOR_ORDER.map(key => (
                  <IndicatorRow
                    key={key}
                    contract={LEVEL_CONTRACT[key]}
                    level="polygon"
                    measurement={aggregate.indicators[key]}
                  />
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>

      <section className="mt-4 rounded-lg border border-theme-neutral-200 bg-white px-4 py-4">
        <p className="mb-3 text-[11px] uppercase tracking-wide text-theme-neutral-400">Attributes</p>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          <Attribute label="Area" value={polygon?.calcArea == null ? "—" : `${polygon.calcArea.toLocaleString()} ha`} />
          <Attribute label="Trees" value={orDash(polygon?.numTrees)} />
          <Attribute label="Plant start" value={formatDate(polygon?.plantStart)} />
          <Attribute label="Practice" value={orDashList(polygon?.practice)} />
          <Attribute label="Target system" value={orDash(polygon?.targetSys)} />
          <Attribute label="Distribution" value={orDashList(polygon?.distr)} />
          <Attribute label="Source" value={orDash(polygon?.source)} />
        </div>
      </section>
    </div>
  );
};

export default PolygonDetailView;

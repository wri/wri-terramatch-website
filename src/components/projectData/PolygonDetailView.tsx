import { Box } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import type { FeatureCollection } from "geojson";
import { useMemo } from "react";

import EntityDataView from "@/components/entityData/EntityDataView";
import { StatusPill, ValidationPill } from "@/components/entityData/polygonTableCells";
import PageContent from "@/components/extensive/PageElements/PageContent/PageContent";
import PageItem from "@/components/extensive/PageElements/PageItem/PageItem";
import { usePolygonGeoJson } from "@/connections/GeoJsonExport";
import { useSitePolygons } from "@/connections/SitePolygons";
import { ProjectIcon } from "@/redesignComponents/foundations/Icons";
import ResponsiveBreadcrumbToolbar, {
  BreadcrumbLink
} from "@/redesignComponents/navigation/Toolbar/ResponsiveBreadcrumbToolbar";

import { aggregatePolygon, polygonMeasurementsFrom } from "../semanticZoom/aggregate";
import DrilldownMap from "../semanticZoom/DrilldownMap";
import IndicatorRow from "../semanticZoom/IndicatorRow";
import { INDICATOR_ORDER, LEVEL_CONTRACT } from "../semanticZoom/levelContract";
import EntityActions from "./actions/EntityActions";

/**
 * The single-polygon entity page, laid out to match the site page: the same breadcrumb bar, the same
 * PageContent/PageItem cards, and the same map-plus-panel EntityDataView shell.
 *
 * The content differs because a polygon is the leaf of the contract — nothing is aggregated and there
 * is nothing to drill into — so the right column holds this polygon's own anomalies over its recorded
 * indicator values, rather than a child list. Every figure still flows through the same
 * `aggregatePolygon` seam and `IndicatorRow` treatment the drill-down uses, so the page and the panel
 * can never disagree about what a number means.
 */
export interface PolygonDetailViewProps {
  projectUuid: string;
  polygonUuid: string;
}

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
  const t = useT();

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

  const breadcrumbs: BreadcrumbLink[] = [
    { label: t("Projects"), link: "/my-projects", icon: <ProjectIcon className="!text-theme-primary-900" /> },
    { label: projectName ?? t("Project"), link: `/project/${projectUuid}` },
    { label: siteName ?? t("Site"), link: siteUuid == null ? `/project/${projectUuid}` : `/site/${siteUuid}` },
    { label: name, link: `/project/${projectUuid}/polygon/${polygonUuid}` }
  ];

  const breadcrumbBar = (
    <Box borderBottom="0.0625rem solid" borderColor="neutral.300" className="sticky top-0 z-20 px-1">
      <ResponsiveBreadcrumbToolbar breadcrumbs={breadcrumbs} suffix={null} />
    </Box>
  );

  // Not found is only asserted once both requests have settled and neither carries the polygon.
  // Asserting it earlier would flash "not found" over data that is merely in flight.
  const settled = polygonLoaded && geoLoaded;
  if (settled && polygon == null && featureCollection == null) {
    return (
      <>
        {breadcrumbBar}
        <PageContent>
          <PageItem title={t("Polygon not found")} flexProps={{ width: "100%" }}>
            <p className="px-1 py-4 text-sm text-theme-neutral-500">
              No polygon matches this link. It may have been deleted, or the address is incorrect.
            </p>
          </PageItem>
        </PageContent>
      </>
    );
  }

  const indicatorPanel = (
    <section className="flex h-full flex-col overflow-hidden rounded-lg border border-theme-neutral-200 bg-white">
      <header className="border-b border-theme-neutral-200 px-4 py-3">
        <p className="text-[11px] uppercase tracking-wide text-theme-neutral-400">Indicators</p>
        <p className="mt-1 text-xs text-theme-neutral-700">As measured on this polygon</p>
      </header>
      <div className="flex-1 overflow-y-auto px-4">
        {aggregate == null ? (
          // The same honest treatment the panel uses: while the record is loading, say so; if it never
          // arrives, an em-dash per row would imply a measurement that does not exist, so a single
          // neutral line is the truthful state.
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
  );

  return (
    <>
      {breadcrumbBar}
      <PageContent>
        {/* Above the fold: the polygon's shape on the left, and a right column holding this polygon's
            anomalies over its recorded indicators — the same EntityDataView shell the project and site
            pages use, with the child drill-down replaced by the leaf's own values. */}
        <PageItem
          title={name}
          flexProps={{ width: "100%" }}
          tag={
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5">
                <span className="text-[11px] uppercase tracking-wide text-theme-neutral-400">Status</span>
                <StatusPill status={status} />
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="text-[11px] uppercase tracking-wide text-theme-neutral-400">Validation</span>
                <ValidationPill validationStatus={validationStatus} />
              </span>
            </div>
          }
        >
          <EntityDataView
            map={<DrilldownMap featureCollection={featureCollection} selectedId={polygonUuid} loading={!geoLoaded} />}
            actions={<EntityActions projectUuid={projectUuid} entityUuid={polygonUuid} entityStatus={status} />}
            kpis={indicatorPanel}
          />
        </PageItem>

        <PageItem title={t("Attributes")} flexProps={{ paddingY: 2, width: "100%" }}>
          <div className="grid grid-cols-2 gap-4 px-1 py-2 sm:grid-cols-3 lg:grid-cols-4">
            <Attribute
              label="Area"
              value={polygon?.calcArea == null ? "—" : `${polygon.calcArea.toLocaleString()} ha`}
            />
            <Attribute label="Trees" value={orDash(polygon?.numTrees)} />
            <Attribute label="Plant start" value={formatDate(polygon?.plantStart)} />
            <Attribute label="Practice" value={orDashList(polygon?.practice)} />
            <Attribute label="Target system" value={orDash(polygon?.targetSys)} />
            <Attribute label="Distribution" value={orDashList(polygon?.distr)} />
            <Attribute label="Source" value={orDash(polygon?.source)} />
          </div>
        </PageItem>
      </PageContent>
    </>
  );
};

export default PolygonDetailView;

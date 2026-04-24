import { DashboardExpandedMapLegend } from "@/components/dashboard/DashboardExpandedMapLegend";
import { DashboardGetProjectsData, MapContainer } from "@/components/elements/Map-mapbox/Map";
import { MapFunctions } from "@/components/elements/Map-mapbox/Map.d";
import { MapStyle } from "@/components/elements/Map-mapbox/MapControls/types";
import { buildDashboardMapProps } from "@/components/elements/Map-mapbox/mapProps.builders";
import LoadingContainerOpacity from "@/components/generic/Loading/LoadingContainerOpacity";
import { CountriesProps, DashboardFilters } from "@/context/dashboard.provider";

export type DashboardExpandedMapModalContentProps = {
  modalMapFunctions: MapFunctions;
  modalMapLoaded: boolean;
  centroids?: DashboardGetProjectsData[];
  polygonsData?: { data: Record<string, string[]>; centroids: unknown[] };
  initialCenter: [number, number] | undefined;
  initialZoom: number | undefined;
  mapStyle: MapStyle | undefined;
  onModalMapStyleChange: (style: MapStyle) => void;
  landscapeNamesForBorderOverlay: string[];
  onModalMapLoadComplete: (loaded: boolean) => void;
  selectedProjectUuid: string | undefined;
  hasAccess?: boolean;
  setFilters: DashboardFilters;
  dashboardCountries: CountriesProps[];
  translate: (key: string, options?: Record<string, string | number>) => string;
  nonProfitProjectCount: number;
  enterpriseProjectCount: number;
};

export function DashboardExpandedMapModalContent({
  modalMapFunctions,
  modalMapLoaded,
  centroids,
  polygonsData,
  initialCenter,
  initialZoom,
  mapStyle,
  onModalMapStyleChange,
  landscapeNamesForBorderOverlay,
  onModalMapLoadComplete,
  selectedProjectUuid,
  hasAccess,
  setFilters,
  dashboardCountries,
  translate,
  nonProfitProjectCount,
  enterpriseProjectCount
}: DashboardExpandedMapModalContentProps) {
  return (
    <div className="shadow-lg relative w-full flex-1 overflow-hidden rounded-lg border-4 border-white">
      <LoadingContainerOpacity loading={modalMapLoaded}>
        <MapContainer
          id="modal"
          {...buildDashboardMapProps({
            mode: "modal",
            mapFunctions: modalMapFunctions,
            centroids,
            polygonsData: polygonsData?.data as Record<string, string[]> | undefined,
            polygonsCentroids: polygonsData?.centroids as { uuid: string; long: number; lat: number }[] | undefined,
            center: initialCenter,
            zoom: initialZoom,
            mapStyle,
            onStyleChange: onModalMapStyleChange,
            selectedLandscapes: landscapeNamesForBorderOverlay,
            setLoader: onModalMapLoadComplete,
            projectUUID: selectedProjectUuid,
            hasAccess,
            dashboardContext: { setFilters, dashboardCountries, dashboardMode: "modal" },
            className: "custom-popup-close-button !h-full"
          })}
        />
      </LoadingContainerOpacity>
      {!selectedProjectUuid && (
        <DashboardExpandedMapLegend
          nonProfitProjectCount={nonProfitProjectCount}
          enterpriseProjectCount={enterpriseProjectCount}
          translate={translate}
        />
      )}
    </div>
  );
}

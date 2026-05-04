import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import CircularProgress from "@mui/material/CircularProgress";
import { useT } from "@transifex/react";
import classNames from "classnames";
import { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { When } from "react-if";

import {
  downloadGeoJsonFile,
  extractGeoJsonFromResponse,
  formatFileName
} from "@/components/elements/Map-mapbox/utils";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import { loadAnrPlotGeometryGeoJson, useAnrPlotGeometry } from "@/connections/AnrPlotGeometry";
import { usePolygonValidation } from "@/connections/Validation";
import { useAnrMapOverlayOptional } from "@/context/anrMapOverlay.provider";
import { isMapAreaSiteFullDto, useMapAreaContext } from "@/context/mapArea.provider";
import { SitePolygonLightDto } from "@/generated/v3/researchService/researchServiceSchemas";
import { ValidationCriteriaDto } from "@/generated/v3/researchService/researchServiceSchemas";
import { useOnUnmount } from "@/hooks/useOnMount";
import ApiSlice from "@/store/apiSlice";
import { isSitePolygonEligibleForAnrMonitoringPlots } from "@/utils/sitePolygonAnrEligibility";

import Button from "../Button/Button";
import Text from "../Text/Text";
import AttributeInformation from "./AttributeInformation";
import ChecklistInformation, { CriteriaData } from "./ChecklistInformation";
import VersionInformation from "./VersionInformation";

export interface MapEditPolygonPanelProps {
  tabEditPolygon: string;
  setTabEditPolygon: Dispatch<SetStateAction<string>>;
  polygonVersionData?: SitePolygonLightDto[];
  refetchPolygonVersions?: () => void;
  mapFunctions?: any;
  polygonData?: Record<string, string[]>;
  recallEntityData?: () => void;
}

const MapEditPolygonPanel = ({
  tabEditPolygon,
  setTabEditPolygon,
  polygonVersionData,
  refetchPolygonVersions,
  mapFunctions,
  polygonData: polygonDataForCancel,
  recallEntityData
}: MapEditPolygonPanelProps) => {
  const t = useT();
  const {
    editPolygon,
    setEditPolygon,
    siteData,
    polygonData,
    setSelectedPolyVersion,
    setOpenModalConfirmation,
    setPreviewVersion,
    setHasOverlaps,
    shouldRefetchValidation
  } = useMapAreaContext();
  const siteFull = isMapAreaSiteFullDto(siteData) ? siteData : undefined;
  const projectDisplayName = siteFull?.projectName ?? "-";
  const siteDisplayName = siteFull?.name ?? "-";
  const { onCancel } = mapFunctions;
  const handleClose = () => {
    setEditPolygon?.({ isOpen: false, uuid: "", primaryUuid: "" });
    setHasOverlaps(false);
    setOpenModalConfirmation(false);
    setSelectedPolyVersion(undefined);
    setPreviewVersion(false);
    onCancel(polygonDataForCancel);
    recallEntityData?.();
  };

  const [criteriaData, setCriteriaData] = useState<CriteriaData | null>(null);
  const [plotsVisible, setPlotsVisible] = useState(true);
  const [attributePlotsVisible, setAttributePlotsVisible] = useState(true);

  useEffect(() => {
    if (shouldRefetchValidation && editPolygon?.uuid) {
      ApiSlice.pruneCache("validations", [editPolygon.uuid]);
    }
  }, [shouldRefetchValidation, editPolygon?.uuid]);

  const polygonValidationData = usePolygonValidation({ polygonUuid: editPolygon?.uuid || "" });
  const selectedSitePolygon = useMemo(() => {
    if (!Array.isArray(polygonData) || editPolygon?.uuid == null || editPolygon.uuid === "") {
      return undefined;
    }
    return polygonData.find((polygon: unknown) => {
      if (polygon == null || typeof polygon !== "object") {
        return false;
      }
      const typedPolygon = polygon as SitePolygonLightDto;
      return typedPolygon.polygonUuid === editPolygon.uuid;
    }) as SitePolygonLightDto | undefined;
  }, [editPolygon?.uuid, polygonData]);
  const anrPlotsEligible = useMemo(
    () => isSitePolygonEligibleForAnrMonitoringPlots(selectedSitePolygon),
    [selectedSitePolygon]
  );
  const sitePolygonUuidForAnr = selectedSitePolygon?.uuid ?? "";
  const [anrConnectionReady, { data: anrPlotGeometry, isLoading: isAnrPlotGeometryLoading }] = useAnrPlotGeometry({
    sitePolygonUuid: sitePolygonUuidForAnr,
    enabled: sitePolygonUuidForAnr !== "" && anrPlotsEligible
  });
  const isAnrPlotsDataPending =
    anrPlotsEligible && sitePolygonUuidForAnr !== "" && (!anrConnectionReady || Boolean(isAnrPlotGeometryLoading));
  const anrMapOverlay = useAnrMapOverlayOptional();
  const anrMapOverlayRef = useRef(anrMapOverlay);
  anrMapOverlayRef.current = anrMapOverlay;
  const hasAnrPlotGeometry = (anrPlotGeometry?.geojson?.features?.length ?? 0) > 0;
  const isAnrTab = tabEditPolygon === "ANR Monitoring Plots";

  const downloadMonitoringPlots = useCallback(async () => {
    if (sitePolygonUuidForAnr === "" || !anrPlotsEligible) {
      return;
    }
    const response = await loadAnrPlotGeometryGeoJson({ sitePolygonUuid: sitePolygonUuidForAnr });
    const geojson = extractGeoJsonFromResponse(response.data);
    if (geojson == null) {
      throw new Error("Failed to extract ANR monitoring plots GeoJSON");
    }
    const polygonName = selectedSitePolygon?.name ?? "polygon";
    const filename = formatFileName(`${polygonName}_anr_monitoring_plots`);
    downloadGeoJsonFile(geojson, filename);
  }, [anrPlotsEligible, selectedSitePolygon?.name, sitePolygonUuidForAnr]);

  useEffect(() => {
    if (!anrPlotsEligible && tabEditPolygon === "ANR Monitoring Plots") {
      setTabEditPolygon("Attributes");
    }
  }, [anrPlotsEligible, setTabEditPolygon, tabEditPolygon]);

  useEffect(() => {
    if (polygonValidationData) {
      const hasOverlapsV3 = polygonValidationData.criteriaList.some(
        (criteria: ValidationCriteriaDto) => criteria.criteriaId === 3 && !criteria.valid
      );
      setHasOverlaps(hasOverlapsV3);
      const transformedData: CriteriaData = {
        polygonId: polygonValidationData.polygonUuid,
        criteriaList: polygonValidationData.criteriaList.map((criteria: ValidationCriteriaDto) => ({
          criteriaId: criteria.criteriaId,
          valid: criteria.valid ? 1 : 0,
          latestCreatedAt: criteria.createdAt ?? undefined,
          extraInfo: criteria.extraInfo ?? undefined
        }))
      };

      setCriteriaData(transformedData);
    }
  }, [polygonValidationData, editPolygon?.uuid, setHasOverlaps]);

  useEffect(() => {
    if (anrMapOverlay == null) {
      return;
    }
    const isAttributeTab = tabEditPolygon === "Attributes";
    const shouldShowFromAttributes = anrPlotsEligible && isAttributeTab && hasAnrPlotGeometry && attributePlotsVisible;
    anrMapOverlay.setDrawerOpen(editPolygon?.isOpen === true);
    anrMapOverlay.setAnrTabActive((isAnrTab && anrPlotsEligible) || shouldShowFromAttributes);
    if (sitePolygonUuidForAnr !== "" && editPolygon?.uuid != null && editPolygon.uuid !== "") {
      anrMapOverlay.syncDrawerSelection({
        sitePolygonUuid: sitePolygonUuidForAnr,
        geometryPolygonUuid: editPolygon.uuid
      });
    }
    if ((anrPlotsEligible && isAnrTab && hasAnrPlotGeometry && plotsVisible) || shouldShowFromAttributes) {
      anrMapOverlay.setShowPlotsOnMap(true);
      return;
    }
    anrMapOverlay.setShowPlotsOnMap(false);
  }, [
    anrMapOverlay,
    anrPlotsEligible,
    editPolygon?.isOpen,
    editPolygon?.uuid,
    hasAnrPlotGeometry,
    isAnrTab,
    plotsVisible,
    tabEditPolygon,
    attributePlotsVisible,
    sitePolygonUuidForAnr
  ]);

  useOnUnmount(() => {
    if (anrMapOverlayRef.current != null) {
      anrMapOverlayRef.current.resetAnrMapOverlay();
    }
  });

  return (
    <>
      <div className="flex items-start justify-between gap-4">
        <div>
          <Text variant="text-12-light" className="text-white ">
            {projectDisplayName}
          </Text>
          <Text variant="text-20-bold" className="mb-4 text-white">
            {siteDisplayName}
          </Text>
        </div>

        <Button variant="text" onClick={handleClose} className="text-white hover:text-primary">
          <Icon name={IconNames.CLEAR} className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex rounded-lg bg-white">
        <button
          className={classNames(
            "text-12-semibold rounded-l-lg border border-neutral-300 py-3 px-1 hover:bg-neutral-100",
            anrPlotsEligible ? "w-1/4" : "w-1/3",
            tabEditPolygon === "Attributes"
              ? "border-0 border-b-4 border-primary bg-blueCustom-10 pb-2"
              : "border border-neutral-300"
          )}
          onClick={() => {
            setTabEditPolygon("Attributes");
          }}
        >
          {t("Attributes")}
        </button>
        <button
          className={classNames(
            "text-12-semibold border border-neutral-300 py-3 px-1 hover:bg-neutral-100",
            anrPlotsEligible ? "w-1/4" : "w-1/3",
            tabEditPolygon === "Checklist"
              ? "border-0 border-b-4 border-primary bg-blueCustom-10 pb-2"
              : "border border-neutral-300"
          )}
          onClick={() => {
            setTabEditPolygon("Checklist");
          }}
        >
          {t("Checklist")}
        </button>
        <button
          className={classNames(
            "text-12-semibold border border-neutral-300 py-3 px-1 hover:bg-neutral-100",
            anrPlotsEligible ? "w-1/4" : "w-1/3 rounded-r-lg",
            tabEditPolygon === "Version"
              ? "border-0 border-b-4 border-primary bg-blueCustom-10 pb-2"
              : "border border-neutral-300"
          )}
          onClick={() => {
            setTabEditPolygon("Version");
          }}
        >
          {t("Version")}
        </button>
        {anrPlotsEligible ? (
          <button
            className={classNames(
              "text-12-semibold w-1/4 rounded-r-lg border border-neutral-300 py-3 px-1 !tracking-tighter hover:bg-neutral-100",
              tabEditPolygon === "ANR Monitoring Plots"
                ? "border-0 border-b-4 border-primary bg-blueCustom-10 pb-2"
                : "border border-neutral-300"
            )}
            onClick={() => {
              setTabEditPolygon("ANR Monitoring Plots");
            }}
          >
            {t("ANR Monitoring Plots")}
          </button>
        ) : null}
      </div>
      <div className="mr-[-10px] mt-4 h-[calc(100%-132px)] overflow-y-auto pr-2">
        <When condition={tabEditPolygon === "Attributes"}>
          <AttributeInformation
            handleClose={handleClose}
            sitePolygonUuid={sitePolygonUuidForAnr}
            polygonNameForFile={selectedSitePolygon?.name ?? undefined}
            hasAnrPlotGeometry={hasAnrPlotGeometry}
            anrMonitoringPlotsEligible={anrPlotsEligible}
            attributePlotsVisible={attributePlotsVisible}
            setAttributePlotsVisible={setAttributePlotsVisible}
          />
        </When>
        <When condition={tabEditPolygon === "Checklist"}>
          <ChecklistInformation criteriaData={criteriaData ?? ({} as CriteriaData)} />
        </When>
        <When condition={tabEditPolygon === "Version"}>
          <VersionInformation
            polygonVersionData={polygonVersionData}
            refetchPolygonVersions={refetchPolygonVersions}
            recallEntityData={recallEntityData}
          />
        </When>
        <When condition={tabEditPolygon === "ANR Monitoring Plots" && anrPlotsEligible}>
          <div className="flex flex-col gap-4 pr-2">
            {isAnrPlotsDataPending ? (
              <div className="flex flex-col items-center justify-center gap-3 py-8 text-white">
                <CircularProgress size={28} color="inherit" aria-label={t("Loading")} />
                <Text variant="text-14-light" className="text-white">
                  {t("Loading ANR monitoring plots...")}
                </Text>
              </div>
            ) : (
              <>
                <div className="flex items-baseline justify-between gap-2">
                  <Text variant="text-14-semibold" className="text-white">
                    {t("Assisted Natural Regeneration Monitoring Plots")}
                  </Text>
                  {hasAnrPlotGeometry && (
                    <button
                      type="button"
                      className="group text-white"
                      onClick={() => setPlotsVisible(prev => !prev)}
                      aria-label={plotsVisible ? t("Hide ANR monitoring plots") : t("Show ANR monitoring plots")}
                    >
                      {plotsVisible ? (
                        <Visibility sx={{ fontSize: 22 }} className="group-hover:text-primary-500" />
                      ) : (
                        <VisibilityOff sx={{ fontSize: 22 }} className="group-hover:text-primary-500" />
                      )}
                    </button>
                  )}
                </div>
                {hasAnrPlotGeometry ? (
                  <>
                    <Text variant="text-12-light" className="text-white">
                      {t(
                        "These monitoring plots mark the specific areas where tree counts are conducted to track natural regeneration over time. Download the monitoring plots to help your team locate and monitor the areas during field visits"
                      )}
                    </Text>
                    <Button variant="semi-black" onClick={downloadMonitoringPlots}>
                      {t("Download Monitoring Plots")}
                    </Button>
                  </>
                ) : (
                  <Text variant="text-12-light" className="text-white">
                    {t(
                      "The monitoring plots are not available yet. They will appear here once they are updated by the project team and ready for download"
                    )}
                  </Text>
                )}
              </>
            )}
          </div>
        </When>
      </div>
    </>
  );
};

export default MapEditPolygonPanel;

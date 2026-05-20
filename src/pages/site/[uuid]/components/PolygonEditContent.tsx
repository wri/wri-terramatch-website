import type { DateValue } from "@ark-ui/react";
import { Flex, TableCell, TableRow, Text } from "@chakra-ui/react";
import { CalendarDate } from "@internationalized/date";
import { useT } from "@transifex/react";
import { format } from "date-fns";
import React, { FC, useCallback, useEffect, useMemo, useState } from "react";

import {
  downloadGeoJsonFile,
  downloadPolygonGeoJson,
  extractGeoJsonFromResponse,
  formatFileName
} from "@/components/elements/Map-mapbox/utils";
import { loadAnrPlotGeometryGeoJson, useAnrPlotGeometry } from "@/connections/AnrPlotGeometry";
import { pruneBoundingBoxesCache } from "@/connections/BoundingBox";
import { updatePolygonVersionAsync, useListPolygonVersions } from "@/connections/PolygonVersion";
import {
  bulkUpdateSitePolygonStatus,
  createPolygonVersion,
  deleteSitePolygon,
  PolygonStatus,
  pruneSitePolygonsCache
} from "@/connections/SitePolygons";
import {
  dropdownOptionsRestoration,
  dropdownOptionsTarget,
  dropdownOptionsTree
} from "@/constants/polygonDropdownOptions";
import { POLYGON_APPROVED, POLYGON_PENDING_APPROVAL } from "@/constants/polygonStatuses";
import { useAnrMapOverlayOptional } from "@/context/anrMapOverlay.provider";
import { useMapAreaContext } from "@/context/mapArea.provider";
import { useNotificationContext } from "@/context/notification.provider";
import { SitePolygonLightDto } from "@/generated/v3/researchService/researchServiceSchemas";
import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import MultiActionButton from "@/redesignComponents/actions/Buttons/MultiActionButton/MultiActionButton";
import MappedTag from "@/redesignComponents/actions/Tags/MappedTag/MappedTag";
import ValidationTag from "@/redesignComponents/actions/Tags/ValidationTag/ValidationTag";
import Accordion from "@/redesignComponents/containers/Accordion/Accordion";
import AccordionHeader from "@/redesignComponents/containers/Accordion/AccordionHeader";
import Table from "@/redesignComponents/dataDisplay/Table/Table";
import Switch from "@/redesignComponents/Forms/Actions/Switch/Switch";
import DatePickerInput from "@/redesignComponents/Forms/Inputs/DateInputs/DatePickerInput/DatePickerInput";
import InputWithUnits from "@/redesignComponents/Forms/Inputs/InputWithUnits";
import SelectInput from "@/redesignComponents/Forms/Inputs/SelectInput";
import TextInput from "@/redesignComponents/Forms/Inputs/TextInput";
import { DownloadIcon, UploadIcon } from "@/redesignComponents/foundations/Icons";
import FloatingActionToolbar from "@/redesignComponents/navigation/Toolbar/FloatingActionToolbar";
import {
  mapSitePolygonStatusToMappedTagState,
  mapSitePolygonValidationStatusToValidationTagState
} from "@/utils/mapStatusToTagStateEntity";
import { isSitePolygonEligibleForAnrMonitoringPlots } from "@/utils/sitePolygonAnrEligibility";

import type { PolygonTableRow } from "../tabs/Polygons";
import DeletePolygon from "./Modals/DeletePolygon";

type PolygonEditContentProps = {
  polygon?: SitePolygonLightDto;
  onClose?: () => void;
  onRegisterSave?: (saveHandler: () => Promise<boolean>) => void;
  onSaved?: () => unknown | Promise<unknown>;
  onPolygonUpdated?: (polygon: SitePolygonLightDto) => void;
};

type PolygonVersionRow = SitePolygonLightDto & { id: string };

const optionToSelectItem = (option: { title: string; value: string }) => ({
  label: option.title,
  value: option.value
});

const isoStringToDateValue = (value: string | null | undefined): DateValue[] => {
  if (value == null || value === "") return [];
  const [year, month, day] = value.split("T")[0].split("-").map(Number);
  if (!year || !month || !day) return [];
  return [new CalendarDate(year, month, day)];
};

const dateValueToIsoString = (value: DateValue | undefined): string | undefined => {
  if (value == null) return undefined;
  const mm = String(value.month).padStart(2, "0");
  const dd = String(value.day).padStart(2, "0");
  return `${value.year}-${mm}-${dd}T00:00:00.000Z`;
};

const normalizeTargetSystem = (value: string | null | undefined): string[] =>
  value != null && value !== "" ? value.split(",").map(item => item.trim()) : [];

const waitForMapEditCleanup = async (): Promise<void> => {
  await new Promise<void>(resolve => {
    if (typeof requestAnimationFrame === "function") {
      requestAnimationFrame(() => resolve());
      return;
    }
    setTimeout(resolve, 0);
  });
};

const PolygonEditContent: FC<PolygonEditContentProps> = ({
  polygon,
  onClose,
  onRegisterSave,
  onSaved,
  onPolygonUpdated
}) => {
  const t = useT();
  const { openNotification } = useNotificationContext();
  const { polygonGeometryEdit, setEditPolygon, setIsUserDrawingEnabled, setPolygonGeometryEdit } = useMapAreaContext();
  const [polygonName, setPolygonName] = useState("");
  const [plantStartDate, setPlantStartDate] = useState<DateValue[]>([]);
  const [restorationPractice, setRestorationPractice] = useState<string[]>([]);
  const [targetLandUseSystem, setTargetLandUseSystem] = useState<string[]>([]);
  const [treeDistribution, setTreeDistribution] = useState<string[]>([]);
  const [treesPlanted, setTreesPlanted] = useState("");
  const [plotsVisible, setPlotsVisible] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isVersionUpdating, setIsVersionUpdating] = useState(false);

  const sitePolygonUuid = polygon?.uuid ?? "";
  const geometryPolygonUuid = polygon?.polygonUuid ?? "";
  const geometryChanged =
    polygonGeometryEdit?.polygonUuid === geometryPolygonUuid &&
    polygonGeometryEdit.isDirty &&
    polygonGeometryEdit.currentGeometry != null;
  const isAnrEligible = useMemo(() => isSitePolygonEligibleForAnrMonitoringPlots(polygon), [polygon]);
  const anrMapOverlay = useAnrMapOverlayOptional();

  const [anrConnectionReady, { data: anrPlotGeometry, isLoading: isAnrPlotGeometryLoading }] = useAnrPlotGeometry({
    sitePolygonUuid,
    enabled: sitePolygonUuid !== "" && isAnrEligible
  });
  const hasAnrPlotGeometry = (anrPlotGeometry?.geojson?.features?.length ?? 0) > 0;
  const isAnrLoading = isAnrEligible && sitePolygonUuid !== "" && (!anrConnectionReady || isAnrPlotGeometryLoading);

  const primaryUuid = polygon?.primaryUuid ?? undefined;
  const [isVersionsLoaded, { data: versionsData, refetch: refetchVersions }] = useListPolygonVersions({
    uuid: primaryUuid,
    enabled: primaryUuid != null
  });
  const isLoadingVersions = !isVersionsLoaded;

  const restorationOptions = useMemo(
    () => dropdownOptionsRestoration.map(option => ({ ...optionToSelectItem(option), label: t(option.title) })),
    [t]
  );
  const targetOptions = useMemo(
    () => dropdownOptionsTarget.map(option => ({ ...optionToSelectItem(option), label: t(option.title) })),
    [t]
  );
  const treeOptions = useMemo(
    () => dropdownOptionsTree.map(option => ({ ...optionToSelectItem(option), label: t(option.title) })),
    [t]
  );
  const formattedArea = useMemo(
    () => polygon?.calcArea?.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) ?? "",
    [polygon?.calcArea]
  );
  const versionRows = useMemo<PolygonVersionRow[]>(
    () => (versionsData ?? []).map(version => ({ ...version, id: version.uuid ?? version.polygonUuid ?? "" })),
    [versionsData]
  );
  const polygonTableRow = useMemo<PolygonTableRow[]>(
    () =>
      polygon == null
        ? []
        : [
            {
              id: polygon.polygonUuid ?? polygon.uuid ?? "",
              polygonName: polygon.name ?? t("Unnamed Polygon"),
              submission: mapSitePolygonStatusToMappedTagState(polygon.status ?? "draft"),
              validation: mapSitePolygonValidationStatusToValidationTagState(polygon.validationStatus ?? null),
              restorationPractice: [],
              targetLandUse: null,
              plantingDate: polygon.plantStart ?? "-",
              treeDistribution: [],
              treesPlanted: polygon.numTrees ?? 0,
              area: polygon.calcArea ?? 0
            }
          ],
    [polygon, t]
  );

  useEffect(() => {
    setPolygonName(polygon?.name ?? "");
    setPlantStartDate(isoStringToDateValue(polygon?.plantStart));
    setRestorationPractice(polygon?.practice ?? []);
    setTargetLandUseSystem(normalizeTargetSystem(polygon?.targetSys));
    setTreeDistribution(polygon?.distr ?? []);
    setTreesPlanted(String(polygon?.numTrees ?? 0));
  }, [polygon]);

  const savePolygonData = useCallback(async () => {
    if (polygon?.primaryUuid == null || polygon.primaryUuid === "") {
      openNotification("error", t("Error!"), t("Missing polygon information"));
      return false;
    }

    try {
      const attributeChanges = {
        polyName: polygonName,
        plantStart: dateValueToIsoString(plantStartDate[0]),
        practice: restorationPractice,
        targetSys: targetLandUseSystem.join(", "),
        distr: treeDistribution,
        numTrees: Number(treesPlanted || 0)
      };

      if (geometryChanged && (polygon.siteId == null || polygon.siteId === "")) {
        openNotification("error", t("Error!"), t("Missing site information"));
        return false;
      }

      const updatedPolygon = await createPolygonVersion({
        primaryUuid: polygon.primaryUuid,
        changeReason: geometryChanged
          ? "Updated polygon geometry and attributes from edit drawer"
          : "Updated polygon attributes from edit drawer",
        attributeChanges,
        ...(geometryChanged
          ? {
              geometry: {
                type: "Feature" as const,
                geometry: polygonGeometryEdit.currentGeometry,
                properties: { siteId: polygon.siteId as string }
              }
            }
          : {})
      });

      pruneSitePolygonsCache();
      if (geometryChanged) {
        pruneBoundingBoxesCache();
      }
      setIsUserDrawingEnabled(false);
      setEditPolygon({ isOpen: false, uuid: "" });
      setPolygonGeometryEdit(undefined);
      onPolygonUpdated?.(updatedPolygon);
      onClose?.();
      await waitForMapEditCleanup();
      await refetchVersions?.();
      await onSaved?.();

      openNotification(
        "success",
        t("Success!"),
        geometryChanged
          ? t("Polygon geometry and attributes were saved successfully")
          : t("Polygon version created successfully")
      );
      return true;
    } catch (error) {
      openNotification("error", t("Error!"), t("Error creating polygon version"));
      return false;
    }
  }, [
    onSaved,
    onPolygonUpdated,
    onClose,
    openNotification,
    plantStartDate,
    geometryChanged,
    polygon?.siteId,
    polygon?.primaryUuid,
    polygonGeometryEdit?.currentGeometry,
    polygonName,
    refetchVersions,
    restorationPractice,
    setEditPolygon,
    setIsUserDrawingEnabled,
    setPolygonGeometryEdit,
    t,
    targetLandUseSystem,
    treeDistribution,
    treesPlanted
  ]);

  useEffect(() => {
    if (anrMapOverlay == null) {
      return;
    }

    const shouldShowPlots = isAnrEligible && hasAnrPlotGeometry && plotsVisible;
    anrMapOverlay.setDrawerOpen(true);
    anrMapOverlay.setAnrTabActive(shouldShowPlots);
    anrMapOverlay.setShowPlotsOnMap(shouldShowPlots);

    if (sitePolygonUuid !== "" && geometryPolygonUuid !== "") {
      anrMapOverlay.syncDrawerSelection({ sitePolygonUuid, geometryPolygonUuid });
    }

    return () => {
      anrMapOverlay.setAnrTabActive(false);
      anrMapOverlay.setShowPlotsOnMap(false);
    };
  }, [anrMapOverlay, geometryPolygonUuid, hasAnrPlotGeometry, isAnrEligible, plotsVisible, sitePolygonUuid]);

  const downloadMonitoringPlots = useCallback(async () => {
    if (sitePolygonUuid === "" || !isAnrEligible) {
      openNotification("error", t("Error!"), t("ANR monitoring plots are not available for this polygon"));
      return;
    }

    try {
      const response = await loadAnrPlotGeometryGeoJson({ sitePolygonUuid });
      const geojson = extractGeoJsonFromResponse(response.data);
      if (geojson == null) {
        throw new Error("Failed to extract ANR monitoring plots GeoJSON");
      }
      const filename = formatFileName(`${polygon?.name ?? "polygon"}_anr_monitoring_plots`);
      downloadGeoJsonFile(geojson, filename);
    } catch (error) {
      openNotification("error", t("Error!"), t("Error downloading ANR monitoring plots"));
    }
  }, [isAnrEligible, openNotification, polygon?.name, sitePolygonUuid, t]);

  const makeVersionActive = useCallback(
    async (version: SitePolygonLightDto) => {
      if (version.uuid == null || version.uuid === "") {
        openNotification("error", t("Error!"), t("Missing polygon version information"));
        return;
      }

      try {
        setIsVersionUpdating(true);
        const updatedVersion = await updatePolygonVersionAsync(version.uuid, { isActive: true });
        pruneSitePolygonsCache();
        await refetchVersions?.();
        await onSaved?.();
        onPolygonUpdated?.(updatedVersion);
        openNotification("success", t("Success!"), t("Polygon version updated successfully"));
      } catch (error) {
        openNotification("error", t("Error!"), t("Error updating polygon version"));
      } finally {
        setIsVersionUpdating(false);
      }
    },
    [onPolygonUpdated, onSaved, openNotification, refetchVersions, t]
  );

  const handleDownloadPolygon = useCallback(async () => {
    if (geometryPolygonUuid === "") {
      openNotification("error", t("Error!"), t("Missing polygon information"));
      return;
    }

    try {
      await downloadPolygonGeoJson(geometryPolygonUuid, polygon?.name ?? "polygon", { includeExtendedData: true });
    } catch (error) {
      openNotification("error", t("Error!"), t("Error downloading polygon"));
    }
  }, [geometryPolygonUuid, openNotification, polygon?.name, t]);

  const handleSubmitPolygon = useCallback(async () => {
    if (polygon?.uuid == null || polygon.uuid === "") {
      openNotification("error", t("Error!"), t("Missing polygon information"));
      return;
    }

    if (polygon.status === POLYGON_PENDING_APPROVAL || polygon.status === POLYGON_APPROVED) {
      openNotification("error", t("Error!"), t("This polygon has already been submitted"));
      return;
    }

    try {
      await bulkUpdateSitePolygonStatus([polygon.uuid], POLYGON_PENDING_APPROVAL as PolygonStatus, "");
      pruneSitePolygonsCache();
      await onSaved?.();
      openNotification("success", t("Success!"), t("Polygon submitted successfully"));
    } catch (error) {
      openNotification("error", t("Error!"), t("Error submitting polygon"));
    }
  }, [onSaved, openNotification, polygon?.status, polygon?.uuid, t]);

  const handleDeletePolygon = useCallback(async () => {
    if (polygon?.uuid == null || polygon.uuid === "") {
      openNotification("error", t("Error!"), t("Missing polygon information"));
      return;
    }

    try {
      await deleteSitePolygon(polygon.uuid);
      pruneSitePolygonsCache();
      await onSaved?.();
      openNotification("success", t("Success!"), t("Polygon deleted successfully"));
      onClose?.();
    } catch (error) {
      openNotification("error", t("Error!"), t("Error deleting polygon"));
      throw error;
    }
  }, [onClose, onSaved, openNotification, polygon?.uuid, t]);

  useEffect(() => {
    onRegisterSave?.(savePolygonData);
  }, [onRegisterSave, savePolygonData]);

  return (
    <Flex className="min-h-0 flex-1 flex-col gap-2">
      <Flex className="min-h-0 flex-1 flex-col gap-2 overflow-auto pr-2">
        <Flex className="h-fit w-full gap-6">
          <Flex className="items-center gap-1">
            <Text textStyle="200" color="neutral.800">
              {t("Submission:")}
            </Text>
            <MappedTag state={mapSitePolygonStatusToMappedTagState(polygon?.status ?? "draft")} />
          </Flex>
          <Flex className="items-center gap-1">
            <Text textStyle="200" color="neutral.800">
              {t("Validation:")}
            </Text>
            <ValidationTag
              status={mapSitePolygonValidationStatusToValidationTagState(polygon?.validationStatus ?? null)}
            />
          </Flex>
        </Flex>
        <Accordion header={<AccordionHeader title={t("Details")} />} defaultOpen>
          <Flex className="flex-1 flex-col gap-4">
            <TextInput
              label={t("Polygon Name")}
              name="polygonName"
              placeholder={t("Full Polygon Name")}
              value={polygonName}
              onChange={event => setPolygonName(event.target.value)}
              required
            />
            <DatePickerInput label={t("Label")} value={plantStartDate} onValueChange={setPlantStartDate} required />
            <SelectInput
              items={restorationOptions}
              label={t("Restoration Practice")}
              value={restorationPractice}
              onChange={setRestorationPractice}
              placeholder={t("Select...")}
              multiple
              required
            />
            <SelectInput
              items={targetOptions}
              label={t("Target Land Use")}
              value={targetLandUseSystem}
              onChange={value => setTargetLandUseSystem(value.slice(0, 1))}
              placeholder={t("Select...")}
              required
            />
            <SelectInput
              items={treeOptions}
              label={t("Tree Distribution")}
              value={treeDistribution}
              onChange={setTreeDistribution}
              placeholder={t("Select...")}
              multiple
              required
            />
            <TextInput
              label={t("Trees Planted")}
              name="treesPlanted"
              placeholder={t("Enter Trees Planted")}
              value={treesPlanted}
              onChange={event => setTreesPlanted(event.target.value.replace(/\D/g, ""))}
              required
            />
            <InputWithUnits
              key={polygon?.uuid}
              label={t("Estimated Area")}
              onChange={function noRefCheck() {}}
              disabled
              defaultValue={formattedArea}
              defaultUnit="ha"
              units={[
                {
                  label: t("ha"),
                  value: "ha"
                }
              ]}
            />
          </Flex>
        </Accordion>
        <Accordion
          header={<AccordionHeader title={t("Monitoring Plots")} />}
          actions={
            <Button
              leftIcon={<DownloadIcon />}
              onClick={() => void downloadMonitoringPlots()}
              size="small"
              variant="secondary"
              disabled={!isAnrEligible || !hasAnrPlotGeometry}
            >
              {t("Download Monitoring Plots")}
            </Button>
          }
        >
          <Flex className="flex-1 flex-col gap-4">
            <Switch
              name="showPlotsOnMap"
              checked={plotsVisible}
              disabled={!isAnrEligible || !hasAnrPlotGeometry}
              onCheckedChange={({ checked }: { checked?: boolean | "indeterminate" }) =>
                setPlotsVisible(checked === true)
              }
            >
              {t("Show Plots on Map")}
            </Switch>
            <Flex className="flex-col gap-7">
              {isAnrLoading ? (
                <Text>{t("Loading ANR monitoring plots...")}</Text>
              ) : isAnrEligible && hasAnrPlotGeometry ? (
                <>
                  <Text>
                    {t(
                      "These monitoring plots mark the specific areas where tree counts are conducted to track natural regeneration over time."
                    )}
                  </Text>
                  <Text>
                    {t(
                      "Download the monitoring plots to help your team locate and monitor the areas during field visits."
                    )}
                  </Text>
                </>
              ) : (
                <Text>{t("Monitoring plots are not available for this polygon.")}</Text>
              )}
            </Flex>
          </Flex>
        </Accordion>
        <Accordion
          header={<AccordionHeader title={t("Geotagged Photos")} />}
          actions={
            <Button leftIcon={<UploadIcon />} onClick={function noRefCheck() {}} size="small" variant="secondary">
              {t("Upload Geotagged Photos")}
            </Button>
          }
        >
          <Flex className="flex-1 flex-col gap-4">
            <Flex className="items-center gap-1">
              <Text textStyle="400-bold" color="neutral.900">{`X ${t("Photos")}`}</Text>
              <Text color="neutral.900">{t("available")}</Text>
              <ValidationTag status="failed" />
            </Flex>
            <Switch name="showPhotosOnMap" onChange={function noRefCheck() {}}>
              {t("Show Photos on Map")}
            </Switch>
          </Flex>
        </Accordion>
        <Accordion header={t("Versions")}>
          <Table<PolygonVersionRow>
            columns={[
              {
                key: "name",
                label: t("Version Name")
              },
              {
                key: "createdAt",
                label: t("Date")
              },
              {
                key: "isActive",
                label: t("State")
              }
            ]}
            data={versionRows}
            renderRow={row => (
              <TableRow key={row.uuid}>
                <TableCell>
                  <Text title={row.versionName ?? row.name ?? t("Unnamed Polygon")} className="max-w-[10rem] truncate">
                    {row.versionName ?? row.name ?? t("Unnamed Polygon")}
                  </Text>
                </TableCell>
                <TableCell>
                  <Text>{row.createdAt != null ? format(new Date(row.createdAt), "MM/dd/yyyy") : "-"}</Text>
                </TableCell>
                <TableCell>
                  <MultiActionButton
                    mainActionLabel={row.isActive ? t("Active") : t("Inactive")}
                    mainActionOnClick={() => {
                      if (!row.isActive) {
                        void makeVersionActive(row);
                      }
                    }}
                    otherActions={[
                      {
                        label: t("Active"),
                        onClick: () => void makeVersionActive(row),
                        value: "active"
                      }
                    ]}
                    disabled={isVersionUpdating || row.isActive}
                    size="small"
                    variant="secondary"
                  />
                </TableCell>
              </TableRow>
            )}
          />
          {isLoadingVersions ? <Text>{t("Loading versions...")}</Text> : null}
        </Accordion>
      </Flex>
      <Flex className="w-full justify-center">
        <FloatingActionToolbar
          className="bg-theme-neutral-200"
          items={[
            { label: t("Delete"), onClick: () => setShowDeleteModal(true), labelColor: "error.500" },
            { label: t("Download"), onClick: () => void handleDownloadPolygon() },
            { label: t("Submit"), onClick: () => void handleSubmitPolygon() }
          ]}
        />
      </Flex>
      <DeletePolygon
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        polygons={polygonTableRow}
        onDelete={handleDeletePolygon}
      />
    </Flex>
  );
};

export default PolygonEditContent;

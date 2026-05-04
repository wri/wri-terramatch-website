import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useT } from "@transifex/react";
import { Dispatch, FC, SetStateAction, useCallback, useEffect, useState } from "react";

import Button from "@/components/elements/Button/Button";
import Dropdown from "@/components/elements/Inputs/Dropdown/Dropdown";
import Input from "@/components/elements/Inputs/Input/Input";
import {
  downloadGeoJsonFile,
  extractGeoJsonFromResponse,
  formatFileName
} from "@/components/elements/Map-mapbox/utils";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import { loadAnrPlotGeometryGeoJson } from "@/connections/AnrPlotGeometry";
import { createVersionWithAttributes, pruneSitePolygonsCache } from "@/connections/SitePolygons";
import {
  dropdownOptionsRestoration,
  dropdownOptionsTarget,
  dropdownOptionsTree
} from "@/constants/polygonDropdownOptions";
import { useMapAreaContext } from "@/context/mapArea.provider";
import { useNotificationContext } from "@/context/notification.provider";
import { SitePolygonLightDto } from "@/generated/v3/researchService/researchServiceSchemas";
import Log from "@/utils/log";

import Text from "../Text/Text";
import { useTranslatedOptions } from "./hooks/useTranslatedOptions";

type AttributeInformationProps = {
  handleClose: () => void;
  sitePolygonUuid: string;
  polygonNameForFile?: string;
  hasAnrPlotGeometry: boolean;
  anrMonitoringPlotsEligible: boolean;
  attributePlotsVisible: boolean;
  setAttributePlotsVisible: Dispatch<SetStateAction<boolean>>;
};

const AttributeInformation: FC<AttributeInformationProps> = ({
  handleClose,
  sitePolygonUuid,
  polygonNameForFile,
  hasAnrPlotGeometry,
  anrMonitoringPlotsEligible,
  attributePlotsVisible,
  setAttributePlotsVisible
}) => {
  const t = useT();
  const { editPolygon, setShouldRefetchPolygonData, polygonData: polygonDataContext } = useMapAreaContext();
  const [polygonData, setPolygonData] = useState<SitePolygonLightDto>();
  const [polygonName, setPolygonName] = useState<string>();
  const [plantStartDate, setPlantStartDate] = useState<string>();
  const [restorationPractice, setRestorationPractice] = useState<string[]>([]);
  const [targetLandUseSystem, setTargetLandUseSystem] = useState<string[]>([]);
  const [treeDistribution, setTreeDistribution] = useState<string[]>([]);
  const [treesPlanted, setTreesPlanted] = useState<number>(0);
  const [calculatedArea, setCalculatedArea] = useState<number>(0);
  const [formattedArea, setFormattedArea] = useState<string>();

  const translatedRestorationOptions = useTranslatedOptions(dropdownOptionsRestoration);
  const translatedTargetOptions = useTranslatedOptions(dropdownOptionsTarget);
  const translatedTreeOptions = useTranslatedOptions(dropdownOptionsTree);
  const { openNotification } = useNotificationContext();

  useEffect(() => {
    if (polygonDataContext && editPolygon.uuid) {
      const activePolygon = polygonDataContext.find(p => p.polygonUuid === editPolygon.uuid);

      if (activePolygon) {
        setPolygonData(activePolygon);
      }
    }
  }, [polygonDataContext, editPolygon.uuid]);

  useEffect(() => {
    if (polygonData) {
      const v3Data = polygonData as SitePolygonLightDto;
      setPolygonName(v3Data.name ?? "");
      setPlantStartDate(v3Data.plantStart ?? "");
      setTreesPlanted(v3Data.numTrees ?? 0);
      setCalculatedArea(v3Data.calcArea ?? 0);

      setRestorationPractice(v3Data.practice ?? []);
      setTreeDistribution(v3Data.distr ?? []);

      const targetSysArray = v3Data.targetSys ? v3Data.targetSys.split(",").map(item => item.trim()) : [];
      setTargetLandUseSystem(targetSysArray);
    }
  }, [polygonData]);

  useEffect(() => {
    const format =
      calculatedArea?.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) ?? "";
    setFormattedArea(format ?? "");
  }, [calculatedArea]);

  const savePolygonData = async () => {
    const primaryUuid = (polygonData as SitePolygonLightDto)?.primaryUuid;

    if (primaryUuid == null) {
      openNotification("error", t("Error!"), t("Missing polygon information"));
      return;
    }

    try {
      await createVersionWithAttributes(primaryUuid, "Updated polygon attributes", {
        polyName: polygonName,
        plantstart: plantStartDate,
        practice: restorationPractice,
        targetSys: targetLandUseSystem.join(", "),
        distr: treeDistribution,
        numTrees: treesPlanted
      });

      pruneSitePolygonsCache();

      setShouldRefetchPolygonData(true);

      openNotification("success", t("Success!"), t("Polygon version created successfully"));
    } catch (error) {
      Log.error("Error creating polygon version:", error);
      openNotification("error", t("Error!"), t("Error creating polygon version"));
    }
  };

  const downloadMonitoringPlots = useCallback(async () => {
    if (sitePolygonUuid === "" || !anrMonitoringPlotsEligible) {
      return;
    }
    try {
      const response = await loadAnrPlotGeometryGeoJson({ sitePolygonUuid });
      const geojson = extractGeoJsonFromResponse(response.data);
      if (geojson == null) {
        throw new Error("Failed to extract ANR monitoring plots GeoJSON");
      }
      const filename = formatFileName(`${polygonNameForFile ?? "polygon"}_anr_monitoring_plots`);
      downloadGeoJsonFile(geojson, filename);
    } catch (error) {
      Log.error("Error downloading ANR monitoring plots:", error);
      openNotification("error", t("Error!"), t("Error downloading ANR monitoring plots"));
    }
  }, [anrMonitoringPlotsEligible, openNotification, polygonNameForFile, sitePolygonUuid, t]);

  return (
    <div className="flex flex-col gap-4">
      <Input
        label={t("Polygon Name")}
        labelClassName="capitalize text-white"
        labelVariant="text-14-light"
        placeholder={t("Input Polygon Name")}
        type="text"
        name=""
        value={polygonName}
        onChangeCapture={e => setPolygonName((e.target as HTMLInputElement).value)}
      />
      <label className="flex flex-col gap-2">
        <Text variant="text-14-light" className="text-white">
          {t("Plant Start Date")}
        </Text>
        <input
          type="date"
          lang="en-GB"
          className="rounded-lg border-neutral-200 focus:border-primary focus:shadow-none focus:ring-transparent"
          placeholder={t("Input Plant Start Date")}
          value={plantStartDate}
          onChange={e => setPlantStartDate(e.target.value)}
        />
      </label>
      <Dropdown
        multiSelect
        label={t("Restoration Practice")}
        suffixLabelView={hasAnrPlotGeometry && anrMonitoringPlotsEligible}
        suffixLabel={
          hasAnrPlotGeometry && anrMonitoringPlotsEligible ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="group border-none bg-transparent"
                onClick={() => setAttributePlotsVisible(prev => !prev)}
                aria-label={attributePlotsVisible ? t("Hide ANR monitoring plots") : t("Show ANR monitoring plots")}
              >
                {attributePlotsVisible ? (
                  <Visibility sx={{ fontSize: 20 }} className="group-hover:text-primary-500" />
                ) : (
                  <VisibilityOff sx={{ fontSize: 20 }} className="group-hover:text-primary-500" />
                )}
              </button>
              <button
                className="text-13-semibold group flex h-8 items-center gap-1 rounded-lg px-2 py-0.5 uppercase text-white hover:bg-white hover:text-primary-500"
                onClick={downloadMonitoringPlots}
              >
                <Icon name={IconNames.DOWNLOAD_PA} className="h-4 w-4" /> {t("Download")}
              </button>
            </div>
          ) : null
        }
        labelClassName="capitalize text-white"
        labelVariant="text-14-light"
        placeholder={t("Select Restoration Practice")}
        options={translatedRestorationOptions}
        value={restorationPractice}
        onChange={e => setRestorationPractice(e as string[])}
        className="bg-white"
      />
      <Dropdown
        label={t("Target Land Use System")}
        labelClassName="capitalize text-white"
        labelVariant="text-14-light"
        placeholder={t("Select Target Land Use System")}
        options={translatedTargetOptions}
        value={targetLandUseSystem}
        onChange={e => setTargetLandUseSystem(e as string[])}
        className="bg-white"
      />
      <Dropdown
        multiSelect
        label={t("Tree Distribution")}
        labelClassName="capitalize text-white"
        labelVariant="text-14-light"
        placeholder={t("Select Tree Distribution")}
        options={translatedTreeOptions}
        value={treeDistribution}
        onChange={e => setTreeDistribution(e as string[])}
        className="bg-white"
      />
      <Input
        label={t("Trees Planted")}
        labelClassName="capitalize text-white"
        labelVariant="text-14-light"
        placeholder={t("Input Trees Planted")}
        type="number"
        format="number"
        name=""
        value={treesPlanted}
        onChangeCapture={(e: React.ChangeEvent<HTMLInputElement>) => setTreesPlanted(Number(e.target.value))}
      />
      <Input
        label={t("Estimated Area")}
        labelClassName="capitalize text-white"
        labelVariant="text-14-light"
        placeholder={t("Input Estimated Area")}
        type="text"
        name=""
        value={formattedArea + " ha"}
        readOnly
      />
      <div className="mt-auto flex items-center justify-end gap-5">
        <Button variant="semi-red" className="w-full" onClick={handleClose}>
          {t("Close")}
        </Button>
        <Button
          variant="semi-black"
          className="w-full"
          onClick={() => {
            savePolygonData();
          }}
        >
          {t("Save")}
        </Button>
      </div>
    </div>
  );
};

export default AttributeInformation;

import { useT } from "@transifex/react";
import { filter } from "lodash";
import { MapboxGeoJSONFeature } from "mapbox-gl";
import { useEffect } from "react";
import { When } from "react-if";

import IconButton from "@/components/elements/IconButton/IconButton";
import { useOnHoverFeature } from "@/components/elements/Map-mapbox/hooks/useOnHoverFeature";
import { useSelectFeature } from "@/components/elements/Map-mapbox/hooks/useSelectFeature";
import {
  AdditionalPolygonProperties,
  ShapePropertiesModal
} from "@/components/elements/Map-mapbox/MapLayers/ShapePropertiesModal";
import { getFeatureProperties } from "@/components/elements/Map-mapbox/utils";
import Text from "@/components/elements/Text/Text";
import { IconNames } from "@/components/extensive/Icon/Icon";
import { getCountriesOptions } from "@/constants/options/countries";
import { getDistributionOptions } from "@/constants/options/distribution";
import { getLandUseTypeOptions } from "@/constants/options/landUseType";
import { getRestorationStrategyOptions } from "@/constants/options/restorationStrategy";
import { useMapContext } from "@/context/map.provider";
import { useModalContext } from "@/context/modal.provider";
import { formatOptionsList, getOptionTitle } from "@/utils/options";

interface FeatureDetailCardProps {
  editable?: boolean;
  additionalPolygonProperties?: AdditionalPolygonProperties;
}

export const FeatureDetailCard = ({ editable, additionalPolygonProperties }: FeatureDetailCardProps) => {
  const t = useT();

  const { map, draw } = useMapContext();
  const [selectedFeature, setSelectedFeature] = useSelectFeature(map);
  const { openModal, closeModal } = useModalContext();
  useOnHoverFeature();

  const onEditFeature = (feature: MapboxGeoJSONFeature) => {
    openModal(
      <ShapePropertiesModal
        draw={draw}
        onSubmit={onSubmitPropertiesForm}
        feature={feature}
        additionalPolygonProperties={additionalPolygonProperties}
      />
    );
  };

  const onDeleteFeature = () => {
    draw?.delete(selectedFeature?.properties?.id);
    setSelectedFeature(undefined);
  };

  const onSubmitPropertiesForm = (additionalProperties: any, feature: MapboxGeoJSONFeature) => {
    Object.entries(additionalProperties).forEach(([key, val]) => {
      const value = Array.isArray(val) ? val.join(",") : val;
      draw?.setFeatureProperty(feature?.properties?.id || feature.id, key, value);
      feature.properties = { ...feature.properties, [key]: value };
    });
    setSelectedFeature(feature);
    closeModal();

    map?.fire("draw.update", { feature });
  };

  useEffect(() => {
    if (!map) return;
    const onCreateListener = function (e: any) {
      const feature = e.features[0];
      onEditFeature(feature);
    };
    map.on("draw.create", onCreateListener);

    return () => {
      map.off("draw.create", onCreateListener);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, additionalPolygonProperties]);

  //@ts-ignore
  if (!selectedFeature || selectedFeature.properties?.mode?.includes("draw_")) return null;

  const title = getFeatureProperties<string>(selectedFeature.properties, "Poly_ID") || t("Shape");
  const countryCode = getFeatureProperties<string>(selectedFeature.properties, "Country");

  const isPpc = additionalPolygonProperties?.Framework === "ppc";
  const projectId =
    (isPpc ? additionalPolygonProperties?.Project_ID : null) ??
    getFeatureProperties<string>(selectedFeature.properties, "Project_ID");
  const projectUuid = additionalPolygonProperties?.Project_UUID;
  const siteId =
    (isPpc ? additionalPolygonProperties?.Site_ID : null) ??
    getFeatureProperties<string>(selectedFeature.properties, "Site_ID");
  const siteUuid = additionalPolygonProperties?.Site_UUID;

  const properties = filter([
    { title: t("Polygon ID"), value: title },
    { title: t("Org Name"), value: getFeatureProperties<string>(selectedFeature.properties, "Org_Name") },
    { title: t("Project ID"), value: projectId },
    isPpc && projectUuid != null ? { title: t("Project UUID"), value: projectUuid } : null,
    { title: t("Project Name"), value: getFeatureProperties<string>(selectedFeature.properties, "Project_Name") },
    { title: t("Site ID"), value: siteId },
    isPpc && siteUuid != null ? { title: t("Site UUID"), value: siteUuid } : null,
    { title: t("Site Name"), value: getFeatureProperties<string>(selectedFeature.properties, "Site_Name") },
    {
      title: t("Country"),
      value: countryCode ? getOptionTitle(countryCode, getCountriesOptions()) : undefined
    },
    {
      title: t("Planting Start Date"),
      value: getFeatureProperties<string>(selectedFeature.properties, "Plant_Date")
    },
    {
      title: t("Restoration Practice"),
      value: formatOptionsList(
        getRestorationStrategyOptions(),
        getFeatureProperties<string>(selectedFeature.properties, "Practice")?.split(",")
      )
    },
    {
      title: t("Target land use system"),
      value: formatOptionsList(
        getLandUseTypeOptions(),
        getFeatureProperties<string>(selectedFeature.properties, "Target_Sys")?.split(",")
      )
    },
    {
      title: t("Tree distribution"),
      value: formatOptionsList(
        getDistributionOptions(),
        getFeatureProperties<string>(selectedFeature.properties, "Distr")?.split(",")
      )
    }
  ]) as { title: string; value: any }[];

  return (
    <>
      <div className="w-80 rounded-lg bg-white">
        <div className="flex h-9 items-center rounded-t-lg bg-primary-200 px-3 py-2">
          <Text variant="text-heading-200">{title}</Text>
        </div>
        <div className="p-3">
          <div className="mb-1">
            {properties.filter(v => !!v.value).length === 0 && (
              <Text variant="text-light-caption-200">{t("No data is attached to this polygon")}</Text>
            )}
            {properties.map(prop => (
              <Text key={prop.title} variant="text-light-caption-200">
                <strong>{prop.title}: </strong>
                {prop.value || "N/A"}
              </Text>
            ))}
          </div>
          <When condition={editable}>
            <div className="flex items-start gap-3">
              <IconButton
                iconProps={{ name: IconNames.EDIT_CIRCLE, width: 32, className: "fill-primary" }}
                onClick={() => onEditFeature(selectedFeature)}
              />
              <IconButton
                iconProps={{ name: IconNames.TRASH_CIRCLE, width: 32, className: "fill-error" }}
                onClick={onDeleteFeature}
              />
            </div>
          </When>
        </div>
      </div>
    </>
  );
};

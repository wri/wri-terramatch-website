import { yupResolver } from "@hookform/resolvers/yup";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import { useT } from "@transifex/react";
//@ts-ignore
import circleToPolygon from "circle-to-polygon";
import { MapboxGeoJSONFeature } from "mapbox-gl";
import { FieldError, useForm } from "react-hook-form";
import { When } from "react-if";
import * as yup from "yup";

import Button from "@/components/elements/Button/Button";
import RHFDropdown from "@/components/elements/Inputs/Dropdown/RHFDropdown";
import Input from "@/components/elements/Inputs/Input/Input";
import { getFeatureProperties } from "@/components/elements/Map-mapbox/utils";
import Text from "@/components/elements/Text/Text";
import { ModalBase } from "@/components/extensive/Modal/Modal";
import { getDistributionOptions } from "@/constants/options/distribution";
import { getLandUseTypeOptions } from "@/constants/options/landUseType";
import { getRestorationStrategyOptions } from "@/constants/options/restorationStrategy";
import { useModalContext } from "@/context/modal.provider";
interface ShapePropertiesModalProps {
  draw?: MapboxDraw;
  feature: MapboxGeoJSONFeature;
  onSubmit: (properties: Omit<IPropertiesValues, "Radius">, feature: MapboxGeoJSONFeature) => void;
  additionalPolygonProperties?: AdditionalPolygonProperties;
}

export interface AdditionalPolygonProperties {
  Framework: string;
  Plant_Date: string;
  Site_ID?: number;
  Site_UUID: string;
  Site_Name: string;
  Project_ID?: number;
  Project_UUID: string;
  Project_Name: string;
  Org_Name: string;
  Country: string;
}

export const user_shapePropertiesValidationSchema = yup.object({
  user_Radius: yup.number().min(55).max(20000000),
  user_Poly_ID: yup.string().required(),
  user_Target_Sys: yup.string().required(),
  user_Practice: yup.string().required(),
  user_Distr: yup.string()
});

const shapePropertiesValidationSchema = yup.object({
  Radius: yup.number().min(55).max(20000000),
  Poly_ID: yup.string().required(),
  Target_Sys: yup.string().required(),
  Practice: yup.array().required(),
  Distr: yup.array()
});

export type IPropertiesValues = yup.InferType<typeof shapePropertiesValidationSchema>;

export const ShapePropertiesModal = ({
  draw,
  feature,
  onSubmit,
  additionalPolygonProperties
}: ShapePropertiesModalProps) => {
  const t = useT();

  const defaultValues = {
    Radius: Math.round(feature.properties?.radiusInKm * 1000) || 2000,
    Poly_ID: getFeatureProperties<string>(feature.properties, "Poly_ID"),
    Practice: getFeatureProperties<string>(feature.properties, "Practice")?.split(","),
    Target_Sys: getFeatureProperties<string>(feature.properties, "Target_Sys"),
    Distr: getFeatureProperties<string>(feature.properties, "Distr")?.split(","),
    ...additionalPolygonProperties
  };

  const { register, control, handleSubmit, formState } = useForm({
    resolver: yupResolver(shapePropertiesValidationSchema),
    defaultValues
  });
  const { closeModal } = useModalContext();

  const onHandleSubmit = (values: IPropertiesValues) => {
    const { Radius, ..._values } = values;

    if (feature.properties?.isCircle) {
      draw?.delete(feature.id as string);
      draw?.add({
        id: feature.id,
        type: "Feature",
        properties: {
          id: feature.id,
          radiusInKm: Radius,
          center: feature.properties.center
        },
        geometry: circleToPolygon(feature.properties.center, Radius, 32)
      });
    }

    onSubmit(_values, feature);
  };

  return (
    <ModalBase className="w-full">
      {/* @ts-ignore */}
      <form onSubmit={handleSubmit(onHandleSubmit)} className="flex w-full flex-col gap-8">
        <Text variant="text-heading-1000">{t("Polygon Details")}</Text>
        <hr />
        <When condition={feature.properties?.isCircle}>
          <Input
            type="number"
            {...register("Radius", { required: true })}
            name="Radius"
            label={t("Circle Radius(Meter)")}
            min={56}
            max={20000000}
            required
            error={formState.errors.Radius}
          />
        </When>
        <Input
          type="text"
          {...register("Poly_ID")}
          name="Poly_ID"
          label={t("Polygon ID")}
          required
          error={formState.errors.Poly_ID}
        />
        <RHFDropdown
          name="Practice"
          options={getRestorationStrategyOptions()}
          label={t("Restoration practice")}
          control={control}
          multiSelect
          required
          error={formState.errors.Practice as FieldError}
        />
        <RHFDropdown
          name="Target_Sys"
          options={getLandUseTypeOptions()}
          label={t("Target land use system")}
          control={control}
          required
          error={formState.errors.Target_Sys}
        />
        <RHFDropdown
          name="Distr"
          options={getDistributionOptions()}
          label={t("Tree distribution")}
          control={control}
          multiSelect
          error={formState.errors.Distr as FieldError}
        />
        <div className="flex w-full flex-row-reverse justify-between gap-3">
          <Button type="submit">Save</Button>
          <Button type="button" variant="secondary" onClick={closeModal}>
            Cancel
          </Button>
        </div>
      </form>
    </ModalBase>
  );
};

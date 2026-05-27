import { useT } from "@transifex/react";
import { useCallback, useEffect, useState } from "react";
import { ControllerRenderProps } from "react-hook-form";

import Button from "@/components/elements/Button/Button";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";

import { DisturbanceNurseryAffectedInput } from "./DisturbanceNurseryAffectedInput";
import { DisturbancePolygonAffectedInput } from "./DisturbancePolygonAffectedInput";
import { DisturbanceSiteAffectedInput } from "./DisturbanceSiteAffectedInput";

export interface DisturbanceAffectedSitesProps {
  onChange?: () => void;
  value: any[];
  field: ControllerRenderProps<any, any>;
}

export const DisturbanceAffectedSites = ({ onChange, value, field }: DisturbanceAffectedSitesProps) => {
  const [affectedSites, setAffectedSites] = useState<number[]>([]);
  const [affectedNurseries, setAffectedNurseries] = useState<number[]>([]);
  const t = useT();

  const siteField = value?.find(f => f.name === "site-affected");
  const polygonField = value?.find(f => f.name === "polygon-affected");
  const siteValue = siteField?.value;
  const siteAffectedValue = typeof siteValue === "string" ? JSON.parse(siteValue) : siteValue;
  const polygonValue = polygonField?.value;
  const polygonAffectedValue = typeof polygonValue === "string" ? JSON.parse(polygonValue) : polygonValue;
  const polygonAffectedArray = Array.isArray(polygonAffectedValue) ? polygonAffectedValue : [];

  const nurseryField = value?.find(f => f.name === "nursery-affected");
  const nurseryValue = nurseryField?.value;
  const nurseryAffectedValue = typeof nurseryValue === "string" ? JSON.parse(nurseryValue) : nurseryValue;

  useEffect(() => {
    const siteLength = siteField ? siteAffectedValue?.length ?? 0 : 0;
    const polygonLength = polygonField ? polygonAffectedArray?.length ?? 0 : 0;
    const maxLength = Math.max(siteLength, polygonLength);

    if (maxLength > 0) {
      const newSites = Array.from({ length: maxLength }, (_, index) => index);
      if (affectedSites.length !== newSites.length || !affectedSites.every((val, index) => val === newSites[index])) {
        setAffectedSites(newSites);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [siteAffectedValue, polygonAffectedArray, siteField?.name, polygonField?.name, value]);

  useEffect(() => {
    const nurseryLength = nurseryField ? nurseryAffectedValue?.length ?? 0 : 0;
    const maxLength = Math.max(nurseryLength);

    if (maxLength > 0) {
      const newNurseries = Array.from({ length: maxLength }, (_, index) => index);
      if (
        affectedNurseries.length !== newNurseries.length ||
        !affectedNurseries.every((val, index) => val === newNurseries[index])
      ) {
        setAffectedNurseries(newNurseries);
      }
    }
  }, [nurseryAffectedValue, nurseryField?.name, affectedNurseries, nurseryField]);

  const addAffectedSite = useCallback(() => {
    const newIndex = affectedSites.length;
    setAffectedSites([...affectedSites, newIndex]);

    const currentSites = siteField?.value;
    const sitesArray = typeof currentSites === "string" ? JSON.parse(currentSites) : currentSites;
    const currentPolygons = polygonField?.value;
    const polygonsArray = typeof currentPolygons === "string" ? JSON.parse(currentPolygons) : currentPolygons;

    const newValue = value?.map(f => {
      if (f.name === siteField?.name) {
        return { ...f, value: [...(sitesArray ?? []), { siteUuid: "", siteName: "" }] };
      }
      if (f.name === polygonField?.name) {
        return { ...f, value: [...(polygonsArray ?? []), []] };
      }
      return f;
    });

    field.onChange(newValue);
    onChange?.();
  }, [value, field, onChange, siteField, polygonField, affectedSites, setAffectedSites]);

  const addAffectedNursery = useCallback(() => {
    const newIndex = affectedNurseries.length;
    setAffectedNurseries([...affectedNurseries, newIndex]);

    const currentNurseries = nurseryField?.value;
    const nurseriesArray = typeof currentNurseries === "string" ? JSON.parse(currentNurseries) : currentNurseries;

    const newValue = value?.map(f => {
      if (f.name === nurseryField?.name) {
        return { ...f, value: [...(nurseriesArray ?? []), { nurseryUuid: "", nurseryName: "" }] };
      }
      return f;
    });

    field.onChange(newValue);
    onChange?.();
  }, [value, field, onChange, nurseryField, affectedNurseries, setAffectedNurseries]);

  const removeAffectedSite = useCallback(
    (index: number) => {
      const updatedSites = affectedSites.filter((_, i) => i !== index);
      setAffectedSites(updatedSites);

      const newSites = (siteAffectedValue ?? [])?.filter((_: any, i: number) => i !== index);
      const newPolygons = (polygonAffectedValue ?? [])?.filter((_: any, i: number) => i !== index);

      const newValue = value?.map(f => {
        if (f.name === siteField?.name) {
          return { ...f, value: newSites };
        }
        if (f.name === polygonField?.name) {
          return { ...f, value: newPolygons };
        }
        return f;
      });

      field.onChange(newValue);
      onChange?.();
    },
    [
      affectedSites,
      siteAffectedValue,
      polygonAffectedValue,
      value,
      field,
      onChange,
      siteField,
      polygonField,
      setAffectedSites
    ]
  );

  const removeAffectedNursery = useCallback(
    (index: number) => {
      const updatedNurseries = affectedNurseries.filter((_, i) => i !== index);
      setAffectedNurseries(updatedNurseries);

      const newNurseries = (nurseryAffectedValue ?? [])?.filter((_: any, i: number) => i !== index);

      const newValue = value?.map(f => {
        if (f.name === nurseryField?.name) {
          return { ...f, value: newNurseries };
        }
        return f;
      });

      field.onChange(newValue);
      onChange?.();
    },
    [affectedNurseries, nurseryAffectedValue, value, field, onChange, nurseryField, setAffectedNurseries]
  );

  return (
    <>
      {affectedSites.map((_, index) => {
        const currentSiteData = siteAffectedValue?.[index];
        const currentSiteUuid = currentSiteData?.siteUuid;
        return (
          <div key={index} className="grid grid-cols-2 gap-x-10 gap-y-4 rounded-lg p-4">
            {siteField == null ? null : (
              <DisturbanceSiteAffectedInput
                value={value}
                field={field}
                onChangeCapture={onChange}
                fieldUuid={`${siteField?.name}[${index}]`}
              />
            )}

            {polygonField == null ? null : (
              <DisturbancePolygonAffectedInput
                value={value}
                field={field}
                onChangeCapture={onChange}
                siteUuid={currentSiteUuid}
                fieldUuid={`${polygonField?.name}[${index}]`}
              />
            )}

            <div className="col-span-2 flex justify-end">
              <button
                onClick={() => removeAffectedSite(index)}
                className="px-0 font-semibold text-black/40 hover:text-red"
              >
                {t("Remove")}
              </button>
            </div>
          </div>
        );
      })}

      <div className="flex justify-end">
        <Button variant="secondary-blue" onClick={addAffectedSite} className="border-none">
          <p className="text-14-bold flex items-center gap-1 normal-case">
            <div className="flex h-4 w-4 items-center justify-center rounded bg-primary">
              <Icon name={IconNames.PLUS} className="h-2.5 w-2.5 text-white" />
            </div>
            {t("Add Site Affected")}
          </p>
        </Button>
      </div>

      {affectedNurseries.map((_, index) => (
        <div key={index} className="grid grid-cols-2 gap-x-10 gap-y-4 rounded-lg p-4">
          {nurseryField == null ? null : (
            <DisturbanceNurseryAffectedInput
              value={value}
              field={field}
              onChangeCapture={onChange}
              fieldUuid={`${nurseryField?.name}[${index}]`}
            />
          )}
          <div className="col-span-2 flex justify-end">
            <button
              onClick={() => removeAffectedNursery(index)}
              className="px-0 font-semibold text-black/40 hover:text-red"
            >
              {t("Remove")}
            </button>
          </div>
        </div>
      ))}

      <div className="flex justify-end">
        <Button variant="secondary-blue" onClick={addAffectedNursery} className="border-none">
          <p className="text-14-bold flex items-center gap-1 normal-case">
            <div className="flex h-4 w-4 items-center justify-center rounded bg-primary">
              <Icon name={IconNames.PLUS} className="h-2.5 w-2.5 text-white" />
            </div>
            {t("Add Nursery Affected")}
          </p>
        </Button>
      </div>
    </>
  );
};

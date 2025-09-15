import { useT } from "@transifex/react";
import { useCallback, useEffect, useState } from "react";
import { FieldError, UseFormReturn } from "react-hook-form";

import Button from "@/components/elements/Button/Button";
import InputWrapper from "@/components/elements/Inputs/InputElements/InputWrapper";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";

import { FieldMapper } from "./FieldMapper";
import { FieldType, FormField } from "./types";

export interface DisturbanceAffectedSitesProps {
  formHook: UseFormReturn<any>;
  onChange: () => void;
  projectUuid?: string;
  fields: FormField[];
}

export const DisturbanceAffectedSites = ({
  formHook,
  onChange,
  projectUuid,
  fields
}: DisturbanceAffectedSitesProps) => {
  const [affectedSites, setAffectedSites] = useState<number[]>([]);
  const t = useT();

  const siteField = fields.find((f: FormField) => f.type === FieldType.DisturbanceAffectedSite);
  const polygonField = fields.find((f: FormField) => f.type === FieldType.DisturbanceAffectedPolygon);

  const siteAffectedValue = formHook.watch(siteField?.name as string) ?? [];
  const polygonAffectedValue = formHook.watch(polygonField?.name as string) ?? [];
  const polygonAffectedArray = Array.isArray(polygonAffectedValue) ? polygonAffectedValue : [];

  useEffect(() => {
    const siteLength = siteField ? siteAffectedValue.length : 0;
    const polygonLength = polygonField ? polygonAffectedArray.length : 0;
    const maxLength = Math.max(siteLength, polygonLength);

    if (maxLength > 0) {
      const newSites = Array.from({ length: maxLength }, (_, index) => index);
      if (affectedSites.length !== newSites.length || !affectedSites.every((val, index) => val === newSites[index])) {
        setAffectedSites(newSites);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [siteAffectedValue, polygonAffectedArray, siteField?.name, polygonField?.name]);

  const addAffectedSite = useCallback(() => {
    const newIndex = affectedSites.length;
    setAffectedSites([...affectedSites, newIndex]);

    if (siteField?.name) {
      const currentSites = formHook.getValues(siteField?.name as string) ?? [];
      const sitesArray = Array.isArray(currentSites) ? currentSites : [];
      formHook.setValue(siteField?.name as string, [...sitesArray, { siteUuid: "", siteName: "" }], {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true
      });
    }

    if (polygonField?.name) {
      const currentPolygons = formHook.getValues(polygonField?.name as string) ?? [];
      const polygonsArray = Array.isArray(currentPolygons) ? currentPolygons : [];
      formHook.setValue(polygonField?.name as string, [...polygonsArray, []], {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true
      });
    }
    onChange();
  }, [affectedSites, siteField?.name, polygonField?.name, formHook, onChange]);

  const removeAffectedSite = useCallback(
    (index: number) => {
      const updatedSites = affectedSites.filter((_, i) => i !== index);
      setAffectedSites(updatedSites);

      if (siteField?.name) {
        const currentSites = formHook.getValues(siteField?.name as string) ?? [];
        const sitesArray = Array.isArray(currentSites) ? currentSites : [];
        const newSites = sitesArray.filter((_: any, i: number) => i !== index);
        formHook.setValue(siteField?.name as string, newSites, {
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true
        });
      }

      if (polygonField?.name) {
        const currentPolygons = formHook.getValues(polygonField?.name as string) ?? [];
        const polygonsArray = Array.isArray(currentPolygons) ? currentPolygons : [];
        const newPolygons = polygonsArray.filter((_: any, i: number) => i !== index);
        formHook.setValue(polygonField?.name as string, newPolygons, {
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true
        });
      }

      onChange();
    },
    [affectedSites, siteField?.name, polygonField?.name, formHook, onChange]
  );
  if (!siteField && !polygonField) {
    return null;
  }

  return (
    <InputWrapper error={formHook.formState.errors[siteField?.name || (polygonField?.name as string)] as FieldError}>
      {affectedSites.map((_, index) => {
        const currentSiteData = siteAffectedValue[index];
        const currentSiteUuid = currentSiteData?.siteUuid;
        return (
          <div key={index} className="grid grid-cols-2 gap-x-10 gap-y-4 rounded-lg p-4">
            {siteField == null ? null : (
              <InputWrapper
                label={index == 0 ? siteField.label : undefined}
                description={index == 0 ? siteField.description : undefined}
              >
                <FieldMapper
                  field={{
                    ...siteField,
                    name: `${siteField?.name}[${index}]`,
                    label: `Site ${index + 1} Affected`,
                    fieldProps: {
                      ...siteField.fieldProps,
                      projectUuid
                    }
                  }}
                  formHook={formHook}
                  onChange={onChange}
                />
              </InputWrapper>
            )}

            {polygonField == null ? null : (
              <InputWrapper
                label={index == 0 ? polygonField.label : undefined}
                description={index == 0 ? polygonField.description : undefined}
              >
                <FieldMapper
                  field={{
                    ...polygonField,
                    name: `${polygonField?.name}[${index}]`,
                    label: `Polygons Affected`,
                    fieldProps: {
                      ...polygonField.fieldProps,
                      siteUuid: currentSiteUuid
                    }
                  }}
                  formHook={formHook}
                  onChange={onChange}
                />
              </InputWrapper>
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
    </InputWrapper>
  );
};

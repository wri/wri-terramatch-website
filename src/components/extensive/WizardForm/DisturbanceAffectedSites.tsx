import { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";

import Button from "@/components/elements/Button/Button";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";

import { PolygonReferenceInput } from "./PolygonReferenceInput";
import { SiteReferenceInput } from "./SiteReferenceInput";
import { FormField } from "./types";

interface DisturbanceAffectedSitesProps {
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

  const siteField = fields.find((f: any) => f.linked_field_key === "dis-rep-site-affected");
  const polygonField = fields.find((f: any) => f.linked_field_key === "dis-rep-polygon-affected");

  const siteAffectedValue = formHook.watch(siteField?.name as string) ?? [];
  const polygonAffectedValue = formHook.watch(polygonField?.name as string) ?? [];

  useEffect(() => {
    const maxLength = Math.max(siteAffectedValue.length, polygonAffectedValue.length);
    if (maxLength > 0) {
      const newSites = Array.from({ length: maxLength }, (_, index) => index);
      setAffectedSites(newSites);
      onChange();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [siteAffectedValue, polygonAffectedValue, siteField?.name, polygonField?.name]);

  const addAffectedSite = () => {
    const newIndex = affectedSites.length;
    setAffectedSites([...affectedSites, newIndex]);

    const currentSites = formHook.getValues(siteField?.name as string) || [];
    const currentPolygons = formHook.getValues(polygonField?.name as string) || [];

    const sitesArray = Array.isArray(currentSites) ? currentSites : [];
    const polygonsArray = Array.isArray(currentPolygons) ? currentPolygons : [];

    formHook.setValue(siteField?.name as string, [...sitesArray, { siteUuid: "", siteName: "" }]);
    formHook.setValue(polygonField?.name as string, [...polygonsArray, []]);
    onChange();
  };

  const removeAffectedSite = (index: number) => {
    const updatedSites = affectedSites.filter((_, i) => i !== index);
    setAffectedSites(updatedSites);

    const currentSites = formHook.getValues(siteField?.name as string) || [];
    const currentPolygons = formHook.getValues(polygonField?.name as string) || [];

    const sitesArray = Array.isArray(currentSites) ? currentSites : [];
    const polygonsArray = Array.isArray(currentPolygons) ? currentPolygons : [];

    const newSites = sitesArray.filter((_: any, i: number) => i !== index);
    const newPolygons = polygonsArray.filter((_: any, i: number) => i !== index);

    formHook.setValue(siteField?.name as string, newSites);
    formHook.setValue(polygonField?.name as string, newPolygons);
    onChange();
  };

  return (
    <div>
      {affectedSites.map((_, index) => {
        const currentSiteData = siteAffectedValue[index];
        const currentSiteUuid = currentSiteData?.siteUuid;
        return (
          <div key={index} className="grid grid-cols-2 gap-x-10 gap-y-4 rounded-lg p-4">
            <div>
              <SiteReferenceInput
                formHook={formHook}
                onChange={onChange}
                projectUuid={projectUuid}
                label={`Site ${index + 1} Affected`}
                fieldUuid={`${siteField?.name}[${index}]`}
              />
            </div>

            <div>
              <PolygonReferenceInput
                formHook={formHook}
                onChange={onChange}
                siteUuid={currentSiteUuid}
                label={`Polygons Affected`}
                fieldUuid={`${polygonField?.name}[${index}]`}
              />
            </div>

            <div className="col-span-2 flex justify-end">
              <button
                onClick={() => removeAffectedSite(index)}
                className="px-0 font-semibold text-black/40 hover:text-red"
              >
                Remove
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
            Add Site Affected
          </p>
        </Button>
      </div>
    </div>
  );
};

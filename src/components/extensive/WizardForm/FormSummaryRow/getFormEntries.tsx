import { useT } from "@transifex/react";
import { useEffect, useMemo, useState } from "react";
import { useShowContext } from "react-admin";

import { useMap } from "@/components/elements/Map-mapbox/hooks/useMap";
import { parsePolygonData } from "@/components/elements/Map-mapbox/utils";
import { FormFieldFactories } from "@/components/extensive/WizardForm/fields";
import { FormEntry, GetFormEntriesProps } from "@/components/extensive/WizardForm/FormSummaryRow/types";
import { GetEntryValueProps } from "@/components/extensive/WizardForm/types";
import { getFormattedAnswer, loadExternalAnswerSources } from "@/components/extensive/WizardForm/utils";
import { useBoundingBox } from "@/connections/BoundingBox";
import { FORM_POLYGONS } from "@/constants/statuses";
import { FormFieldsProvider, useFieldsProvider } from "@/context/wizardForm.provider";
import { useGetV2SitesSitePolygon, useGetV2TerrafundProjectPolygon } from "@/generated/apiComponents";
import { singularEntityName } from "@/helpers/entity";
import { Entity, EntityName } from "@/types/common";
import { isNotNull } from "@/utils/array";

export const useGetFormEntries = (props: GetFormEntriesProps) => {
  const t = useT();
  let { record } = useShowContext();
  const { type, entity } = props;
  const fieldsProvider = useFieldsProvider();

  record = { organisation: props.organisation, ...record };
  const uuid = entity?.entityUUID ?? record?.uuid;
  const entityType = entity?.entityName ?? (type as EntityName);

  const { data: sitePolygonData } = useGetV2SitesSitePolygon(
    {
      pathParams: {
        site: uuid
      }
    },
    {
      enabled: entityType === "sites" && !!uuid
    }
  );

  const { data: projectPolygonData } = useGetV2TerrafundProjectPolygon(
    {
      queryParams: {
        entityType: singularEntityName((entityType ?? "") as EntityName),
        uuid: uuid ?? ""
      }
    },
    {
      enabled: (entityType === "projects" || entityType === "project-pitches") && uuid != null
    }
  );
  const bboxParams =
    type === "sites"
      ? { siteUuid: record?.uuid }
      : entityType === "projects"
      ? { projectUuid: uuid }
      : entityType === "project-pitches"
      ? { projectPitchUuid: uuid }
      : {};

  const bbox = useBoundingBox(bboxParams);

  const entityPolygonData = getEntityPolygonData(record, type, entity, sitePolygonData, projectPolygonData);

  const mapFunctions = useMap();

  const [externalSourcesLoaded, setExternalSourcesLoaded] = useState(false);
  useEffect(() => {
    loadExternalAnswerSources(fieldsProvider.fieldNames(props.stepId), props.values, fieldsProvider).finally(() =>
      setExternalSourcesLoaded(true)
    );
  }, [fieldsProvider, props.stepId, props.values]);

  return useMemo(
    () =>
      externalSourcesLoaded
        ? getFormEntries(fieldsProvider, props, t, undefined, entityPolygonData, bbox, mapFunctions, record)
        : [],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [externalSourcesLoaded, props, t, entityPolygonData, bbox, externalSourcesLoaded]
  );
};

export const getFormEntries = (
  fieldsProvider: FormFieldsProvider,
  { stepId, values, nullText, type, entity }: GetFormEntriesProps,
  t: typeof useT,
  fieldIds = fieldsProvider.fieldNames(stepId),
  entityPolygonData?: any,
  bbox?: any,
  mapFunctions?: any,
  record?: any
) => {
  const entries: FormEntry[] = [];

  const props: GetEntryValueProps = {
    fieldsProvider,
    t,
    entity,
    type,
    entityPolygonData,
    bbox,
    mapFunctions,
    record,
    stepId,
    nullText
  };
  for (const field of fieldIds.map(fieldsProvider.fieldByName).filter(isNotNull)) {
    const { addFormEntries } = FormFieldFactories[field.inputType];
    if (addFormEntries == null) {
      entries.push({
        title: field.label ?? "",
        inputType: field.inputType,
        value: getFormattedAnswer(field, values, fieldsProvider) ?? nullText ?? t("Answer Not Provided")
      });
    } else {
      addFormEntries(entries, field, values, props);
    }
  }

  return entries;
};

// Make this a pure function that doesn't call hooks
const getEntityPolygonData = (
  record: any,
  type?: EntityName,
  entity?: Entity,
  sitePolygonData?: any,
  projectPolygonData?: any
) => {
  if (!record && !entity) {
    return null;
  }

  const entityType = entity?.entityName || (type as EntityName);

  if (entityType === "sites") {
    return sitePolygonData ? parsePolygonData(sitePolygonData) : null;
  } else if (entityType === "projects" || entityType === "project-pitches") {
    const polygonUuid = projectPolygonData?.project_polygon?.poly_uuid;
    return projectPolygonData ? { [FORM_POLYGONS]: [polygonUuid] } : null;
  }

  return null;
};

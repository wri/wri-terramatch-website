import { useT } from "@transifex/react";
import { useEffect, useMemo, useState } from "react";
import { useShowContext } from "react-admin";
import { Else, If, Then } from "react-if";

import { formatEntryValue } from "@/admin/apiProvider/utils/entryFormat";
import Accordion from "@/components/elements/Accordion/Accordion";
import { useMap } from "@/components/elements/Map-mapbox/hooks/useMap";
import { parsePolygonData } from "@/components/elements/Map-mapbox/utils";
import Text from "@/components/elements/Text/Text";
import { FormFieldFactories } from "@/components/extensive/WizardForm/fields";
import { FormSummaryProps } from "@/components/extensive/WizardForm/FormSummary";
import { FieldInputType, GetEntryValueProps } from "@/components/extensive/WizardForm/types";
import { useBoundingBox } from "@/connections/BoundingBox";
import { FORM_POLYGONS } from "@/constants/statuses";
import { FormFieldsProvider, useFieldsProvider } from "@/context/wizardForm.provider";
import { useGetV2SitesSitePolygon, useGetV2TerrafundProjectPolygon } from "@/generated/apiComponents";
import { pluralEntityNameToSingular } from "@/helpers/entity";
import { Entity, EntityName } from "@/types/common";
import { isNotNull } from "@/utils/array";

import List from "../List/List";
import { childIdsWithCondition, getFormattedAnswer, loadExternalAnswerSources } from "./utils";

export interface FormSummaryRowProps extends FormSummaryProps {
  type?: EntityName;
  stepId: string;
  index: number;
  nullText?: string;
  // TODO Get entity from wizard context
  entity?: Entity;
}

type GetFormEntriesProps = Omit<FormSummaryRowProps, "index" | "onEdit" | "formUuid">;

type FormEntry = {
  title?: string;
  inputType: FieldInputType;
  value: any;
};

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
        entityType: pluralEntityNameToSingular((entityType ?? "") as EntityName),
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
    loadExternalAnswerSources(fieldsProvider.fieldIds(props.stepId), props.values, fieldsProvider).finally(() =>
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
  fieldIds = fieldsProvider.fieldIds(stepId),
  entityPolygonData?: any,
  bbox?: any,
  mapFunctions?: any,
  record?: any
) => {
  const outputArr: FormEntry[] = [];

  const props: GetEntryValueProps = {
    fieldsProvider,
    t,
    entity,
    type,
    entityPolygonData,
    bbox,
    mapFunctions,
    record
  };
  for (const field of fieldIds.map(fieldsProvider.fieldById).filter(isNotNull)) {
    const { getEntryValue } = FormFieldFactories[field.inputType];
    const value =
      getEntryValue == null
        ? getFormattedAnswer(field, values, fieldsProvider) ?? nullText ?? t("Answer Not Provided")
        : getEntryValue(field, values, props);
    if (value == null) continue;

    outputArr.push({ title: field.label ?? "", inputType: field.inputType, value });

    // Special case handling for conditional. It's done here instead of the field factory in order
    // to keep the signature and use of getEntryValue simpler.
    if (field.inputType === "conditional") {
      outputArr.push(
        ...getFormEntries(
          fieldsProvider,
          { values, nullText, stepId, type, entity },
          t,
          childIdsWithCondition(field.name, values[field.name], fieldsProvider)
        )
      );
    }
  }

  return outputArr;
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

const FormSummaryRow = ({ stepId, index, ...props }: FormSummaryRowProps) => {
  const t = useT();
  const { title } = useFieldsProvider().step(stepId) ?? {};
  const entries = useGetFormEntries({ stepId, ...props });
  return (
    <Accordion
      variant="secondary"
      title={title ?? ""}
      ctaButtonProps={
        props.onEdit
          ? {
              text: t("Edit"),
              onClick: () => props.onEdit?.(index)
            }
          : undefined
      }
    >
      <List
        className="flex flex-col gap-4"
        items={entries}
        render={entry => (
          <div className="flex items-start gap-12 transition-all delay-300 duration-300">
            <Text variant="text-body-500" className="flex-1">
              {entry.title}
            </Text>
            <If condition={typeof entry.value === "string" || typeof entry.value === "number"}>
              <Then>
                <Text variant="text-body-300" className="flex-1" containHtml>
                  {formatEntryValue(entry.value)}
                </Text>
              </Then>
              <Else>{formatEntryValue(entry.value)}</Else>
            </If>
          </div>
        )}
      />
    </Accordion>
  );
};

export default FormSummaryRow;

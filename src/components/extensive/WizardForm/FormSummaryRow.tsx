import { AccessorKeyColumnDef } from "@tanstack/react-table";
import { useT } from "@transifex/react";
import { useEffect, useMemo, useState } from "react";
import { useShowContext } from "react-admin";
import { Else, If, Then } from "react-if";

import { formatEntryValue } from "@/admin/apiProvider/utils/entryFormat";
import Accordion from "@/components/elements/Accordion/Accordion";
import { getDisturbanceTableColumns } from "@/components/elements/Inputs/DataTable/RHFDisturbanceTable";
import { getFundingTypeTableColumns } from "@/components/elements/Inputs/DataTable/RHFFundingTypeDataTable";
import { getInvasiveTableColumns } from "@/components/elements/Inputs/DataTable/RHFInvasiveTable";
import { getLeadershipsTableColumns } from "@/components/elements/Inputs/DataTable/RHFLeadershipsTable";
import { getOwnershipTableColumns } from "@/components/elements/Inputs/DataTable/RHFOwnershipStakeTable";
import { getSeedingTableColumns } from "@/components/elements/Inputs/DataTable/RHFSeedingTable";
import { getStrataTableColumns } from "@/components/elements/Inputs/DataTable/RHFStrataTable";
import { documentationColumnsMap, formatFinancialData } from "@/components/elements/Inputs/FinancialTableInput/types";
import { TreeSpeciesValue } from "@/components/elements/Inputs/TreeSpeciesInput/TreeSpeciesInput";
import { useMap } from "@/components/elements/Map-mapbox/hooks/useMap";
import { MapContainer } from "@/components/elements/Map-mapbox/Map";
import { parsePolygonData } from "@/components/elements/Map-mapbox/utils";
import Text from "@/components/elements/Text/Text";
import DemographicsCollapseGrid from "@/components/extensive/DemographicsCollapseGrid/DemographicsCollapseGrid";
import { GRID_VARIANT_NARROW } from "@/components/extensive/DemographicsCollapseGrid/DemographicVariant";
import TreeSpeciesTable, { PlantData } from "@/components/extensive/Tables/TreeSpeciesTable";
import { FormSummaryProps } from "@/components/extensive/WizardForm/FormSummary";
import { FieldDefinition } from "@/components/extensive/WizardForm/types";
import { useBoundingBox } from "@/connections/BoundingBox";
import { SupportedEntity } from "@/connections/EntityAssociation";
import { FORM_POLYGONS } from "@/constants/statuses";
import { FormFieldsProvider, useFieldsProvider } from "@/context/wizardForm.provider";
import { useGetV2SitesSitePolygon, useGetV2TerrafundProjectPolygon } from "@/generated/apiComponents";
import { FormQuestionDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { pluralEntityNameToSingular, v3Entity } from "@/helpers/entity";
import { Entity, EntityName } from "@/types/common";
import { isNotNull } from "@/utils/array";

import List from "../List/List";
import { childIdsWithCondition, getAnswer, getFormattedAnswer, loadExternalAnswerSources } from "./utils";

export interface FormSummaryRowProps extends FormSummaryProps {
  type?: EntityName;
  stepId: string;
  index: number;
  nullText?: string;
  entity?: Entity;
}

type GetFormEntriesProps = Omit<FormSummaryRowProps, "index" | "onEdit" | "formUuid">;

interface FormEntry {
  title?: string;
  inputType: FormQuestionDto["inputType"];
  value: any;
}

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

  fieldIds.forEach(fieldId => {
    const field = fieldsProvider.fieldById(fieldId);
    if (field == null) return;

    switch (field.inputType) {
      case "treeSpecies": {
        const value = (getAnswer(field, values) ?? []) as TreeSpeciesValue[];
        const collection = value[0]?.collection;
        outputArr.push(treeSpeciesSummary(collection, entity, field, values));
        break;
      }

      case "workdays":
      case "restorationPartners":
      case "jobs":
      case "volunteers":
      case "allBeneficiaries":
      case "trainingBeneficiaries":
      case "indirectBeneficiaries":
      case "employees":
      case "associates": {
        const entries = (values[field.name]?.[0] ?? {}).demographics ?? [];
        outputArr.push({
          title: field.label,
          inputType: field.inputType,
          value: <DemographicsCollapseGrid entries={entries} variant={GRID_VARIANT_NARROW} type={field.inputType} />
        });
        break;
      }

      case "mapInput": {
        outputArr.push({
          title: field.label,
          inputType: field.inputType,
          value: entityPolygonData && Object.keys(entityPolygonData).length !== 0 && (
            <MapContainer
              polygonsData={entityPolygonData}
              bbox={bbox}
              className="h-[240px] flex-1"
              hasControls={false}
              showPopups={type === "sites"}
              showLegend={type === "sites"}
              mapFunctions={mapFunctions}
              showDownloadPolygons={true}
              record={record}
            />
          )
        });
        break;
      }

      case "financialIndicators": {
        const entries = values[field.name];
        if (!Array.isArray(entries) || !entries || entries?.length === 0) break;
        const years = field.years;
        const columnMaps: Record<string, string[]> = {
          documentationData: documentationColumnsMap
        };

        const formatted = formatFinancialData(entries, years ?? undefined, "", "");
        const sections = [
          { title: t("Profit Analysis"), key: "profitAnalysisData" },
          { title: t("Budget Analysis"), key: "nonProfitAnalysisData" },
          { title: t("Current Ratio"), key: "currentRatioData" },
          { title: t("Documentation"), key: "documentationData" }
        ];

        const isEmptyValue = (val: any) => {
          if (val === undefined || val === null) return true;
          if (typeof val === "string") {
            return val.trim() === "" || val?.trim() === "-";
          }
          return false;
        };
        const value = sections
          .map(section => {
            const data = formatted[section.key as keyof typeof formatted] as Record<string, any>[];
            const columns = columnMaps[section.key as keyof typeof columnMaps];
            if (!Array.isArray(data) || !data || data?.length === 0) return "";

            const filteredRows = data?.filter((row: Record<string, any>) => {
              if (!columns) return null;
              const valuesToCheck = columns.filter(c => c !== "year").map(col => row[col]);
              return valuesToCheck.some(val => !isEmptyValue(val));
            });

            if (filteredRows.length === 0) return "";

            const rowsHtml = filteredRows
              .map((row: Record<string, any>) => {
                const cellValues = columns.map(col => {
                  if (col === "documentation") {
                    if (Array.isArray(row[col]) && row[col].length > 0) {
                      return row[col]
                        .map((document: any) => {
                          if (document.url) {
                            return `<a href="${
                              document.url
                            }" target="_blank" rel="noopener noreferrer" class="text-primary underline">${
                              document.file_name ?? ""
                            }</a>`;
                          }
                          return "";
                        })
                        .filter((link: any) => link !== "")
                        .join(", ");
                    }
                    return "";
                  }

                  if (col === "year") {
                    return isEmptyValue(row[col]) ? "-" : String(row[col]);
                  }
                  return isEmptyValue(row[col]) ? "-" : row[col].toLocaleString();
                });
                return cellValues.join(", ");
              })
              .join("<br/>");

            return `<strong>${section.title}</strong><br/>${rowsHtml}<br/><br/>`;
          })
          .filter(Boolean)
          .join("");

        const output = {
          title: field.label,
          inputType: field.inputType,
          value: value ?? t("Answer Not Provided")
        };

        outputArr.push(output);
        break;
      }

      case "tableInput": {
        const rows = fieldsProvider.childIds(field.name).map(fieldsProvider.fieldById).filter(isNotNull);
        outputArr.push({
          title: field.label,
          inputType: field.inputType,
          value: rows
            .map(row => `${row.label}: ${values[field.name]?.[row.name ?? ""] ?? t("Answer Not Provided")}`)
            .join("<br/>")
        });
        break;
      }

      case "leaderships":
      case "ownershipStake":
      case "fundingType":
      case "stratas":
      case "disturbances":
      case "invasive": {
        let headers: AccessorKeyColumnDef<any>[] = [];

        if (field.inputType === "leaderships") headers = getLeadershipsTableColumns(t);
        else if (field.inputType === "ownershipStake") headers = getOwnershipTableColumns(t);
        else if (field.inputType === "fundingType") headers = getFundingTypeTableColumns(t);
        else if (field.inputType === "stratas") headers = getStrataTableColumns(t);
        else if (field.inputType === "disturbances") {
          const { with_intensity: hasIntensity, with_extent: hasExtent } = (field.additionalProps ?? {}) as {
            with_intensity: boolean | undefined;
            with_extent: boolean | undefined;
          };
          headers = getDisturbanceTableColumns({ hasIntensity, hasExtent }, t);
        } else if (field.inputType === "invasive") headers = getInvasiveTableColumns(t);

        outputArr.push(dataTableSummary(headers, field, values));
        break;
      }

      case "seedings": {
        if (field.additionalProps?.capture_count === true) {
          // RHFSeedingTableInput
          outputArr.push(treeSpeciesSummary("seeds", entity, field, values));
        } else {
          // RHFSeedingTable
          outputArr.push(dataTableSummary(getSeedingTableColumns(t, false), field, values));
        }
        break;
      }

      case "conditional": {
        outputArr.push({
          title: field.label ?? "",
          inputType: field.inputType,
          value: getFormattedAnswer(field, values) ?? nullText ?? t("Answer Not Provided")
        });
        outputArr.push(
          ...getFormEntries(
            fieldsProvider,
            { values, nullText, stepId, type, entity },
            t,
            childIdsWithCondition(field.name, values[field.name], fieldsProvider)
          )
        );
        break;
      }

      default: {
        outputArr.push({
          title: field.label ?? "",
          inputType: field.inputType,
          value: getFormattedAnswer(field, values) ?? nullText ?? t("Answer Not Provided")
        });
      }
    }
  });

  return outputArr;
};

const dataTableSummary = (headers: AccessorKeyColumnDef<any>[], field: FieldDefinition, values: any) => {
  const stringValues: string[] = [];
  values?.[field.name]?.forEach((entry: any) => {
    const row: (string | undefined)[] = [];

    Object.values(headers).forEach(h => {
      const value = entry[h.accessorKey];
      //@ts-ignore
      row.push(h.cell?.({ getValue: () => value }) || value);
    });
    stringValues.push(row.join(", "));
  });

  return {
    title: field.label,
    inputType: field.inputType,
    value: stringValues.join("<br/>")
  };
};

const treeSpeciesSummary = (
  collection: string | undefined,
  entity: Entity | undefined,
  field: FieldDefinition,
  values: any
) => {
  const value = (getAnswer(field, values) ?? []) as TreeSpeciesValue[];
  const plants = value.map(
    ({ name, amount, taxon_id }) =>
      ({
        name,
        amount,
        // ?? null is important here for the isEqual check in useFormChanges. The v3 API always
        // returns null, so if taxon_id is undefined here, we want it to be explicitly null
        // for comparison.
        taxonId: taxon_id ?? null
      } as PlantData)
  );
  const supportedEntity = v3Entity(entity) as SupportedEntity | undefined;
  const tableType = field.additionalProps?.with_numbers !== true ? "noCount" : undefined;
  return {
    title: field.label,
    inputType: field.inputType,
    value: (
      <TreeSpeciesTable
        {...{ plants, collection, tableType }}
        entity={supportedEntity}
        entityUuid={entity?.entityUUID}
      />
    )
  };
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

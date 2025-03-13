import { AccessorKeyColumnDef } from "@tanstack/react-table";
import { useT } from "@transifex/react";
import { useMemo } from "react";
import { useShowContext } from "react-admin";
import { Else, If, Then } from "react-if";

import { formatEntryValue } from "@/admin/apiProvider/utils/entryFormat";
import Accordion from "@/components/elements/Accordion/Accordion";
import { getDisturbanceTableColumns } from "@/components/elements/Inputs/DataTable/RHFDisturbanceTable";
import { getFundingTypeTableColumns } from "@/components/elements/Inputs/DataTable/RHFFundingTypeDataTable";
import { getInvasiveTableColumns } from "@/components/elements/Inputs/DataTable/RHFInvasiveTable";
import { getLeadershipTableColumns } from "@/components/elements/Inputs/DataTable/RHFLeadershipTeamTable";
import { getOwnershipTableColumns } from "@/components/elements/Inputs/DataTable/RHFOwnershipStakeTable";
import { getSeedingTableColumns } from "@/components/elements/Inputs/DataTable/RHFSeedingTable";
import { getStrataTableColumns } from "@/components/elements/Inputs/DataTable/RHFStrataTable";
import { TreeSpeciesValue } from "@/components/elements/Inputs/TreeSpeciesInput/TreeSpeciesInput";
import { useMap } from "@/components/elements/Map-mapbox/hooks/useMap";
import { MapContainer } from "@/components/elements/Map-mapbox/Map";
import { getPolygonBbox, getSiteBbox, parsePolygonData } from "@/components/elements/Map-mapbox/utils";
import Text from "@/components/elements/Text/Text";
import DemographicsCollapseGrid from "@/components/extensive/DemographicsCollapseGrid/DemographicsCollapseGrid";
import { GRID_VARIANT_NARROW } from "@/components/extensive/DemographicsCollapseGrid/DemographicVariant";
import TreeSpeciesTable, { PlantData } from "@/components/extensive/Tables/TreeSpeciesTable";
import { FormSummaryProps } from "@/components/extensive/WizardForm/FormSummary";
import { SupportedEntity } from "@/connections/EntityAssocation";
import { FORM_POLYGONS } from "@/constants/statuses";
import { useGetV2SitesSitePolygon, useGetV2TerrafundProjectPolygon } from "@/generated/apiComponents";
import { pluralEntityNameToSingular, v3Entity } from "@/helpers/entity";
import { Entity, EntityName } from "@/types/common";

import List from "../List/List";
import { FieldType, FormStepSchema } from "./types";
import { getAnswer, getFormattedAnswer } from "./utils";

export interface FormSummaryRowProps extends FormSummaryProps {
  type?: EntityName;
  step: FormStepSchema;
  index: number;
  nullText?: string;
  entity?: Entity;
}

type GetFormEntriesProps = Omit<FormSummaryRowProps, "index" | "steps" | "onEdit">;

export interface FormEntry {
  title?: string;
  type: FieldType;
  value: any;
}

export const useGetFormEntries = (props: GetFormEntriesProps) => {
  const t = useT();
  const { record } = useShowContext();
  const { type, entity } = props;
  const entityPolygonData = getEntityPolygonData(record, type, entity);
  let bbox: any;
  if (type === "sites") {
    bbox = getSiteBbox(record);
  } else {
    bbox = getPolygonBbox(entityPolygonData?.[FORM_POLYGONS]?.[0]);
  }
  const mapFunctions = useMap();
  return useMemo<any[]>(
    () => getFormEntries(props, t, entityPolygonData, bbox, mapFunctions),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [props, t, entityPolygonData, bbox]
  );
};

export const getFormEntries = (
  { step, values, nullText, type, entity }: GetFormEntriesProps,
  t: typeof useT,
  entityPolygonData?: any,
  bbox?: any,
  mapFunctions?: any
) => {
  const outputArr: FormEntry[] = [];

  step.fields.forEach(f => {
    switch (f.type) {
      case FieldType.TreeSpecies:
      case FieldType.SeedingsTableInput: {
        const value = (getAnswer(f, values) ?? []) as TreeSpeciesValue[];
        const collection = f.type === FieldType.SeedingsTableInput ? "seeds" : value[0]?.collection;
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
        const tableType = !f.fieldProps.withNumbers ? "noCount" : undefined;
        outputArr.push({
          title: f.label,
          type: f.type,
          value: (
            <TreeSpeciesTable
              {...{ plants, collection, tableType }}
              entity={supportedEntity}
              entityUuid={entity?.entityUUID}
            />
          )
        });
        break;
      }

      case FieldType.WorkdaysTable:
      case FieldType.RestorationPartnersTable:
      case FieldType.JobsTable:
      case FieldType.VolunteersTable:
      case FieldType.AllBeneficiariesTable:
      case FieldType.TrainingBeneficiariesTable: {
        const entries = (values[f.name]?.[0] ?? {}).demographics ?? [];
        outputArr.push({
          title: f.label,
          type: f.type,
          value: <DemographicsCollapseGrid entries={entries} variant={GRID_VARIANT_NARROW} type={f.type} />
        });
        break;
      }

      case FieldType.Map: {
        outputArr.push({
          title: f.label,
          type: f.type,
          value: entityPolygonData && Object.keys(entityPolygonData).length !== 0 && (
            <MapContainer
              polygonsData={entityPolygonData}
              bbox={bbox}
              className="h-[240px] flex-1"
              hasControls={false}
              showPopups={type === "sites"}
              showLegend={type === "sites"}
              mapFunctions={mapFunctions}
            />
          )
        });
        break;
      }

      case FieldType.InputTable: {
        outputArr.push({
          title: f.label,
          type: f.type,
          value: f.fieldProps.rows
            .map(row => `${row.label}: ${values[f.name]?.[row.name] ?? t("Answer Not Provided")}`)
            .join("<br/>")
        });
        break;
      }

      case FieldType.LeadershipTeamDataTable:
      case FieldType.OwnershipStakeDataTable:
      case FieldType.FundingTypeDataTable:
      case FieldType.StrataDataTable:
      case FieldType.DisturbanceDataTable:
      case FieldType.InvasiveDataTable:
      case FieldType.SeedingsDataTable: {
        let headers: AccessorKeyColumnDef<any>[] = [];

        if (f.type === FieldType.LeadershipTeamDataTable) headers = getLeadershipTableColumns(t);
        else if (f.type === FieldType.OwnershipStakeDataTable) headers = getOwnershipTableColumns(t);
        else if (f.type === FieldType.FundingTypeDataTable) headers = getFundingTypeTableColumns(t);
        else if (f.type === FieldType.StrataDataTable) headers = getStrataTableColumns(t);
        else if (f.type === FieldType.DisturbanceDataTable) headers = getDisturbanceTableColumns(f.fieldProps, t);
        else if (f.type === FieldType.InvasiveDataTable) headers = getInvasiveTableColumns(t);
        else if (f.type === FieldType.SeedingsDataTable) headers = getSeedingTableColumns(t, f.fieldProps.captureCount);

        const stringValues: string[] = [];
        values?.[f.name]?.forEach((entry: any) => {
          const row: (string | undefined)[] = [];

          Object.values(headers).forEach(h => {
            const value = entry[h.accessorKey];
            //@ts-ignore
            row.push(h.cell?.({ getValue: () => value }) || value);
          });
          stringValues.push(row.join(", "));
        });

        outputArr.push({
          title: f.label,
          type: f.type,
          value: stringValues.join("<br/>")
        });
        break;
      }

      case FieldType.Conditional: {
        outputArr.push({
          title: f.label ?? "",
          type: f.type,
          value: getFormattedAnswer(f, values) ?? nullText ?? t("Answer Not Provided")
        });
        const children = getFormEntries(
          {
            values,
            nullText,
            step: {
              ...step,
              fields: f.fieldProps.fields.filter(child => child.condition === values[f.name])
            },
            entity
          },
          t
        );
        outputArr.push(...children);
        break;
      }

      default: {
        outputArr.push({
          title: f.label ?? "",
          type: f.type,
          value: getFormattedAnswer(f, values) ?? nullText ?? t("Answer Not Provided")
        });
      }
    }
  });

  return outputArr;
};
const getEntityPolygonData = (record: any, type?: EntityName, entity?: Entity) => {
  if (!record && !entity) {
    return null;
  }

  const uuid = entity?.entityUUID || record?.uuid;
  const entityType = entity?.entityName || (type as EntityName);
  if (entityType === "sites") {
    const { data: sitePolygonData } = useGetV2SitesSitePolygon({
      pathParams: {
        site: uuid
      }
    });
    return sitePolygonData ? parsePolygonData(sitePolygonData) : null;
  } else if (entityType === "projects" || entityType === "project-pitches") {
    const { data: projectPolygonData } = useGetV2TerrafundProjectPolygon({
      queryParams: {
        entityType: pluralEntityNameToSingular(entityType) ?? "",
        uuid: uuid ?? ""
      }
    });
    return projectPolygonData ? { [FORM_POLYGONS]: [projectPolygonData?.project_polygon?.poly_uuid] } : null;
  }

  return null;
};
const FormSummaryRow = ({ step, index, ...props }: FormSummaryRowProps) => {
  const t = useT();
  const entries = useGetFormEntries({ step, ...props });
  return (
    <Accordion
      variant="secondary"
      title={step.title}
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

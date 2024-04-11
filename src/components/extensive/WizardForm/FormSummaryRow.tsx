import { AccessorKeyColumnDef } from "@tanstack/react-table";
import { useT } from "@transifex/react";
import dynamic from "next/dynamic";
import { useMemo } from "react";
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
import { getWorkdaysTableColumns } from "@/components/elements/Inputs/DataTable/RHFWorkdaysTable";
import { TreeSpeciesValue } from "@/components/elements/Inputs/TreeSpeciesInput/TreeSpeciesInput";
import Text from "@/components/elements/Text/Text";
import { FormSummaryProps } from "@/components/extensive/WizardForm/FormSummary";
import { EntityName } from "@/types/common";

import List from "../List/List";
import { FieldType, FormStepSchema } from "./types";
import { getAnswer, getFormattedAnswer } from "./utils";

const Map = dynamic(() => import("@/components/elements/Map-mapbox/Map"), { ssr: false });

export interface FormSummaryRowProps extends FormSummaryProps {
  type?: EntityName;
  step: FormStepSchema;
  index: number;
  nullText?: string;
}

export const useGetFormEntries = (props: Omit<FormSummaryRowProps, "index">) => {
  const t = useT();
  return useMemo<any[]>(() => getFormEntries(props, t), [props, t]);
};

export const getFormEntries = (props: Omit<FormSummaryRowProps, "index">, t: typeof useT) => {
  const { step } = props;

  const outputArr: any[] = [];

  step.fields.forEach(f => {
    switch (f.type) {
      case FieldType.TreeSpecies:
      case FieldType.SeedingsTableInput: {
        //If it was tree species
        const value = getAnswer(f, props.values) as TreeSpeciesValue[] | null;
        outputArr.push({
          title: t("Total {label}", { label: f.label ?? "" }),
          value: value?.length ?? props.nullText ?? t("Answer Not Provided")
        });
        if (f.fieldProps.withNumbers) {
          //If tree species included numbers
          outputArr.push({
            title: t("Total {label} Count", { label: f.label ?? "" }),
            value: value?.reduce((t, v) => t + (v.amount || 0), 0) ?? props.nullText ?? t("Answer Not Provided")
          });
        }
        break;
      }

      case FieldType.Map: {
        outputArr.push({
          title: f.label,
          value: <Map geojson={props.values[f.name]} className="h-[240px] flex-1" hasControls={false} />
        });
        break;
      }

      case FieldType.InputTable: {
        outputArr.push({
          title: f.label,
          value: f.fieldProps.rows
            .map(row => `${row.label}: ${props.values[f.name]?.[row.name] ?? t("Answer Not Provided")}`)
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
      case FieldType.WorkdaysTable:
      case FieldType.SeedingsDataTable: {
        let headers: AccessorKeyColumnDef<any>[] = [];

        if (f.type === FieldType.LeadershipTeamDataTable) headers = getLeadershipTableColumns(t);
        else if (f.type === FieldType.OwnershipStakeDataTable) headers = getOwnershipTableColumns(t);
        else if (f.type === FieldType.FundingTypeDataTable) headers = getFundingTypeTableColumns(t);
        else if (f.type === FieldType.StrataDataTable) headers = getStrataTableColumns(t);
        else if (f.type === FieldType.DisturbanceDataTable) headers = getDisturbanceTableColumns(f.fieldProps, t);
        else if (f.type === FieldType.InvasiveDataTable) headers = getInvasiveTableColumns(t);
        else if (f.type === FieldType.WorkdaysTable)
          headers = getWorkdaysTableColumns(t, f.fieldProps.ethnicityOptions);
        else if (f.type === FieldType.SeedingsDataTable) headers = getSeedingTableColumns(t, f.fieldProps.captureCount);

        const values: string[] = [];
        props.values?.[f.name]?.forEach((entry: any) => {
          const row: (string | undefined)[] = [];

          Object.values(headers).forEach(h => {
            const value = entry[h.accessorKey];
            //@ts-ignore
            row.push(h.cell?.({ getValue: () => value }) || value);
          });
          values.push(row.join(", "));
        });

        outputArr.push({
          title: f.label,
          value: values.join("<br/>")
        });
        break;
      }

      case FieldType.Conditional: {
        outputArr.push({
          title: f.label ?? "",
          value: getFormattedAnswer(f, props.values) ?? props.nullText ?? t("Answer Not Provided")
        });
        const children = getFormEntries(
          {
            ...props,
            step: {
              ...props.step,
              fields: f.fieldProps.fields.filter(child => child.condition === props.values[f.name])
            }
          },
          t
        );
        outputArr.push(...children);
        break;
      }

      default: {
        outputArr.push({
          title: f.label ?? "",
          value: getFormattedAnswer(f, props.values) ?? props.nullText ?? t("Answer Not Provided")
        });
      }
    }
  });

  return outputArr;
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

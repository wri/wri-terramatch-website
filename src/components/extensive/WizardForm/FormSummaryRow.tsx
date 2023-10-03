import { AccessorKeyColumnDef } from "@tanstack/react-table";
import { useT } from "@transifex/react";
import dynamic from "next/dynamic";
import { useMemo } from "react";
import { Else, If, Then } from "react-if";

import Accordion from "@/components/elements/Accordion/Accordion";
import { getFundingTypeTableHeaders } from "@/components/elements/Inputs/DataTable/RHFFundingTypeDataTable";
import { getLeadershipTableHeaders } from "@/components/elements/Inputs/DataTable/RHFLeadershipTeamTable";
import { TreeSpeciesValue } from "@/components/elements/Inputs/TreeSpeciesInput/TreeSpeciesInput";
import Text from "@/components/elements/Text/Text";
import { FormSummaryProps } from "@/components/extensive/WizardForm/FormSummary";
import { getFundingTypesOptions } from "@/constants/options/fundingTypes";
import { getGenderTypes } from "@/constants/options/gender";
import { getOptionTitle } from "@/utils/options";

import List from "../List/List";
import { FieldType, FormStepSchema } from "./types";
import { getAnswer, getFormattedAnswer } from "./utils";

const Map = dynamic(() => import("@/components/elements/Map/Map"), { ssr: false });

export interface FormSummaryRowProps extends FormSummaryProps {
  step: FormStepSchema;
  index: number;
}

export const useGetFormEntries = (props: Omit<FormSummaryRowProps, "index">) => {
  const { step } = props;
  const t = useT();

  const output = useMemo<any[]>(() => {
    const outputArr: any[] = [];
    step.fields.forEach(f => {
      switch (f.type) {
        case FieldType.TreeSpecies: {
          //If it was tree species
          const value = getAnswer(f, props.values) as TreeSpeciesValue[] | null;
          outputArr.push({
            title: t("Total {label}", { label: f.label ?? "" }),
            value: value?.length || t("Answer Not Provided")
          });
          if (f.fieldProps.withNumbers) {
            //If tree species included numbers
            outputArr.push({
              title: t("Total {label} Count", { label: f.label ?? "" }),
              value: value?.reduce((t, v) => t + (v.amount || 0), 0) || t("Answer Not Provided")
            });
          }
          break;
        }

        case FieldType.Map: {
          outputArr.push({
            title: f.label,
            value: <Map id={f.name} t={t} geojson={props.values[f.name]} className="flex-1" height={240} />
          });
          break;
        }

        case FieldType.InputTable: {
          outputArr.push({
            title: f.label,
            value: f.fieldProps.rows.map(row => `${row.label}: ${props.values[f.name][row.name]}`).join("<br/>")
          });
          break;
        }

        case FieldType.LeadershipTeamDataTable:
        case FieldType.FundingTypeDataTable: {
          let headers: AccessorKeyColumnDef<any>[] = [];

          if (f.type === FieldType.LeadershipTeamDataTable) headers = getLeadershipTableHeaders(t);
          else headers = getFundingTypeTableHeaders(t);

          const values: string[] = [];
          props.values[f.name].forEach((entry: any) => {
            const row: (string | undefined)[] = [];

            Object.values(headers).forEach(h => {
              const value = entry[h.accessorKey];

              if (h.accessorKey === "gender") {
                row.push(getOptionTitle(value, getGenderTypes(t)));
              } else if (h.accessorKey === "type") {
                row.push(getOptionTitle(value, getFundingTypesOptions(t)));
              } else {
                row.push(entry[h.accessorKey]);
              }
            });
            values.push(row.join(", "));
          });

          outputArr.push({
            title: f.label,
            value: values.join("<br/>")
          });
          break;
        }

        default: {
          outputArr.push({
            title: f.label ?? "",
            value: getFormattedAnswer(f, props.values) || t("Answer Not Provided")
          });
        }
      }
    });

    return outputArr;
  }, [props.values, step.fields, t]);

  return output;
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
                  {entry.value}
                </Text>
              </Then>
              <Else>{entry.value}</Else>
            </If>
          </div>
        )}
      />
    </Accordion>
  );
};

export default FormSummaryRow;

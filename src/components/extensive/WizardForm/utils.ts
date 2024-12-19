import { AccessorKeyColumnDef } from "@tanstack/react-table";
import * as yup from "yup";

import { getDisturbanceTableColumns } from "@/components/elements/Inputs/DataTable/RHFDisturbanceTable";
import { getFundingTypeTableColumns } from "@/components/elements/Inputs/DataTable/RHFFundingTypeDataTable";
import { getInvasiveTableColumns } from "@/components/elements/Inputs/DataTable/RHFInvasiveTable";
import { getLeadershipTableColumns } from "@/components/elements/Inputs/DataTable/RHFLeadershipTeamTable";
import { getOwnershipTableColumns } from "@/components/elements/Inputs/DataTable/RHFOwnershipStakeTable";
import { getSeedingTableColumns } from "@/components/elements/Inputs/DataTable/RHFSeedingTable";
import { getStrataTableColumns } from "@/components/elements/Inputs/DataTable/RHFStrataTable";
import { TreeSpeciesValue } from "@/components/elements/Inputs/TreeSpeciesInput/TreeSpeciesInput";
import { FormRead } from "@/generated/apiSchemas";
import { UploadedFile } from "@/types/common";
import { toArray } from "@/utils/array";
import { CSVGenerator } from "@/utils/CsvGeneratorClass";

import { FieldType, FormField, FormStepSchema } from "./types";

export const getSchema = (fields: FormField[]) => {
  return yup.object(getSchemaFields(fields));
};

export const getSchemaFields = (fields: FormField[]) => {
  let schema: any = {};

  for (const field of fields) {
    if (field.type === FieldType.InputTable) {
      schema[field.name] = getSchema(field.fieldProps.rows);
    } else if (field.type === FieldType.Conditional) {
      schema[field.name] = field.validation.nullable().label(field.label);

      field.fieldProps.fields.forEach(child => {
        schema[child.name] = child.validation
          .when(field.name, {
            is: !!child.condition,
            then: schema => schema,
            otherwise: () => yup.mixed().nullable()
          })
          .nullable()
          .label(child.label || "");

        if (child.fieldProps.required) {
          schema[child.name] = schema[child.name].required();
        }
      });
    } else {
      schema[field.name] = field.validation?.nullable().label(" ");
    }

    if (field.fieldProps.required) schema[field.name] = schema[field.name].required();
  }

  return schema;
};

export const getAnswer = (
  field: FormField,
  values: any
): string | string[] | UploadedFile[] | TreeSpeciesValue[] | undefined => {
  const value = values?.[field.name];

  switch (field.type) {
    case FieldType.Input:
    case FieldType.TextArea:
    case FieldType.TreeSpecies:
    case FieldType.Conditional:
    case FieldType.SeedingsTableInput:
      return value;

    case FieldType.FileUpload:
      return toArray(value);

    case FieldType.Dropdown:
    case FieldType.Select:
    case FieldType.SelectImage: {
      const { options } = field.fieldProps;

      if (Array.isArray(value)) {
        return (value.map(v => options.find(o => o.value === v)?.title).filter(title => !!title) as string[]) || value;
      } else {
        return options.find(o => o.value === value)?.title || value;
      }
    }

    default:
      return undefined;
  }
};

export const getFormattedAnswer = (field: FormField, values: any): string | undefined => {
  const answer: any = getAnswer(field, values);
  let response;

  if (Array.isArray(answer) && field.type === FieldType.FileUpload) {
    response = answer
      .filter(file => !!file)
      ?.map(file => `<a href="${file.url}" target="_blank">${file.file_name}</a>`)
      .join(", ");
  } else if (Array.isArray(answer)) {
    response = answer.length > 0 ? answer.join(", ") : undefined;
  } else if (typeof answer === "boolean") {
    response = answer ? "Yes" : "No";
  } else {
    response = answer;
  }

  return response;
};

export const downloadAnswersCSV = (steps: FormStepSchema[], values: any) => {
  const csv = new CSVGenerator();
  csv.pushRow(["Question", "Answer"]);
  for (let step of steps) {
    for (let field of step.fields) {
      appendAnswersAsCSVRow(csv, field, values);
    }
  }
  csv.download("answers.csv");
};

const appendAnswersAsCSVRow = (csv: CSVGenerator, field: FormField, values: any) => {
  switch (field.type) {
    case FieldType.TreeSpecies: {
      const value = ((getAnswer(field, values) || []) as TreeSpeciesValue[]).filter(v => !!v);
      if (value.length > 0) {
        if (field.fieldProps.withNumbers) {
          csv.pushRow([field.label, "Species name", "Total Trees"]);
          value.forEach(v => {
            csv.pushRow(["", v.name, v.amount]);
          });
        } else {
          csv.pushRow([field.label, "Species name"]);
          value.forEach(v => {
            csv.pushRow(["", v.name]);
          });
        }
      }
      break;
    }
    case FieldType.FileUpload: {
      const value = ((getAnswer(field, values) || []) as UploadedFile[]).filter(v => !!v);
      if (value.length > 0) {
        csv.pushRow([field.label, "FileName", "File Url"]);

        value.forEach(v => {
          csv.pushRow(["", v?.title || v?.file_name || "", v.url]);
        });
      }
      break;
    }
    case FieldType.InputTable: {
      csv.pushRow([field.label, field.fieldProps.headers[0], field.fieldProps.headers[1]]);

      field.fieldProps.rows.forEach(row => {
        csv.pushRow(["", row.label, values[row.name]]);
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
    case FieldType.RestorationPartnersTable:
    case FieldType.SeedingsDataTable: {
      let headers: AccessorKeyColumnDef<any>[] = [];

      if (field.type === FieldType.LeadershipTeamDataTable) headers = getLeadershipTableColumns();
      else if (field.type === FieldType.OwnershipStakeDataTable) headers = getOwnershipTableColumns();
      else if (field.type === FieldType.FundingTypeDataTable) headers = getFundingTypeTableColumns();
      else if (field.type === FieldType.StrataDataTable) headers = getStrataTableColumns();
      else if (field.type === FieldType.DisturbanceDataTable) headers = getDisturbanceTableColumns(field.fieldProps);
      else if (field.type === FieldType.InvasiveDataTable) headers = getInvasiveTableColumns();
      else if (field.type === FieldType.SeedingsDataTable)
        headers = getSeedingTableColumns(undefined, field.fieldProps.captureCount);

      csv.pushRow([field.label, ...headers.map(h => h.header! as string)]);

      values[field.name].forEach((entry: any) => {
        const row: (string | undefined)[] = [""];
        Object.values(headers).forEach(h => {
          const value = entry[h.accessorKey];
          //@ts-ignore
          row.push(h.cell?.({ getValue: () => value }) || value);
        });
        csv.pushRow(row);
      });

      break;
    }

    case FieldType.Conditional: {
      csv.pushRow([field.label, getFormattedAnswer(field, values)]);
      field.fieldProps.fields
        .filter(child => child.condition === values[field.name])
        .forEach(field => appendAnswersAsCSVRow(csv, field, values));
      break;
    }

    default: {
      csv.pushRow([field.label, getFormattedAnswer(field, values)]);
    }
  }

  return csv;
};

/**
 * Get requested information form based on fields requested.
 * @param form
 * @param requestedInfoFields
 * @returns Form to be used in getCustomFormSteps params
 */
export const getRequestedInformationForm = (form: FormRead, requestedInfoFields: string[]): FormRead => {
  const form_sections = form.form_sections
    ?.map(s => {
      const newQuestions = s?.form_questions
        ?.map(q => {
          // TODO - To update this logic, needs BED change.
          // The way we are selecting fields are unreliable since it's searching for label and it can lead to having two result!!
          if (q.label && !requestedInfoFields.includes(q.label)) return;
          return q;
        })
        .filter(Boolean);

      return {
        ...s,
        form_questions: newQuestions
      };
    })
    .filter(s => s?.form_questions && s.form_questions.length > 0);

  return { ...form, form_sections } as FormRead;
};

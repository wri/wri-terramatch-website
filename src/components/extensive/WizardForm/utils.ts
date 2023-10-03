import { AccessorKeyColumnDef } from "@tanstack/react-table";
import * as yup from "yup";

import { getFundingTypeTableHeaders } from "@/components/elements/Inputs/DataTable/RHFFundingTypeDataTable";
import { getLeadershipTableHeaders } from "@/components/elements/Inputs/DataTable/RHFLeadershipTeamTable";
import { TreeSpeciesValue } from "@/components/elements/Inputs/TreeSpeciesInput/TreeSpeciesInput";
import { FormRead } from "@/generated/apiSchemas";
import { UploadedFile } from "@/types/common";
import { toArray } from "@/utils/array";
import { CSVGenerator } from "@/utils/csvGenerator";

import { FieldType, FormField, FormStepSchema } from "./types";

export const getSchema = (fields: FormField[]) => {
  let schema: { [index: string]: yup.AnySchema } = {};
  for (const field of fields) {
    if (field.type === FieldType.InputTable) {
      schema[field.name] = getSchema(field.fieldProps.rows);
    } else {
      if (field.label) {
        schema[field.name] = field.validation.nullable(true).label(field.label);
      } else {
        schema[field.name] = field.validation.nullable(true);
      }
    }
  }

  return yup.object(schema);
};

export const getStepIndexByValues = (values: any, steps: FormStepSchema[], skipValueCheck?: boolean) => {
  let currentStepIndex = -1;

  for (const step of steps) {
    currentStepIndex++;

    if (!getSchema(step.fields).isValidSync(values)) {
      return currentStepIndex;
    } else if (!skipValueCheck) {
      for (const field of step.fields) {
        if (!values[field.name]) {
          return currentStepIndex;
        }
      }
    }
  }
  return currentStepIndex;
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
        case FieldType.FundingTypeDataTable: {
          let headers: AccessorKeyColumnDef<any>[] = [];

          if (field.type === FieldType.LeadershipTeamDataTable) {
            headers = getLeadershipTableHeaders();
          } else {
            headers = getFundingTypeTableHeaders();
          }

          csv.pushRow([field.label, ...headers.map(h => h.header! as string)]);

          values[field.name].forEach((entry: any) => {
            const row: (string | undefined)[] = [""];
            Object.values(headers).forEach(h => {
              row.push(entry[h.accessorKey]);
            });
            csv.pushRow(row);
          });

          break;
        }

        default: {
          csv.pushRow([field.label, getFormattedAnswer(field, values)]);
        }
      }
    }
  }

  csv.download("answers.csv");
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

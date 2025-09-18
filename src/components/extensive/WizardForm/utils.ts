import { AccessorKeyColumnDef } from "@tanstack/react-table";
import { useT } from "@transifex/react";
import { Dictionary, isEmpty } from "lodash";
import * as yup from "yup";
import { AnySchema } from "yup";

import { getDisturbanceTableColumns } from "@/components/elements/Inputs/DataTable/RHFDisturbanceTable";
import { getFundingTypeTableColumns } from "@/components/elements/Inputs/DataTable/RHFFundingTypeDataTable";
import { getInvasiveTableColumns } from "@/components/elements/Inputs/DataTable/RHFInvasiveTable";
import { getLeadershipsTableColumns } from "@/components/elements/Inputs/DataTable/RHFLeadershipsTable";
import { getOwnershipTableColumns } from "@/components/elements/Inputs/DataTable/RHFOwnershipStakeTable";
import { getSeedingTableColumns } from "@/components/elements/Inputs/DataTable/RHFSeedingTable";
import { getStrataTableColumns } from "@/components/elements/Inputs/DataTable/RHFStrataTable";
import { TreeSpeciesValue } from "@/components/elements/Inputs/TreeSpeciesInput/TreeSpeciesInput";
import { FormFieldFactories } from "@/components/extensive/WizardForm/fields";
import { FormQuestionContextType } from "@/components/extensive/WizardForm/formQuestions.provider";
import { QuestionDefinition } from "@/components/extensive/WizardForm/types";
import { findCachedGadmTitle, loadGadmCodes } from "@/connections/Gadm";
import { selectChildQuestions } from "@/connections/util/Form";
import { Framework } from "@/context/framework.provider";
import { FormRead } from "@/generated/apiSchemas";
import { FormQuestionDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { SELECT_FILTER_QUESTION } from "@/helpers/customForms";
import { UploadedFile } from "@/types/common";
import { toArray } from "@/utils/array";
import { CSVGenerator } from "@/utils/CsvGeneratorClass";

export const getSchema = (
  questions: QuestionDefinition[],
  t: typeof useT,
  framework: Framework = Framework.UNDEFINED
) => {
  return yup.object(getSchemaFields(questions, t, framework));
};

export const questionDtoToDefinition = (question: FormQuestionDto): QuestionDefinition => ({
  ...question,
  name: question.uuid
});

const getSchemaFields = (questions: QuestionDefinition[], t: typeof useT, framework: Framework) => {
  let schema: Dictionary<AnySchema> = {};

  for (const question of questions) {
    if (question.inputType === "tableInput") {
      schema[question.name] = getSchema(selectChildQuestions(question.name).map(questionDtoToDefinition), t, framework);
    } else if (question.inputType === "conditional") {
      schema[question.name] = FormFieldFactories[question.inputType]
        .createValidator(question, t, framework)!
        .nullable()
        .label(question.label);
      for (const child of selectChildQuestions(question.name)) {
        const childValidation = FormFieldFactories[child.inputType].createValidator(child, t, framework);
        if (childValidation != null) {
          schema[child.uuid] = childValidation
            .when(question.name, {
              is: child.showOnParentCondition === true,
              then: schema => schema,
              otherwise: () => yup.mixed().nullable()
            })
            .nullable()
            .lable(child.label ?? "");

          if (child.validation?.required === true) {
            schema[child.uuid] = schema[child.uuid].required();
          }
        }
      }
    } else {
      const validation = FormFieldFactories[question.inputType].createValidator(question, t, framework) ?? yup.mixed();
      schema[question.name] = validation.nullable().label(question.label ?? "");
    }

    if (question.validation?.required === true && schema[question.name] != null) {
      schema[question.name] = schema[question.name].required();
    }
  }

  return schema;
};

/**
 * Some form answers require data from external sources to be able to display the title associated
 * with the value in the form field (currently just GADM codes). This method goes through the given
 * set of form fields and caches all data that will be needed by synchronous methods like getAnswer()
 */
export const loadExternalAnswerSources = async (
  questions: FormQuestionDto[],
  values: Dictionary<any>,
  formQuestionContext: FormQuestionContextType
) => {
  const promises: Promise<unknown>[] = [];

  for (const question of questions) {
    if (question.inputType === "conditional") {
      const children = formQuestionContext
        .childQuestions(question.uuid)
        .filter(({ showOnParentCondition }) => showOnParentCondition === values[question.uuid]);
      promises.push(loadExternalAnswerSources(children, values, formQuestionContext));
    } else if (question.inputType === "select") {
      if (!question.optionsList?.startsWith("gadm-level-")) continue;

      const level = Number(question.optionsList.slice(-1)) as 0 | 1 | 2;
      if (level === 0) {
        promises.push(loadGadmCodes({ level }));
      } else {
        const filterField = SELECT_FILTER_QUESTION[question.linkedFieldKey ?? ""];
        if (filterField != null) {
          const parentCodes = toArray(
            values?.[formQuestionContext.linkedFieldQuestion(filterField)?.uuid ?? ""] ?? []
          ) as string[];
          if (!isEmpty(parentCodes)) {
            promises.push(loadGadmCodes({ level, parentCodes }));
          }
        }
      }
    }
  }

  await Promise.all(promises);
};

type Answer = string | string[] | boolean | UploadedFile[] | TreeSpeciesValue[] | undefined;

export const getAnswer = (question: FormQuestionDto, values: any): Answer => {
  const value = values?.[question.uuid];

  switch (question.inputType) {
    case "text":
    case "url":
    case "number":
    case "number-percentage":
    case "date":
    case "long-text":
    case "treeSpecies":
    case "conditional":
    case "boolean":
    case "seedings":
      return value;

    case "file":
      return toArray(value);

    case "select": {
      const { options, apiOptionsSource, optionsFilterFieldName } = field.fieldProps;
      if (options == null) {
        if (!apiOptionsSource?.startsWith("gadm-level-")) return value;

        // Pull titles for our values from the data api cache. If the title isn't found, return
        // the base value.
        const dropdownValues = toArray(value) as string[];
        return dropdownValues.map(value => {
          const level = Number(apiOptionsSource.slice(-1)) as 0 | 1 | 2;
          if (level === 0) return findCachedGadmTitle(level, value) ?? value;

          if (optionsFilterFieldName == null) return value;
          const parentCodes = toArray(values?.[optionsFilterFieldName]) as string[];
          return findCachedGadmTitle(level, value, parentCodes) ?? value;
        });
      }

      // Fall through to the default case.
    }
    // eslint-disable-next-line no-fallthrough
    case "radio":
    case "select-image": {
      const { options } = field.fieldProps;

      if (Array.isArray(value)) {
        return (value.map(v => options.find(o => o.value === v)?.title).filter(title => !!title) as string[]) ?? value;
      } else {
        return options.find(o => o.value === value)?.title ?? value;
      }
    }

    case "strategy-area": {
      const { options } = field.fieldProps;
      const parsedValue: { [key: string]: number }[] = JSON.parse(value);

      if (Array.isArray(parsedValue)) {
        const formatted = parsedValue
          .filter(entry => {
            const key = Object.keys(entry)[0];
            const percent = entry[key];
            return key && percent !== null && percent !== undefined && !isNaN(percent);
          })
          .map(entry => {
            const key = Object.keys(entry)[0];
            const percent = entry[key];
            const title = options.find(o => o.value === key)?.title || key;

            return percent ? `${title} (${percent}%)` : `${title} (${percent})`;
          });

        return formatted;
      }

      return value;
    }

    default:
      return undefined;
  }
};

export const getFormattedAnswer = (question: FormQuestionDto, values: Dictionary<any>): string | undefined => {
  const answer = getAnswer(question, values);

  if (Array.isArray(answer) && question.inputType === "file") {
    return (answer as UploadedFile[])
      .filter(file => !!file)
      ?.map(file => `<a href="${file.url}" target="_blank">${file.file_name}</a>`)
      .join(", ");
  } else if (Array.isArray(answer)) {
    return answer.length > 0 ? answer.join(", ") : undefined;
  } else if (typeof answer === "boolean") {
    return answer ? "Yes" : "No";
  } else {
    return answer;
  }
};

export const downloadAnswersCSV = (questions: FormQuestionDto[], values: Dictionary<any>) => {
  const csv = new CSVGenerator();
  csv.pushRow(["Question", "Answer"]);
  for (const question of questions) {
    appendAnswersAsCSVRow(csv, question, values);
  }
  csv.download("answers.csv");
};

const appendAnswersAsCSVRow = (csv: CSVGenerator, question: FormQuestionDto, values: Dictionary<any>) => {
  switch (question.inputType) {
    case "treeSpecies": {
      const value = ((getAnswer(question, values) ?? []) as TreeSpeciesValue[]).filter(v => !!v);
      if (value.length > 0) {
        if (question.additionalProps?.with_numbers === true) {
          csv.pushRow([question.label, "Species name", "Total Trees"]);
          value.forEach(v => {
            csv.pushRow(["", v.name, v.amount]);
          });
        } else {
          csv.pushRow([question.label, "Species name"]);
          value.forEach(v => {
            csv.pushRow(["", v.name]);
          });
        }
      }
      break;
    }
    case "file": {
      const value = ((getAnswer(question, values) || []) as UploadedFile[]).filter(v => !!v);
      if (value.length > 0) {
        csv.pushRow([question.label, "FileName", "File Url"]);

        value.forEach(v => {
          csv.pushRow(["", v?.title || v?.file_name || "", v.url]);
        });
      }
      break;
    }
    case "tableInput": {
      csv.pushRow([
        question.label,
        question.tableHeaders?.[0]?.label ?? undefined,
        question.tableHeaders?.[1]?.label ?? undefined
      ]);

      field.fieldProps.rows.forEach(row => {
        csv.pushRow(["", row.label, values[row.name]]);
      });
      break;
    }

    case "leaderships":
    case "ownershipStake":
    case "fundingType":
    case "stratas":
    case "disturbances":
    case "invasive":
    case "workdays":
    case "restorationPartners":
    case "jobs":
    case "volunteers":
    case "allBeneficiaries":
    case "trainingBeneficiaries":
    case "indirectBeneficiaries":
    case "employees":
    case "associates":
    case "seedings": {
      let headers: AccessorKeyColumnDef<any>[] = [];

      if (question.inputType === "leaderships") headers = getLeadershipsTableColumns();
      else if (question.inputType === "ownershipStake") headers = getOwnershipTableColumns();
      else if (question.inputType === "fundingType") headers = getFundingTypeTableColumns();
      else if (question.inputType === "stratas") headers = getStrataTableColumns();
      else if (question.inputType === "disturbances") headers = getDisturbanceTableColumns(field.fieldProps);
      else if (question.inputType === "invasive") headers = getInvasiveTableColumns();
      else if (question.inputType === "seedings")
        headers = getSeedingTableColumns(undefined, field.fieldProps.captureCount);

      csv.pushRow([question.label, ...headers.map(h => h.header! as string)]);

      values[question.uuid].forEach((entry: any) => {
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

    case "conditional": {
      csv.pushRow([question.label, getFormattedAnswer(question, values)]);
      question.fieldProps.fields
        .filter(child => child.condition === values[question.uuid])
        .forEach(field => appendAnswersAsCSVRow(csv, field, values));
      break;
    }

    default: {
      csv.pushRow([question.label, getFormattedAnswer(question, values)]);
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

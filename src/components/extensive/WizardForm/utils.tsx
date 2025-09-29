import { AccessorKeyColumnDef } from "@tanstack/react-table";
import { useT } from "@transifex/react";
import { Dictionary, isEmpty, isFunction } from "lodash";
import { useMemo } from "react";
import * as yup from "yup";
import { AnySchema } from "yup";

import { TreeSpeciesValue } from "@/components/elements/Inputs/TreeSpeciesInput/TreeSpeciesInput";
import TreeSpeciesTable, { PlantData } from "@/components/extensive/Tables/TreeSpeciesTable";
import { FormFieldFactories } from "@/components/extensive/WizardForm/fields";
import { Answer, FieldDefinition } from "@/components/extensive/WizardForm/types";
import { SupportedEntity } from "@/connections/EntityAssociation";
import { loadGadmCodes } from "@/connections/Gadm";
import { selectChildQuestions } from "@/connections/util/Form";
import { getMonthOptions } from "@/constants/options/months";
import { Framework } from "@/context/framework.provider";
import { FormFieldsProvider, useFieldsProvider } from "@/context/wizardForm.provider";
import { FormQuestionDto, FormQuestionOptionDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { SELECT_FILTER_QUESTION } from "@/helpers/customForms";
import { v3Entity } from "@/helpers/entity";
import { Entity, Option, UploadedFile } from "@/types/common";
import { toArray } from "@/utils/array";
import { CSVGenerator } from "@/utils/CsvGeneratorClass";

export const getSchema = (fields: FieldDefinition[], t: typeof useT, framework: Framework = Framework.UNDEFINED) => {
  return yup.object(getSchemaFields(fields, t, framework));
};

export const questionDtoToDefinition = (question: FormQuestionDto): FieldDefinition => ({
  ...question,
  name: question.uuid
});

const isDtoOption = (option: FormQuestionOptionDto | Option): option is FormQuestionOptionDto =>
  (option as FormQuestionOptionDto).slug != null;

export const toFormOptions = (options?: FormQuestionOptionDto[] | Option[] | null) =>
  (options ?? []).map(option =>
    isDtoOption(option)
      ? {
          title: option.label,
          value: option.slug,
          meta: {
            image_url: option.imageUrl,
            image: option.thumbUrl == null ? null : { thumb_url: option.thumbUrl }
          }
        }
      : option
  );

export const getHardcodedOptions = (optionsList: string, t?: typeof useT) => {
  // We currently only support "months" for this feature
  if (optionsList === "months") return getMonthOptions(t);
  return [];
};

export const useFilterFieldName = (linkedFieldKey?: string) => {
  const { fieldByKey } = useFieldsProvider();
  return useMemo(
    () => fieldByKey(SELECT_FILTER_QUESTION[linkedFieldKey ?? ""] ?? "")?.name,
    [fieldByKey, linkedFieldKey]
  );
};

const selectChildDefinitions = (parentId: string) => selectChildQuestions(parentId).map(questionDtoToDefinition);

const getSchemaFields = (fields: FieldDefinition[], t: typeof useT, framework: Framework) => {
  let schema: Dictionary<AnySchema> = {};

  for (const field of fields) {
    if (field.inputType === "tableInput") {
      schema[field.name] = getSchema(selectChildDefinitions(field.name), t, framework);
    } else if (field.inputType === "conditional") {
      schema[field.name] = FormFieldFactories[field.inputType]
        .createValidator(field, t, framework)!
        .nullable()
        .label(field.label);
      for (const child of selectChildDefinitions(field.name)) {
        const childValidation = FormFieldFactories[child.inputType].createValidator(child, t, framework);
        if (childValidation != null) {
          schema[child.name] = childValidation
            .when(field.name, {
              is: child.showOnParentCondition === true,
              then: schema => schema,
              otherwise: () => yup.mixed().nullable()
            })
            .nullable()
            .lable(child.label ?? "");

          if (child.validation?.required === true) {
            schema[child.name] = schema[child.name].required();
          }
        }
      }
    } else {
      const validation = FormFieldFactories[field.inputType].createValidator(field, t, framework) ?? yup.mixed();
      schema[field.name] = validation.nullable().label(field.label ?? "");
    }

    if (field.validation?.required === true && schema[field.name] != null) {
      schema[field.name] = schema[field.name].required();
    }
  }

  return schema;
};

export const childIdsWithCondition = (fieldId: string, condition: boolean, fieldsProvider: FormFieldsProvider) =>
  (
    fieldsProvider
      .childIds(fieldId)
      .map(childId => fieldsProvider.fieldById(childId))
      .filter(child => child != null && child.showOnParentCondition === condition) as FieldDefinition[]
  ).map(({ name }) => name);

/**
 * Some form answers require data from external sources to be able to display the title associated
 * with the value in the form field (currently just GADM codes). This method goes through the given
 * set of form fields and caches all data that will be needed by synchronous methods like getAnswer()
 */
export const loadExternalAnswerSources = async (
  fieldIds: string[],
  values: Dictionary<any>,
  fieldsProvider: FormFieldsProvider
) => {
  const promises: Promise<unknown>[] = [];

  for (const fieldId of fieldIds) {
    const field = fieldsProvider.fieldById(fieldId);
    if (field == null) continue;

    if (field.inputType === "conditional") {
      promises.push(
        loadExternalAnswerSources(
          childIdsWithCondition(fieldId, values[fieldId], fieldsProvider),
          values,
          fieldsProvider
        )
      );
    } else if (field.inputType === "select") {
      if (!field.optionsList?.startsWith("gadm-level-")) continue;

      const level = Number(field.optionsList.slice(-1)) as 0 | 1 | 2;
      if (level === 0) {
        promises.push(loadGadmCodes({ level }));
      } else {
        const filterField = SELECT_FILTER_QUESTION[field.linkedFieldKey ?? ""];
        if (filterField != null) {
          const parentCodes = toArray(values?.[fieldsProvider.fieldByKey(filterField)?.name ?? ""] ?? []) as string[];
          if (!isEmpty(parentCodes)) {
            promises.push(loadGadmCodes({ level, parentCodes }));
          }
        }
      }
    }
  }

  await Promise.all(promises);
};

export const getAnswer = (
  field: FieldDefinition,
  values: Dictionary<any>,
  fieldsProvider: FormFieldsProvider
): Answer => {
  const { getAnswer } = FormFieldFactories[field.inputType];
  return getAnswer == null ? (values[field.name] as Answer) : getAnswer(field, values, fieldsProvider);
};

export const getFormattedAnswer = (
  field: FieldDefinition,
  values: Dictionary<any>,
  fieldsProvider: FormFieldsProvider
): string | undefined => {
  const answer = getAnswer(field, values, fieldsProvider);

  if (Array.isArray(answer) && field.inputType === "file") {
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

export const downloadAnswersCSV = (fieldsProvider: FormFieldsProvider, values: Dictionary<any>) => {
  const csv = new CSVGenerator();
  csv.pushRow(["Question", "Answer"]);
  for (const stepId of fieldsProvider.stepIds()) {
    for (const fieldId of fieldsProvider.fieldIds(stepId)) {
      const field = fieldsProvider.fieldById(fieldId);
      if (field != null) appendAnswersAsCSVRow(csv, field, values, fieldsProvider);
    }
  }
  csv.download("answers.csv");
};

export const appendTableAnswers = (
  csv: CSVGenerator,
  label: string,
  headers: AccessorKeyColumnDef<any, unknown>[],
  entries: any[]
) => {
  csv.pushRow([label, ...headers.map(h => h.header! as string)]);
  entries.forEach((entry: any) => {
    csv.pushRow(
      Object.values(headers).reduce(
        (row, header) => {
          const value = entry[header.accessorKey];
          const cellValue = isFunction(header.cell) ? header.cell({ getValue: () => value }) : undefined;
          return [...row, cellValue ?? value];
        },
        [""]
      )
    );
  });
};

export const appendAnswersAsCSVRow = (
  csv: CSVGenerator,
  field: FieldDefinition,
  values: Dictionary<any>,
  fieldsProvider: FormFieldsProvider
) => {
  const { appendAnswers } = FormFieldFactories[field.inputType];
  if (appendAnswers == null) {
    csv.pushRow([field.label, getFormattedAnswer(field, values, fieldsProvider)]);
  } else {
    appendAnswers(field, csv, values, fieldsProvider);
  }
};

export const treeSpeciesEntryValue = (
  collection: string | undefined,
  entity: Entity | undefined,
  field: FieldDefinition,
  values: any,
  fieldsProvider: FormFieldsProvider
) => {
  const value = (getAnswer(field, values, fieldsProvider) ?? []) as TreeSpeciesValue[];
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
  return (
    <TreeSpeciesTable {...{ plants, collection, tableType }} entity={supportedEntity} entityUuid={entity?.entityUUID} />
  );
};

export const dataTableEntryValue = (headers: AccessorKeyColumnDef<any>[], field: FieldDefinition, values: any) => {
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

  return stringValues.join("<br/>");
};

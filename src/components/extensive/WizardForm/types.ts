import { useT } from "@transifex/react";
import { Dictionary } from "lodash";
import { ReactElement } from "react";
import { Control, FieldError, UseFormReturn } from "react-hook-form";
import { AnySchema } from "yup";

import { AdditionalOptionsProps } from "@/admin/modules/form/components/FormBuilder/AdditionalOptions";
import { FormQuestionField } from "@/admin/modules/form/components/FormBuilder/QuestionArrayInput";
import { TreeSpeciesValue } from "@/components/elements/Inputs/TreeSpeciesInput/TreeSpeciesInput";
import { BBox } from "@/components/elements/Map-mapbox/GeoJSON";
import { Framework } from "@/context/framework.provider";
import { FormFieldsProvider } from "@/context/wizardForm.provider";
import { FormQuestionDto, FormQuestionOptionDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { Entity, EntityName, Option, UploadedFile } from "@/types/common";
import { CSVGenerator } from "@/utils/CsvGeneratorClass";

export type FieldInputType =
  | FormQuestionDto["inputType"]
  // "tel" is only used in FE hardcoded forms, and cannot be selected as a type in FormBuilder
  | "tel"
  // "empty" is a placeholder used in the FormBuilder for a new question that hasn't selected a
  // linked field key yet.
  | "empty";

export type StepDefinition = {
  id: string;
  title?: string | null;
  description?: string | null;
};

export type TableHeader = {
  label: string | null;
  order: number | null;
};

export type FieldDefinition = {
  inputType: FieldInputType;
  // Functions as the ID for form fields. When the fields come from the API, this is also the UUID.
  name: string;
  label: string;
  placeholder?: string | null;
  description?: string | null;
  validation?: Dictionary<any> | null;
  multiChoice?: boolean;
  collection?: string | null;
  optionsList?: string | null;
  optionsOther?: boolean | null;
  options?: FormQuestionOptionDto[] | Option[] | null;
  showOnParentCondition?: boolean | null;
  linkedFieldKey?: string | null;
  isParentConditionalDefault?: boolean;
  minCharacterLimit?: number | null;
  maxCharacterLimit?: number | null;
  years?: number[] | null;
  tableHeaders?: TableHeader[] | null;
  additionalProps?: Dictionary<any> | null;
  model?: FormQuestionDto["model"];
};

export type SharedFieldProps = {
  error: FieldError;
  name: string;
  label: string;
  required: boolean;
  placeholder: string | undefined;
  description: string | undefined;
  formHook: UseFormReturn;
  control: Control;
  onChangeCapture: () => void;
  feedbackRequired: boolean;
};

export type GetEntryValueProps = {
  fieldsProvider: FormFieldsProvider;
  t: typeof useT;
  entity?: Entity;
  type?: EntityName;
  entityPolygonData?: Dictionary<string[]>;
  bbox?: BBox;
  mapFunctions?: any;
  record?: any;
};

export type FormFieldFactory = {
  /**
   * Creates a Yup validations schema for this field definition.
   */
  createValidator: (field: FieldDefinition, t: typeof useT, framework: Framework) => AnySchema | undefined;

  /**
   * Renders the form field as a form input.
   */
  renderInput: (field: FieldDefinition, sharedProps: SharedFieldProps) => ReactElement;

  /**
   * Return the Answer value for this field. The default is to simply return the form value at this field's id
   *
   * Note: this means that if a field should explicitly provide _no_ answer, it must define this method and
   * return undefined.
   */
  getAnswer?: (field: FieldDefinition, formValues: Dictionary<any>, fieldsProvider: FormFieldsProvider) => Answer;

  /**
   * Appends the answers for this field to the provided CSV generator. The default is to append
   * one row with the field label and the value from getFormattedAnswer.
   *
   * Note: this means that if a field should explicitly _not_ add rows to the CSV, it must define
   * this method and NOOP.
   */
  appendAnswers?: (
    field: FieldDefinition,
    csv: CSVGenerator,
    formValues: Dictionary<any>,
    fieldsProvider: FormFieldsProvider
  ) => void;

  /**
   * Generate a FormEntry value for the given field with the given values and supplementary information.
   * The default uses `getFormattedAnswer`.
   */
  getEntryValue?: (field: FieldDefinition, formValues: Dictionary<any>, additional: GetEntryValueProps) => any;

  /**
   * Using the current values in the given dictionary, set the correct default value for this field.
   * Default is to NOOP
   */
  defaultValue?: (
    field: FieldDefinition,
    formValues: Dictionary<any>,
    fieldsProvider: FormFieldsProvider
  ) => Dictionary<any>;

  /**
   * Normalize the value that was provided in the form input so that it can be sent to the server
   * in the correct format. Default is to NOOP.
   */
  normalizeValue?: (
    field: FieldDefinition,
    formValues: Dictionary<any>,
    fieldsProvider: FormFieldsProvider
  ) => Dictionary<any>;

  formBuilderAdditionalOptions?: (props: AdditionalOptionsProps) => ReactElement;

  formBuilderDefaults?: (linkedField: FormQuestionField) => Partial<FieldDefinition>;
};

export type Answer = string | string[] | boolean | UploadedFile[] | TreeSpeciesValue[] | undefined;

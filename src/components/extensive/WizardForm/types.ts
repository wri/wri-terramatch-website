/* eslint-disable no-unused-vars */
import { UseControllerProps } from "react-hook-form";
import { AnySchema } from "yup";

import { RHFCoreTeamLeadersTableProps } from "@/components/elements/Inputs/DataTable/RHFCoreTeamLeadersTable";
import { RHFDataTableProps } from "@/components/elements/Inputs/DataTable/RHFDataTable";
import { RHFFundingTypeTableProps } from "@/components/elements/Inputs/DataTable/RHFFundingTypeDataTable";
import { RHFLeadershipTeamTableProps } from "@/components/elements/Inputs/DataTable/RHFLeadershipTeamTable";
import { RHFDropdownProps } from "@/components/elements/Inputs/Dropdown/RHFDropdown";
import { RHFFileInputProps } from "@/components/elements/Inputs/FileInput/RHFFileInput";
import { InputProps } from "@/components/elements/Inputs/Input/Input";
import { RHFInputTableProps } from "@/components/elements/Inputs/InputTable/RHFInputTable";
import { RHFMapProps } from "@/components/elements/Inputs/Map/RHFMap";
import { RHFSelectProps } from "@/components/elements/Inputs/Select/RHFSelect";
import { RHFSelectImageProps } from "@/components/elements/Inputs/SelectImage/RHFSelectImage";
import { TextAreaProps } from "@/components/elements/Inputs/textArea/TextArea";
import { RHFTreeSpeciesInputProps } from "@/components/elements/Inputs/TreeSpeciesInput/RHFTreeSpeciesInput";

export interface FormStepSchema {
  title: string;
  fields: FormField[];
  tabTitle?: string;
  subtitle?: string;
}
interface FormFieldBase {
  name: string;
  validation: AnySchema;
  label?: string;
  description?: string;
  placeholder?: string;
}

type FieldProps<T> = Omit<T, "label" | "description" | "placeholder" | "name">;

type FieldTypeBuilder<U, T> = FormFieldBase & {
  type: U;
  fieldProps: FieldProps<T>;
};

export enum FieldType {
  Input = "input",
  TextArea = "textArea",
  Dropdown = "dropdown",
  Select = "Select",
  FileUpload = "file",
  TreeSpecies = "treeSpecies",
  DataTable = "dataTable",
  LeadershipTeamDataTable = "leadershipTeamDataTable",
  CoreTeamLeadersDataTable = "coreTeamLeadersDataTable",
  FundingTypeDataTable = "fundingTypeDataTable",
  InputTable = "inputTable",
  SelectImage = "selectImage",
  Map = "map"
}

export type InputFormField = FieldTypeBuilder<FieldType.Input, InputProps>;

export type FormField =
  | InputFormField
  | FieldTypeBuilder<FieldType.TextArea, TextAreaProps>
  | FieldTypeBuilder<
      FieldType.Dropdown,
      Omit<RHFDropdownProps, "formHook" | "onChangeCapture" | keyof UseControllerProps>
    >
  | FieldTypeBuilder<FieldType.Select, Omit<RHFSelectProps, "formHook" | "onChangeCapture" | keyof UseControllerProps>>
  | FieldTypeBuilder<
      FieldType.FileUpload,
      Omit<RHFFileInputProps, "formHook" | "onChangeCapture" | keyof UseControllerProps>
    >
  | FieldTypeBuilder<
      FieldType.TreeSpecies,
      Omit<RHFTreeSpeciesInputProps, "formHook" | "onChangeCapture" | keyof UseControllerProps>
    >
  | FieldTypeBuilder<FieldType.DataTable, Omit<RHFDataTableProps, "onChangeCapture" | keyof UseControllerProps>>
  | FieldTypeBuilder<
      FieldType.LeadershipTeamDataTable,
      Omit<RHFLeadershipTeamTableProps, "onChangeCapture" | keyof UseControllerProps>
    >
  | FieldTypeBuilder<
      FieldType.CoreTeamLeadersDataTable,
      Omit<RHFCoreTeamLeadersTableProps, "onChangeCapture" | keyof UseControllerProps>
    >
  | FieldTypeBuilder<
      FieldType.FundingTypeDataTable,
      Omit<RHFFundingTypeTableProps, "onChangeCapture" | keyof UseControllerProps>
    >
  | FieldTypeBuilder<
      FieldType.InputTable,
      Omit<RHFInputTableProps, "formHook" | "onChangeCapture" | "errors" | "error" | keyof UseControllerProps>
    >
  | FieldTypeBuilder<
      FieldType.SelectImage,
      Omit<RHFSelectImageProps, "formHook" | "onChangeCapture" | keyof UseControllerProps>
    >
  | FieldTypeBuilder<FieldType.Map, Omit<RHFMapProps, "formHook" | "onChangeCapture" | keyof UseControllerProps>>;

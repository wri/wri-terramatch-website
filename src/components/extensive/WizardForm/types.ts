/* eslint-disable no-unused-vars */
import { UseControllerProps } from "react-hook-form";
import { AnySchema } from "yup";

import { BooleanInputProps } from "@/components/elements/Inputs/BooleanInput/BooleanInput";
import { ConditionalInputProps } from "@/components/elements/Inputs/ConditionalInput/ConditionalInput";
import { RHFCoreTeamLeadersTableProps } from "@/components/elements/Inputs/DataTable/RHFCoreTeamLeadersTable";
import { RHFDataTableProps } from "@/components/elements/Inputs/DataTable/RHFDataTable";
import { RHFDisturbanceTableProps } from "@/components/elements/Inputs/DataTable/RHFDisturbanceTable";
import { RHFFundingTypeTableProps } from "@/components/elements/Inputs/DataTable/RHFFundingTypeDataTable";
import { RHFInvasiveTableProps } from "@/components/elements/Inputs/DataTable/RHFInvasiveTable";
import { RHFLeadershipTeamTableProps } from "@/components/elements/Inputs/DataTable/RHFLeadershipTeamTable";
import { RHFOwnershipStakeTableProps } from "@/components/elements/Inputs/DataTable/RHFOwnershipStakeTable";
import { RHFSeedingProps } from "@/components/elements/Inputs/DataTable/RHFSeedingTable";
import { RHFStrataTableProps } from "@/components/elements/Inputs/DataTable/RHFStrataTable";
import { RHFDropdownProps } from "@/components/elements/Inputs/Dropdown/RHFDropdown";
import { RHFFileInputProps } from "@/components/elements/Inputs/FileInput/RHFFileInput";
import { InputProps } from "@/components/elements/Inputs/Input/Input";
import { RHFInputTableProps } from "@/components/elements/Inputs/InputTable/RHFInputTable";
import { RHFMapProps } from "@/components/elements/Inputs/Map/RHFMap";
import { RHFSelectProps } from "@/components/elements/Inputs/Select/RHFSelect";
import { RHFSelectImageProps } from "@/components/elements/Inputs/SelectImage/RHFSelectImage";
import { TextAreaProps } from "@/components/elements/Inputs/textArea/TextArea";
import { RHFSeedingTableInputProps } from "@/components/elements/Inputs/TreeSpeciesInput/RHFSeedingTableInput";
import { RHFTreeSpeciesInputProps } from "@/components/elements/Inputs/TreeSpeciesInput/RHFTreeSpeciesInput";
import { RHFWorkdaysTableProps } from "@/components/elements/Inputs/WorkdaysInput/RHFWorkdaysTable";

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
  condition?: boolean;
  feedbackRequired?: boolean;
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
  SeedingsTableInput = "seedingsTableInput",
  DataTable = "dataTable",
  LeadershipTeamDataTable = "leadershipTeamDataTable",
  CoreTeamLeadersDataTable = "coreTeamLeadersDataTable",
  FundingTypeDataTable = "fundingTypeDataTable",
  StrataDataTable = "strataDataTable",
  DisturbanceDataTable = "disturbanceDataTable",
  InvasiveDataTable = "invasiveDataTable",
  SeedingsDataTable = "seedingsDataTable",
  WorkdaysTable = "workdays",
  InputTable = "inputTable",
  SelectImage = "selectImage",
  Map = "map",
  Conditional = "conditional",
  Boolean = "boolean",
  OwnershipStakeDataTable = "OwnershipStakeDataTable"
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
  | FieldTypeBuilder<FieldType.TreeSpecies, Omit<RHFTreeSpeciesInputProps, "formHook" | keyof UseControllerProps>>
  | FieldTypeBuilder<
      FieldType.SeedingsTableInput,
      Omit<RHFSeedingTableInputProps, "formHook" | "onChangeCapture" | keyof UseControllerProps>
    >
  | FieldTypeBuilder<FieldType.DataTable, Omit<RHFDataTableProps, "onChangeCapture" | keyof UseControllerProps>>
  | FieldTypeBuilder<
      FieldType.LeadershipTeamDataTable,
      Omit<RHFLeadershipTeamTableProps, "onChangeCapture" | keyof UseControllerProps>
    >
  | FieldTypeBuilder<
      FieldType.OwnershipStakeDataTable,
      Omit<RHFOwnershipStakeTableProps, "onChangeCapture" | keyof UseControllerProps>
    >
  | FieldTypeBuilder<
      FieldType.CoreTeamLeadersDataTable,
      Omit<RHFCoreTeamLeadersTableProps, "onChangeCapture" | keyof UseControllerProps>
    >
  | FieldTypeBuilder<
      FieldType.FundingTypeDataTable,
      Omit<RHFFundingTypeTableProps, "onChangeCapture" | keyof UseControllerProps>
    >
  | FieldTypeBuilder<FieldType.StrataDataTable, Omit<RHFStrataTableProps, "onChangeCapture" | keyof UseControllerProps>>
  | FieldTypeBuilder<
      FieldType.DisturbanceDataTable,
      Omit<RHFDisturbanceTableProps, "onChangeCapture" | keyof UseControllerProps>
    >
  | FieldTypeBuilder<
      FieldType.InvasiveDataTable,
      Omit<RHFInvasiveTableProps, "onChangeCapture" | keyof UseControllerProps>
    >
  | FieldTypeBuilder<FieldType.SeedingsDataTable, Omit<RHFSeedingProps, "onChangeCapture" | keyof UseControllerProps>>
  | FieldTypeBuilder<FieldType.WorkdaysTable, Omit<RHFWorkdaysTableProps, "onChangeCapture" | keyof UseControllerProps>>
  | FieldTypeBuilder<
      FieldType.InputTable,
      Omit<RHFInputTableProps, "formHook" | "onChangeCapture" | "errors" | "error" | keyof UseControllerProps>
    >
  | FieldTypeBuilder<
      FieldType.SelectImage,
      Omit<RHFSelectImageProps, "formHook" | "onChangeCapture" | keyof UseControllerProps>
    >
  | FieldTypeBuilder<FieldType.Map, Omit<RHFMapProps, "formHook" | "onChangeCapture" | keyof UseControllerProps>>
  | FieldTypeBuilder<FieldType.Conditional, Omit<ConditionalInputProps, "formHook" | "onChangeCapture">>
  | FieldTypeBuilder<FieldType.Boolean, Omit<BooleanInputProps, "formHook" | "onChangeCapture">>;

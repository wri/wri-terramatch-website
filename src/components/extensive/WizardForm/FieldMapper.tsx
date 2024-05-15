import { FieldError, FieldValues, UseFormReturn } from "react-hook-form";

import BooleanInput from "@/components/elements/Inputs/BooleanInput/BooleanInput";
import ConditionalInput from "@/components/elements/Inputs/ConditionalInput/ConditionalInput";
import RHFCoreTeamLeadersDataTable from "@/components/elements/Inputs/DataTable/RHFCoreTeamLeadersTable";
import RHFDataTable from "@/components/elements/Inputs/DataTable/RHFDataTable";
import RHFDisturbanceTable from "@/components/elements/Inputs/DataTable/RHFDisturbanceTable";
import FundingTypeDataTable from "@/components/elements/Inputs/DataTable/RHFFundingTypeDataTable";
import RHFInvasiveTable from "@/components/elements/Inputs/DataTable/RHFInvasiveTable";
import RHFLeadershipTeamDataTable from "@/components/elements/Inputs/DataTable/RHFLeadershipTeamTable";
import RHFOwnershipStakeDataTable from "@/components/elements/Inputs/DataTable/RHFOwnershipStakeTable";
import RHFSeedingTable from "@/components/elements/Inputs/DataTable/RHFSeedingTable";
import RHFStrataTable from "@/components/elements/Inputs/DataTable/RHFStrataTable";
import RHFWorkdaysTable from "@/components/elements/Inputs/DataTable/RHFWorkdaysTable";
import RHFDropdown from "@/components/elements/Inputs/Dropdown/RHFDropdown";
import RHFFileInput from "@/components/elements/Inputs/FileInput/RHFFileInput";
import Input from "@/components/elements/Inputs/Input/Input";
import RHFInputTable from "@/components/elements/Inputs/InputTable/RHFInputTable";
import RHFMap from "@/components/elements/Inputs/Map/RHFMap";
import RHFSelect from "@/components/elements/Inputs/Select/RHFSelect";
import RHFSelectImage from "@/components/elements/Inputs/SelectImage/RHFSelectImage";
import TextArea from "@/components/elements/Inputs/textArea/TextArea";
import RHFSeedingTableInput from "@/components/elements/Inputs/TreeSpeciesInput/RHFSeedingTableInput";
import RHFTreeSpeciesInput from "@/components/elements/Inputs/TreeSpeciesInput/RHFTreeSpeciesInput";

import { FieldType, FormField } from "./types";

interface FieldMapperProps {
  field: FormField;
  formHook: UseFormReturn<FieldValues, any>;
  onChange: () => void;
}

export const FieldMapper = ({ field, formHook, onChange }: FieldMapperProps) => {
  const sharedProps = {
    error: formHook.formState.errors?.[field.name] as FieldError,
    name: field.name,
    label: field.label,
    placeholder: field.placeholder,
    description: field.description,
    feedbackRequired: field.feedbackRequired
  };

  switch (field.type) {
    case FieldType.Input:
      return <Input {...field.fieldProps} {...sharedProps} formHook={formHook} onChangeCapture={onChange} ref={null} />;

    case FieldType.TextArea:
      return <TextArea {...field.fieldProps} {...sharedProps} formHook={formHook} onChangeCapture={onChange} />;

    case FieldType.Dropdown:
      return (
        <RHFDropdown
          {...field.fieldProps}
          {...sharedProps}
          formHook={formHook}
          control={formHook.control}
          onChangeCapture={onChange}
          enableAdditionalOptions
        />
      );

    case FieldType.Select:
      return (
        <RHFSelect
          {...field.fieldProps}
          {...sharedProps}
          control={formHook.control}
          onChangeCapture={onChange}
          formHook={formHook}
        />
      );

    case FieldType.FileUpload:
      return (
        <RHFFileInput
          {...field.fieldProps}
          {...sharedProps}
          formHook={formHook}
          control={formHook.control}
          onChangeCapture={onChange}
          maxFileSize={10}
        />
      );

    case FieldType.TreeSpecies:
      return (
        <RHFTreeSpeciesInput
          {...field.fieldProps}
          {...sharedProps}
          error={sharedProps.error as any}
          formHook={formHook}
          control={formHook.control}
          onChangeCapture={onChange}
        />
      );

    case FieldType.SeedingsTableInput:
      return (
        <RHFSeedingTableInput
          {...field.fieldProps}
          {...sharedProps}
          error={sharedProps.error as any}
          formHook={formHook}
          control={formHook.control}
          onChangeCapture={onChange}
        />
      );

    case FieldType.SelectImage:
      return (
        <RHFSelectImage
          {...field.fieldProps}
          {...sharedProps}
          control={formHook.control}
          onChangeCapture={onChange}
          formHook={formHook}
        />
      );

    case FieldType.DataTable:
      return (
        <RHFDataTable {...field.fieldProps} {...sharedProps} control={formHook.control} onChangeCapture={onChange} />
      );

    case FieldType.LeadershipTeamDataTable:
      return (
        <RHFLeadershipTeamDataTable
          {...field.fieldProps}
          {...sharedProps}
          control={formHook.control}
          onChangeCapture={onChange}
        />
      );

    case FieldType.CoreTeamLeadersDataTable:
      return (
        <RHFCoreTeamLeadersDataTable
          {...field.fieldProps}
          {...sharedProps}
          control={formHook.control}
          onChangeCapture={onChange}
        />
      );

    case FieldType.StrataDataTable:
      return (
        <RHFStrataTable {...field.fieldProps} {...sharedProps} control={formHook.control} onChangeCapture={onChange} />
      );

    case FieldType.WorkdaysTable:
      return (
        <RHFWorkdaysTable
          {...field.fieldProps}
          {...sharedProps}
          control={formHook.control}
          onChangeCapture={onChange}
        />
      );

    case FieldType.FundingTypeDataTable:
      return (
        <FundingTypeDataTable
          {...field.fieldProps}
          {...sharedProps}
          control={formHook.control}
          onChangeCapture={onChange}
        />
      );

    case FieldType.DisturbanceDataTable:
      return (
        <RHFDisturbanceTable
          {...field.fieldProps}
          {...sharedProps}
          control={formHook.control}
          onChangeCapture={onChange}
        />
      );

    case FieldType.InvasiveDataTable:
      return (
        <RHFInvasiveTable
          {...field.fieldProps}
          {...sharedProps}
          control={formHook.control}
          onChangeCapture={onChange}
        />
      );

    case FieldType.SeedingsDataTable:
      return (
        <RHFSeedingTable {...field.fieldProps} {...sharedProps} control={formHook.control} onChangeCapture={onChange} />
      );

    case FieldType.InputTable:
      return (
        <RHFInputTable
          {...field.fieldProps}
          {...sharedProps}
          control={formHook.control}
          formHook={formHook}
          onChangeCapture={onChange}
        />
      );

    case FieldType.Map:
      return (
        <RHFMap
          {...field.fieldProps}
          {...sharedProps}
          formHook={formHook}
          control={formHook.control}
          onChangeCapture={onChange}
        />
      );

    case FieldType.Conditional:
      return (
        <ConditionalInput
          {...field.fieldProps}
          {...sharedProps}
          formHook={formHook}
          control={formHook.control}
          onChangeCapture={onChange}
        />
      );

    case FieldType.Boolean:
      return (
        <BooleanInput
          {...field.fieldProps}
          {...sharedProps}
          formHook={formHook}
          control={formHook.control}
          onChangeCapture={onChange}
        />
      );
    case FieldType.OwnershipStakeDataTable:
      return (
        <RHFOwnershipStakeDataTable
          {...field.fieldProps}
          {...sharedProps}
          control={formHook.control}
          onChangeCapture={onChange}
        />
      );

    default:
      return null;
  }
};

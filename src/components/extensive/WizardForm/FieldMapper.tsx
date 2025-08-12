import { FieldError, FieldValues, UseFormReturn } from "react-hook-form";

import BooleanInput from "@/components/elements/Inputs/BooleanInput/BooleanInput";
import ConditionalInput from "@/components/elements/Inputs/ConditionalInput/ConditionalInput";
import RHFDataTable from "@/components/elements/Inputs/DataTable/RHFDataTable";
import RHFDisturbanceTable from "@/components/elements/Inputs/DataTable/RHFDisturbanceTable";
import FundingTypeDataTable from "@/components/elements/Inputs/DataTable/RHFFundingTypeDataTable";
import RHFInvasiveTable from "@/components/elements/Inputs/DataTable/RHFInvasiveTable";
import RHFLeadershipsDataTable from "@/components/elements/Inputs/DataTable/RHFLeadershipsTable";
import RHFOwnershipStakeDataTable from "@/components/elements/Inputs/DataTable/RHFOwnershipStakeTable";
import RHFSeedingTable from "@/components/elements/Inputs/DataTable/RHFSeedingTable";
import RHFStrataTable from "@/components/elements/Inputs/DataTable/RHFStrataTable";
import RHFStrategyAreaDataTable from "@/components/elements/Inputs/DataTable/RHFStrategyAreaDataTable";
import RHFDemographicsTable from "@/components/elements/Inputs/DemographicsInput/RHFDemographicsTable";
import RHFDropdown from "@/components/elements/Inputs/Dropdown/RHFDropdown";
import RHFFileInput from "@/components/elements/Inputs/FileInput/RHFFileInput";
import RHFFinancialIndicatorsDataTable from "@/components/elements/Inputs/FinancialTableInput/RHFFinancialIndicatorTable";
import Input from "@/components/elements/Inputs/Input/Input";
import RHFInputTable from "@/components/elements/Inputs/InputTable/RHFInputTable";
import RHFMap from "@/components/elements/Inputs/Map/RHFMap";
import RHFSelect from "@/components/elements/Inputs/Select/RHFSelect";
import RHFSelectImage from "@/components/elements/Inputs/SelectImage/RHFSelectImage";
import TextArea from "@/components/elements/Inputs/textArea/TextArea";
import RHFSeedingTableInput from "@/components/elements/Inputs/TreeSpeciesInput/RHFSeedingTableInput";
import RHFTreeSpeciesInput from "@/components/elements/Inputs/TreeSpeciesInput/RHFTreeSpeciesInput";
import { MapAreaProvider } from "@/context/mapArea.provider";

import { FieldType, FormField } from "./types";
interface FieldMapperProps {
  field: FormField;
  formHook: UseFormReturn<FieldValues, any>;
  onChange: () => void;
  formSubmissionOrg?: any;
}

export const FieldMapper = ({ field, formHook, onChange, formSubmissionOrg }: FieldMapperProps) => {
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
          isPhotosAndVideo={field.fieldProps.collection === "photos" || field.fieldProps.collection === "videos"}
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

    case FieldType.LeadershipsDataTable:
      return (
        <RHFLeadershipsDataTable
          {...field.fieldProps}
          {...sharedProps}
          formHook={formHook}
          error={sharedProps.error as any}
          control={formHook.control}
          onChangeCapture={onChange}
        />
      );

    case FieldType.StrategyAreaInput:
      return (
        <RHFStrategyAreaDataTable
          {...field.fieldProps}
          {...sharedProps}
          formHook={formHook}
          error={sharedProps.error as any}
          control={formHook.control}
          onChangeCapture={onChange}
        />
      );

    case FieldType.StrataDataTable:
      return (
        <RHFStrataTable {...field.fieldProps} {...sharedProps} control={formHook.control} onChangeCapture={onChange} />
      );

    case FieldType.WorkdaysTable:
    case FieldType.RestorationPartnersTable:
    case FieldType.JobsTable:
    case FieldType.VolunteersTable:
    case FieldType.AllBeneficiariesTable:
    case FieldType.TrainingBeneficiariesTable:
    case FieldType.IndirectBeneficiariesTable:
    case FieldType.EmployeesTable:
    case FieldType.AssociatesTable:
      return (
        <RHFDemographicsTable
          {...field.fieldProps}
          {...sharedProps}
          formHook={formHook}
          control={formHook.control}
          onChangeCapture={onChange}
          demographicType={field.type}
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
      return <RHFInvasiveTable {...field.fieldProps} {...sharedProps} control={formHook.control} />;

    case FieldType.SeedingsDataTable:
      return <RHFSeedingTable {...field.fieldProps} {...sharedProps} control={formHook.control} />;

    case FieldType.InputTable:
      return <RHFInputTable {...field.fieldProps} {...sharedProps} control={formHook.control} formHook={formHook} />;

    case FieldType.Map:
      return (
        <MapAreaProvider>
          <RHFMap
            {...field.fieldProps}
            {...sharedProps}
            formHook={formHook}
            control={formHook.control}
            onChangeCapture={onChange}
          />
        </MapAreaProvider>
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

    case FieldType.FinancialTableInput:
      return (
        <RHFFinancialIndicatorsDataTable
          {...field.fieldProps}
          {...sharedProps}
          formHook={formHook}
          error={sharedProps.error}
          control={formHook.control}
          onChangeCapture={onChange}
          formSubmissionOrg={formSubmissionOrg}
        />
      );

    default:
      return null;
  }
};

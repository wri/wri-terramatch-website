import { isNumber } from "lodash";
import { FC, useMemo } from "react";
import { FieldError, UseFormReturn } from "react-hook-form";

import BooleanInput from "@/components/elements/Inputs/BooleanInput/BooleanInput";
import ConditionalInput from "@/components/elements/Inputs/ConditionalInput/ConditionalInput";
import RHFDisturbanceTable from "@/components/elements/Inputs/DataTable/RHFDisturbanceTable";
import RHFFundingTypeDataTable from "@/components/elements/Inputs/DataTable/RHFFundingTypeDataTable";
import RHFInvasiveTable from "@/components/elements/Inputs/DataTable/RHFInvasiveTable";
import RHFLeadershipsDataTable from "@/components/elements/Inputs/DataTable/RHFLeadershipsTable";
import RHFOwnershipStakeTable from "@/components/elements/Inputs/DataTable/RHFOwnershipStakeTable";
import RHFSeedingTable from "@/components/elements/Inputs/DataTable/RHFSeedingTable";
import RHFStrataTable from "@/components/elements/Inputs/DataTable/RHFStrataTable";
import RHFStrategyAreaDataTable from "@/components/elements/Inputs/DataTable/RHFStrategyAreaDataTable";
import RHFDemographicsTable from "@/components/elements/Inputs/DemographicsInput/RHFDemographicsTable";
import RHFDropdown from "@/components/elements/Inputs/Dropdown/RHFDropdown";
import RHFFileInput from "@/components/elements/Inputs/FileInput/RHFFileInput";
import RHFFinancialIndicatorsDataTable from "@/components/elements/Inputs/FinancialTableInput/RHFFinancialIndicatorTable";
import Input, { InputProps } from "@/components/elements/Inputs/Input/Input";
import RHFInputTable from "@/components/elements/Inputs/InputTable/RHFInputTable";
import RHFMap from "@/components/elements/Inputs/Map/RHFMap";
import RHFSelect from "@/components/elements/Inputs/Select/RHFSelect";
import RHFSelectImage from "@/components/elements/Inputs/SelectImage/RHFSelectImage";
import TextArea from "@/components/elements/Inputs/textArea/TextArea";
import RHFSeedingTableInput from "@/components/elements/Inputs/TreeSpeciesInput/RHFSeedingTableInput";
import RHFTreeSpeciesInput from "@/components/elements/Inputs/TreeSpeciesInput/RHFTreeSpeciesInput";
import { selectQuestion } from "@/connections/util/Form";
import { MapAreaProvider } from "@/context/mapArea.provider";

type FormQuestionProps = {
  questionId: string;
  formHook: UseFormReturn;
  onChange: () => void;
  formSubmissionOrg?: any;
};

const useQuestionData = (questionId: string, formHook: UseFormReturn, onChange: () => void) => {
  return useMemo(() => {
    const question = selectQuestion(questionId);
    if (question == null) return null;

    const sharedProps = {
      error: formHook.formState.errors?.[question.uuid] as FieldError,
      name: question.uuid,
      label: question.label,
      required: question.validation?.required === true,
      placeholder: question.placeholder ?? undefined,
      description: question.description ?? undefined,
      formHook,
      control: formHook.control,
      onChangeCapture: onChange
    };

    return { question, sharedProps };
  }, [formHook, onChange, questionId]);
};

const FormQuestion: FC<FormQuestionProps> = ({ questionId, formHook, onChange, formSubmissionOrg }) => {
  const questionData = useQuestionData(questionId, formHook, onChange);
  if (questionData == null) return null;

  const { question, sharedProps } = questionData;
  const { inputType, linkedFieldKey } = question;

  switch (inputType) {
    case "text":
    case "url":
    case "number":
    case "date":
    case "number-percentage": {
      const type = inputType === "number-percentage" ? "number" : inputType;
      const props: InputProps = {
        ...sharedProps,
        type
      };
      if (["pro-pit-lat-proposed", "pro-pit-long-proposed"].includes(linkedFieldKey ?? "")) {
        props.max = question.maxNumberLimit == null ? undefined : `${question.maxNumberLimit}`;
        props.min = question.minNumberLimit == null ? undefined : `${question.minNumberLimit}`;
        props.allowNegative = true;
      }
      if (inputType === "date") {
        props.max = question.validation?.max == null ? undefined : `${question.validation.max}`;
        props.maxLength = isNumber(question.validation?.max) ? question.validation?.max : undefined;
        props.min = question.validation?.min == null ? undefined : `${question.validation.min}`;
        props.minLength = isNumber(question.validation?.min) ? question.validation?.min : undefined;
      } else if (inputType === "number-percentage") {
        props.max = "100";
        props.min = "0";
      }
      return <Input {...props} ref={undefined} />;
    }

    case "long-text":
      return <TextArea {...sharedProps} maxLength={question.validation?.max} minLength={question.validation?.min} />;

    case "select":
      return (
        <RHFDropdown
          {...sharedProps}
          multiSelect={question.multiChoice}
          hasOtherOptions={question.optionsOther ?? undefined}
          optionsList={question.optionsList}
          linkedFieldKey={linkedFieldKey}
          enableAdditionalOptions
        />
      );

    case "radio":
      return <RHFSelect {...sharedProps} optionsList={question.optionsList} />;

    case "conditional":
      return <ConditionalInput {...sharedProps} questionId={questionId} id={questionId} inputId={questionId} />;

    case "boolean":
      return <BooleanInput {...sharedProps} id={questionId} inputId={questionId} />;

    case "file":
      return (
        <RHFFileInput
          {...sharedProps}
          isPhotosAndVideo={["photos", "videos"].includes(question.collection ?? "")}
          allowMultiple={question.multiChoice}
          collection={question.collection ?? ""}
          accept={question.additionalProps?.accept}
          maxFileSize={question.additionalProps?.max ?? 10}
          showPrivateCheckbox={question.additionalProps?.with_private_checkbox}
        />
      );

    case "treeSpecies":
      return (
        <RHFTreeSpeciesInput
          {...sharedProps}
          error={sharedProps.error as any}
          withNumbers={question.additionalProps?.with_numbers}
          collection={question.collection ?? ""}
        />
      );

    case "tableInput":
      return (
        <RHFInputTable
          {...sharedProps}
          headers={question.tableHeaders}
          questionId={questionId}
          hasTotal={question.additionalProps?.with_numbers}
        />
      );

    case "leaderships":
      return <RHFLeadershipsDataTable {...sharedProps} collection={question.collection ?? ""} />;

    case "ownershipStake":
      return <RHFOwnershipStakeTable {...sharedProps} />;

    case "financialIndicators":
      return (
        <RHFFinancialIndicatorsDataTable
          {...sharedProps}
          formSubmissionOrg={formSubmissionOrg}
          years={question.years ?? undefined}
          model={question.collection ?? undefined}
        />
      );

    case "stratas":
      return <RHFStrataTable {...sharedProps} />;

    case "disturbances":
      return (
        <RHFDisturbanceTable
          {...sharedProps}
          hasExtent={question.additionalProps?.with_extent}
          hasIntensity={question.additionalProps?.with_intensity}
        />
      );

    case "invasive":
      return <RHFInvasiveTable {...sharedProps} />;

    case "seedings":
      if (question.additionalProps?.capture_count === true) {
        return <RHFSeedingTableInput {...sharedProps} withNumbers />;
      } else {
        return <RHFSeedingTable {...sharedProps} collection={question.collection ?? ""} captureCount={false} />;
      }

    case "fundingType":
      return <RHFFundingTypeDataTable {...sharedProps} />;

    case "workdays":
    case "restorationPartners":
    case "jobs":
    case "employees":
    case "volunteers":
    case "allBeneficiaries":
    case "trainingBeneficiaries":
    case "indirectBeneficiaries":
    case "associates":
      return (
        <RHFDemographicsTable {...sharedProps} demographicType={inputType} collection={question.collection ?? ""} />
      );

    case "select-image":
      return <RHFSelectImage {...sharedProps} multiSelect={question.multiChoice} optionsList={question.optionsList} />;

    case "mapInput":
      return (
        <MapAreaProvider>
          <RHFMap {...sharedProps} inputId={questionId} />
        </MapAreaProvider>
      );

    case "strategy-area":
      return (
        <RHFStrategyAreaDataTable
          {...sharedProps}
          collection={question.collection ?? ""}
          optionsList={question.optionsList}
          linkedFieldKey={question.linkedFieldKey}
          hasOtherOptions={question.optionsOther}
        />
      );
  }
};

export default FormQuestion;

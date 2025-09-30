import { FC, Fragment, MutableRefObject } from "react";
import { BooleanInput, FormDataConsumerRenderParams, maxValue, minValue, NumberInput } from "react-admin";

import ConditionalAdditionalOptions from "@/admin/modules/form/components/FormBuilder/AdditionalOptions/ConditionalAdditionalOptions";
import FinancialIndicatorsAdditionalOptions from "@/admin/modules/form/components/FormBuilder/AdditionalOptions/FinancialIndicatorsAdditionalOptions";
import SelectAdditionalOptions from "@/admin/modules/form/components/FormBuilder/AdditionalOptions/SelectAdditionalOptions";
import TableAdditionalOptions from "@/admin/modules/form/components/FormBuilder/AdditionalOptions/TableAdditionalOptions";
import {
  FormQuestionField,
  QuestionArrayInputProps
} from "@/admin/modules/form/components/FormBuilder/QuestionArrayInput";
import { AdditionalInputTypes } from "@/admin/types/common";

type AdditionalOptionsProps = {
  field: FormQuestionField;
  linkedFieldsData: FormQuestionField[];
  getSource: NonNullable<FormDataConsumerRenderParams["getSource"]>;
  onDeleteQuestion: QuestionArrayInputProps["onDeleteQuestion"];
  selectRef: MutableRefObject<HTMLDivElement | null>;
};

const AdditionalOptions: FC<AdditionalOptionsProps> = ({
  field,
  getSource,
  linkedFieldsData,
  onDeleteQuestion,
  selectRef
}) => {
  switch (field.inputType) {
    case AdditionalInputTypes.TableInput:
      return <TableAdditionalOptions {...{ linkedFieldsData, getSource }} />;

    case AdditionalInputTypes.ConditionalInput:
      return <ConditionalAdditionalOptions {...{ linkedFieldsData, getSource, onDeleteQuestion }} />;

    case "strategy-area":
    case "select":
    case "select-image":
      if (field.id === "org-hq-state" || field.id === "org-states") return null;
      return <SelectAdditionalOptions {...{ field, getSource }} />;

    case "financialIndicators":
      return <FinancialIndicatorsAdditionalOptions {...{ selectRef, getSource }} />;

    case "disturbances":
      return (
        <Fragment>
          <BooleanInput
            source={getSource("additionalProps.with_intensity")}
            label="Has intensity"
            helperText="When enabled, this will prompt users to specify the intensity of the disturbance, which can be categorized as low, medium, or high."
            defaultValue={false}
          />
          <BooleanInput
            source={getSource("additionalProps.with_extent")}
            label="Has extent (% of site affected)"
            helperText="When enabled, this will prompt users to indicate the extent of the disturbance. Users can choose from the following ranges: 0 - 20%, 21 - 40%, 41 - 60%, 61 - 80%, or 81 - 100%."
            defaultValue={false}
          />
        </Fragment>
      );

    case "seedings":
      return (
        <BooleanInput
          source={getSource("additionalProps.capture_count")}
          label="Capture Count"
          helperText="To allow users enter count instead of 'Number of seeds in sample' and 'Weight of sample(Kg)'"
          defaultValue={false}
        />
      );

    case "treeSpecies":
      return (
        <BooleanInput
          source={getSource("additionalProps.with_numbers")}
          label="Has Count"
          helperText="To allow users enter count for each tree species record."
          defaultValue={false}
        />
      );

    case "file":
      return (
        <BooleanInput
          source={getSource("additionalProps.with_private_checkbox")}
          label="Private or public checkbox"
          helperText="Enable this option to allow project developers to set this file as either private or public."
          defaultValue={false}
        />
      );

    case "long-text":
      return (
        <>
          <NumberInput
            source={getSource("minCharacterLimit")}
            label="Minimum Character Limit"
            defaultValue={0}
            validate={[minValue(0)]}
          />
          <NumberInput
            source={getSource("maxCharacterLimit")}
            label="Maximum Character Limit"
            defaultValue={90000}
            validate={[maxValue(90000)]}
          />
        </>
      );

    default:
      return null;
  }
};

export default AdditionalOptions;

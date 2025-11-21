import { FC, MutableRefObject } from "react";
import { FormDataConsumerRenderParams } from "react-admin";

import {
  FormQuestionField,
  QuestionArrayInputProps
} from "@/admin/modules/form/components/FormBuilder/QuestionArrayInput";
import { FormFieldFactories } from "@/components/extensive/WizardForm/fields";

export type AdditionalOptionsProps = {
  field: FormQuestionField;
  linkedFieldsData: FormQuestionField[];
  getSource: NonNullable<FormDataConsumerRenderParams["getSource"]>;
  onDeleteQuestion: QuestionArrayInputProps["onDeleteQuestion"];
  selectRef: MutableRefObject<HTMLDivElement | null>;
};

const AdditionalOptions: FC<AdditionalOptionsProps> = props => {
  const { formBuilderAdditionalOptions } = FormFieldFactories[props.field.inputType];
  return formBuilderAdditionalOptions?.(props) ?? null;
};

export default AdditionalOptions;

import { FC } from "react";
import { BooleanInput, FormDataConsumerRenderParams, minLength } from "react-admin";

import {
  FormQuestionField,
  QuestionArrayInput,
  QuestionArrayInputProps
} from "@/admin/modules/form/components/FormBuilder/QuestionArrayInput";
import { AdditionalInputTypes } from "@/admin/types/common";

type ConditionalAdditionalOptionsProps = {
  linkedFieldsData: FormQuestionField[];
  getSource: NonNullable<FormDataConsumerRenderParams["getSource"]>;
  onDeleteQuestion: QuestionArrayInputProps["onDeleteQuestion"];
};

const ConditionalAdditionalOptions: FC<ConditionalAdditionalOptionsProps> = ({
  linkedFieldsData,
  getSource,
  onDeleteQuestion
}) => (
  <QuestionArrayInput
    source={getSource("child_form_questions")}
    label="Follow-up questions"
    title="Child Question"
    linkedFieldsData={linkedFieldsData.filter(field => field.inputType !== AdditionalInputTypes.ConditionalInput)}
    validate={minLength(1, "At least one Follow-up questions is required")}
    isChildQuestion
    onDeleteQuestion={onDeleteQuestion}
  >
    <BooleanInput
      source="show_on_parent_condition"
      label="If you want to ask this follow-up question when the user responds 'yes,' turn the toggle on. If you prefer to ask this question when the user responds 'no,' leave the toggle off."
      defaultValue={false}
    />
  </QuestionArrayInput>
);

export default ConditionalAdditionalOptions;

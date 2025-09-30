import { Delete as DeleteIcon } from "@mui/icons-material";
import { FC, ReactElement, useCallback, useRef, useState } from "react";
import {
  ArrayInput,
  ArrayInputProps,
  AutocompleteInput,
  BooleanInput,
  FormDataConsumer,
  FormDataConsumerRenderParams,
  required,
  TextInput
} from "react-admin";

import { AccordionFormIterator } from "@/admin/components/AccordionFormIterator/AccordionFormIterator";
import {
  AddItemButton,
  PreviewButton,
  RemoveItemButton
} from "@/admin/components/AccordionFormIterator/AccordionFormIteratorButtons";
import { FormQuestionPreviewDialog } from "@/admin/components/Dialogs/FormQuestionPreviewDialog";
import { RichTextInput } from "@/admin/components/RichTextInput/RichTextInput";
import AdditionalOptions from "@/admin/modules/form/components/FormBuilder/AdditionalOptions";
import { AdditionalInputTypes, Choice } from "@/admin/types/common";
import { FieldDefinition } from "@/components/extensive/WizardForm/types";
import { LinkedFieldDto } from "@/generated/v3/entityService/entityServiceSchemas";

export interface QuestionArrayInputProps extends Omit<ArrayInputProps, "children"> {
  title: string;
  linkedFieldsData: FormQuestionField[];
  onDeleteQuestion?: (index: number, source: string) => Promise<void>;
  isChildQuestion?: boolean;
  hideDescriptionInput?: boolean;
  children?: ReactElement;
  formTitle?: string;
}

export type FormQuestionField = Pick<LinkedFieldDto, "name" | "id"> &
  Partial<Omit<LinkedFieldDto, "name" | "inputType" | "id">> & {
    inputType: LinkedFieldDto["inputType"] | AdditionalInputTypes.TableInput;
  };

export const appendAdditionalFormQuestionFields = (originalList: LinkedFieldDto[]): FormQuestionField[] => [
  { name: "Table Input (Generic)", inputType: AdditionalInputTypes.TableInput, id: "table-input" },
  { name: "Conditional Input (Generic)", inputType: AdditionalInputTypes.ConditionalInput, id: "conditional" },
  ...originalList
];

export const QuestionArrayInput: FC<QuestionArrayInputProps> = ({
  title,
  linkedFieldsData,
  onDeleteQuestion,
  hideDescriptionInput,
  isChildQuestion,
  children,
  formTitle,
  ...arrayInputProps
}) => {
  const [previewQuestionId, setPreviewQuestionId] = useState<string>();
  const linkedFieldChoices = linkedFieldsData?.map(({ id, name }) => ({ id, name } as Choice)) || [];
  const selectRef = useRef<HTMLDivElement | null>(null);

  const getFieldById = useCallback(
    (fieldId: string) => linkedFieldsData.find(({ id }) => id === fieldId),
    [linkedFieldsData]
  );

  const onSelectPreview = useCallback(
    (field: Record<any, any>) => setPreviewQuestionId((field as FieldDefinition).name),
    []
  );

  return (
    <div ref={selectRef} className="w-full">
      <ArrayInput {...arrayInputProps}>
        <AccordionFormIterator
          accordionSummaryTitle={(index, fields) =>
            `${title} ${index + 1} of ${fields.length} ${fields[index].label ? `(${fields[index].label})` : ""}`
          }
          addButton={<AddItemButton variant="contained" label={`Add ${title}`} />}
          removeButton={
            <RemoveItemButton
              variant="text"
              label={`Delete ${title}`}
              onDelete={onDeleteQuestion}
              modalTitle="Delete Question"
              modalContent="This is permanent, are you sure you want to delete this Question?"
            >
              <DeleteIcon />
            </RemoveItemButton>
          }
          summaryChildren={!isChildQuestion && <PreviewButton onClick={onSelectPreview} />}
        >
          <AutocompleteInput
            source="linkedFieldKey"
            choices={linkedFieldChoices}
            label="Field"
            fullWidth
            validate={required()}
          />
          <TextInput
            source="label"
            label="Question Text"
            helperText="Please indicate the question you want to ask project developers. The responses to this question will always be linked to the original field selected. Use this option solely to amend the wording of the question."
            fullWidth
            validate={required()}
          />

          {!hideDescriptionInput && (
            <RichTextInput
              source="description"
              label="Helper"
              helperText="Use this helper text to provide contextual information to project developers on how to best respond to the question above. This option is intended solely for amending the wording of the helper text to offer clear and helpful guidance."
              fullWidth
              disableAlignmentSelect
              disableHorizontalLine
              disableLevelSelect
              disableListSelect
              height="75px"
            />
          )}
          <BooleanInput
            source="validation.required"
            label="Required"
            helperText="Please keep this option on if you want to make this question required. When this option is enabled, project developers will be obligated to provide an answer to the question before they can submit the form."
            defaultValue={false}
          />
          <FormDataConsumer>
            {({ scopedFormData, getSource }: FormDataConsumerRenderParams) => {
              if (scopedFormData == null || getSource == null) return null;
              const field = getFieldById(scopedFormData.linkedFieldKey);
              if (field == null) return null;

              return <AdditionalOptions {...{ field, getSource, linkedFieldsData, onDeleteQuestion, selectRef }} />;
            }}
          </FormDataConsumer>
          {children}
        </AccordionFormIterator>
      </ArrayInput>
      <FormQuestionPreviewDialog
        open={previewQuestionId != null}
        questionId={previewQuestionId}
        linkedFieldData={linkedFieldsData}
        onClose={() => setPreviewQuestionId(undefined)}
        formTitle={formTitle}
      />
    </div>
  );
};

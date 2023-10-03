import { Delete as DeleteIcon } from "@mui/icons-material";
import { Box, Button } from "@mui/material";
import { Fragment, useEffect, useState } from "react";
import {
  ArrayInput,
  ArrayInputProps,
  AutocompleteInput,
  BooleanInput,
  FormDataConsumer,
  FormDataConsumerRenderParams,
  required,
  TextInput,
  useInput
} from "react-admin";
import { Else, If, Then } from "react-if";

import { AccordionFormIterator } from "@/admin/components/AccordionFormIterator/AccordionFormIterator";
import {
  AddItemButton,
  PreviewButton,
  RemoveItemButton
} from "@/admin/components/AccordionFormIterator/AccordionFormIteratorButtons";
import { FormQuestionPreviewDialog } from "@/admin/components/Dialogs/FormQuestionPreviewDialog";
import { RichTextInput } from "@/admin/components/RichTextInput/RichTextInput";
import { OptionArrayInput } from "@/admin/modules/form/components/FormBuilder/OptionArrayInput";
import { AdditionalInputTypes, Choice } from "@/admin/types/common";
import { minArrayLength, noDuplication, noEmptyElement } from "@/admin/utils/forms";
import { FormQuestionRead, V2GenericList } from "@/generated/apiSchemas";

interface QuestionArrayInputProps extends Omit<ArrayInputProps, "children"> {
  title: string;
  linkedFieldsData: V2GenericList[];
  onDeleteQuestion?: (index: number, source: string) => Promise<void>;
  isChildQuestion?: boolean;
  hideDescriptionInput?: boolean;
}

export const appendAdditionalFormQuestionFields = (
  originalList: V2GenericList[],
  isChildQuestion?: boolean
): V2GenericList[] => {
  return isChildQuestion
    ? originalList
    : [
        { name: "Table Input (Generic)", input_type: AdditionalInputTypes.TableInput, uuid: "table-input" },
        ...originalList
      ];
};

export const QuestionArrayInput = ({
  title,
  linkedFieldsData,
  onDeleteQuestion,
  hideDescriptionInput,
  isChildQuestion,
  ...arrayInputProps
}: QuestionArrayInputProps) => {
  const [previewQuestion, setPreviewQuestion] = useState<FormQuestionRead | undefined>();
  const linkedFieldChoices =
    appendAdditionalFormQuestionFields(linkedFieldsData, isChildQuestion)?.map(
      item => ({ id: item.uuid, name: item.name } as Choice)
    ) || [];

  const getFieldByUUID = (fieldUUID: string) =>
    appendAdditionalFormQuestionFields(linkedFieldsData, isChildQuestion).find(item => item.uuid === fieldUUID);

  return (
    <>
      <ArrayInput {...arrayInputProps}>
        <AccordionFormIterator
          defaultExpanded
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
          summaryChildren={!isChildQuestion && <PreviewButton onClick={setPreviewQuestion} />}
        >
          <AutocompleteInput
            source="linked_field_key"
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
              if (!scopedFormData || !getSource) return null;
              const field = getFieldByUUID(scopedFormData.linked_field_key);

              const allowCreate =
                //@ts-ignore
                field?.option_list_key !== "countries" &&
                field?.uuid !== "org-type" &&
                //@ts-ignore
                field?.option_list_key !== "months";

              if (!field) return null;
              const [editOptions, setEditOptions] = useState(false);
              const defaultOptions = field.options?.map((option: any) => ({
                label: option.label,
                slug: option.alt_value || option.slug
              }));

              const {
                field: { value: linked_field_key }
              } = useInput({ source: getSource("linked_field_key") });

              const {
                field: { value: form_question_options, onChange: onChangeOptions }
              } = useInput({ source: getSource("form_question_options") });

              useEffect(() => {
                //To force update default value when linked_field_key changes

                if (!form_question_options?.[0]?.uuid) {
                  // to prevent this on edit page

                  onChangeOptions(defaultOptions);
                }
                // eslint-disable-next-line react-hooks/exhaustive-deps
              }, [linked_field_key]);

              switch (field?.input_type) {
                case "tableInput":
                  return (
                    <Fragment key={field?.uuid}>
                      <Box display="flex" width="100%" gap={2} marginTop={2}>
                        <TextInput
                          source={getSource("table_headers.0.label")}
                          label="Table Header (Question)"
                          helperText=""
                          fullWidth
                          validate={required()}
                        />
                        <TextInput
                          source={getSource("table_headers.1.label")}
                          label="Table Header (Answer)"
                          helperText=""
                          fullWidth
                          validate={required()}
                        />
                      </Box>
                      <QuestionArrayInput
                        source={getSource("child_form_questions")}
                        label="Table Questions"
                        title="Child Question"
                        linkedFieldsData={linkedFieldsData.filter(
                          field => field.input_type === "text" || field.input_type === "number"
                        )}
                        hideDescriptionInput
                        isChildQuestion
                        validate={[minArrayLength(1, "Question")]}
                      />
                    </Fragment>
                  );

                case "select":
                  if (field.uuid === "org-hq-state" || field.uuid === "org-states") {
                    return null;
                  }
                  return (
                    <Fragment key={field?.uuid}>
                      <If condition={!editOptions}>
                        <Then>
                          <Button
                            onClick={() => setEditOptions(true)}
                            variant="contained"
                            sx={{ marginX: "auto", marginY: 2 }}
                          >
                            Edit options
                          </Button>
                        </Then>
                        <Else>
                          <OptionArrayInput
                            label="Options"
                            source={getSource("form_question_options")}
                            //@ts-ignore
                            defaultValue={defaultOptions}
                            dropDownOptions={
                              defaultOptions?.map((option: any) => ({
                                id: option.alt_value || option.slug,
                                name: option.label
                              })) as Choice[]
                            }
                            allowCreate={allowCreate}
                            validate={[noEmptyElement("label"), noDuplication("label"), minArrayLength(1, "Option")]}
                          />
                        </Else>
                      </If>
                      {allowCreate && (
                        <BooleanInput
                          source={getSource("options_other")}
                          label="Has Other"
                          helperText="Enable this option to let users provide a response when they choose 'Other' as an option."
                          defaultValue={false}
                        />
                      )}
                    </Fragment>
                  );

                case "treeSpecies":
                  return (
                    <BooleanInput
                      source={getSource("additional_props.with_numbers")}
                      label="Has Count"
                      helperText="To allow users enter count for each tree species record."
                      defaultValue={false}
                    />
                  );
                default:
                  return null;
              }
            }}
          </FormDataConsumer>
        </AccordionFormIterator>
      </ArrayInput>
      <FormQuestionPreviewDialog
        open={!!previewQuestion}
        question={previewQuestion}
        linkedFieldData={appendAdditionalFormQuestionFields(linkedFieldsData, isChildQuestion) as any[]}
        onClose={() => setPreviewQuestion(undefined)}
      />
    </>
  );
};

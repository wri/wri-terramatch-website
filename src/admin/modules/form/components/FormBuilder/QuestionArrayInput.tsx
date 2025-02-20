import { Delete as DeleteIcon } from "@mui/icons-material";
import { Box, Button } from "@mui/material";
import { Fragment, ReactElement, useEffect, useState } from "react";
import {
  ArrayInput,
  ArrayInputProps,
  AutocompleteInput,
  BooleanInput,
  FormDataConsumer,
  FormDataConsumerRenderParams,
  minLength,
  NumberInput,
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
import { noDuplication, noEmptyElement } from "@/admin/utils/forms";
import { FormQuestionRead, V2GenericList } from "@/generated/apiSchemas";

interface QuestionArrayInputProps extends Omit<ArrayInputProps, "children"> {
  title: string;
  linkedFieldsData: V2GenericList[];
  onDeleteQuestion?: (index: number, source: string) => Promise<void>;
  isChildQuestion?: boolean;
  hideDescriptionInput?: boolean;
  children?: ReactElement;
}

export const appendAdditionalFormQuestionFields = (originalList: V2GenericList[]): V2GenericList[] => {
  return [
    { name: "Table Input (Generic)", input_type: AdditionalInputTypes.TableInput, uuid: "table-input" },
    { name: "Conditional Input (Generic)", input_type: AdditionalInputTypes.ConditionalInput, uuid: "conditional" },
    ...originalList
  ];
};

export const QuestionArrayInput = ({
  title,
  linkedFieldsData,
  onDeleteQuestion,
  hideDescriptionInput,
  isChildQuestion,
  children,
  ...arrayInputProps
}: QuestionArrayInputProps) => {
  const [previewQuestion, setPreviewQuestion] = useState<FormQuestionRead | undefined>();
  const linkedFieldChoices = linkedFieldsData?.map(item => ({ id: item.uuid, name: item.name } as Choice)) || [];

  const getFieldByUUID = (fieldUUID: string) => linkedFieldsData.find(item => item.uuid === fieldUUID);

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
          <FormDataConsumer>
            {({ scopedFormData, getSource }: FormDataConsumerRenderParams) => {
              if (!scopedFormData || !getSource) return null;
              const field = getFieldByUUID(scopedFormData.linked_field_key);
              return field?.input_type == "long-text" ? (
                <>
                  <NumberInput
                    source={getSource("min_character_limit")}
                    label="Minimum Character Limit"
                    defaultValue={90000}
                  />
                  <NumberInput
                    source={getSource("max_character_limit")}
                    label="Maximum Character Limit"
                    defaultValue={90000}
                  />
                </>
              ) : (
                <></>
              );
            }}
          </FormDataConsumer>
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
              const input_type = field?.input_type;
              const [editOptions, setEditOptions] = useState(false);
              const defaultOptions = field.options?.map((option: any) => ({
                ...option,
                label: option.label,
                slug: option.alt_value || option.slug
              }));

              const {
                field: { value: linked_field_key }
              } = useInput({ source: getSource("linked_field_key") });

              const {
                field: { value: form_question_options, onChange: onChangeOptions }
              } = useInput({ source: getSource("form_question_options") });

              const {
                field: { value: has_total }
              } = useInput({ source: getSource("additional_props.with_numbers") });

              useEffect(() => {
                //To force update default value when linked_field_key changes

                if (!form_question_options?.[0]?.uuid) {
                  // to prevent this on edit page

                  onChangeOptions(defaultOptions);
                }
                // eslint-disable-next-line react-hooks/exhaustive-deps
              }, [linked_field_key]);

              switch (input_type) {
                case AdditionalInputTypes.TableInput:
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
                      <BooleanInput
                        source={getSource("additional_props.with_numbers")}
                        label="Has Total"
                        helperText="To append total value of answers at the end of 'Table Header (Answer)'. if turned on you'll only be able to select number inputs."
                        defaultValue={false}
                      />
                      <QuestionArrayInput
                        source={getSource("child_form_questions")}
                        label="Table Questions"
                        title="Child Question"
                        linkedFieldsData={linkedFieldsData.filter(
                          field => (!has_total && field.input_type === "text") || field.input_type?.includes("number")
                        )}
                        hideDescriptionInput
                        isChildQuestion
                        validate={minLength(1, "At least one child Question is required")}
                      />
                    </Fragment>
                  );

                case AdditionalInputTypes.ConditionalInput:
                  return (
                    <QuestionArrayInput
                      source={getSource("child_form_questions")}
                      label="Follow-up questions"
                      title="Child Question"
                      linkedFieldsData={linkedFieldsData.filter(
                        field => field.input_type !== AdditionalInputTypes.ConditionalInput
                      )}
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

                case "select":
                case "select-image":
                case "workdays":
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
                            {input_type === "workdays" ? "Edit ethnicity's options" : "Edit options"}
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
                                ...option,
                                id: option.alt_value || option.slug,
                                name: option.label
                              })) as Choice[]
                            }
                            allowCreate={allowCreate}
                            allowImages={field.input_type === "select-image"}
                            validate={[
                              noEmptyElement("label"),
                              noDuplication("label"),
                              minLength(1, "At least one Option is required")
                            ]}
                          />
                        </Else>
                      </If>
                      {allowCreate && input_type === "select" && (
                        <BooleanInput
                          source={getSource("options_other")}
                          label="Has Other"
                          helperText="Enable this option to let users provide a response when they choose 'Other' as an option."
                          defaultValue={false}
                        />
                      )}
                    </Fragment>
                  );

                case "disturbances":
                  return (
                    <Fragment>
                      <BooleanInput
                        source={getSource("additional_props.with_intensity")}
                        label="Has intensity"
                        helperText="When enabled, this will prompt users to specify the intensity of the disturbance, which can be categorized as low, medium, or high."
                        defaultValue={false}
                      />
                      <BooleanInput
                        source={getSource("additional_props.with_extent")}
                        label="Has extent (% of site affected)"
                        helperText="When enabled, this will prompt users to indicate the extent of the disturbance. Users can choose from the following ranges: 0 - 20%, 21 - 40%, 41 - 60%, 61 - 80%, or 81 - 100%."
                        defaultValue={false}
                      />
                    </Fragment>
                  );

                case "seedings":
                  return (
                    <BooleanInput
                      source={getSource("additional_props.capture_count")}
                      label="Capture Count"
                      helperText="To allow users enter count instead of 'Number of seeds in sample' and 'Weight of sample(Kg)'"
                      defaultValue={false}
                    />
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

                case "file":
                  return (
                    <BooleanInput
                      source={getSource("additional_props.with_private_checkbox")}
                      label="Private or public checkbox"
                      helperText="Enable this option to allow project developers to set this file as either private or public."
                      defaultValue={false}
                    />
                  );
                default:
                  return null;
              }
            }}
          </FormDataConsumer>
          {children}
        </AccordionFormIterator>
      </ArrayInput>
      <FormQuestionPreviewDialog
        open={!!previewQuestion}
        question={previewQuestion}
        linkedFieldData={linkedFieldsData as any[]}
        onClose={() => setPreviewQuestion(undefined)}
      />
    </>
  );
};

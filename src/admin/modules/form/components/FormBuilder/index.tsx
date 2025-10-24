import { Delete as DeleteIcon, ExpandMore, UploadFile } from "@mui/icons-material";
import { Accordion, AccordionDetails, AccordionSummary, Box, Typography } from "@mui/material";
import { camelCase } from "lodash";
import { useCallback, useMemo, useState } from "react";
import { ArrayInput, DateTimeInput, maxLength, minLength, required, SelectInput, TextInput } from "react-admin";
import { useFormContext } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";

import { AccordionFormIterator } from "@/admin/components/AccordionFormIterator/AccordionFormIterator";
import {
  AddItemButton,
  PreviewButton,
  RemoveItemButton
} from "@/admin/components/AccordionFormIterator/AccordionFormIteratorButtons";
import { FormSectionPreviewDialog } from "@/admin/components/Dialogs/FormSectionPreviewDialog";
import { FileUploadInput } from "@/admin/components/Inputs/FileUploadInput";
import { RichTextInput } from "@/admin/components/RichTextInput/RichTextInput";
import {
  appendAdditionalFormQuestionFields,
  QuestionArrayInput
} from "@/admin/modules/form/components/FormBuilder/QuestionArrayInput";
import { FormBuilderData } from "@/admin/modules/form/components/FormBuilder/types";
import { maxFileSize } from "@/admin/utils/forms";
import { StepDefinition } from "@/components/extensive/WizardForm/types";
import { FormModelType, useLinkedFields } from "@/connections/util/Form";
import { LocalStep } from "@/context/wizardForm.provider";
import { Forms } from "@/generated/v3/entityService/entityServiceConstants";

type FormType = (typeof Forms.FORM_TYPES)[number];
export const formTypeChoices: { id: FormType; name: string }[] = [
  { id: "application", name: "Application" },
  { id: "project", name: "Project" },
  { id: "site", name: "Site" },
  { id: "nursery", name: "Nursery" },
  { id: "project-report", name: "Project Report" },
  { id: "site-report", name: "Site Report" },
  { id: "nursery-report", name: "Nursery Report" },
  { id: "financial-report", name: "Financial Report" },
  { id: "disturbance-report", name: "Disturbance Report" }
];

const toFormModelType = (formTypeChoice: string) => {
  const singular = camelCase(formTypeChoice);
  if (singular === "projectPitch") return "projectPitches";
  if (singular === "nursery") return "nurseries";
  return `${singular}s` as FormModelType;
};

export const FormBuilderForm = () => {
  const { getValues, watch } = useFormContext<FormBuilderData>();
  const modelTypeValue = watch("type");
  const formTypes = useMemo(
    () => modelTypeValue?.replace("application", "organisation,project-pitch")?.split(",").map(toFormModelType),
    [modelTypeValue]
  );

  const [previewSectionId, setPreviewSectionId] = useState<string>();
  const onSelectPreview = useCallback(
    (field: Record<any, any>) => setPreviewSectionId((field as StepDefinition).id),
    []
  );

  const [, { data: linkedFieldsData }] = useLinkedFields({ enabled: modelTypeValue != null, formTypes });
  const fullLinkedFields = useMemo(
    () => appendAdditionalFormQuestionFields(linkedFieldsData ?? []),
    [linkedFieldsData]
  );

  const createStep = useCallback(
    (): LocalStep => ({
      id: `new-step-${uuidv4()}`,
      title: "",
      description: "",
      fields: []
    }),
    []
  );

  const bannerRequired = getValues()?.bannerUrl == null;

  return (
    <>
      <SelectInput
        label="Form Type"
        source="type"
        choices={formTypeChoices}
        fullWidth
        disabled={modelTypeValue != null}
        helperText="If you choose the incorrect form type and need to switch, please return to the previous page and start a new form. This ensures you won't lose any data by altering the form type midway through the creation process."
        sx={{ marginBottom: 6 }}
      />
      {modelTypeValue == null ? null : (
        <>
          <div>
            <Accordion className="w-full">
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="body1">Form Introduction</Typography>
              </AccordionSummary>
              <AccordionDetails className="space-y-6">
                <TextInput
                  source="title"
                  label="Form Title"
                  helperText="Please use the form title to distinguish between different forms. This title will be displayed to the project developer on the first page of the form."
                  fullWidth
                  validate={[required(), maxLength(40)]}
                />
                <RichTextInput
                  source="description"
                  label="Form Description"
                  helperText="Please use the description to provide additional context to project developers on how to complete this form. The description will be displayed on the first page of the form to assist them throughout the process."
                  validate={[required(), maxLength(5000)]}
                  disableLevelSelect
                />
                <FileUploadInput
                  source="banner"
                  label="Upload Banner Images"
                  validate={[...(bannerRequired ? [required()] : []), maxFileSize(1)]}
                  isRequired={bannerRequired}
                  accept={["image/png", "image/svg+xml", "image/jpeg"]}
                  placeholder={
                    <Box paddingY={2}>
                      <UploadFile color="primary" />
                      <Typography variant="subtitle1" color="primary" marginBottom={0.5} marginTop={2}>
                        Click to upload or drag and drop
                      </Typography>
                      <Typography variant="caption">
                        Recommended aspect ratio is 17:7
                        <br />
                        SVG, PNG or JPG (max. 1MB)
                      </Typography>
                    </Box>
                  }
                />
                <TextInput
                  source="documentationLabel"
                  label="Download Button Title"
                  helperText="Please use the download button title to label the button on the first page of the form. This is typically used to enable project developers to download a PDF containing the form questions."
                  validate={[maxLength(25)]}
                  fullWidth
                />
                <TextInput
                  source="documentation"
                  label="Download URL"
                  helperText="Please add a link to the button above. This link is usually used to direct project developers to attachments or the help center for additional information and support."
                  validate={[maxLength(2083)]}
                  fullWidth
                />
                <DateTimeInput
                  source="deadlineAt"
                  label="Deadline(Date)"
                  helperText="Please set a deadline (date and time in Eastern Standard Time) for project developers to complete this form. The deadline will be displayed on the first page of the form and will be automatically adjusted based on the project developers' respective time zones. This field is optional; however, if you are creating a form for an application, it is strongly advised to include a deadline."
                  fullWidth
                />
              </AccordionDetails>
            </Accordion>
          </div>
          <ArrayInput source="steps" label="Form Sections" validate={minLength(1, "At least one section is required")}>
            <AccordionFormIterator
              accordionSummaryTitle={(index, fields) =>
                `Section ${index + 1} of ${fields.length} ${fields[index].title && `(${fields[index].title})`}`
              }
              addButton={<AddItemButton variant="contained" label="Add Section" />}
              addItemFactory={createStep}
              removeButton={
                <RemoveItemButton
                  variant="text"
                  label="Delete Section"
                  modalTitle="Delete Section"
                  modalContent="This is permanent, are you sure you want to delete this section?"
                >
                  <DeleteIcon />
                </RemoveItemButton>
              }
              summaryChildren={<PreviewButton onClick={onSelectPreview} />}
            >
              <TextInput
                source="title"
                label="Section Title"
                helperText="The section will be displayed on the form and is used to group questions that belong to the same category together. For example: 'Organizational Details.' This helps in organizing and presenting related questions for better clarity and efficiency."
                fullWidth
                validate={required()}
              />
              <RichTextInput
                source="description"
                label="Section Description"
                helperText="Please add a description to the category. This will assist project developers in understanding the type of questions that fall under that category, providing them with context and guidance."
                disableLevelSelect
                disableHorizontalLine
              />

              <QuestionArrayInput
                source="fields"
                label="Form Questions"
                title="Question"
                linkedFieldsData={fullLinkedFields}
                validate={minLength(1, "At least one question is required")}
                formTitle={getValues()?.title}
              />
            </AccordionFormIterator>
          </ArrayInput>

          <div className="w-full">
            <Accordion className="mt-8 w-full">
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="body1">Form Submission Message</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <RichTextInput
                  source="submissionMessage"
                  label="Submission Message"
                  helperText="Use this box to compose a message that will confirm to project developers that their submission has been sent successfully. Please ensure you include a title, a description, and guidance on the next steps after submission. You can use HTML formatting to customize the message appearance. This message will be used for both the email notification that the project developer will receive and the submission screen displayed after pressing 'Submit' on the form. Make sure the message is clear, informative, and provides any necessary instructions or follow-up actions."
                  validate={required()}
                />
              </AccordionDetails>
            </Accordion>
          </div>

          <FormSectionPreviewDialog
            open={previewSectionId != null}
            stepId={previewSectionId}
            onClose={() => setPreviewSectionId(undefined)}
          />
        </>
      )}
    </>
  );
};

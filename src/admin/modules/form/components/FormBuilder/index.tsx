import { Delete as DeleteIcon, ExpandMore, UploadFile } from "@mui/icons-material";
import { Accordion, AccordionDetails, AccordionSummary, Box, Typography } from "@mui/material";
import { get } from "lodash";
import { useState } from "react";
import { ArrayInput, DateTimeInput, maxLength, minLength, required, SelectInput, TextInput } from "react-admin";
import { useFormContext } from "react-hook-form";
import { When } from "react-if";

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
import { maxFileSize } from "@/admin/utils/forms";
import {
  useDeleteV2AdminFormsQuestionUUID,
  useDeleteV2AdminFormsSectionUUID,
  useGetV2FormsLinkedFieldListing
} from "@/generated/apiComponents";
import { FormRead, FormSectionRead, V2GenericList } from "@/generated/apiSchemas";

export const formTypeChoices = [
  { id: "application", name: "Application" },
  { id: "project", name: "Project" },
  { id: "site", name: "Site" },
  { id: "nursery", name: "Nursery" },
  { id: "project-report", name: "Project Report" },
  { id: "site-report", name: "Site Report" },
  { id: "nursery-report", name: "Nursery Report" }
];

export const getLinkedFieldListingQuery = (formType: string): string =>
  formType
    ?.replace("application", "organisation,project-pitch")
    ?.split(",")
    .map(type => `form_types[]=${type}`)
    .join("&");

export const FormBuilderForm = () => {
  const { getValues, watch } = useFormContext<FormRead>();
  const formType = watch("type");

  const { mutateAsync: deleteSection } = useDeleteV2AdminFormsSectionUUID();
  const { mutateAsync: deleteQuestion } = useDeleteV2AdminFormsQuestionUUID();
  const [previewSection, setPreviewSection] = useState<FormSectionRead>();

  const { data: linkedFieldsData } = useGetV2FormsLinkedFieldListing<{ data: V2GenericList[] }>(
    {
      // @ts-ignore
      queryParams: getLinkedFieldListingQuery(formType)
    },
    { enabled: !!formType }
  );

  const DeleteSection = async (index: number, source: string) => {
    const values = getValues();
    //@ts-ignore
    const uuid = get(values, source)[index]?.uuid;

    if (uuid) {
      //@ts-ignore
      await deleteSection({ pathParams: { uuid } });
    }
  };

  const DeleteQuestion = async (index: number, source: string) => {
    const values = getValues();
    //@ts-ignore
    const uuid = get(values, source)[index]?.uuid;

    if (uuid) {
      //@ts-ignore
      await deleteQuestion({ pathParams: { uuid } });
    }
  };

  return (
    <>
      <SelectInput
        label="Form Type"
        source="type"
        choices={formTypeChoices}
        fullWidth
        disabled={!!formType}
        helperText="If you choose the incorrect form type and need to switch, please return to the previous page and start a new form. This ensures you won't lose any data by altering the form type midway through the creation process."
        sx={{ marginBottom: 6 }}
      />
      <When condition={!!formType}>
        <>
          <div>
            <Accordion className="w-full" defaultExpanded>
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
                  validate={[required(), maxFileSize(1)]}
                  isRequired
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
                  source="documentation_label"
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
                  source="deadline_at"
                  label="Deadline(Date)"
                  helperText="Please set a deadline (date and time in Eastern Standard Time) for project developers to complete this form. The deadline will be displayed on the first page of the form and will be automatically adjusted based on the project developers' respective time zones. This field is optional; however, if you are creating a form for an application, it is strongly advised to include a deadline."
                  fullWidth
                />
              </AccordionDetails>
            </Accordion>
          </div>
          <ArrayInput
            source="form_sections"
            label="Form Sections"
            validate={minLength(1, "At least one section is required")}
          >
            <AccordionFormIterator
              defaultExpanded
              accordionSummaryTitle={(index, fields) =>
                `Section ${index + 1} of ${fields.length} ${fields[index].title && `(${fields[index].title})`}`
              }
              addButton={<AddItemButton variant="contained" label="Add Section" />}
              removeButton={
                <RemoveItemButton
                  variant="text"
                  label="Delete Section"
                  onDelete={DeleteSection}
                  modalTitle="Delete Section"
                  modalContent="This is permanent, are you sure you want to delete this section?"
                >
                  <DeleteIcon />
                </RemoveItemButton>
              }
              summaryChildren={<PreviewButton onClick={setPreviewSection} />}
            >
              <TextInput
                source="title"
                label="Form Title"
                helperText="The section will be displayed on the form and is used to group questions that belong to the same category together. For example: 'Organizational Details.' This helps in organizing and presenting related questions for better clarity and efficiency."
                fullWidth
                validate={required()}
              />
              <RichTextInput
                source="description"
                label="Form Description"
                helperText="Please add a description to the category. This will assist project developers in understanding the type of questions that fall under that category, providing them with context and guidance."
                disableLevelSelect
                disableHorizontalLine
              />

              <QuestionArrayInput
                source="form_questions"
                label="Form Questions"
                title="Question"
                linkedFieldsData={appendAdditionalFormQuestionFields(linkedFieldsData?.data || [])}
                onDeleteQuestion={DeleteQuestion}
                validate={minLength(1, "At least one question is required")}
              />
            </AccordionFormIterator>
          </ArrayInput>

          <div className="w-full">
            <Accordion className="mt-8 w-full" defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="body1">Form Submission Message</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <RichTextInput
                  source="submission_message"
                  label="Submission Message"
                  helperText="Use this box to compose a message that will confirm to project developers that their submission has been sent successfully. Please ensure you include a title, a description, and guidance on the next steps after submission. You can use HTML formatting to customize the message appearance. This message will be used for both the email notification that the project developer will receive and the submission screen displayed after pressing 'Submit' on the form. Make sure the message is clear, informative, and provides any necessary instructions or follow-up actions."
                  validate={required()}
                />
              </AccordionDetails>
            </Accordion>
          </div>

          <FormSectionPreviewDialog
            open={!!previewSection}
            //@ts-ignore
            linkedFieldData={appendAdditionalFormQuestionFields(linkedFieldsData?.data || [])}
            section={previewSection}
            onClose={() => setPreviewSection(undefined)}
          />
        </>
      </When>
    </>
  );
};

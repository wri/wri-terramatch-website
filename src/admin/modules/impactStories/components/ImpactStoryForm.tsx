import { Box, Typography } from "@mui/material";
import { memo } from "react";
import { ReferenceInput, required } from "react-admin";
import { useFormContext } from "react-hook-form";

import { FileUploadInput } from "@/admin/components/Inputs/FileUploadInput";
import { maxFileSize } from "@/admin/utils/forms";
import Button from "@/components/elements/Button/Button";
import Dropdown from "@/components/elements/Inputs/Dropdown/Dropdown";
import { VARIANT_DROPDOWN_IMPACT_STORY } from "@/components/elements/Inputs/Dropdown/DropdownVariant";
import Input from "@/components/elements/Inputs/Input/Input";
import Text from "@/components/elements/Text/Text";
import { ModalId } from "@/components/extensive/Modal/ModalConst";
import ModalStory from "@/components/extensive/Modal/ModalStory";
import { useModalContext } from "@/context/modal.provider";

import modules from "../..";
import { useImpactStoryForm } from "../hooks/useImpactStoryForm";
import QuillEditor from "./QuillEditor";
import { StyledAutocompleteInput, StyledReferenceInput } from "./StyledInputs";

export interface ImpactCategory {
  title: string;
  value: string;
}

export interface ImpactStoryFormProps {
  mode: "create" | "edit";
}

export const IMPACT_CATEGORIES: ImpactCategory[] = [
  { title: "Business development/fundraising", value: "business-dev-fund" },
  { title: "Community benefits", value: "community-benefits" },
  { title: "Livelihoods strengthening", value: "livelihoods-strengthening" },
  { title: "Gender equity", value: "gender-equity" },
  { title: "Youth engagement", value: "youth-engagement" },
  { title: "Ecosystem services", value: "ecosystem-services" },
  { title: "Climate resilience", value: "climate-resilience" },
  { title: "Institutional capacity", value: "institutional-capacity" },
  { title: "Technical capacity", value: "technical-capacity" }
];

const ImpactStoryForm: React.FC<ImpactStoryFormProps> = memo(({ mode }) => {
  const { initialValues, handlers } = useImpactStoryForm(mode);
  const { openModal } = useModalContext();
  const { getValues } = useFormContext();

  const handlePreviewClick = () => {
    const formValues = getValues();
    const previewData = {
      title: formValues.title ? formValues.title : formValues?.data?.title,
      date: formValues.date ? formValues.date : formValues?.data?.date,
      content: formValues.content ? JSON.parse(formValues.content) : JSON.parse(formValues.data?.content),
      category: formValues.category ? JSON.parse(formValues.category) : JSON.parse(formValues.data?.category),
      thumbnail:
        formValues.thumbnail instanceof File ? URL.createObjectURL(formValues.thumbnail) : formValues.thumbnail || "",
      organization: {
        name: formValues?.organization?.name
          ? formValues?.organization?.name
          : formValues?.data?.organization.name ?? "",
        category: formValues?.category ? JSON.parse(formValues?.category) : JSON.parse(formValues?.data?.category),
        country: formValues?.organization?.countries
          ? formValues?.organization?.countries
          : formValues?.data?.organization?.countries,
        facebook_url: formValues?.organization?.facebook_url
          ? formValues?.organization?.facebook_url
          : formValues?.data?.organization?.facebook_url,
        instagram_url: formValues?.organization?.instagram_url
          ? formValues?.organization?.instagram_url
          : formValues?.data?.organization?.instagram_url,
        linkedin_url: formValues?.organization?.linkedin_url
          ? formValues?.organization?.linkedin_url
          : formValues?.data?.organization?.linkedin_url,
        twitter_url: formValues?.organization?.twitter_url
          ? formValues?.organization?.twitter_url
          : formValues?.data?.organization?.twitter_url
      },
      status: formValues?.status ? formValues?.status : formValues?.data?.status
    };

    openModal(ModalId.MODAL_STORY, <ModalStory data={previewData} preview={true} title={"IMPACT_STORY"} />);
  };
  return (
    <div>
      <Text variant="text-24-bold" className="leading-[normal] text-darkCustom">
        {mode === "create" ? "Create Impact Story" : "Edit Impact Story"}
      </Text>

      <div className="mt-5 flex flex-col gap-y-6">
        <div className="grid grid-cols-2 gap-x-4">
          <Input
            label="Title of Story"
            name="title"
            type="text"
            defaultValue={initialValues.title}
            labelClassName="capitalize text-14-bold"
            className="text-14-light"
            onChange={e => handlers.handleTitleChange(e.target.value)}
            required
          />
          <Input
            label="Date"
            name="date"
            type="date"
            defaultValue={initialValues.date}
            labelClassName="capitalize text-14-bold"
            className="text-14-light"
            onChange={e => handlers.handleDateChange(e.target.value)}
            required
          />
        </div>

        <StyledReferenceInput label="Organization Details">
          <ReferenceInput
            source="organization.uuid"
            reference={modules.organisation.ResourceName}
            defaultValue={initialValues.orgUuid}
            required
          >
            <StyledAutocompleteInput optionText="name" fullWidth label={false} placeholder="Select an organization" />
          </ReferenceInput>
        </StyledReferenceInput>

        <Dropdown
          label="Impact Category"
          options={IMPACT_CATEGORIES}
          value={initialValues.categories}
          onChange={e => handlers.handleImpactCategoryChange(e as string[])}
          labelClassName="capitalize text-14-bold"
          className="text-14-light"
          multiSelect={true}
          variant={VARIANT_DROPDOWN_IMPACT_STORY}
          required
        />

        <div className="grid grid-cols-2 gap-x-4">
          <FileUploadInput
            source="thumbnail"
            label="Upload Impact Story Images"
            defaultValue={initialValues.thumbnail}
            validate={[required(), maxFileSize(1)]}
            isRequired
            accept={["image/png", "image/svg+xml", "image/jpeg"]}
            placeholder={
              <Box paddingY={2}>
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
        </div>

        <div>
          <Text variant="text-14-bold">Content</Text>
          <QuillEditor value={initialValues.content} onChange={handlers.handleContentChange} />
        </div>

        <div className="flex justify-between">
          {mode === "edit" && (
            <Button variant="semi-red" onClick={handlers.handleDelete}>
              Delete
            </Button>
          )}
          <div className="flex items-center gap-x-2">
            <Button variant="white-border" onClick={() => handlers.handleStatusChange("draft")}>
              Save as draft
            </Button>
            <Button type="button" variant="white-border" onClick={handlePreviewClick}>
              Preview
            </Button>
            <Button variant="primary" onClick={() => handlers.handleStatusChange("published")}>
              Publish
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
});

ImpactStoryForm.displayName = "ImpactStoryForm";

export default ImpactStoryForm;

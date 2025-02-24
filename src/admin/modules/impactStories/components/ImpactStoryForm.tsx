import { Box } from "@mui/material";
import { memo, useEffect, useState } from "react";
import { ReferenceInput, required } from "react-admin";
import { useFormContext } from "react-hook-form";

import { maxFileSize } from "@/admin/utils/forms";
import Button from "@/components/elements/Button/Button";
import Dropdown from "@/components/elements/Inputs/Dropdown/Dropdown";
import { VARIANT_DROPDOWN_IMPACT_STORY } from "@/components/elements/Inputs/Dropdown/DropdownVariant";
import Input from "@/components/elements/Inputs/Input/Input";
import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import { ModalId } from "@/components/extensive/Modal/ModalConst";
import ModalStory from "@/components/extensive/Modal/ModalStory";
import { useLoading } from "@/context/loaderAdmin.provider";
import { useModalContext } from "@/context/modal.provider";
import { useOnMount } from "@/hooks/useOnMount";

import modules from "../..";
import { useImpactStoryForm } from "../hooks/useImpactStoryForm";
import QuillEditor from "./QuillEditor";
import StyledFileUploadInput from "./StyledFileUploadInput";
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
  const { getValues, trigger } = useFormContext();
  const { showLoader, hideLoader } = useLoading();
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [organizationUuid, setOrganizationUuid] = useState("");

  useEffect(() => {
    setTitle(initialValues.title);
    setDate(initialValues.date);
    setOrganizationUuid(initialValues.orgUuid);
  }, [initialValues]);

  useEffect(() => {
    handlers.handleTitleChange(title);
    handlers.handleDateChange(date);
  }, [handlers, title, date]);

  useOnMount(() => hideLoader);
  const handlePreviewClick = () => {
    const formValues = getValues();
    const previewData = {
      uuid: formValues.uuid ? formValues.uuid : formValues?.data?.uuid,
      title: formValues.title ? formValues.title : formValues?.data?.title,
      date: formValues.date ? formValues.date : formValues?.data?.date,
      content: formValues.content ? JSON.parse(formValues.content) : JSON.parse(formValues.data?.content),
      category: formValues.category ? formValues.category : formValues.data?.category,
      thumbnail:
        formValues.thumbnail instanceof File ? URL.createObjectURL(formValues.thumbnail) : formValues.thumbnail || "",
      organization: {
        name: formValues?.organization?.name
          ? formValues?.organization?.name
          : formValues?.data?.organization.name ?? "",
        category: formValues?.category ? formValues?.category : formValues?.data?.category,
        country:
          formValues?.organization?.countries?.length > 0
            ? formValues.organization.countries.map((c: any) => c.label).join(", ")
            : formValues?.data?.organization?.countries?.length > 0
            ? formValues.data.organization.countries.map((c: any) => c.label).join(", ")
            : "No country",
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
  const handleSave = async (status: "draft" | "published") => {
    const isValid = await trigger();
    if (!isValid) {
      return;
    }
    showLoader();
    handlers.handleStatusChange(status);
  };
  return (
    <div className="impact-story-form w-full">
      <Text variant="text-24-bold" className="leading-[normal] text-darkCustom">
        {mode === "create" ? "Create Impact Story" : "Edit Impact Story"}
      </Text>

      <div className="mt-5 flex flex-col gap-y-6">
        <div className="grid grid-cols-2 gap-x-4">
          <Input
            label="Title of Story"
            name="title"
            type="text"
            value={title}
            labelClassName="capitalize text-14-bold"
            className="text-14-light"
            onChange={e => setTitle(e.target.value)}
            required
          />
          <Input
            label="Date"
            name="date"
            type="date"
            value={date}
            labelClassName="capitalize text-14-bold"
            className="text-14-light"
            onChange={e => setDate(e.target.value)}
            required
          />
        </div>

        <StyledReferenceInput label="Organization Details">
          <ReferenceInput source="organization.uuid" reference={modules.organisation.ResourceName} required>
            <StyledAutocompleteInput
              optionText="name"
              fullWidth
              label={false}
              placeholder="Select an organization"
              defaultValue={organizationUuid}
            />
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
          <StyledFileUploadInput
            source="thumbnail"
            label="Upload Impact Story Images"
            defaultValue={initialValues.thumbnail}
            validate={[required(), maxFileSize(1)]}
            isRequired
            accept={["image/png", "image/svg+xml", "image/jpeg"]}
            placeholder={
              <Box className="flex flex-col items-center gap-y-2">
                <Icon
                  name={IconNames.UPLOAD_CLOUD_CUSTOM}
                  className="h-8 w-8 rounded-full bg-neutral-250 p-2 text-black"
                />
                <Text variant="text-12-bold" className="text-primary">
                  Click to upload
                </Text>
                <Text variant="text-12-bold" className="text-primary">
                  documents or images to help reviewer
                </Text>
              </Box>
            }
          />
          <Text variant="text-14-bold">Uploaded</Text>
        </div>

        <div>
          <Text variant="text-14-bold" className="mb-2">
            Content
          </Text>
          <QuillEditor value={initialValues.content} onChange={handlers.handleContentChange} />
        </div>

        <div className="flex justify-between">
          {mode === "edit" && (
            <Button variant="semi-red" onClick={handlers.handleDelete}>
              Delete
            </Button>
          )}
          <div className="ml-auto flex items-center gap-x-2">
            <Button variant="white-border" onClick={() => handleSave("draft")}>
              Save as draft
            </Button>
            <Button type="button" variant="white-border" onClick={handlePreviewClick}>
              Preview
            </Button>
            <Button variant="primary" onClick={() => handleSave("published")}>
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

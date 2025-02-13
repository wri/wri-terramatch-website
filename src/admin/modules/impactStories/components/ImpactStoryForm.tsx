import { memo } from "react";
import { ReferenceInput } from "react-admin";

import Button from "@/components/elements/Button/Button";
import Dropdown from "@/components/elements/Inputs/Dropdown/Dropdown";
import { VARIANT_DROPDOWN_IMPACT_STORY } from "@/components/elements/Inputs/Dropdown/DropdownVariant";
import FileInput from "@/components/elements/Inputs/FileInput/FileInput";
import { VARIANT_FILE_INPUT_IMPACT_STORY } from "@/components/elements/Inputs/FileInput/FileInputVariants";
import Input from "@/components/elements/Inputs/Input/Input";
import Text from "@/components/elements/Text/Text";

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
  { title: "Gender equity", value: "gender-equity" },
  { title: "Youth engagement", value: "youth-engagement" },
  { title: "Ecosystem services", value: "ecosystem-services" }
];

const ImpactStoryForm: React.FC<ImpactStoryFormProps> = memo(({ mode }) => {
  const { initialValues, handlers } = useImpactStoryForm(mode);
  console.log("initialValues", initialValues.orgUuid);
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
          />
          <Input
            label="Date"
            name="date"
            type="date"
            defaultValue={initialValues.date}
            labelClassName="capitalize text-14-bold"
            className="text-14-light"
            onChange={e => handlers.handleDateChange(e.target.value)}
          />
        </div>

        <StyledReferenceInput label="Organization Details">
          <ReferenceInput
            source="organization.uuid"
            reference={modules.organisation.ResourceName}
            defaultValue={initialValues.orgUuid}
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
        />

        <div className="grid grid-cols-2 gap-x-4">
          <FileInput
            onChange={handlers.handleFileChange}
            variant={VARIANT_FILE_INPUT_IMPACT_STORY}
            files={[]}
            allowMultiple={false}
            label="Thumbnail"
            labelClassName="capitalize text-14-bold"
            classNameTextOr="hidden"
            descriptionInput={
              <Text variant="text-12-bold" className="text-center text-primary">
                documents or images to help reviewer
              </Text>
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
            <Button variant="white-border" onClick={handlers.handlePreview}>
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

import { t } from "@transifex/native";
import React from "react";

import Button from "@/components/elements/Button/Button";
import Dropdown from "@/components/elements/Inputs/Dropdown/Dropdown";
import { VARIANT_DROPDOWN_IMPACT_STORY } from "@/components/elements/Inputs/Dropdown/DropdownVariant";
import FileInput from "@/components/elements/Inputs/FileInput/FileInput";
import { VARIANT_FILE_INPUT_IMPACT_STORY } from "@/components/elements/Inputs/FileInput/FileInputVariants";
import Input from "@/components/elements/Inputs/Input/Input";
import Text from "@/components/elements/Text/Text";
import { ModalId } from "@/components/extensive/Modal/ModalConst";
import ModalStory from "@/components/extensive/Modal/ModalStory";
import { useModalContext } from "@/context/modal.provider";

import QuillEditor from "./QuillEditor";

const ImpactStoriesEditForm = () => {
  const { openModal } = useModalContext();
  const ModalStoryOpen = (uuid: string) => {
    openModal(ModalId.MODAL_STORY, <ModalStory uuid={uuid} title={t("IMPACT STORY")} preview={true} />);
  };
  return (
    <div>
      <Text variant="text-24-bold" className="leading-[normal] text-darkCustom">
        Edit Impact Story
      </Text>
      <div className="mt-5 flex flex-col gap-y-6">
        <div className="grid grid-cols-2 gap-x-4">
          <Input
            label="Title of Story"
            name="title"
            type="text"
            labelClassName="capitalize text-14-bold"
            className="text-14-light"
          />
          <Input
            label="Date"
            name="title"
            type="date"
            labelClassName="capitalize text-14-bold"
            className="text-14-light"
          />
        </div>
        <Dropdown
          label="Impact Category"
          options={[
            {
              title: "Gender equity",
              value: "gender-equity"
            },
            {
              title: "Youth engagement",
              value: "youth-engagement"
            },
            {
              title: "Ecosystem services",
              value: "ecosystem-services"
            }
          ]}
          onChange={() => {}}
          labelClassName="capitalize text-14-bold"
          className="text-14-light"
          multiSelect={true}
          variant={VARIANT_DROPDOWN_IMPACT_STORY}
        />
        <div className="grid grid-cols-2 gap-x-4">
          <div>
            <FileInput
              onChange={() => {}}
              variant={VARIANT_FILE_INPUT_IMPACT_STORY}
              files={[]}
              allowMultiple={true}
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

          <Input
            label="Uploaded"
            name="title"
            type="text"
            labelClassName="capitalize text-14-bold"
            className="text-14-light"
          />
        </div>
        <Text variant={"text-14-bold"}>Content</Text>
        <QuillEditor />
        <div className="grid grid-cols-2 gap-x-4">
          <Input
            label="Organization Details"
            name="title"
            type="text"
            labelClassName="capitalize text-14-bold"
            className="text-14-light"
          />
        </div>
        <div className="flex justify-between">
          <Button variant="semi-red">Delete</Button>
          <div className="flex items-center gap-x-2">
            <Button variant="white-border">Save as draft</Button>
            <Button variant="white-border" onClick={() => ModalStoryOpen("impact-story-1")}>
              Preview
            </Button>
            <Button variant="primary">Publish</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImpactStoriesEditForm;

import { FormProps } from "react-admin";
import { UseControllerProps, UseFormReturn } from "react-hook-form";

import Input, { InputProps } from "@/components/elements/Inputs/Input/Input";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";

import Accordion from "../../Accordion/Accordion";
import Button from "../../Button/Button";
import Dropdown from "../Dropdown/Dropdown";
import RHFFileInput from "../FileInput/RHFFileInput";
import InputWrapper from "../InputElements/InputWrapper";
import TextArea from "../textArea/TextArea";

export interface CollapseDisturbanceProps extends Omit<InputProps, "defaultValue">, UseControllerProps {
  fields: FormProps[];
  formHook: UseFormReturn;
  onChangeCapture: () => void;
}

const Options = [
  { value: "fire", title: "Fire" },
  { value: "flood", title: "Flood" },
  { value: "drought", title: "Drought" },
  { value: "erosion", title: "Erosion" },
  { value: "other", title: "Other" }
];

const CollapseDisturbance = (props: CollapseDisturbanceProps) => {
  return (
    <InputWrapper {...props}>
      <Accordion title="Add Disturbance" variant="tertiary" defaultOpen>
        <div className="border-light rounded-b-xl p-4">
          <div className="grid grid-cols-2 gap-x-10 gap-y-10">
            <Dropdown
              placeholder="Select here"
              label="Disturbance Type"
              required
              options={Options}
              onChange={() => {}}
            />
            <Dropdown
              placeholder="Select here"
              label="Disturbance Subtype"
              required
              options={Options}
              multiSelect
              onChange={() => {}}
            />
            <Dropdown placeholder="Select here" label="Intensity" required options={Options} onChange={() => {}} />
            <Dropdown placeholder="Select here" label="Extent" required options={Options} onChange={() => {}} />
            <Input type="text" name="people_affected" placeholder="Select here" label="People Affected" required />
            <Input type="number" name="monetary_damage" placeholder="Select here" label="Monetary Damage" required />
            <Dropdown
              placeholder="Select here"
              label="Property Affected"
              required
              options={Options}
              onChange={() => {}}
            />
            <Dropdown
              placeholder="Select here"
              label="Date of Disturbance"
              required
              options={Options}
              onChange={() => {}}
            />
            <div className="col-span-2 w-full border-t border-black border-opacity-12" />
            <Dropdown
              placeholder="Select here"
              label="Site 1 Affected"
              required
              options={Options}
              onChange={() => {}}
            />
            <Input
              type="date"
              name="date_of_disturbance"
              placeholder="Select here"
              label="Date of Disturbance"
              required
            />
            <Dropdown
              placeholder="Select here"
              label="Site 2 Affected"
              required
              options={Options}
              onChange={() => {}}
              suffixLabel={<button className="px-0 font-semibold text-black/40 hover:text-red">Remove</button>}
              labelClassName="justify-between"
              suffixLabelView
            />
            <Dropdown
              placeholder="Select here"
              label="Polygons Affected"
              required
              options={Options}
              onChange={() => {}}
            />
            <div className="col-span-2 flex justify-end">
              <Button variant="secondary-blue" className="-mr-2.5 border-none">
                <p className="text-14-bold flex items-center gap-1 normal-case">
                  <div className="flex h-4 w-4 items-center justify-center rounded bg-primary">
                    <Icon name={IconNames.PLUS} className="h-2.5 w-2.5 text-white" />
                  </div>
                  Add Site Affected
                </p>
              </Button>
            </div>
            <div className="col-span-2 w-full border-t border-black border-opacity-12" />
            <div className="col-span-2 grid grid-cols-1 gap-x-10 gap-y-10">
              <TextArea name="description" placeholder="Insert Description" label="Description" required rows={2} />
              <TextArea
                name="action_description"
                placeholder="Insert Action Description"
                label="Action Description"
                required
                rows={2}
              />
              <RHFFileInput
                name="disturbance"
                model="disturbance"
                collection="disturbance"
                uuid="disturbance"
                formHook={props.formHook}
                control={props.formHook.control}
                onChangeCapture={props.onChangeCapture}
              />
            </div>
          </div>
        </div>
      </Accordion>
    </InputWrapper>
  );
};

export default CollapseDisturbance;

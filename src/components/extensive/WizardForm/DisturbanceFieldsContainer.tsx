import { FieldValues, UseFormReturn } from "react-hook-form";

import Accordion from "@/components/elements/Accordion/Accordion";
import InputDescription from "@/components/elements/Inputs/InputElements/InputDescription";

import { DisturbanceAffectedSites } from "./DisturbanceAffectedSites";
import { FieldMapper } from "./FieldMapper";
import { FormField } from "./types";

interface DisturbanceFieldsContainerProps {
  fields: FormField[];
  formHook: UseFormReturn<FieldValues, any>;
  onChange: () => void;
  projectUuid?: string;
}

export const DisturbanceFieldsContainer = ({
  fields,
  formHook,
  onChange,
  projectUuid
}: DisturbanceFieldsContainerProps) => {
  const inputDropdownFields = fields.filter(
    f => (f.type === "dropdown" || f.type === "input") && !f.type.startsWith("disturbanceAffected")
  );
  const textAreaFields = fields.filter(f => f.type === "textArea");
  const fileFields = fields.filter(f => f.type === "file");
  const affectedFields = fields.filter(f => f.type.startsWith("disturbanceAffected"));

  return (
    <div key="disturbance-container">
      <Accordion title="Add Disturbance" variant="tertiary" defaultOpen>
        <div className="border-light rounded-b-xl p-4">
          <div className="mb-6">
            <h3 className="mb-4 text-lg font-semibold">Add Disturbance Information</h3>
            <InputDescription>
              {`The three major disturbance types used in TerraMatch are defined below: <ul>
                <li>Ecological – minor natural disturbances that impact less than half of planted species, including pests, small erosion events, etc.</li>
                <li>Climatic – major natural disturbances that impact more than half of planted species or the landscape as a whole, including flooding, wildfires, etc.</li>
                <li>Man-made – minor or major human-caused disturbances, including site vandalism, illegal grazing, etc.</li>
              </ul>`}
            </InputDescription>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-x-10 gap-y-10">
              {inputDropdownFields.map((field, index) => {
                if (index % 2 === 0 && index < inputDropdownFields.length - 1) {
                  const nextField = inputDropdownFields[index + 1];
                  return (
                    <div key={`${field.name}-${index}`} className="contents">
                      <div>
                        <FieldMapper field={field} formHook={formHook} onChange={onChange} />
                      </div>
                      <div>
                        <FieldMapper field={nextField} formHook={formHook} onChange={onChange} />
                      </div>
                    </div>
                  );
                }

                if (index % 2 === 1) {
                  return null;
                }

                return (
                  <div key={`${field.name}-${index}`}>
                    <FieldMapper field={field} formHook={formHook} onChange={onChange} />
                  </div>
                );
              })}
            </div>
            <div className="col-span-2 w-full border-t border-black border-opacity-12" />

            <DisturbanceAffectedSites
              formHook={formHook}
              onChange={onChange}
              projectUuid={projectUuid}
              fields={affectedFields}
            />
            {textAreaFields.map((field, index) => (
              <div key={`${field.name}-${index}`}>
                <FieldMapper field={field} formHook={formHook} onChange={onChange} />
              </div>
            ))}

            {fileFields.map((field, index) => (
              <div key={`${field.name}-${index}`}>
                <FieldMapper field={field} formHook={formHook} onChange={onChange} />
              </div>
            ))}
          </div>
        </div>
      </Accordion>
    </div>
  );
};

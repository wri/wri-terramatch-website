import { Delete as DeleteIcon } from "@mui/icons-material";
import { Button } from "@mui/material";
import { get } from "lodash";
import { FC, useCallback, useState } from "react";
import { ArrayInput, BooleanInput, FormDataConsumerRenderParams, required, TextInput } from "react-admin";
import { useFormContext } from "react-hook-form";

import { AccordionFormIterator } from "@/admin/components/AccordionFormIterator/AccordionFormIterator";
import { AddItemButton, RemoveItemButton } from "@/admin/components/AccordionFormIterator/AccordionFormIteratorButtons";
import { getEntryConfigs, TrackingDomain, TrackingType } from "@/components/extensive/TrackingCollapseGrid/types";
import { useFrameworkContext } from "@/context/framework.provider";
import { useValueChanged } from "@/hooks/useValueChanged";

type TrackingAdditionalOptionsProps = {
  type: TrackingType;
  domain: TrackingDomain;
  getSource: NonNullable<FormDataConsumerRenderParams["getSource"]>;
};

const TrackingAdditionalOptions: FC<TrackingAdditionalOptionsProps> = ({ type, domain, getSource }) => {
  const { framework } = useFrameworkContext();
  const source = getSource("additionalProps.entryConfigs");
  const form = useFormContext();

  const currentValue = get(form.getValues(), source);
  const currentValueSet = Array.isArray(currentValue) && currentValue.length > 0;
  const [editEntries, setEditEntries] = useState(currentValueSet);

  useValueChanged(editEntries, () => {
    if (editEntries && !currentValueSet) {
      form.setValue(source, getEntryConfigs(domain, type, framework), { shouldDirty: true });
    }
  });

  const resetToDefault = useCallback(() => {
    setEditEntries(false);
    form.setValue(source, null, { shouldDirty: true });
  }, [form, source]);

  return (
    <>
      {!editEntries ? (
        <Button variant="contained" onClick={() => setEditEntries(true)}>
          Customize Tracking Entries
        </Button>
      ) : (
        <>
          <Button variant="contained" onClick={resetToDefault}>
            Reset Tracking Entries to Platform Default
          </Button>
          <ArrayInput source={source} label="Tracking Entry Configurations">
            <AccordionFormIterator
              accordionSummaryTitle={(index, entries) =>
                `Entry ${index + 1} of ${entries.length} (${entries[index].type})`
              }
              addButton={<AddItemButton variant="contained" label="Add Tracking Entry" />}
              removeButton={
                <RemoveItemButton
                  variant="text"
                  label="Delete Tracking Entry"
                  modalTitle="Delete Tracking Entry"
                  modalContent="Are you sure you want to delete this tracking entry?"
                >
                  <DeleteIcon />
                </RemoveItemButton>
              }
            >
              <TextInput source="type" label="Type" validate={required()} />
              <TextInput source="title" label="Title" validate={required()} />
              <BooleanInput source="balanced" label="Require Balanced" defaultValue={true} />
              <TextInput
                source="addNameLabel"
                label="Add Name Label"
                helperText={
                  'e.g. "Add Ethnic Group". If left blank, "name" support is left off of this entry configuration.'
                }
              />
              <ArrayInput source="subTypes" label="Subtypes">
                <AccordionFormIterator
                  accordionSummaryTitle={(index, entries) =>
                    `Subtype ${index + 1} of ${entries.length} (${entries[index].subtype})`
                  }
                  addButton={<AddItemButton variant="contained" label="Add Entry Subtype" />}
                  removeButton={
                    <RemoveItemButton
                      variant="text"
                      label="Delete Entry Subtype"
                      modalTitle="Delete Entry Subtype"
                      modalContent="Are you sure you want to delete this entry subtype?"
                    >
                      <DeleteIcon />
                    </RemoveItemButton>
                  }
                >
                  <TextInput source="subtype" label="Subtype" validate={required()} />
                  <TextInput source="label" label="Label" validate={required()} />
                </AccordionFormIterator>
              </ArrayInput>
            </AccordionFormIterator>
          </ArrayInput>
        </>
      )}
    </>
  );
};

export default TrackingAdditionalOptions;

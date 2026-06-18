import { Button } from "@mui/material";
import { get } from "lodash";
import { FC, useState } from "react";
import {
  ArrayInput,
  BooleanInput,
  FormDataConsumerRenderParams,
  required,
  SimpleFormIterator,
  TextInput
} from "react-admin";
import { useFormContext } from "react-hook-form";

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
  const { setValue, getValues } = useFormContext();

  const currentValue = get(getValues(), source);
  const currentValueSet = Array.isArray(currentValue) && currentValue.length > 0;
  const [editEntries, setEditEntries] = useState(currentValueSet);

  useValueChanged(editEntries, () => {
    if (editEntries && !currentValueSet) setValue(source, getEntryConfigs(domain, type, framework));
  });

  return (
    <>
      {!editEntries ? (
        <Button onClick={() => setEditEntries(true)}>Customize Entries</Button>
      ) : (
        <ArrayInput source={source} label="Entry Configurations">
          <SimpleFormIterator>
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
              <SimpleFormIterator inline>
                <TextInput source="subtype" label="Subtype" validate={required()} />
                <TextInput source="label" label="Label" validate={required()} />
              </SimpleFormIterator>
            </ArrayInput>
          </SimpleFormIterator>
        </ArrayInput>
      )}
    </>
  );
};

export default TrackingAdditionalOptions;

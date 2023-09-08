import { SxProps, Typography } from "@mui/material";
import {
  ArrayInput,
  ArrayInputProps,
  AutocompleteInput,
  FormDataConsumer,
  FormDataConsumerRenderParams,
  required,
  SimpleFormIterator,
  useInput
} from "react-admin";

import { Choice } from "@/admin/types/common";

interface OptionArrayInputProps extends Omit<ArrayInputProps, "children"> {
  dropDownOptions: Choice[];
  allowCreate?: boolean;
}

export const OptionArrayInput = ({ allowCreate, dropDownOptions, ...arrayInputProps }: OptionArrayInputProps) => {
  const getOption = (slug: string) => arrayInputProps.defaultValue?.find((option: any) => option.slug === slug);

  return (
    <ArrayInput {...arrayInputProps}>
      <SimpleFormIterator sx={SimpleFormIteratorStyles}>
        <FormDataConsumer>
          {({ scopedFormData, getSource }: FormDataConsumerRenderParams) => {
            if (!scopedFormData || !getSource) return null;

            return <Typography variant="body1">{scopedFormData.label}</Typography>;
          }}
        </FormDataConsumer>
        <FormDataConsumer>
          {({ scopedFormData, getSource }: FormDataConsumerRenderParams) => {
            if (!scopedFormData || !getSource || !!scopedFormData.label) return null;
            const { field } = useInput({ source: getSource("") });

            return (
              <AutocompleteInput
                source=""
                label="Field"
                fullWidth
                choices={dropDownOptions}
                allowCreate={allowCreate}
                onChange={slug => {
                  const option = getOption(slug);
                  if (option) field.onChange(option);
                }}
                onCreate={allowCreate ? label => field.onChange({ label }) : undefined}
                validate={required()}
              />
            );
          }}
        </FormDataConsumer>
      </SimpleFormIterator>
    </ArrayInput>
  );
};

const SimpleFormIteratorStyles: SxProps = {
  "&": {
    maxHeight: 400,
    overflow: "auto"
  },
  "& .RaSimpleFormIterator-line": {
    flexDirection: "row",
    justifyContent: "space-between",
    textAlign: "center",
    paddingY: 1
  },
  "& .RaSimpleFormIterator-action": { visibility: "visible", padding: 0, margin: 0, border: "none" },
  "& .RaSimpleFormIterator-action .button-remove": {
    height: "fit-content"
  },
  "& .RaSimpleFormIterator-form": { justifyContent: "center" }
};

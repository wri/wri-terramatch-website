import { DeleteForever, UploadFile } from "@mui/icons-material";
import { Box, IconButton, SxProps, Typography } from "@mui/material";
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

import { FileUploadInput } from "@/admin/components/Inputs/FileUploadInput";
import { Choice } from "@/admin/types/common";
import { maxFileSize } from "@/admin/utils/forms";

interface OptionArrayInputProps extends Omit<ArrayInputProps, "children"> {
  dropDownOptions: Choice[];
  allowImages?: boolean;
  allowCreate?: boolean;
}

export const OptionArrayInput = ({
  allowImages,
  allowCreate,
  dropDownOptions,
  ...arrayInputProps
}: OptionArrayInputProps) => {
  const getOption = (slug: string) => arrayInputProps.defaultValue?.find((option: any) => option.slug === slug);

  return (
    <ArrayInput {...arrayInputProps}>
      <SimpleFormIterator sx={SimpleFormIteratorStyles}>
        <FormDataConsumer>
          {({ scopedFormData, getSource }: FormDataConsumerRenderParams) => {
            if (!scopedFormData || !getSource) return null;
            const { field } = useInput({ source: getSource("") });

            const imageSrc = scopedFormData.image?.src || scopedFormData.image?.url || scopedFormData.image_url;

            return (
              <Box flexDirection="row" gap={2} display="flex" alignItems="center">
                {imageSrc && (
                  <div className="relative hover:[&>button]:opacity-100">
                    <img src={imageSrc} height={100} width={100} alt="" role="presentation" />
                    <IconButton
                      className="!absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] opacity-0"
                      onClick={() => field.onChange({ ...field.value, image_url: null, image: null })}
                      color="error"
                      size="large"
                    >
                      <DeleteForever />
                    </IconButton>
                  </div>
                )}
                <Typography variant="body1">{scopedFormData.label}</Typography>
              </Box>
            );
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

                  if (option) field.onChange({ ...field.value, ...option });
                }}
                onCreate={allowCreate ? label => field.onChange({ ...field.value, label }) : undefined}
                validate={required()}
              />
            );
          }}
        </FormDataConsumer>
        <FormDataConsumer>
          {({ scopedFormData, getSource }: FormDataConsumerRenderParams) => {
            if (!allowImages || !scopedFormData || !getSource || !!scopedFormData?.image || scopedFormData.image_url)
              return null;

            return (
              <FileUploadInput
                source={getSource("image")}
                label="Option Icon"
                validate={[required(), maxFileSize(1)]}
                isRequired
                fullWidth
                accept={["image/png", "image/svg+xml", "image/jpeg"]}
                placeholder={
                  <Box paddingY={2}>
                    <UploadFile color="primary" />
                    <Typography variant="subtitle1" color="primary" marginBottom={0.5} marginTop={2}>
                      Click to upload or drag and drop
                    </Typography>
                    <Typography variant="caption">
                      Recommended aspect ratio is 1:1
                      <br />
                      SVG, PNG or JPG (max. 1MB)
                    </Typography>
                  </Box>
                }
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

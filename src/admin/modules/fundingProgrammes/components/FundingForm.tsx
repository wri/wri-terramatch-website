import { Delete as DeleteIcon, UploadFile } from "@mui/icons-material";
import { Box, Divider, Typography } from "@mui/material";
import { get } from "lodash";
import {
  ArrayInput,
  AutocompleteInput,
  DateTimeInput,
  maxLength,
  ReferenceInput,
  required,
  SelectArrayInput,
  SelectInput,
  TextInput
} from "react-admin";
import { useFormContext } from "react-hook-form";

import { AccordionFormIterator } from "@/admin/components/AccordionFormIterator/AccordionFormIterator";
import { AddItemButton, RemoveItemButton } from "@/admin/components/AccordionFormIterator/AccordionFormIteratorButtons";
import { FileUploadInput } from "@/admin/components/Inputs/FileUploadInput";
import modules from "@/admin/modules";
import { getOrganisationTypeOptions } from "@/constants/options/organisations";
import { useDeleteV2AdminFundingProgrammeStageUUID } from "@/generated/apiComponents";
import { FundingProgramme } from "@/generated/apiSchemas";
import { optionToChoices } from "@/utils/options";

import statusChoices from "../constants/statusChoices";

const FundingForm = () => {
  const { getValues } = useFormContext<FundingProgramme>();

  const { mutate: deleteStage } = useDeleteV2AdminFundingProgrammeStageUUID();

  const DeleteStage = async (index: number, source: string) => {
    const values = getValues();
    //@ts-ignore
    const uuid = get(values, source)[index]?.uuid;

    if (uuid) {
      //@ts-ignore
      await deleteStage({ pathParams: { uuid } });
    }
  };

  return (
    <>
      <TextInput source="name" fullWidth label="Funding Program Title" validate={[required(), maxLength(100)]} />
      <TextInput
        source="description"
        fullWidth
        label="Funding Program Description"
        validate={[required(), maxLength(290)]}
      />
      <TextInput source="read_more_url" fullWidth label="Read More Url" validate={[required()]} />
      <TextInput source="location" label="Location" fullWidth />
      <SelectInput source="status" label="Status" choices={statusChoices} fullWidth validate={required()} />
      <SelectArrayInput
        source="organisation_types"
        label="Organization type"
        choices={optionToChoices(getOrganisationTypeOptions())}
        fullWidth
        validate={required()}
      />

      <FileUploadInput
        source="cover"
        label="Cover"
        fullWidth
        validate={required()}
        placeholder={
          <Box paddingY={2}>
            <UploadFile color="primary" />
            <Typography variant="subtitle1" color="primary" marginBottom={0.5} marginTop={2}>
              Click to upload or drag and drop
            </Typography>
            <Typography variant="caption">
              Recommended aspect ratio is 17:7
              <br />
              PNG or JPG (max. 1MB)
            </Typography>
          </Box>
        }
      />

      <ArrayInput source="stages" label="Stages">
        <AccordionFormIterator
          defaultExpanded
          accordionSummaryTitle={(index, fields) =>
            `Stage ${index + 1} of ${fields.length} ${fields[index].name ? `$(${fields[index].name})` : ""}`
          }
          addButton={<AddItemButton label="Add Stage" variant="outlined" />}
          removeButton={
            <RemoveItemButton
              variant="text"
              label="Delete Stage"
              onDelete={DeleteStage}
              modalTitle="Delete Stage"
              modalContent="This is permanent, are you sure you want to delete this Stage?"
            >
              <DeleteIcon />
            </RemoveItemButton>
          }
        >
          <TextInput source="name" label="Stage Name" fullWidth validate={[required(), maxLength(50)]} />

          <ReferenceInput source="form.uuid" reference={modules.form.ResourceName} filter={{ type: "application" }}>
            <AutocompleteInput optionText="title" fullWidth validate={[required()]} />
          </ReferenceInput>

          <DateTimeInput source="deadline_at" label="Stage Deadline" fullWidth />
        </AccordionFormIterator>
      </ArrayInput>
      <Divider />
    </>
  );
};

export default FundingForm;

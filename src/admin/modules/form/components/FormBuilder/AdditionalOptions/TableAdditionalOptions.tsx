import { Box } from "@mui/material";
import { FC, Fragment } from "react";
import { BooleanInput, minLength, required, TextInput, useInput } from "react-admin";

import { FormQuestionField, QuestionArrayInput } from "@/admin/modules/form/components/FormBuilder/QuestionArrayInput";

type TableAdditionalOptionsProps = {
  linkedFieldsData: FormQuestionField[];
};

const TableAdditionalOptions: FC<TableAdditionalOptionsProps> = ({ linkedFieldsData }) => {
  const {
    field: { value: hasTotal }
  } = useInput({ source: "additionalProps.with_numbers" });
  return (
    <>
      <Box display="flex" width="100%" gap={2} marginTop={2}>
        <TextInput
          source="tableHeaders.0"
          label="Table Header (Question)"
          helperText=""
          fullWidth
          validate={required()}
        />
        <TextInput
          source="tableHeaders.1"
          label="Table Header (Answer)"
          helperText=""
          fullWidth
          validate={required()}
        />
      </Box>
      <BooleanInput
        source="additionalProps.with_numbers"
        label="Has Total"
        helperText="To append total value of answers at the end of 'Table Header (Answer)'. if turned on you'll only be able to select number inputs."
        defaultValue={false}
      />
      <QuestionArrayInput
        source="children"
        label="Table Questions"
        title="Child Question"
        linkedFieldsData={linkedFieldsData.filter(
          field => (!hasTotal && field.inputType === "text") || field.inputType?.includes("number")
        )}
        hideDescriptionInput
        isChildQuestion
        validate={minLength(1, "At least one child Question is required")}
      />
    </>
  );
};

export default TableAdditionalOptions;

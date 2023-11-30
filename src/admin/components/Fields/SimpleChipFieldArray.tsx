import { Typography } from "@mui/material";
import { ArrayField, ArrayFieldProps, ChipField, FunctionField, SingleFieldList, useRecordContext } from "react-admin";

import { Choice } from "@/admin/types/common";

interface SimpleChipFieldArrayProps extends Omit<ArrayFieldProps, "children"> {
  choices: Choice[];
}

const SimpleChipFieldArray = (props: SimpleChipFieldArrayProps) => {
  const recordContext = useRecordContext();

  //fix: RA crashes when null or undefined passed to an arrayField
  if (!Array.isArray(recordContext[props.source!])) {
    return (
      <Typography component="span" variant="body2">
        {props.emptyText || "Not Provided"}
      </Typography>
    );
  }

  return (
    <ArrayField {...props}>
      <SingleFieldList linkType={false}>
        <FunctionField
          render={(record: string) => (
            <ChipField record={{ name: props.choices.find(i => i.id === record)?.name }} source="name" />
          )}
        />
      </SingleFieldList>
    </ArrayField>
  );
};

export default SimpleChipFieldArray;

import { Typography } from "@mui/material";
import { ArrayField, ArrayFieldProps, ChipField, FunctionField, SingleFieldList, useRecordContext } from "react-admin";

import { Choice } from "@/admin/types/common";

interface SimpleChipFieldArrayProps extends Omit<ArrayFieldProps, "children"> {
  choices: Choice[];
  valueByPath?: Boolean;
}

const getValueByPath = (obj: any, path: string) => {
  return path.split(".").reduce((acc, part) => acc && acc[part], obj);
};

const SimpleChipFieldArray = (props: SimpleChipFieldArrayProps) => {
  const recordContext = useRecordContext();
  const sourceValue = props.valueByPath ? getValueByPath(recordContext, props.source!) : recordContext[props.source!];

  //fix: RA crashes when null or undefined passed to an arrayField
  if (!Array.isArray(sourceValue)) {
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

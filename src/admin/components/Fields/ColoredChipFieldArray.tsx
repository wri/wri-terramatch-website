import { Typography } from "@mui/material";
import { ArrayField, ArrayFieldProps, ChipField, FunctionField, SingleFieldList, useRecordContext } from "react-admin";

import { Choice } from "@/admin/types/common";

interface ColoredChipFieldArrayProps extends Omit<ArrayFieldProps, "children"> {
  choices: Choice[];
}

const POLYGON_SUBMITTED_TYPE_CLASSNAME_MAP: { [key: string]: string } = {
  Approved: "bg-green-30 text-green-100",
  Rejected: "bg-error-400 text-error-600",
  "Under Review": "bg-yellow-300 text-yellow-700",
  "Awaiting approval": "bg-yellow-300 text-yellow-700",
  "Planting in progress": "bg-yellow-300 text-yellow-700",
  Draft: "bg-yellow-300 text-yellow-700",
  Unknown: "",
  "Needs more information": "bg-yellow-300 text-yellow-700"
};

const ColoredChipFieldArray = (props: ColoredChipFieldArrayProps) => {
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
          render={(record: string) => {
            const choise = props.choices.find(i => i.id === record)?.name as string;
            return (
              <ChipField
                record={{ name: choise }}
                source="name"
                className={POLYGON_SUBMITTED_TYPE_CLASSNAME_MAP[choise]}
              />
            );
          }}
        />
      </SingleFieldList>
    </ArrayField>
  );
};

export default ColoredChipFieldArray;

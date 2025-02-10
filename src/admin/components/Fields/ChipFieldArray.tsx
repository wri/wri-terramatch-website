import classNames from "classnames";
import React from "react";
import { ArrayField, ArrayFieldProps, ChipField, FunctionField, SingleFieldList } from "react-admin";

interface ChipFieldArrayProps extends Omit<ArrayFieldProps, "children"> {
  data: { id: string; label: string; className?: string }[];
  emptyText?: string;
}

const ChipFieldArray: React.FC<ChipFieldArrayProps> = ({ data, emptyText, ...props }) => {
  if (!data.length) {
    return (
      <div className="text-14 w-fit-content whitespace-nowrap rounded-[3px] bg-grey-200 px-2 text-grey-500">
        {emptyText ?? "Not Provided"}
      </div>
    );
  }

  return (
    <ArrayField {...props} record={{ [props.source!]: data }}>
      <SingleFieldList linkType={false}>
        <FunctionField
          render={(record?: { id: string; label: string; className?: string }) =>
            record ? (
              <ChipField
                record={{ label: record.label }}
                source="label"
                className={classNames("!h-fit !rounded-[3px] text-grey-500", record.className)}
              />
            ) : null
          }
        />
      </SingleFieldList>
    </ArrayField>
  );
};

export default ChipFieldArray;

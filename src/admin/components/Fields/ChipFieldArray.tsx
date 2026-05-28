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
      <div className="text-14 w-fit-content bg-grey-200 text-grey-500 whitespace-nowrap rounded-[3px] px-2">
        {emptyText ?? "Not Provided"}
      </div>
    );
  }

  return (
    <ArrayField {...props} record={{ [props.source!]: data }}>
      <SingleFieldList linkType={false}>
        <FunctionField
          // @ts-ignore
          render={(record?: { id: string; label: string; className?: string }) =>
            record ? (
              <ChipField
                record={{ label: record.label }}
                source="label"
                className={classNames("text-grey-500 !h-fit !rounded-[3px]", record.className)}
              />
            ) : null
          }
        />
      </SingleFieldList>
    </ArrayField>
  );
};

export default ChipFieldArray;

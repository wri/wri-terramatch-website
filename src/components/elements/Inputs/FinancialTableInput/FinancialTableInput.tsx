// import { RowData } from "@tanstack/react-table";
import { useT } from "@transifex/react";
import { useId } from "react";
import { Control, FieldValues, UseFormReturn } from "react-hook-form";

import Table from "@/components/elements/Table/Table";
// import { Box, Grid, Typography } from "@mui/material";
// import Input from "../Input/Input";
// import Text from "../../Text/Text";
import { OptionValue } from "@/types/common";

// import { FormField } from "@/components/extensive/WizardForm/types";
import InputWrapper, { InputWrapperProps } from "../InputElements/InputWrapper";
// import { Else, If, Then, When } from "react-if";
// import FileInput from "../FileInput/FileInput";
// import TextArea from "../textArea/TextArea";
// import { VARIANT_TABLE_PRIMARY } from "../../Table/TableVariants";
// import { twMerge } from "tailwind-merge";
// import classNames from "classnames";

export interface FinancialTableInputProps extends Omit<InputWrapperProps, "error"> {
  label?: string;
  description?: string;
  containerClassName?: string;
  required?: boolean;
  feedbackRequired?: boolean;
  tableColumns: any[];
  value: any[];
  onChange?: (values: any) => void;
  generateUuids?: boolean;
  additionalValues?: any;
  formHook?: UseFormReturn<FieldValues, any>;
  control?: Control<FieldValues, any>;
  onChangeCapture?: (values: any) => void;
  handleCreate?: (value: any) => void;
  handleDelete?: (uuid?: string) => void;
  years?: number[] | null;
  selectCurrency?: string | null | OptionValue;
  handleChange?: any;
  setValue?: React.Dispatch<React.SetStateAction<any[]>>;
}

const FinancialTableInput = (props: FinancialTableInputProps) => {
  const id = useId();
  const t = useT();
  // const { value, tableColumns, selectCurrency, handleChange, setValue } = props;

  // const currencyInput = {
  //   USD: "$",
  //   EUR: "€",
  //   GBP: "£"
  // } as any;

  return (
    <InputWrapper
      inputId={id}
      label={props.label ?? t("ADD FINANCIAL DATA")}
      containerClassName={props.containerClassName}
      description={props.description}
      required={props.required}
      feedbackRequired={props.feedbackRequired}
      {...props}
    >
      <Table
        columns={props.tableColumns}
        data={props.value}
        {...props}
        // key={props.resetTable}
      />
      {/* <Box>
        <Grid container className={VARIANT_TABLE_PRIMARY.thead}>
          {tableColumns?.map((column, index) => (
            <Grid
              key={index}
              item
              xs={3}
              style={column.meta}
              className={twMerge(
                `text-bold-subtitle-500 whitespace-nowrap px-6 py-4 ${VARIANT_TABLE_PRIMARY.trHeader}`
              )}
            >
              <div
                className="inline w-full max-w-full"
                style={{
                  fontSize: "inherit",
                  fontWeight: "inherit",
                  color: "currentColor",
                  fontFamily: "inherit"
                }}
              >
                <div className="font-inherit relative w-full max-w-full">
                  <span className="font-inherit ">{column?.header! as string}</span>
                </div>
              </div>
            </Grid>
          ))}
        </Grid>

        {value.map((row, index) => (
          <Grid container key={index} className={VARIANT_TABLE_PRIMARY.tBody}>
            <Grid
              item
              className={classNames("text-normal-subtitle-400", VARIANT_TABLE_PRIMARY.tdBody)}
              style={{ width: "22.5%" }}
              sx={{ alignContent: "center" }}
            >
              <Typography>{row.year}</Typography>
            </Grid>

            {row?.fields?.map((rowField: any, fieldIndex: number) => (
              <Grid
                item
                // xs={3}
                // sx={{ p: 2 }}
                className={classNames("text-normal-subtitle-400", VARIANT_TABLE_PRIMARY.tdBody)}
              >
                <When condition={rowField?.inputType == "input"}>
                  <div className="border-light flex h-fit items-center justify-between rounded-lg border py-2 px-2.5 hover:border-primary hover:shadow-input">
                    <div className="flex items-center gap-0">
                      {currencyInput?.[selectCurrency!]}
                      <Input
                        type="number"
                        variant="secondary"
                        className="border-none !p-0"
                        name={`revenue-${row.year}`}
                        onChange={e => handleChange(index, fieldIndex, e.target.value, value, setValue)}
                      />
                    </div>
                    <span className="text-13">{selectCurrency}</span>
                  </div>
                </When>
                <When condition={rowField?.inputType == "inputFile"}>
                  <div>
                    <FileInput
                      files={rowField.value}
                      onChange={newFiles => handleChange(index, fieldIndex, newFiles, value, setValue)}
                    />
                  </div>
                </When>
                <When condition={rowField?.inputType == "textArea"}>
                  <TextArea
                    name={row}
                    className="h-fit min-h-min hover:border-primary hover:shadow-input"
                    placeholder="Add description here"
                    rows={2}
                    onChange={e => handleChange(index, fieldIndex, e.target.value, value, setValue)}
                  />
                </When>
                <When condition={rowField?.type == "total"}>
                  <Grid
                    item
                    style={{ width: "22.5%" }}
                    className={classNames("text-normal-subtitle-400", VARIANT_TABLE_PRIMARY.tdBody)}
                  >
                    <Text variant="text-14-semibold">
                      {currencyInput?.[selectCurrency!]
                        ? currencyInput?.[selectCurrency!] + rowField?.value
                        : rowField?.value}
                    </Text>
                  </Grid>
                </When>
              </Grid>
            ))}
          </Grid>
        ))}
      </Box> */}
    </InputWrapper>
  );
};

export default FinancialTableInput;

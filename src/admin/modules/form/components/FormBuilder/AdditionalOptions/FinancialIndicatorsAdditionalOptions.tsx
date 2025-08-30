import { FC, MutableRefObject } from "react";
import { FormDataConsumerRenderParams, required, SelectArrayInput } from "react-admin";

type FinancialIndicatorsAdditionalOptionsProps = {
  selectRef: MutableRefObject<HTMLDivElement | null>;
  getSource: NonNullable<FormDataConsumerRenderParams["getSource"]>;
};

const FinancialIndicatorsAdditionalOptions: FC<FinancialIndicatorsAdditionalOptionsProps> = ({
  selectRef,
  getSource
}) => (
  <>
    <SelectArrayInput
      source={getSource("years")}
      label="Years multi-select"
      helperText="Select one or more years"
      choices={Array(6)
        .fill(0)
        .map((_, index) => {
          const year = new Date().getFullYear() - 5 + index;
          return { id: year, name: year };
        })}
      fullWidth
      validate={required()}
      options={{
        MenuProps: {
          PaperProps: {
            sx: {
              width: selectRef.current?.offsetWidth ? selectRef.current?.offsetWidth - 50 : "100%"
            }
          }
        }
      }}
    />
    <SelectArrayInput
      source={getSource("collection")}
      label="Select Collections"
      helperText="Select one or more collections"
      choices={[
        { id: "profit", name: "Net Profit" },
        { id: "budget", name: "Budget" },
        { id: "current-ratio", name: "Ratio" }
      ]}
      fullWidth
      validate={required()}
      options={{
        MenuProps: {
          PaperProps: {
            sx: {
              width: selectRef.current?.offsetWidth ? selectRef.current?.offsetWidth - 50 : "100%"
            }
          }
        }
      }}
      parse={(value: string[] | undefined) => (value ? JSON.stringify(value) : "[]")}
      format={(value: string | undefined) => {
        try {
          return value ? JSON.parse(value) : [];
        } catch {
          return [];
        }
      }}
    />
  </>
);

export default FinancialIndicatorsAdditionalOptions;

import { PropsWithChildren } from "react";
import { DateInput } from "react-admin";
import { useController, UseControllerProps, UseFormReturn } from "react-hook-form";

export interface DateFieldProps extends UseControllerProps<any> {
  onChangeCapture?: () => void;
  formHook?: UseFormReturn;
  optionsFilterFieldName?: string;
  enableAdditionalOptions?: boolean;
}

const DateField = ({ enableAdditionalOptions, ...props }: PropsWithChildren<DateFieldProps>) => {
  console.log(props);
  if (!props.control) {
    throw new Error("DateField requires a 'control' prop from react-hook-form.");
  }
  const {
    field: { value }
  } = useController(props);

  console.log(value);

  return <DateInput label="Fecha" source={props.name} defaultValue={props.defaultValue} control={props.control} />;
};

export default DateField;

import classNames from "classnames";
import { useMemo } from "react";

import { InputFormField } from "@/components/extensive/WizardForm/types";

import ErrorMessage from "../../ErrorMessage/ErrorMessage";
import Text from "../../Text/Text";
import Input from "../Input/Input";
import InputWrapper, { InputWrapperProps } from "../InputElements/InputWrapper";

export interface InputTableProps extends InputWrapperProps {
  className?: string;
  headers: [string, string];
  rows: InputFormField[];
  value: any;
  onChange: (value: any) => void;
  errors: any;
  total?: number;
  hasTotal?: boolean;
}

function InputTable({
  className,
  headers,
  total,
  hasTotal,
  rows,
  value,
  onChange,
  errors,
  ...inputWrapperProps
}: InputTableProps) {
  const error = useMemo(() => {
    for (const row of rows) {
      const error = errors?.[row.name];
      if (error) return error;
    }

    return undefined;
  }, [rows, errors]);

  return (
    <InputWrapper {...inputWrapperProps}>
      <div>
        <table className={classNames(className, "w-full")}>
          <thead className="h-[60px] bg-primary">
            <tr>
              <th align="center">
                <Text variant="text-heading-300">{headers?.[0]?.trim()}</Text>
              </th>
              <th align="center">
                <Text variant="text-heading-300">{headers?.[1]?.trim() + (hasTotal ? ` ${total}` : "")}</Text>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={`row-${index}`}>
                <td className="h-[53px] border-b border-neutral-400 p-0 pb-1.5 pt-6 align-bottom" align="center">
                  <Text variant="text-heading-100" className="first-letter:uppercase">
                    {row.label}
                  </Text>
                </td>
                <td className="h-[53px] p-0 align-bottom">
                  <Input
                    {...row.fieldProps}
                    ref={null}
                    name={row.name}
                    variant="secondary"
                    placeholder={row.placeholder}
                    error={errors?.[row.name]}
                    onChange={e =>
                      onChange({
                        ...value,
                        [row.name]: row.fieldProps.type === "number" ? e.target.valueAsNumber : e.target.value
                      })
                    }
                    value={value?.[row.name]}
                    hideErrorMessage
                    className="text-heading-100 text-center"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <ErrorMessage className="mt-6" error={error} />
      </div>
    </InputWrapper>
  );
}

export default InputTable;

import { ReactNode } from "react";

import { CHECKBOX_VARIANT_ROUNDED } from "./CheckbocVariant";

export interface CheckboxProps {
  label?: ReactNode;
  keyCkeckbox: string;
  variant?: string;
}
const Checkbox = (props: CheckboxProps) => {
  const { label, keyCkeckbox, variant = CHECKBOX_VARIANT_ROUNDED } = props;

  return (
    <label className="flex justify-between" htmlFor={keyCkeckbox}>
      {label}
      <input
        id={keyCkeckbox}
        className={`${variant} `}
        type="checkbox"
        onClick={e => {
          e.stopPropagation();
        }}
      />
    </label>
  );
};

export default Checkbox;

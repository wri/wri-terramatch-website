import { useT } from "@transifex/react";
import classNames from "classnames";
import { isNumber } from "lodash";
import { forwardRef, HTMLProps } from "react";

import StatusPill from "@/components/elements/StatusPill/StatusPill";
import Text from "@/components/elements/Text/Text";
import { TextVariants } from "@/types/common";

export interface InputLabelProps extends HTMLProps<HTMLLabelElement> {
  required?: boolean;
  children?: string | number;
  feedbackRequired?: boolean;
  labelVariant?: TextVariants;
  suffixLabelView?: boolean;
}

const InputLabel = forwardRef<HTMLLabelElement, InputLabelProps>((props, ref) => {
  const t = useT();
  const {
    feedbackRequired,
    required,
    children,
    className,
    labelVariant,
    suffixLabelView = true,
    ...labelProps
  } = props;

  return props.children == null ? null : (
    <>
      <Text<HTMLLabelElement>
        {...labelProps}
        ref={ref}
        as="label"
        variant={labelVariant ?? "text-bold-body-300"}
        className={classNames("mr-2 inline uppercase", className)}
      >
        {`${isNumber(children) ? children : t(children)} ${required && suffixLabelView ? "*" : ""}`}
      </Text>

      {feedbackRequired && (
        <StatusPill status="warning" className="inline-flex w-fit">
          <Text variant="text-bold-caption-100">{t("More Info Requested")}</Text>
        </StatusPill>
      )}
    </>
  );
});

export default InputLabel;

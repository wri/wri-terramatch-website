import clsx from "clsx";
import React from "react";

import Icon from "@/components/componentsToLogin/Icon/Icon";
import { ICON_VARIANT_PASSRWORD_STATUS } from "@/components/componentsToLogin/Icon/IconVariant";
import Text from "@/components/componentsToLogin/Text/Text";

import usePasswordStrength from "./usePasswordStrength";

interface PasswordValidationProps {
  password: string;
}

const PasswordValidation = (props: PasswordValidationProps) => {
  const { password = "" } = props;

  const { passwordStrength, values: passwordValues, validationCount } = usePasswordStrength({ password });

  const thresholdValue = 3;

  const textColor = clsx({
    "text-red-300": validationCount < thresholdValue,
    "text-green-100": validationCount > thresholdValue,
    "text-yellow": validationCount === thresholdValue
  });
  const bgColor = clsx({
    "bg-red-300": validationCount < thresholdValue,
    "bg-green-100": validationCount > thresholdValue,
    "bg-yellow": validationCount === thresholdValue
  });

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1">
        <Text variant="text-14-light text-dark-500">Password Strength:</Text>
        <Text variant="text-14-bold" className={textColor}>
          {passwordStrength}
        </Text>
      </div>

      <div className="h-2 w-2/3 rounded-lg bg-grey-500">
        <div
          className={`h-full rounded-lg transition-all duration-500 ${bgColor}`}
          style={{
            width: `${validationCount * 25}%`
          }}
        />
      </div>
      <div className="flex items-center gap-1">
        <Icon
          src={`${passwordValues.hasCorrectLength ? "/icons/ic-success.svg" : "/icons/ic-critical.svg"}`}
          alt="status"
          variant={ICON_VARIANT_PASSRWORD_STATUS}
        />
        <Text variant="text-14-light text-dark-500">Use a minimum of 8 characters</Text>
      </div>
      <div className="flex items-center gap-1">
        <Icon
          src={`${passwordValues.hasUppercase ? "/icons/ic-success.svg" : "/icons/ic-critical.svg"}`}
          alt="status"
          variant={ICON_VARIANT_PASSRWORD_STATUS}
        />
        <Text variant="text-14-light text-dark-500">Use an uppercase letter</Text>
      </div>
      <div className="flex items-center gap-1">
        <Icon
          src={`${passwordValues.hasLowercase ? "/icons/ic-success.svg" : "/icons/ic-critical.svg"}`}
          alt="status"
          variant={ICON_VARIANT_PASSRWORD_STATUS}
        />
        <Text variant="text-14-light text-dark-500">Use a lowercase letter</Text>
      </div>
      <div className="flex items-center gap-1">
        <Icon
          src={`${passwordValues.hasNumber ? "/icons/ic-success.svg" : "/icons/ic-critical.svg"}`}
          alt="status"
          variant={ICON_VARIANT_PASSRWORD_STATUS}
        />
        <Text variant="text-14-light text-dark-500">Use a number</Text>
      </div>
    </div>
  );
};

export default PasswordValidation;

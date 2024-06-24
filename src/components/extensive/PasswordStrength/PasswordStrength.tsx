import { useT } from "@transifex/react";
import clsx from "clsx";
import { useMemo } from "react";

import LinearProgressBar from "@/components/elements/ProgressBar/LinearProgressBar/LinearProgressBar";
import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import { Colors } from "@/types/common";

import { usePasswordStrength } from "./hooks/usePasswordStrength";

export type PasswordStrengthValue = "Very Weak" | "Weak" | "Fair" | "Strong";

export type PasswordStrengthProps = {
  password: string;
};

const PasswordText = ({ text = "", hasPassed = false }) => {
  return (
    <li className="flex items-center gap-1">
      <Icon
        name={hasPassed ? IconNames.SUCCESS : IconNames.CRITICAL}
        width={0}
        height={0}
        className="h-4 w-4 lg:h-5 lg:w-5 wide:h-6 wide:w-6"
      />
      <Text variant="text-14-light">{text}</Text>
    </li>
  );
};

const PasswordStrength = ({ password = "" }: PasswordStrengthProps) => {
  const t = useT();
  const { strength, values: passwordValues, validationCount } = usePasswordStrength({ password });

  const progressValue = validationCount * 25;

  const progressColor: Colors = useMemo(() => {
    switch (strength) {
      case "Very Weak":
      case "Weak":
        return "error";
      case "Fair":
        return "tertiary";
      default:
        return "success";
    }
  }, [strength]);

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
        <Text variant="text-14-light">{t("Password Strength:")}</Text>
        <Text variant="text-14-bold" className={textColor}>
          {t(strength)}
        </Text>
      </div>
      <div className="w-2/3 rounded-lg bg-grey-500">
        <LinearProgressBar value={progressValue} colorProgress={bgColor} color={progressColor} className={""} />
      </div>
      <div>
        <ul className="flex flex-col gap-2">
          <PasswordText text={t("Use a minimum of 8 characters")} hasPassed={passwordValues.hasCorrectLength} />
          <PasswordText text={t("Use an uppercase letter")} hasPassed={passwordValues.hasUppercase} />
          <PasswordText text={t("Use a lowercase letter")} hasPassed={passwordValues.hasLowercase} />
          <PasswordText text={t("Use a number")} hasPassed={passwordValues.hasNumber} />
        </ul>
      </div>
    </div>
  );
};

export default PasswordStrength;

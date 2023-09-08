import { useEffect, useState } from "react";

import { PasswordStrengthValue } from "../PasswordStrength";

interface IValues {
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasCorrectLength: boolean;
}

export const usePasswordStrength = ({
  password = ""
}: {
  password: string;
}): { strength: PasswordStrengthValue; values: IValues; validationCount: number } => {
  const [strength, setStrength] = useState<PasswordStrengthValue>("Very Weak");
  const [values, setValues] = useState<IValues>({
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasCorrectLength: false
  });

  const [validation, setValidation] = useState<boolean[]>([]);

  useEffect(() => {
    const hasCorrectLength = password.length >= 8;
    const hasUppercase = (password.match(/[A-Z]/g) || []).length;
    const hasLowercase = (password.match(/[a-z]/g) || []).length;
    const hasNumber = (password.match(/[0-9]/g) || []).length;

    const _validation = [!!hasUppercase, !!hasLowercase, !!hasNumber, hasCorrectLength].filter(v => !!v);

    setValues({
      hasUppercase: !!hasUppercase,
      hasLowercase: !!hasLowercase,
      hasNumber: !!hasNumber,
      hasCorrectLength
    });

    setValidation(_validation);

    switch (_validation.length) {
      case 4:
        return setStrength("Strong");
      case 3:
        return setStrength("Fair");
      case 2:
        return setStrength("Weak");
      default:
        return setStrength("Very Weak");
    }
  }, [password]);

  return { strength, values, validationCount: validation.length };
};

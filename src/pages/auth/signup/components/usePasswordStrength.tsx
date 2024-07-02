import { useEffect, useState } from "react";

interface UsePasswordStrengthProps {
  password: string;
}

interface UsePasswordStrengthResult {
  passwordStrength: string;
  values: {
    hasUppercase: boolean;
    hasLowercase: boolean;
    hasNumber: boolean;
    hasCorrectLength: boolean;
  };
  validationCount: number;
}

const ValidationStrength = {
  STRONG: 4,
  FAIR: 3,
  WEAK: 2,
  VERY_WEAK: 1
};
const usePasswordStrength = (props: UsePasswordStrengthProps): UsePasswordStrengthResult => {
  const { password } = props;
  const [passwordStrength, setPasswordStrength] = useState("Very Weak");
  const [values, setValues] = useState({
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasCorrectLength: false
  });

  const [validation, setValidation] = useState<boolean[]>([]);

  useEffect(() => {
    const hasCorrectLength = password.length >= 8;
    const hasUppercase = (password.match(/[A-Z]/g) ?? []).length > 0;
    const hasLowercase = (password.match(/[a-z]/g) ?? []).length > 0;
    const hasNumber = (password.match(/[0-9]/g) ?? []).length > 0;

    const _validation = [hasUppercase, hasLowercase, hasNumber, hasCorrectLength];

    const strengthMap = {
      [ValidationStrength.STRONG]: "Strong",
      [ValidationStrength.FAIR]: "Fair",
      [ValidationStrength.WEAK]: "Weak"
    };

    setValues({
      hasUppercase,
      hasLowercase,
      hasNumber,
      hasCorrectLength
    });

    setValidation(_validation);
    const validationCount = _validation.filter(value => value === true).length;

    setPasswordStrength(strengthMap[validationCount]);
  }, [password]);

  return {
    passwordStrength,
    values,
    validationCount: validation.filter(Boolean).length
  };
};

export default usePasswordStrength;

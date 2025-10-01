import { Typography } from "@mui/material";
import { FC, ReactNode } from "react";

import { FieldInputType } from "@/components/extensive/WizardForm/types";

interface IFieldViewProps {
  inputType: FieldInputType;
  value: ReactNode;
}

const FieldView: FC<IFieldViewProps> = ({ inputType, value }) => {
  if (inputType === "long-text" || typeof value === "number") {
    return <Typography variant="body2">{value}</Typography>;
  } else if (typeof value === "string") {
    // covers the case where getFormEntry() returns values joined with '<br/>'
    return <Typography variant="body2" dangerouslySetInnerHTML={{ __html: value }} />;
  } else {
    return <>{value}</>;
  }
};

export default FieldView;

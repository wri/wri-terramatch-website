import { Typography } from "@mui/material";
import { ReactNode } from "react";

import { FieldType } from "@/components/extensive/WizardForm/types";

interface IFieldViewProps {
  type: FieldType;
  value: ReactNode;
}

const FieldView = ({ type, value }: IFieldViewProps) => {
  if (type === FieldType.TextArea || typeof value === "number") {
    return <Typography variant="body2">{value}</Typography>;
  } else if (typeof value === "string") {
    // covers the case where getFormEntry() returns values joined with '<br/>'
    return <Typography variant="body2" dangerouslySetInnerHTML={{ __html: value }} />;
  } else {
    return <>{value}</>;
  }
};

export default FieldView;

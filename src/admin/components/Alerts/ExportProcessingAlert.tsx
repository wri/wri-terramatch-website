import { Alert, CircularProgress } from "@mui/material";
import { FC } from "react";

type ExportProcessingAlertProps = {
  show: boolean;
};

const ExportProcessingAlert: FC<ExportProcessingAlertProps> = ({ show }) => {
  if (!show) return null;

  return (
    <div className="fixed bottom-5 left-0 z-50 flex w-full items-center justify-center">
      <Alert variant="filled" severity="warning" icon={<CircularProgress size={18} color="inherit" />}>
        We are currently processing your export request, this may take a while!
      </Alert>
    </div>
  );
};

export default ExportProcessingAlert;

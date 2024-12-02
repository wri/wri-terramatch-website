import { Alert, AlertTitle, CircularProgress } from "@mui/material";
import { FC, useEffect, useState } from "react";
import { useStore } from "react-redux";

import { AppStore } from "@/store/store";

type DelayedJobsProgressAlertProps = {
  show: boolean;
  title?: string;
  message?: string;
  onCancel?: () => void;
};

const DelayedJobsProgressAlert: FC<DelayedJobsProgressAlertProps> = ({ show, title, message, onCancel }) => {
  const [delayedJobProcessing, setDelayedJobProcessing] = useState<number>(0);
  const [delayedJobTotal, setDalayedJobTotal] = useState<number>(0);

  const store = useStore<AppStore>();
  useEffect(() => {
    let intervalId: any;
    if (show) {
      intervalId = setInterval(() => {
        const { total_content, processed_content } = store.getState().api;
        setDalayedJobTotal(total_content);
        setDelayedJobProcessing(processed_content);
      }, 1000);
    }

    return () => {
      if (intervalId) {
        setDelayedJobProcessing(0);
        setDalayedJobTotal(0);
        clearInterval(intervalId);
      }
    };
  }, [show]);

  if (!show) return null;

  const calculatedProgress = delayedJobTotal! > 0 ? Math.round((delayedJobProcessing! / delayedJobTotal!) * 100) : 0;

  const severity = calculatedProgress >= 75 ? "success" : calculatedProgress >= 50 ? "info" : "warning";

  return (
    <div className="fixed bottom-5 left-0 z-50 flex w-full items-center justify-center">
      <Alert
        severity={severity}
        icon={<CircularProgress size={18} color="inherit" />}
        action={
          onCancel && (
            <button
              onClick={onCancel}
              className="bg-red-500 hover:bg-red-600 ml-2 rounded px-2 py-1 text-sm font-medium"
            >
              Cancel
            </button>
          )
        }
      >
        <AlertTitle>{title}</AlertTitle>
        {message || `Polygons processed: ${delayedJobProcessing} out of ${delayedJobTotal} (${calculatedProgress}%)`}
      </Alert>
    </div>
  );
};

export default DelayedJobsProgressAlert;

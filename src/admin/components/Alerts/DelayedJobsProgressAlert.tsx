import { Alert, AlertTitle, CircularProgress } from "@mui/material";
import { FC, useEffect, useState } from "react";
import { useStore } from "react-redux";

import ApiSlice from "@/store/apiSlice";
import { AppStore } from "@/store/store";

type DelayedJobsProgressAlertProps = {
  show: boolean;
  title?: string;
  setIsLoadingDelayedJob?: (value: boolean) => void;
};

const DelayedJobsProgressAlert: FC<DelayedJobsProgressAlertProps> = ({ show, title, setIsLoadingDelayedJob }) => {
  const [delayedJobProcessing, setDelayedJobProcessing] = useState<number>(0);
  const [delayedJobTotal, setDalayedJobTotal] = useState<number>(0);
  const [proccessMessage, setProccessMessage] = useState<string>("Running 0 out of 0 polygons (0%)");

  const store = useStore<AppStore>();
  useEffect(() => {
    let intervalId: any;
    if (show) {
      intervalId = setInterval(() => {
        const { total_content, processed_content, proccess_message } = store.getState().api;
        setDalayedJobTotal(total_content);
        setDelayedJobProcessing(processed_content);
        if (proccess_message != "") {
          setProccessMessage(proccess_message);
        }
      }, 1000);
    }

    return () => {
      if (intervalId) {
        setDelayedJobProcessing(0);
        setDalayedJobTotal(0);
        setProccessMessage("Running 0 out of 0 polygons (0%)");
        clearInterval(intervalId);
      }
    };
  }, [show]);

  const abortDelayedJob = () => {
    ApiSlice.abortDelayedJob(true);
    ApiSlice.addTotalContent(0);
    ApiSlice.addProgressContent(0);
    ApiSlice.addProgressMessage("Running 0 out of 0 polygons (0%)");
    setDelayedJobProcessing(0);
    setDalayedJobTotal(0);
    setIsLoadingDelayedJob?.(false);
  };

  if (!show) return null;

  const calculatedProgress = delayedJobTotal! > 0 ? Math.round((delayedJobProcessing! / delayedJobTotal!) * 100) : 0;

  const severity = calculatedProgress >= 75 ? "success" : calculatedProgress >= 50 ? "info" : "warning";

  return (
    <div className="fixed bottom-5 left-0 z-50 flex w-full items-center justify-center">
      <Alert
        severity={severity}
        icon={<CircularProgress size={18} color="inherit" />}
        action={
          <button
            onClick={abortDelayedJob}
            className="hover:bg-red-300 ml-2 rounded px-2 py-1 text-sm font-medium text-red-200"
          >
            Cancel
          </button>
        }
      >
        <AlertTitle>{title}</AlertTitle>
        {proccessMessage ?? "Running 0 out of 0 polygons (0%)"}
      </Alert>
    </div>
  );
};

export default DelayedJobsProgressAlert;

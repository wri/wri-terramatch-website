import { Alert, AlertTitle, CircularProgress } from "@mui/material";
import { FC } from "react";
import { useSelector } from "react-redux";

import JobsSlice, { JobsDataStore } from "@/store/jobsSlice";
import { AppStore } from "@/store/store";

type DelayedJobsProgressAlertProps = {
  show: boolean;
  title?: string;
  setIsLoadingDelayedJob?: (value: boolean) => void;
};

const DelayedJobsProgressAlert: FC<DelayedJobsProgressAlertProps> = ({ show, title, setIsLoadingDelayedJob }) => {
  const { totalContent, processedContent, progressMessage } = useSelector<AppStore, JobsDataStore>(({ jobs }) => jobs);

  const abortDelayedJob = () => {
    JobsSlice.abortDelayedJob();
    setIsLoadingDelayedJob?.(false);
  };

  if (!show) return null;

  const calculatedProgress = totalContent > 0 ? Math.round((processedContent / totalContent) * 100) : 0;

  const severity = calculatedProgress >= 75 ? "success" : calculatedProgress >= 50 ? "info" : "warning";

  return (
    <div className="fixed bottom-5 left-0 z-50 flex w-full items-center justify-center">
      <Alert
        severity={severity}
        icon={<CircularProgress size={18} color="inherit" />}
        action={
          <button
            onClick={abortDelayedJob}
            className="ml-2 rounded px-2 py-1 text-sm font-medium text-red-200 hover:bg-red-300"
          >
            Cancel
          </button>
        }
      >
        <AlertTitle>{title}</AlertTitle>
        {progressMessage ?? "Running 0 out of 0 polygons (0%)"}
      </Alert>
    </div>
  );
};

export default DelayedJobsProgressAlert;

import { Fragment, PropsWithChildren } from "react";

import Paper from "@/components/elements/Paper/Paper";

import Loader from "./Loader";

interface LoadingContainerProps {
  loading: boolean;
  className?: string;
  wrapInPaper?: boolean;
}

const LoadingContainerOpacity = ({
  className,
  wrapInPaper,
  loading,
  children
}: PropsWithChildren<LoadingContainerProps>) => {
  return (
    <Fragment>
      {wrapInPaper ? (
        <Paper className={`relative ${className}`}>
          {children}
          {loading && (
            <>
              <div className="pointer-events-none absolute inset-0 bg-black opacity-25" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader />
              </div>
            </>
          )}
        </Paper>
      ) : (
        <div className={`relative ${className}`}>
          {children}
          {loading && (
            <>
              <div className="pointer-events-none absolute inset-0 bg-black opacity-25" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader />
              </div>
            </>
          )}
        </div>
      )}
    </Fragment>
  );
};

export default LoadingContainerOpacity;

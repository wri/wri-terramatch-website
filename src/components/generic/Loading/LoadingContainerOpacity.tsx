import { Fragment, PropsWithChildren } from "react";

import Paper from "@/components/elements/Paper/Paper";
import { useModalContext } from "@/context/modal.provider";

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
  const { modals } = useModalContext();
  const modal = modals.find(modal => modal.id === "modalExpand");
  const loadingModal = modal ? modal.loading : false;

  return (
    <Fragment>
      {wrapInPaper ? (
        <Paper className={`relative h-full w-full ${className}`}>
          {children}
          {(loading || loadingModal) && (
            <>
              <div className="pointer-events-none absolute inset-0 rounded-lg bg-black opacity-25" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader />
              </div>
            </>
          )}
        </Paper>
      ) : (
        <div className={`relative h-full w-full ${className}`}>
          {children}
          {(loading || loadingModal) && (
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

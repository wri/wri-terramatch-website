import { FC, PropsWithChildren } from "react";

import Paper from "@/components/elements/Paper/Paper";

import Loader from "./Loader";

interface LoadingContainerProps {
  loading: boolean;
  className?: string;
  wrapInPaper?: boolean;
}

const LoadingContainer: FC<PropsWithChildren<LoadingContainerProps>> = ({
  className,
  wrapInPaper,
  loading,
  children
}) =>
  loading ? (
    wrapInPaper ? (
      <Paper>
        <Loader className={className} />
      </Paper>
    ) : (
      <Loader className={className} />
    )
  ) : (
    <>{children}</>
  );

export default LoadingContainer;

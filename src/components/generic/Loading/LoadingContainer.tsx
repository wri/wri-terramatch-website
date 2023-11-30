import { Fragment, PropsWithChildren } from "react";
import { Else, If, Then } from "react-if";

import Paper from "@/components/elements/Paper/Paper";

import Loader from "./Loader";

interface LoadingContainerProps {
  loading: boolean;
  className?: string;
  wrapInPaper?: boolean;
}

const LoadingContainer = ({ className, wrapInPaper, loading, children }: PropsWithChildren<LoadingContainerProps>) => {
  return (
    <Fragment>
      <If condition={loading}>
        <Then>
          {wrapInPaper ? (
            <Paper>
              <Loader className={className} />
            </Paper>
          ) : (
            <Loader className={className} />
          )}
        </Then>
        <Else>{children}</Else>
      </If>
    </Fragment>
  );
};

export default LoadingContainer;

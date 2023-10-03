import { Fragment, PropsWithChildren } from "react";
import { Else, If, Then } from "react-if";

import Loader from "./Loader";

interface LoadingContainerProps {
  loading: boolean;
  className?: string;
}

const LoadingContainer = ({ className, loading, children }: PropsWithChildren<LoadingContainerProps>) => {
  return (
    <Fragment>
      <If condition={loading}>
        <Then>
          <Loader className={className} />
        </Then>
        <Else>{children}</Else>
      </If>
    </Fragment>
  );
};

export default LoadingContainer;

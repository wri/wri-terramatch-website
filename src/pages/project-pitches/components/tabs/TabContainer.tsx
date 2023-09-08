import classNames from "classnames";
import React, { PropsWithChildren } from "react";

import Container from "@/components/generic/Layout/Container";

interface TabContainerProps
  extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
    PropsWithChildren {}

const TabContainer = ({ className, children, ...props }: TabContainerProps) => {
  return (
    <div {...props} className={classNames(className, "bg-neutral-150")}>
      <Container className="flex flex-col items-end px-16 xl:px-0">{children}</Container>
    </div>
  );
};

export default TabContainer;

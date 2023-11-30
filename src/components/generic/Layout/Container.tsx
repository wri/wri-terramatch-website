import React, { PropsWithChildren } from "react";

interface ContainerProps
  extends PropsWithChildren<React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>> {}

const Container = ({ className, ...props }: ContainerProps) => {
  return (
    <section className={`mx-auto w-full max-w-[1218px] ${className}`} {...props}>
      {props.children}
    </section>
  );
};

export default Container;

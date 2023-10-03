import classNames from "classnames";
import { DetailedHTMLProps, HTMLAttributes, PropsWithChildren } from "react";

interface SectionBodyProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
    PropsWithChildren {}

const SectionBody = ({ children, className, ...divProps }: SectionBodyProps) => {
  return (
    <div {...divProps} className={classNames(className, "flex w-full flex-col gap-8")}>
      {children}
    </div>
  );
};

export default SectionBody;

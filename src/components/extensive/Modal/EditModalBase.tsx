import classNames from "classnames";
import { FC } from "react";

import { ModalBaseProps } from "./Modal";

export const EditModalBase: FC<ModalBaseProps> = ({ children, className, ...rest }) => {
  return (
    <div
      className={classNames(
        className,
        "m-auto flex max-h-full max-w-[1400px] flex-grow flex-col items-center justify-start overflow-y-auto rounded-lg border-2 border-neutral-100 bg-white"
      )}
      {...rest}
    >
      {children}
    </div>
  );
};

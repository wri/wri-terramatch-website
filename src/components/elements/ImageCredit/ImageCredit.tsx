import classNames from "classnames";
import { DetailedHTMLProps, HTMLAttributes, PropsWithChildren } from "react";

export type ImageCreditProps = PropsWithChildren<
  DetailedHTMLProps<HTMLAttributes<HTMLParagraphElement>, HTMLParagraphElement>
>;

const ImageCredit = ({ className, children, ...pProps }: ImageCreditProps) => {
  if (!children) return null;

  return (
    <p
      {...pProps}
      className={classNames(
        className,
        "text-heading-200 bg-black bg-opacity-95 p-1 pb-0 text-white md:p-[10px] md:pb-1"
      )}
    >
      {children}
    </p>
  );
};

export default ImageCredit;

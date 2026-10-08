import { DetailedHTMLProps, HTMLAttributes } from "react";

import { LoadingIcon } from "@/redesignComponents/foundations/Icons";

const Loader = (props: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>) => (
  <div {...props} className={`flex h-32 items-center justify-center ${props.className}`}>
    <LoadingIcon boxSize={6} className="animate-spin" color="primary.700" />
  </div>
);

export default Loader;

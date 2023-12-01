import { DetailedHTMLProps, HTMLAttributes } from "react";

import Icon, { IconNames } from "@/components/extensive/Icon/Icon";

const Loader = (props: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>) => {
  return (
    <div {...props} className={`flex h-32 items-center justify-center ${props.className}`}>
      <Icon name={IconNames.SPINNER} width={40} height={40} />
    </div>
  );
};

export default Loader;

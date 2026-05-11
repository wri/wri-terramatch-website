import { FC } from "react";

import Icon, { IconNames } from "@/components/extensive/Icon/Icon";

const InlineLoader: FC<{ loading: boolean }> = ({ loading }) =>
  loading ? (
    <div className="ml-2">
      <Icon name={IconNames.SPINNER} width={20} height={20} />
    </div>
  ) : null;

export default InlineLoader;

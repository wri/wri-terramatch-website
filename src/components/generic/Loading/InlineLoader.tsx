import { If, Then } from "react-if";

import Icon, { IconNames } from "@/components/extensive/Icon/Icon";

const InlineLoader = ({ loading }: { loading: boolean }) => (
  <If condition={loading}>
    <Then>
      <div className="ml-2">
        <Icon name={IconNames.SPINNER} width={20} height={20} />
      </div>
    </Then>
  </If>
);

export default InlineLoader;

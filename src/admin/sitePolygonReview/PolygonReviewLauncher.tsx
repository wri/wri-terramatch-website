import { FC } from "react";
import { useShowContext } from "react-admin";

import Button from "@/components/elements/Button/Button";
import Text from "@/components/elements/Text/Text";
import { IconNames } from "@/components/extensive/Icon/Icon";

const PolygonReviewLauncher: FC = () => {
  // using useShowContext to get the record uuid as we don't remove the react-admin dependencies yet
  const { isLoading, record } = useShowContext();

  if (isLoading || record?.uuid == null) return null;

  return (
    <div className="flex w-full flex-col items-center gap-4 rounded-xl border-2 border-grey-350 bg-white p-10 shadow-monitored">
      <Text variant="text-16-bold" className="text-darkCustom">
        Polygon Review has moved
      </Text>
      <Text variant="text-14-light" className="max-w-xl text-center text-darkCustom">
        Review, validate, and edit site polygons in the new dedicated page. It opens in a new browser tab.
      </Text>
      <Button
        iconProps={{ name: IconNames.LINK, className: "h-4 w-4" }}
        onClick={() => {
          window.open(`/site/${record.uuid}/polygon-review`, "_blank", "noopener,noreferrer");
        }}
      >
        <Text variant="text-14-bold" className="text-white">
          Open Polygon Review
        </Text>
      </Button>
    </div>
  );
};

export default PolygonReviewLauncher;

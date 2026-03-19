import { useT } from "@transifex/react";

import Button from "@/components/elements/Button/Button";
import Text from "@/components/elements/Text/Text";
import { IconNames } from "@/components/extensive/Icon/Icon";

const AnrMonitoringPlots = ({ polygonUuid }: { polygonUuid: string }) => {
  const t = useT();

  if (polygonUuid === "") {
    return (
      <div className="flex flex-col gap-3">
        <Text variant="text-14" className="text-gray-500">
          {t("ANR Monitoring Plots")}
        </Text>
        <Text variant="text-12" className="text-gray-400">
          {t("Select a polygon to view ANR monitoring plots.")}
        </Text>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <Text variant="text-14-semibold" className="text-darkCustom">
        {t("Assisted Natural Regeneration Monitoring Plots")}
      </Text>
      <Text variant="text-12" className="text-gray-400">
        {t("Upload ANR Monitoring Plots")}
      </Text>
      {/* Copied "SEND" button style from Polygon Status (CommentaryBox), label changed to "upload". */}
      <div className="flex justify-end">
        <Button
          className="self-end border-[2.5px] border-primary"
          iconProps={{ name: IconNames.SEND, className: "h-4 w-4" }}
          onClick={() => undefined}
        >
          <Text variant="text-12-bold" className="text-white">
            {t("upload")}
          </Text>
        </Button>
      </div>
    </div>
  );
};

export default AnrMonitoringPlots;

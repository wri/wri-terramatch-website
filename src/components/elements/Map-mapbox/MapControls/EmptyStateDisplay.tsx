import { useT } from "@transifex/react";

import { useMapAreaContext } from "@/context/mapArea.provider";

import Button from "../../Button/Button";
import Text from "../../Text/Text";

const EmptyStateDisplay = () => {
  const t = useT();
  const { isMonitoring, setIsUserDrawingEnabled, isUserDrawingEnabled } = useMapAreaContext();
  return (
    <>
      {!isUserDrawingEnabled && (
        <div className="absolute left-[58%] top-[38%] z-30 grid gap-2" id="emptystatedisplay">
          <div className="rounded-lg bg-[#ffffff26] py-3 px-3 text-center text-white backdrop-blur-md">
            <Text variant="text-10-light">
              {t("Polygons have not been")}
              <br />
              {t("created for this site")}
            </Text>
            {isMonitoring && (
              <Button
                variant="primary"
                className="mt-3 rounded-lg px-11 lg:px-13 wide:px-15"
                onClick={() => setIsUserDrawingEnabled(true)}
              >
                <span className="text-12-bold normal-case">{t("Add Polygons")}</span>
              </Button>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default EmptyStateDisplay;

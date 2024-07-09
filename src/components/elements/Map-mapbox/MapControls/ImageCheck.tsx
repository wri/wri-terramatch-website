import { useT } from "@transifex/react";
import { Dispatch, SetStateAction } from "react";

import Button from "../../Button/Button";
import Checkbox from "../../Inputs/Checkbox/Checkbox";
import Text from "../../Text/Text";

const ImageCheck = ({
  showMediaPopups,
  setShowMediaPopups
}: {
  showMediaPopups: boolean;
  setShowMediaPopups: Dispatch<SetStateAction<boolean>>;
}) => {
  const t = useT();
  return (
    <div className="relarive">
      <Button
        variant="white-button-map"
        className="flex items-center gap-2"
        onClick={() => setShowMediaPopups(!showMediaPopups)}
      >
        <Checkbox
          name={""}
          className="leading-3"
          checked={showMediaPopups}
          onChange={() => setShowMediaPopups(!showMediaPopups)}
        />
        <Text variant="text-12-bold"> {t("Images")}</Text>
      </Button>
    </div>
  );
};

export default ImageCheck;

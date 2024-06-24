import { useT } from "@transifex/react";
import { useState } from "react";

import Button from "../../Button/Button";
import Checkbox from "../../Inputs/Checkbox/Checkbox";
import Text from "../../Text/Text";
import { MiniGallery } from "./MiniGallery";

const ImageCheck = () => {
  const t = useT();
  const [viewImages, setViewImages] = useState(false);
  return (
    <div className="relarive">
      <MiniGallery viewImages={viewImages} setViewImages={setViewImages} />
      <Button variant="white-button-map" className="flex items-center gap-2" onClick={() => setViewImages(!viewImages)}>
        <Checkbox name={""} className="leading-3" checked={viewImages} />
        <Text variant="text-12-bold"> {t("Images")}</Text>
      </Button>
    </div>
  );
};

export default ImageCheck;

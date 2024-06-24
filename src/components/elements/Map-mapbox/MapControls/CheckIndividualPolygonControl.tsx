import { useT } from "@transifex/react";
import { useEffect, useState } from "react";

import { useMapAreaContext } from "@/context/mapArea.provider";
import { fetchPostV2TerrafundValidationPolygon } from "@/generated/apiComponents";

import Button from "../../Button/Button";

const CheckIndividualPolygonControl = () => {
  const [clickedValidation, setClickedValidation] = useState(false);
  const { editPolygon, setShouldRefetchValidation } = useMapAreaContext();
  const t = useT();

  const validatePolygon = async () => {
    await fetchPostV2TerrafundValidationPolygon({ queryParams: { uuid: editPolygon.uuid } });
    setShouldRefetchValidation(true);
    setClickedValidation(false);
  };

  useEffect(() => {
    if (clickedValidation) {
      validatePolygon();
    }
  }, [clickedValidation]);

  return (
    <div className="grid gap-2">
      <Button
        variant="text"
        className="text-10-bold my-2 flex w-full justify-center rounded-lg border border-tertiary-600 bg-tertiary-600 p-2 hover:border-white"
        onClick={() => setClickedValidation(true)}
      >
        {t("Check Polygons")}
      </Button>
    </div>
  );
};

export default CheckIndividualPolygonControl;

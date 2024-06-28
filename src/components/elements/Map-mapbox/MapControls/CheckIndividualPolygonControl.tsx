import { useT } from "@transifex/react";
import { useEffect, useState } from "react";
import { When } from "react-if";

import { useMapAreaContext } from "@/context/mapArea.provider";
import { fetchPostV2TerrafundValidationPolygon } from "@/generated/apiComponents";

import Button from "../../Button/Button";

const CheckIndividualPolygonControl = ({ viewRequestSuport }: { viewRequestSuport: boolean }) => {
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
    <div className="flex gap-2">
      <When condition={viewRequestSuport}>
        <Button
          variant="text"
          className="text-10-bold flex w-full justify-center whitespace-nowrap rounded-lg border border-white bg-white p-2 text-black hover:border-black"
          onClick={() => setClickedValidation(true)}
        >
          {t("Request Support")}
        </Button>
      </When>
      <Button
        variant="text"
        className="text-10-bold flex w-full justify-center whitespace-nowrap rounded-lg border border-tertiary-600 bg-tertiary-600 p-2 text-white hover:border-white"
        onClick={() => setClickedValidation(true)}
      >
        {t("Check Polygon")}
      </Button>
    </div>
  );
};

export default CheckIndividualPolygonControl;

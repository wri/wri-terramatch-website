import { useT } from "@transifex/react";
import { useEffect, useState } from "react";
import { When } from "react-if";

import { useLoading } from "@/context/loaderAdmin.provider";
import { useMapAreaContext } from "@/context/mapArea.provider";
import { useNotificationContext } from "@/context/notification.provider";
import { usePostV2TerrafundValidationPolygon } from "@/generated/apiComponents";

import Button from "../../Button/Button";

const CheckIndividualPolygonControl = ({ viewRequestSuport }: { viewRequestSuport: boolean }) => {
  const [clickedValidation, setClickedValidation] = useState(false);
  const { editPolygon, setShouldRefetchValidation } = useMapAreaContext();
  const t = useT();
  const { showLoader, hideLoader } = useLoading();
  const { openNotification } = useNotificationContext();

  const displayNotification = (message: string, type: "success" | "error" | "warning", title: string) => {
    openNotification(type, title, message);
  };
  const { mutate: getValidations } = usePostV2TerrafundValidationPolygon({
    onSuccess: () => {
      setShouldRefetchValidation(true);
      setClickedValidation(false);
      hideLoader();
      displayNotification(
        t("Please update and re-run if validations fail."),
        "success",
        t("Success! TerraMatch reviewed the polygon")
      );
    },
    onError: () => {
      hideLoader();
      setClickedValidation(false);
      displayNotification(t("Please try again later."), "error", t("Error! TerraMatch could not review polygons"));
    }
  });
  useEffect(() => {
    if (clickedValidation) {
      showLoader();
      getValidations({ queryParams: { uuid: editPolygon.uuid } });
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

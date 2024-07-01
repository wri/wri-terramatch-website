import { useT } from "@transifex/react";
import { useEffect, useState } from "react";
import { When } from "react-if";

import Loader from "@/components/generic/Loading/Loader";
import { useMapAreaContext } from "@/context/mapArea.provider";
import { usePostV2TerrafundValidationPolygon } from "@/generated/apiComponents";

import Button from "../../Button/Button";
import Notification from "../../Notification/Notification";

const CheckIndividualPolygonControl = ({ viewRequestSuport }: { viewRequestSuport: boolean }) => {
  const [clickedValidation, setClickedValidation] = useState(false);
  const { editPolygon, setShouldRefetchValidation } = useMapAreaContext();
  const t = useT();
  const [isLoading, setIsLoading] = useState(false);
  const [notificationStatus, setNotificationStatus] = useState<{
    open: boolean;
    message: string;
    type: "success" | "error" | "warning";
    title: string;
  }>({
    open: false,
    message: "",
    type: "success",
    title: "Success!"
  });
  const displayNotification = (message: string, type: "success" | "error" | "warning", title: string) => {
    setNotificationStatus({
      open: true,
      message,
      type,
      title
    });
    setTimeout(() => {
      setNotificationStatus({
        open: false,
        message: "",
        type: "success",
        title: ""
      });
    }, 3000);
  };
  const { mutate: getValidations } = usePostV2TerrafundValidationPolygon({
    onSuccess: () => {
      setShouldRefetchValidation(true);
      setClickedValidation(false);
      setIsLoading(false);
      displayNotification(
        t("Please update and re-run if validations fail."),
        "success",
        t("Success! TerraMatch reviewed the polygon")
      );
    },
    onError: () => {
      setIsLoading(false);
      setClickedValidation(false);
      displayNotification(t("Please try again later."), "error", t("Error! TerraMatch could not review polygons"));
    }
  });
  useEffect(() => {
    if (clickedValidation) {
      setIsLoading(true);
      getValidations({ queryParams: { uuid: editPolygon.uuid } });
    }
  }, [clickedValidation]);

  return (
    <div className="flex gap-2">
      <When condition={isLoading}>
        <div className="max-h-[60vh] min-h-[10vh] grid-cols-[14%_20%_18%_15%_33%]" id="loaderscheck">
          <Loader />
        </div>
      </When>
      <Notification {...notificationStatus} />
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

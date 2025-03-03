import { useT } from "@transifex/react";
import { useMemo, useState } from "react";

import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import ModalImageGallery, { TabImagesItem } from "@/components/extensive/Modal/ModalImageGallery";
import { GetV2MODELUUIDFilesResponse } from "@/generated/apiComponents";
import { useOnMount } from "@/hooks/useOnMount";

import Button from "../../Button/Button";
import Text from "../../Text/Text";

const ViewImageCarousel = ({
  modelFilesData,
  imageGalleryRef
}: {
  modelFilesData: GetV2MODELUUIDFilesResponse["data"];
  imageGalleryRef?: React.RefObject<HTMLDivElement>;
}) => {
  const t = useT();
  const modelFilesTabItems: TabImagesItem[] = useMemo(() => {
    const modelFilesGeolocalized: GetV2MODELUUIDFilesResponse["data"] = [];
    const modelFilesNonGeolocalized: GetV2MODELUUIDFilesResponse["data"] = [];
    modelFilesData?.forEach(modelFile => {
      if (modelFile.location?.lat && modelFile.location?.lng) {
        modelFilesGeolocalized.push(modelFile);
      } else {
        modelFilesNonGeolocalized.push(modelFile);
      }
    });
    return [
      {
        id: "1",
        title: t("Non-Geotagged Images"),
        images: modelFilesNonGeolocalized.map(modelFile => ({
          id: modelFile.uuid!,
          src: modelFile.file_url!,
          title: modelFile.file_name!,
          dateCreated: modelFile.created_date!,
          geoTag: t("Not Geo-Referenced")
        }))
      },
      {
        id: "2",
        title: t("GeoTagged Images"),
        images: modelFilesGeolocalized.map(modelFile => ({
          id: modelFile.uuid!,
          src: modelFile.file_url!,
          title: modelFile.file_name!,
          dateCreated: modelFile.created_date!,
          geoTag: t("Geo-Referenced")
        }))
      }
    ];
  }, [modelFilesData, t]);

  const [openModal, setOpenModal] = useState(false);

  const scrollToGalleryElement = () => {
    if (imageGalleryRef?.current) {
      const element = imageGalleryRef.current;
      const topPosition = element.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({
        top: topPosition,
        behavior: "smooth"
      });
    }
  };

  const scrollToElement = () => {
    let route = window.location.href;
    if (route.includes("admin")) {
      if (window.location.hash.includes("show")) {
        const newUrl = window.location.hash.replace(/show\/\d+/, "show/2");
        window.location.hash = newUrl;
      }
      return;
    }

    if ((route.includes("site/") || route.includes("project/")) && !route.includes("tab=")) {
      const newUrl = `${route}?tab=overview`;
      route = newUrl;
      window.history.replaceState(null, "", newUrl);
    }

    if (route.includes("tab=overview")) {
      const newUrl = route.replace("tab=overview", "tab=gallery");

      sessionStorage.setItem("scrollToElement", "true");
      window.location.href = newUrl;
    }

    scrollToGalleryElement();
  };

  useOnMount(() => {
    if (sessionStorage.getItem("scrollToElement") === "true") {
      scrollToGalleryElement();
      sessionStorage.removeItem("scrollToElement");
    }
  });

  return (
    <div className="relative">
      <Button variant="white-button-map" className="flex items-center gap-2" onClick={() => scrollToElement()}>
        <Icon name={IconNames.IMAGE_ICON} className="h-4 w-4" />
        <Text variant="text-12-bold"> {t("View Gallery")}</Text>
      </Button>
      <ModalImageGallery
        onClose={() => setOpenModal(false)}
        tabItems={modelFilesTabItems}
        title={""}
        WrapperClassName={openModal ? "" : "hidden"}
      />
    </div>
  );
};

export default ViewImageCarousel;

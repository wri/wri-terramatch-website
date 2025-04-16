import { useT } from "@transifex/react";
import classNames from "classnames";
import { useMemo, useState } from "react";

import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import ModalImageGallery, { TabImagesItem } from "@/components/extensive/Modal/ModalImageGallery";
import { MediaDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { useOnMount } from "@/hooks/useOnMount";

import Button from "../../Button/Button";
import Text from "../../Text/Text";

const ViewImageCarousel = ({
  modelFilesData,
  imageGalleryRef,
  className
}: {
  modelFilesData: MediaDto[];
  imageGalleryRef?: React.RefObject<HTMLDivElement>;
  className?: string;
}) => {
  const t = useT();
  const modelFilesTabItems: TabImagesItem[] = useMemo(() => {
    const modelFilesGeolocalized: MediaDto[] = [];
    const modelFilesNonGeolocalized: MediaDto[] = [];
    modelFilesData?.forEach(modelFile => {
      if (modelFile.lat && modelFile.lng) {
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
          src: modelFile.url!,
          title: modelFile.fileName!,
          dateCreated: modelFile.createdAt!,
          geoTag: t("Not Geo-Referenced")
        }))
      },
      {
        id: "2",
        title: t("GeoTagged Images"),
        images: modelFilesGeolocalized.map(modelFile => ({
          id: modelFile.uuid!,
          src: modelFile.url!,
          title: modelFile.fileName!,
          dateCreated: modelFile.createdAt!,
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
      <Button
        variant="white-button-map"
        className={classNames("flex items-center gap-2", className)}
        onClick={() => scrollToElement()}
      >
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

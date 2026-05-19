import { useT } from "@transifex/react";
import classNames from "classnames";
import { FC } from "react";

import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import { useOnMount } from "@/hooks/useOnMount";

import Button from "../../Button/Button";
import Text from "../../Text/Text";

type ViewGalleryButtonProps = {
  imageGalleryRef?: React.RefObject<HTMLDivElement | null>;
  className?: string;
};

const ViewImageGalleryButton: FC<ViewGalleryButtonProps> = ({ imageGalleryRef, className }) => {
  const t = useT();

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
    </div>
  );
};

export default ViewImageGalleryButton;

import { useT } from "@transifex/react";
import { useState } from "react";
import { When } from "react-if";

import Button from "@/components/elements/Button/Button";
import IconButton from "@/components/elements/IconButton/IconButton";
import Checkbox from "@/components/elements/Inputs/Checkbox/Checkbox";
import Text from "@/components/elements/Text/Text";
import { IconNames } from "@/components/extensive/Icon/Icon";
import { useMapContext } from "@/context/map.provider";

export const FilterControl = () => {
  const [showFilters, setShowFilters] = useState(false);
  const { draw, map } = useMapContext();
  const t = useT();

  const changeImagesVisibility = (visible: boolean) => {
    map?.setLayoutProperty("clusters", "visibility", visible ? "visible" : "none");
    map?.setLayoutProperty("cluster-count", "visibility", visible ? "visible" : "none");
    map?.setLayoutProperty("unclustered-point", "visibility", visible ? "visible" : "none");
    map?.setLayoutProperty("image", "visibility", visible ? "visible" : "none");
  };

  const changeShapeFileVisibility = (visible: boolean) => {
    map?.setLayoutProperty("gl-draw-polygon-fill-static.cold", "visibility", visible ? "visible" : "none");
    map?.setLayoutProperty("gl-draw-polygon-stroke-static.cold", "visibility", visible ? "visible" : "none");
  };

  const imagesVisibility = map?.getLayoutProperty("image", "visibility");
  const filterVisibility = map?.getLayoutProperty("gl-draw-polygon-fill-static.cold", "visibility");

  if (!draw) return null;

  return (
    <div className="flex h-fit gap-5 rounded-lg bg-white px-6 py-2 shadow">
      <Button variant="text" className="h-fit" onClick={() => setShowFilters(true)}>
        {t("Map Filter")}
      </Button>
      <When condition={showFilters}>
        <div className="flex h-fit items-center gap-2">
          <Checkbox
            id="filter-images"
            name="filter-images"
            defaultChecked={!imagesVisibility || imagesVisibility === "visible"}
            onChange={e => changeImagesVisibility(e.target.checked)}
          />
          <Text htmlFor="filter-images" as="label" variant="text-bold-caption-200">
            {t("Images")}
          </Text>
        </div>
        <div className="flex h-fit items-center gap-2">
          <Checkbox
            id="filter-shapes"
            name="filter-shapes"
            defaultChecked={!filterVisibility || filterVisibility === "visible"}
            onChange={e => changeShapeFileVisibility(e.target.checked)}
          />
          <Text htmlFor="filter-shapes" as="label" variant="text-bold-caption-200">
            {t("Shapefiles")}
          </Text>
        </div>
        <IconButton
          iconProps={{ name: IconNames.CROSS, className: "fill-error h-[22px]" }}
          onClick={() => setShowFilters(false)}
        />
      </When>
    </div>
  );
};

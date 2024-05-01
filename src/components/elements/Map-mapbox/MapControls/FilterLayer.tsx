import { useT } from "@transifex/react";
import classNames from "classnames";
import { useState } from "react";
import { When } from "react-if";

import Button from "@/components/elements/Button/Button";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import { useMapContext } from "@/context/map.provider";

export const FilterControl = () => {
  const { draw } = useMapContext();

  const [showFilters, setShowFilters] = useState(false);
  const t = useT();

  // Previous Images and Shapefiles Features

  // const changeImagesVisibility = (visible: boolean) => {
  //   map?.setLayoutProperty("clusters", "visibility", visible ? "visible" : "none");
  //   map?.setLayoutProperty("cluster-count", "visibility", visible ? "visible" : "none");
  //   map?.setLayoutProperty("unclustered-point", "visibility", visible ? "visible" : "none");
  //   map?.setLayoutProperty("image", "visibility", visible ? "visible" : "none");
  // };

  // const changeShapeFileVisibility = (visible: boolean) => {
  //   map?.setLayoutProperty("gl-draw-polygon-fill-static.cold", "visibility", visible ? "visible" : "none");
  //   map?.setLayoutProperty("gl-draw-polygon-stroke-static.cold", "visibility", visible ? "visible" : "none");
  // };

  // const imagesVisibility = map?.getLayoutProperty("image", "visibility");
  // const filterVisibility = map?.getLayoutProperty("gl-draw-polygon-fill-static.cold", "visibility");

  if (!draw) return null;

  return (
    <div className="">
      <When condition={showFilters}>
        <div className="relative">
          <div className="absolute bottom-1 w-max rounded-lg bg-white p-2 shadow">
            <Button
              variant="text"
              className="text-12-bold text-nowrap h-fit w-full !justify-start rounded-lg bg-white p-2"
              onClick={() => {}}
            >
              <div className="text-12-semibold flex items-center">
                <div className="mr-2 h-3 w-3 rounded-sm bg-blueCustom-200 lg:h-4 lg:w-4 wide:h-5 wide:w-5" />
                {t("Submitted")}
              </div>
            </Button>
            <Button
              variant="text"
              className="text-12-bold text-nowrap h-fit w-full !justify-start rounded-lg bg-white p-2"
              onClick={() => {}}
            >
              <div className="text-12-semibold flex items-center">
                <div className="mr-2 h-3 w-3 rounded-sm bg-tertiary-600 lg:h-4 lg:w-4 wide:h-5 wide:w-5" />
                {t("Needs More Info")}
              </div>
            </Button>
            <Button
              variant="text"
              className="text-12-bold text-nowrap h-fit w-full !justify-start rounded-lg bg-white p-2"
              onClick={() => {}}
            >
              <div className="text-12-semibold flex items-center">
                <div className="mr-2 h-3 w-3 rounded-sm bg-greenCustom-200 lg:h-4 lg:w-4 wide:h-5 wide:w-5" />
                {t("Approved")}
              </div>
            </Button>
          </div>
        </div>
        {/* <div className="flex items-center gap-2 h-fit">
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
        <div className="flex items-center gap-2 h-fit">
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
        /> */}
      </When>
      <Button
        variant="text"
        className="text-12-bold h-fit rounded-lg bg-white px-5 py-2 shadow"
        onClick={() => setShowFilters(!showFilters)}
      >
        <div className="text-12-bold flex items-center gap-2">
          {t("Polygon Status")}
          <Icon
            name={IconNames.CHEVRON_DOWN}
            className={classNames("fill-neutral-900 transition", showFilters && "rotate-180")}
            width={16}
          />
        </div>
      </Button>
    </div>
  );
};

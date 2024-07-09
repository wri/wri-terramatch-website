import { useT } from "@transifex/react";
import classNames from "classnames";
import { useState } from "react";
import { When } from "react-if";

import Button from "@/components/elements/Button/Button";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";

export const FilterControl = () => {
  const [showFilters, setShowFilters] = useState(false);
  const t = useT();

  const buttons = [
    { color: "pinkCustom", text: "Draft" },
    { color: "blue", text: "Submitted" },
    { color: "tertiary-600", text: "Needs More Info" },
    { color: "green", text: "Approved" }
  ];

  return (
    <div className="">
      <When condition={showFilters}>
        <div className="relative">
          <div className="absolute bottom-1 w-max rounded-lg bg-white p-2 shadow">
            {buttons.map((button, index) => (
              <Button
                key={index}
                variant="text"
                className="text-12-bold text-nowrap h-fit w-full !justify-start rounded-lg bg-white p-2"
                onClick={() => {}}
              >
                <div className="text-12-semibold flex items-center">
                  <div className={`mr-2 h-3 w-3 rounded-sm bg-${button.color} lg:h-4 lg:w-4 wide:h-5 wide:w-5`} />
                  {t(button.text)}
                </div>
              </Button>
            ))}
          </div>
        </div>
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

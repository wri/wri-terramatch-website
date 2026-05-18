import { useT } from "@transifex/react";
import classNames from "classnames";
import { FC, useState } from "react";

import Button from "@/components/elements/Button/Button";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import {
  POLYGON_APPROVED,
  POLYGON_DRAFT,
  POLYGON_INFORMATION_REQUIRED,
  POLYGON_PENDING_APPROVAL
} from "@/constants/polygonStatuses";

const POLYGON_FILTER_LEGEND = [
  { status: POLYGON_DRAFT, color: "pinkCustom", label: "Draft" },
  { status: POLYGON_PENDING_APPROVAL, color: "blue", label: "Pending Approval" },
  { status: POLYGON_INFORMATION_REQUIRED, color: "tertiary-600", label: "Information Required" },
  { status: POLYGON_APPROVED, color: "green", label: "Approved" }
] as const;

export const FilterControl: FC = () => {
  const [showFilters, setShowFilters] = useState(false);
  const t = useT();

  return (
    <div className="">
      {showFilters && (
        <div className="relative">
          <div className="absolute bottom-1 w-max rounded-lg bg-white p-2 shadow">
            {POLYGON_FILTER_LEGEND.map(({ status, color, label }) => (
              <Button
                key={status}
                variant="text"
                className="text-12-bold text-nowrap h-fit w-full !justify-start rounded-lg bg-white p-2"
                onClick={() => {}}
              >
                <div className="text-12-semibold flex items-center">
                  <div className={`mr-2 h-3 w-3 rounded-sm bg-${color} lg:h-4 lg:w-4 wide:h-5 wide:w-5`} />
                  {t(label)}
                </div>
              </Button>
            ))}
          </div>
        </div>
      )}
      <Button
        variant="text"
        className="text-12-bold h-fit rounded border border-neutral-175 bg-white p-2 shadow"
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

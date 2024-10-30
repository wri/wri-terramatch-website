import classNames from "classnames";
import { Fragment } from "react";

import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import { useDashboardContext } from "@/context/dashboard.provider";
import { TextVariants } from "@/types/common";

interface DashboardBreadcrumbsProps {
  className?: string;
  clasNameText?: string;
  textVariant?: TextVariants;
  framework: string;
  countryId?: number;
  countryName?: string;
  countrySlug?: string;
  projectName?: string;
}

const DashboardBreadcrumbs = ({
  className,
  clasNameText,
  textVariant,
  framework,
  countryId,
  countryName,
  countrySlug,
  projectName
}: DashboardBreadcrumbsProps) => {
  const { setFilters } = useDashboardContext();

  const links = [
    {
      title: framework,
      onClick: () =>
        setFilters(prevValues => ({
          ...prevValues,
          programme: "terrafund",
          country: {
            country_slug: "",
            id: 0,
            data: {
              label: "",
              icon: ""
            }
          },
          uuid: ""
        }))
    },
    countryName
      ? {
          title: countryName,
          onClick: () =>
            setFilters(prevValues => ({
              ...prevValues,
              uuid: ""
            }))
        }
      : null,
    projectName
      ? {
          title: projectName
        }
      : null
  ].filter(Boolean);

  return (
    <div className={classNames(className, "flex items-center gap-3")}>
      {links.map(
        (item, index) =>
          item && (
            <Fragment key={`${item?.title}-${index}`}>
              {item.onClick ? (
                <button onClick={item.onClick} className="text-left">
                  <Text
                    variant={textVariant || "text-14-bold"}
                    className={classNames(
                      "text-darkCustom opacity-60 hover:text-primary hover:underline hover:opacity-100",
                      "line-clamp-1",
                      clasNameText
                    )}
                    title={item.title}
                  >
                    {item.title}
                  </Text>
                </button>
              ) : (
                <Text
                  variant={textVariant || "text-14-bold"}
                  className={classNames("text-darkCustom", "line-clamp-1", clasNameText)}
                  title={item.title}
                >
                  {item.title}
                </Text>
              )}
              {index < links.length - 1 && (
                <Icon name={IconNames.CHEVRON_RIGHT} width={12} className="text-darkCustom" />
              )}
            </Fragment>
          )
      )}
    </div>
  );
};

export default DashboardBreadcrumbs;

import classNames from "classnames";
import { Fragment, useMemo } from "react";

import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import { CountriesProps, useDashboardContext } from "@/context/dashboard.provider";
import { TextVariants } from "@/types/common";
import { getCohortName } from "@/utils/dashboardUtils";

interface DashboardBreadcrumbsProps {
  className?: string;
  clasNameText?: string;
  textVariant?: TextVariants;
  cohort: string | undefined | null;
  countryData?: CountriesProps;
  projectName?: string | undefined | null;
}

const DashboardBreadcrumbs = ({
  className,
  clasNameText,
  textVariant,
  cohort,
  countryData,
  projectName
}: DashboardBreadcrumbsProps) => {
  const { setFilters } = useDashboardContext();
  const links = useMemo(
    () =>
      [
        {
          title: getCohortName(cohort),
          onClick: () => {
            setFilters(prevValues => ({
              ...prevValues,
              cohort: cohort,
              country: {
                country_slug: "",
                id: 0,
                data: {
                  label: "",
                  icon: ""
                }
              },
              uuid: ""
            }));
          }
        },
        countryData
          ? {
              title: countryData?.data?.label,
              onClick: () => {
                setFilters(prevValues => ({
                  ...prevValues,
                  country: {
                    country_slug: countryData?.country_slug,
                    id: countryData?.id ?? 0,
                    data: {
                      label: countryData?.data?.label,
                      icon: countryData?.data?.icon
                    }
                  },
                  uuid: ""
                }));
              }
            }
          : null,
        projectName
          ? {
              title: projectName
            }
          : null
      ].filter(Boolean),
    [cohort, countryData, projectName, setFilters]
  );

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
                      "text-nowrap",
                      "w-max",
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
                  className={classNames("text-darkCustom", "text-nowrap", "line-clamp-1", clasNameText)}
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

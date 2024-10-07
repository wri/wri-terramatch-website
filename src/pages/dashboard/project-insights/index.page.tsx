import { useT } from "@transifex/react";
import React from "react";

import Table from "@/components/elements/Table/Table";
import { VARIANT_TABLE_AIRTABLE_DASHBOARD } from "@/components/elements/Table/TableVariants";
import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";

const ProjectInsights = () => {
  const t = useT();

  return (
    <div className="h-full overflow-hidden bg-neutral-70 py-8 px-14">
      <Table
        variant={VARIANT_TABLE_AIRTABLE_DASHBOARD}
        hasPagination
        classNameWrapper=" py-8 !px-9 bg-white rounded-3xl"
        invertSelectPagination={true}
        data={[
          {
            projectName: {
              title: "Harit Bharat Fund Base",
              description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
              link: "",
              image: "/images/airtable-card.png",
              year: "2023"
            },
            lastUpdate: "9 January 2024"
          },
          {
            projectName: {
              title: "Harit Bharat Fund Base",
              description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
              link: "",
              image: "/images/airtable-card.png",
              year: "2023"
            },
            lastUpdate: "9 January 2024"
          },
          {
            projectName: {
              title: "Harit Bharat Fund Base",
              description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
              link: "",
              image: "/images/airtable-card.png",
              year: "2023"
            },
            lastUpdate: "9 January 2024"
          },
          {
            projectName: {
              title: "Harit Bharat Fund Base",
              description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
              link: "",
              image: "/images/airtable-card.png",
              year: "2023"
            },
            lastUpdate: "9 January 2024"
          },
          {
            projectName: {
              title: "Harit Bharat Fund Base",
              description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
              link: "",
              image: "/images/airtable-card.png",
              year: "2023"
            },
            lastUpdate: "9 January 2024"
          },
          {
            projectName: {
              title: "Harit Bharat Fund Base",
              description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
              link: "",
              image: "/images/airtable-card.png",
              year: "2023"
            },
            lastUpdate: "9 January 2024"
          },
          {
            projectName: {
              title: "Harit Bharat Fund Base",
              description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
              link: "",
              image: "/images/airtable-card.png",
              year: "2023"
            },
            lastUpdate: "9 January 2024"
          },
          {
            projectName: {
              title: "Harit Bharat Fund Base",
              description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
              link: "",
              image: "/images/airtable-card.png",
              year: "2023"
            },
            lastUpdate: "9 January 2024"
          },
          {
            projectName: {
              title: "Harit Bharat Fund Base",
              description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
              link: "",
              image: "/images/airtable-card.png",
              year: "2023"
            },
            lastUpdate: "9 January 2024"
          }
        ]}
        columns={[
          {
            accessorKey: "projectName",
            header: "Project Name",
            enableSorting: false,
            cell: (props: any) => {
              const { title, description, link, image, year } = props.getValue();

              return (
                <div className="flex w-full items-center gap-2">
                  <img src={image} alt="project-img" className="h-10 w-10 rounded" />
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1">
                      <Text variant="text-14-semibold">
                        {t(title)} - {t(year)}
                      </Text>
                      <Text variant="text-14-light" className="text-blueCustom-900">
                        {t("Airtable")}
                      </Text>
                      <a href={link} target="_blank" rel="noreferrer">
                        <Icon name={IconNames.LINK_AIRTABLE} className="h-3 w-3" />
                      </a>
                    </div>
                    <Text variant="text-14-light" className="text-darkCustom-50">
                      {t(description)}
                    </Text>
                  </div>
                </div>
              );
            }
          },
          {
            accessorKey: "lastUpdate",
            header: "Last Update",
            enableSorting: false
          }
        ]}
      />
    </div>
  );
};

export default ProjectInsights;

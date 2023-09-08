import { useT } from "@transifex/react";
import React from "react";
import { When } from "react-if";

import Table from "@/components/elements/Table/Table";
import Text from "@/components/elements/Text/Text";
import { V2OrganisationRead } from "@/generated/apiSchemas";

type TeamAndResourcesProps = {
  organization?: V2OrganisationRead;
};

const TeamAndResources = ({ organization }: TeamAndResourcesProps) => {
  const t = useT();

  return (
    <section className="my-10 bg-neutral-150 p-8">
      <Text variant="text-heading-300">{t("Team and Resources")}</Text>
      <div className="mt-10 flex flex-col gap-12">
        <When
          // @ts-expect-error
          condition={organization?.leadership_team && organization?.leadership_team.length > 0}
        >
          <Table
            initialTableState={{
              pagination: { pageSize: 5 }
            }}
            columns={[
              {
                accessorKey: "id",
                header: "#"
              },
              {
                accessorKey: "firstName",
                header: t("First Name")
              },
              {
                accessorKey: "lastName",
                header: t("Last Name")
              },
              {
                accessorKey: "gender",
                header: t("Gender")
              },
              {
                accessorKey: "age",
                header: t("Age")
              },
              {
                accessorKey: "role",
                header: t("Role")
              }
            ]}
            // @ts-expect-error
            data={organization?.leadership_team.map((member, index) => ({
              id: (index + 1).toString(),
              firstName: member.first_name,
              lastName: member.last_name,
              age: member.age,
              role: member.position,
              gender: member.gender
            }))}
          />
        </When>
        <Table
          columns={[
            {
              accessorKey: "label",
              header: t("Employee Type"),
              enableSorting: false
            },
            {
              accessorKey: "count",
              header: t("Employee Count")
            }
          ]}
          initialTableState={{
            pagination: { pageSize: 5 }
          }}
          data={[
            {
              id: "1",
              label: "Number of full-time permanent employees",
              count: organization?.ft_permanent_employees
            },
            {
              id: "2",
              label: "Number of part-time permanent employees",
              count: organization?.pt_permanent_employees
            },
            {
              id: "3",
              label: "Number of temporary employees",
              count: organization?.temp_employees
            },
            {
              id: "4",
              label: "Number of female employees",
              count: organization?.female_employees
            },
            {
              id: "5",
              label: "Number of male employees",
              count: organization?.male_employees
            },
            {
              id: "6",
              label: "Number of employees between and including ages 18 and 35",
              count: organization?.young_employees
            },
            {
              id: "7",
              label: "Number of employees older than 35 years of age",
              // @ts-expect-error
              count: organization?.over_35_employees
            }
          ]}
        />
      </div>
    </section>
  );
};

export default TeamAndResources;

import { useT } from "@transifex/react";
import { FC } from "react";

import Table from "@/components/elements/Table/Table";
import { VARIANT_TABLE_BORDER_ALL } from "@/components/elements/Table/TableVariants";
import Text from "@/components/elements/Text/Text";
import { useGadmOptions } from "@/connections/Gadm";
import { useOrganisationLeadership } from "@/connections/Organisation";
import { OrganisationFullDto } from "@/generated/v3/userService/userServiceSchemas";
import { formatOptionsList } from "@/utils/options";

type TeamAndResourcesProps = {
  organization?: OrganisationFullDto;
};

const TeamAndResources: FC<TeamAndResourcesProps> = ({ organization }) => {
  const t = useT();
  const countryOptions = useGadmOptions({ level: 0 });

  const [, { leadership: leadershipTeam }] = useOrganisationLeadership({
    organisationUuid: organization?.uuid ?? ""
  });

  return (
    <section className="my-10 rounded-lg bg-neutral-150 p-8">
      <Text variant="text-heading-300">{t("Team and Resources")}</Text>
      <div className="mt-10 flex flex-col gap-12">
        {leadershipTeam != null && leadershipTeam.length > 0 && (
          <Table
            variant={VARIANT_TABLE_BORDER_ALL}
            columns={[
              {
                accessorKey: "name",
                header: t("Name"),
                enableSorting: false
              },
              {
                accessorKey: "position",
                header: t("Position"),
                enableSorting: false
              },
              {
                accessorKey: "nationality",
                header: t("Nationality"),
                enableSorting: false,
                cell: ({ getValue }) => {
                  const nationality = getValue() as string | null;
                  return nationality ? formatOptionsList(countryOptions ?? [], nationality ? [nationality] : []) : null;
                }
              },
              {
                accessorKey: "gender",
                header: t("Gender"),
                enableSorting: false
              },
              {
                accessorKey: "age",
                header: t("Age"),
                enableSorting: false
              }
            ]}
            initialTableState={{
              pagination: { pageSize: 10 }
            }}
            data={leadershipTeam.map(leader => ({
              id: leader.uuid,
              name: [leader.firstName, leader.lastName].filter(Boolean).join(" ") || null,
              position: leader.position ?? null,
              nationality: leader.nationality ?? null,
              gender: leader.gender ?? null,
              age: leader.age ?? null
            }))}
          />
        )}
        <Table
          variant={VARIANT_TABLE_BORDER_ALL}
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
              count: organization?.ftPermanentEmployees ?? undefined
            },
            {
              id: "2",
              label: "Number of part-time permanent employees",
              count: organization?.ptPermanentEmployees ?? undefined
            },
            {
              id: "3",
              label: "Number of temporary employees",
              count: organization?.tempEmployees ?? undefined
            },
            {
              id: "4",
              label: "Number of female employees",
              count: organization?.femaleEmployees ?? undefined
            },
            {
              id: "5",
              label: "Number of male employees",
              count: organization?.maleEmployees ?? undefined
            },
            {
              id: "6",
              label: "Number of employees between and including ages 18 and 35",
              count: organization?.youngEmployees ?? undefined
            },
            {
              id: "7",
              label: "Number of employees older than 35 years of age",
              count: organization?.over35Employees ?? undefined
            }
          ]}
        />
      </div>
    </section>
  );
};

export default TeamAndResources;

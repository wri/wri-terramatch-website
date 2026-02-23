import { Typography } from "@mui/material";
import { ColumnDef } from "@tanstack/react-table";
import { FC, useCallback, useMemo, useRef, useState } from "react";
import { Link, useCreatePath, useShowContext } from "react-admin";

import modules from "@/admin/modules";
import { ConnectionTable } from "@/components/elements/ServerSideTable/ConnectionTable";
import { VARIANT_TABLE_PRIMARY } from "@/components/elements/Table/TableVariants";
import { applicationsConnection } from "@/connections/Application";
import { loadFundingProgramme } from "@/connections/FundingProgramme";
import { ApplicationDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { FundingProgrammeDto } from "@/generated/v3/entityService/entityServiceSchemas";

type FundingProgrammeRow = {
  fundingProgrammeUuid: string;
  name: string;
  status: string;
  createdAt: string;
};

const createColumns = (createPath: ReturnType<typeof useCreatePath>): ColumnDef<FundingProgrammeRow>[] => [
  {
    accessorKey: "name",
    header: "Name",
    enableSorting: false,
    cell: props => {
      const row = props.row.original;
      return (
        <Link
          to={createPath({
            resource: modules.fundingProgramme.ResourceName,
            type: "show",
            id: row.fundingProgrammeUuid
          })}
        >
          {row.name}
        </Link>
      );
    }
  },
  {
    accessorKey: "status",
    header: "Status",
    enableSorting: false,
    cell: props => {
      const status = props.getValue() as string;
      return status ?? "<no status>";
    }
  },
  {
    accessorKey: "createdAt",
    header: "Date added",
    enableSorting: false,
    cell: props => {
      const date = props.getValue() as string;
      if (!date) return "<no date>";
      return new Date(date).toLocaleDateString("en-GB");
    }
  }
];

const OrganisationFundingProgrammesTable: FC = () => {
  const organisationUuid = useShowContext().record?.uuid;
  const createPath = useCreatePath();

  const [fundingProgrammesMap, setFundingProgrammesMap] = useState<Map<string, FundingProgrammeDto>>(new Map());

  const fetchedUuidsRef = useRef<Set<string>>(new Set());

  const columns = useMemo(() => createColumns(createPath), [createPath]);

  const fetchMissingFundingProgrammes = useCallback(async (applications: ApplicationDto[]) => {
    const uniqueUuids = Array.from(
      new Set(applications.map(app => app.fundingProgrammeUuid).filter((uuid): uuid is string => Boolean(uuid)))
    );

    const uuidsToFetch = uniqueUuids.filter(uuid => !fetchedUuidsRef.current.has(uuid));

    if (uuidsToFetch.length === 0) {
      return;
    }

    uuidsToFetch.forEach(uuid => fetchedUuidsRef.current.add(uuid));

    const fundingProgrammePromises = uuidsToFetch.map(uuid => loadFundingProgramme({ id: uuid, translated: false }));

    const results = await Promise.all(fundingProgrammePromises);

    setFundingProgrammesMap(prevMap => {
      const newMap = new Map(prevMap);
      results.forEach((result, index) => {
        if (result.data) {
          newMap.set(uuidsToFetch[index], result.data);
        }
      });
      return newMap;
    });
  }, []);

  const dataProcessor = useMemo(
    () =>
      (applications: ApplicationDto[]): FundingProgrammeRow[] => {
        const programmesMap = new Map<string, { name: string; createdAt: string }>();

        applications.forEach(app => {
          const uuid = app.fundingProgrammeUuid;
          if (!uuid) return;

          const existing = programmesMap.get(uuid);
          const appDate = new Date(app.createdAt).getTime();

          if (!existing) {
            programmesMap.set(uuid, {
              name: app.fundingProgrammeName ?? "",
              createdAt: app.createdAt
            });
          } else {
            const existingDate = new Date(existing.createdAt).getTime();
            if (appDate < existingDate) {
              programmesMap.set(uuid, {
                ...existing,
                createdAt: app.createdAt
              });
            }
          }
        });

        return Array.from(programmesMap.entries()).map(([uuid, data]) => {
          const fundingProgramme = fundingProgrammesMap.get(uuid);
          return {
            fundingProgrammeUuid: uuid,
            name: data.name,
            status: fundingProgramme?.status ?? "",
            createdAt: data.createdAt
          };
        });
      },
    [fundingProgrammesMap]
  );

  const onApplicationsFetch = useCallback(
    (connectedData: { data?: ApplicationDto[] }) => {
      if (connectedData.data) {
        fetchMissingFundingProgrammes(connectedData.data);
      }
    },
    [fetchMissingFundingProgrammes]
  );

  return (
    <div>
      <Typography variant="h6" component="h3" mb={2}>
        Funding Programs Enrolled
      </Typography>
      <ConnectionTable
        connection={applicationsConnection}
        connectionProps={{ filter: { organisationUuid } }}
        variant={VARIANT_TABLE_PRIMARY}
        columns={columns}
        dataProcessor={dataProcessor}
        onFetch={onApplicationsFetch}
      />
    </div>
  );
};

export default OrganisationFundingProgrammesTable;

import { ColumnDef } from "@tanstack/react-table";
import { useT } from "@transifex/react";

import CountryFlag from "@/components/dashboard/CountryFlag";
import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";

export type ImpactStoryModalRow = {
  title: string;
  date?: string;
  thumbnail?: string;
  organization: {
    name: string;
    country: string;
    countries_data?: { icon?: string; label?: string }[];
  };
  uuid?: string;
};

export function buildImpactStoriesModalColumns(
  t: typeof useT,
  onOpenStory: (row: ImpactStoryModalRow) => void
): ColumnDef<ImpactStoryModalRow>[] {
  return [
    {
      header: t("Impact Story"),
      accessorKey: "title",
      enableSorting: true
    },
    {
      header: t("Country"),
      cell: (props: { row: { original: ImpactStoryModalRow } }) => {
        const countries = props.row.original.organization?.countries_data ?? [];
        if (countries.length === 0) {
          return <Text variant="text-14">-</Text>;
        }

        return (
          <div className="flex flex-wrap items-center gap-2">
            {countries.map((country: { icon?: string; label?: string }, index: number) => (
              <div key={index} className="flex items-center gap-2">
                <CountryFlag src={country.icon ?? ""} alt={`${country.label} flag`} size="xs" />
                <Text variant="text-14">{country.label}</Text>
              </div>
            ))}
          </div>
        );
      },
      accessorKey: "organization.countries_data",
      enableSorting: true
    },
    {
      header: t("Organization"),
      accessorKey: "organization.name",
      enableSorting: true
    },
    {
      header: t("Date Created"),
      accessorKey: "date",
      enableSorting: false
    },
    {
      header: "",
      accessorKey: "link",
      enableSorting: false,
      cell: ({ row }: { row: { original: ImpactStoryModalRow } }) => {
        return (
          <button type="button" onClick={() => onOpenStory(row.original)}>
            <Icon name={IconNames.IC_ARROW_COLLAPSE} className="h-3 w-3 rotate-90 text-darkCustom hover:text-primary" />
          </button>
        );
      }
    }
  ];
}

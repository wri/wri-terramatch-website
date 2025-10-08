import { useT } from "@transifex/react";
import { flatMap } from "lodash";
import { useMemo } from "react";
import { Link, useBasename } from "react-admin";

import { formatEntryValue } from "@/admin/apiProvider/utils/entryFormat";
import Table from "@/components/elements/Table/Table";
import { VARIANT_TABLE_AIRTABLE_DASHBOARD } from "@/components/elements/Table/TableVariants";
import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import { FormStepSchema } from "@/components/extensive/WizardForm/types";
import { DISTURBANCE_PROPERTY_AFFECTED_OPTIONS, formatOptions } from "@/constants/options/disturbanceReports";
import { TextVariants } from "@/types/common";

import Intensity from "./Intensity";

const parseFieldValue = (value: any) => {
  if (typeof value === "string" && value.startsWith("[") && value.endsWith("]")) {
    try {
      return JSON.parse(value);
    } catch (e) {
      return value;
    }
  }
  return value;
};

interface DisturbanceReportProps {
  id?: string;
  index?: number;
  values?: Record<string, any>;
  formSteps?: FormStepSchema[];
}

interface SiteAffected {
  siteUuid: string;
  siteName: string;
}

interface PolygonAffected {
  polyUuid: string;
  polyName: string;
  siteUuid: string;
}

const TextEntry = ({
  value,
  variant = "text-14",
  className = "leading-none text-blueCustom-900",
  variantLabel = "text-14-light",
  classNameLabel = "leading-none text-darkCustom-300",
  classNameContainer = "flex flex-col gap-2 capitalize",
  label
}: {
  value: any;
  variant?: TextVariants;
  className?: string;
  variantLabel?: TextVariants;
  classNameLabel?: string;
  classNameContainer?: string;
  label?: string;
}) =>
  value == null ? null : (
    <div className={classNameContainer}>
      <Text variant={variantLabel} className={classNameLabel}>
        {label}
      </Text>
      {Array.isArray(value) ? (
        <Text variant={variant} className={className}>
          {value.join(", ")}
        </Text>
      ) : typeof value === "string" || typeof value === "number" ? (
        <Text variant={variant} className={className} dangerouslySetInnerHTML={{ __html: formatEntryValue(value) }} />
      ) : (
        <Text variant={variant} className={className}>
          {formatEntryValue(value)}
        </Text>
      )}
    </div>
  );

const DisturbanceReport = (props: DisturbanceReportProps) => {
  const { values = {}, formSteps = [] } = props;
  const basename = useBasename();
  const t = useT();

  const disturbanceReportEntries = useMemo(() => {
    const field = flatMap(formSteps, "fields").find(({ type }) => type === "disturbanceReportEntries");
    return values[field?.name ?? ""] ?? [];
  }, [values, formSteps]);

  const getFieldValue = (fieldName: string) => {
    const field = disturbanceReportEntries.find((f: any) => f.name === fieldName);
    return field ? parseFieldValue(field.value) : null;
  };

  const disturbanceType = getFieldValue("disturbance-type");
  const disturbanceSubtype = getFieldValue("disturbance-subtype");
  const intensity = getFieldValue("intensity");
  const extent = getFieldValue("extent");
  const propertyAffected = getFieldValue("property-affected");
  const peopleAffected = getFieldValue("people-affected");
  const dateOfDisturbance = getFieldValue("date-of-disturbance");
  const monetaryDamage = getFieldValue("monetary-damage");
  const sitesAffected = getFieldValue("site-affected");
  const polygonsAffected = getFieldValue("polygon-affected");

  const formatValuesWithOptions = (values: string[], options: Array<{ value: string; title: string }>) => {
    if (!Array.isArray(values)) return values;
    return values.map(value => {
      const option = options.find(opt => opt.value === value);
      return option ? option.title : value;
    });
  };

  const formattedPropertyAffected = formatValuesWithOptions(propertyAffected, DISTURBANCE_PROPERTY_AFFECTED_OPTIONS);
  const formattedSubtype = formatOptions(disturbanceSubtype);

  const columns = [
    {
      accessorKey: "sites_affected",
      header: t("Sites Affected"),
      cell: ({ getValue, row }: any) => (
        <Text variant="text-14-light" className="flex items-center gap-2 leading-none text-blueCustom-900">
          {getValue()}
          <Link
            className="h-4 w-4 cursor-pointer text-darkCustom-300 hover:text-primary"
            to={`${basename}${`/site/${row.original?.site_uuid}/show`}`}
          >
            <Icon name={IconNames.LINK_PA} className="h-4 w-4" />
          </Link>
        </Text>
      ),
      enableSorting: false,
      meta: { width: "50%" }
    },
    {
      accessorKey: "polygon_affected",
      header: t("Polygons Affected"),
      enableSorting: false,
      meta: { width: "50%" }
    }
  ];

  const disturbanceReportData = Array.isArray(sitesAffected)
    ? sitesAffected.map((site: SiteAffected) => {
        const sitePolygons =
          polygonsAffected?.flat().filter((poly: PolygonAffected) => poly?.siteUuid === site?.siteUuid) ?? [];

        return {
          sites_affected: site?.siteName,
          site_uuid: site?.siteUuid,
          polygon_affected: sitePolygons?.map((poly: PolygonAffected) => poly?.polyName).join(", ")
        };
      })
    : [];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <Text variant="text-20-bold" className="leading-none" />
        <div className="grid grid-cols-3 gap-x-4 gap-y-6">
          <TextEntry value={disturbanceType ?? t("Answer Not Provided")} label={t("Disturbance Type")} />
          <TextEntry
            value={formattedSubtype ?? t("Answer Not Provided")}
            label={t("Disturbance Subtype")}
            classNameContainer="col-span-2 flex flex-col gap-2"
            className="text-blueCustom-900"
          />

          <div className="flex flex-col gap-2">
            <Text variant="text-14-light" className="leading-none text-darkCustom-300">
              {t("Intensity")}
            </Text>
            {["low", "medium", "high"].includes(intensity?.toLowerCase()) ? (
              <Intensity className="text-blueCustom-900" intensity={intensity?.toLowerCase()} />
            ) : (
              <Text variant="text-14" className="leading-none text-blueCustom-900">
                {t("Answer Not Provided")}
              </Text>
            )}
          </div>

          <TextEntry value={extent ?? t("Answer Not Provided")} label={t("Extent")} />
          <TextEntry
            value={peopleAffected ? Number(peopleAffected).toLocaleString() : t("Answer Not Provided")}
            label={t("People Affected")}
          />
          <TextEntry
            value={formattedPropertyAffected ?? t("Answer Not Provided")}
            label={t("Property Affected")}
            classNameContainer="col-span-3 flex flex-col gap-2"
            className="text-blueCustom-900"
          />
          <TextEntry value={dateOfDisturbance ?? t("Answer Not Provided")} label={t("Date of Disturbance")} />
          <TextEntry
            value={monetaryDamage ? `$${Number(monetaryDamage).toLocaleString()}` : t("Answer Not Provided")}
            label={t("Monetary Damage (USD)")}
          />
        </div>
      </div>

      <Table
        data={disturbanceReportData}
        columns={columns}
        hasPagination={false}
        invertSelectPagination={false}
        variant={VARIANT_TABLE_AIRTABLE_DASHBOARD}
      />
    </div>
  );
};

export default DisturbanceReport;

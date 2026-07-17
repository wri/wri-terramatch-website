import { useT } from "@transifex/react";
import Link from "next/link";

import Intensity, { IntensityEnum } from "@/admin/modules/disturbanceReport/components/Intensity";
import LongTextField from "@/components/elements/Field/LongTextField";
import Table from "@/components/elements/Table/Table";
import { VARIANT_TABLE_AIRTABLE_DASHBOARD } from "@/components/elements/Table/TableVariants";
import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import PageBody from "@/components/extensive/PageElements/Body/PageBody";
import PageCard from "@/components/extensive/PageElements/Card/PageCard";
import PageColumn from "@/components/extensive/PageElements/Column/PageColumn";
import PageRow from "@/components/extensive/PageElements/Row/PageRow";
import Container from "@/components/generic/Layout/Container";
import { formatOptions } from "@/constants/options/disturbanceReports";
import { shouldHideNurseries, toFramework } from "@/context/framework.provider";
import { DisturbanceReportFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { useDate } from "@/hooks/useDate";

type DisturbanceReportOverviewTabProps = {
  report?: DisturbanceReportFullDto;
};

interface SiteAffected {
  siteUuid: string;
  siteName: string;
}

interface NurseryAffected {
  nurseryUuid: string;
  nurseryName: string;
}

interface PolygonAffected {
  polyUuid: string;
  polyName: string;
  siteUuid: string;
}

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

const DisturbanceReportOverviewTab = ({ report }: DisturbanceReportOverviewTabProps) => {
  const t = useT();
  const { format } = useDate();

  if (!report) {
    return (
      <Container className="mx-auto rounded-2xl p-8 shadow-all">
        <Text variant="text-16-light">{t("No disturbance report data available")}</Text>
      </Container>
    );
  }

  const hideNurseries = shouldHideNurseries(toFramework(report.frameworkKey));

  const sitesAffectedColumns = [
    {
      accessorKey: "sitesAffected",
      header: t("Sites Affected"),
      cell: ({ getValue, row }: any) => (
        <Text variant="text-14-light" className="flex items-center gap-2 leading-none text-blueCustom-900">
          {getValue()}
          <Link
            className="h-4 w-4 cursor-pointer text-darkCustom-300 hover:text-primary"
            href={`/site/${row.original?.siteUuid}`}
          >
            <Icon name={IconNames.LINK_PA} className="h-4 w-4" />
          </Link>
        </Text>
      ),
      enableSorting: false,
      meta: { width: "50%" }
    },
    {
      accessorKey: "polygonAffected",
      header: t("Polygons Affected"),
      enableSorting: false,
      meta: { width: "50%" }
    }
  ];

  const nurseriesAffectedColumns = [
    {
      accessorKey: "nurseriesAffected",
      header: t("Nurseries Affected"),
      cell: ({ getValue, row }: any) => (
        <Text variant="text-14-light" className="flex items-center gap-2 leading-none text-blueCustom-900">
          {getValue()}
          <Link
            className="h-4 w-4 cursor-pointer text-darkCustom-300 hover:text-primary"
            href={`/nursery/${row.original?.nurseryUuid}`}
          >
            <Icon name={IconNames.LINK_PA} className="h-4 w-4" />
          </Link>
        </Text>
      ),
      enableSorting: false,
      meta: { width: "50%" }
    }
  ];

  const getFieldValue = (fieldName: string) => {
    const field = report?.entries?.find((f: any) => f.name === fieldName);
    return field ? parseFieldValue(field.value) : null;
  };

  const disturbanceType = getFieldValue("disturbance-type");
  const disturbanceSubtype = getFieldValue("disturbance-subtype");
  const intensity = getFieldValue("intensity");
  const extent = getFieldValue("extent");
  const propertyAffected = getFieldValue("property-affected");
  const peopleAffected = getFieldValue("people-affected");
  const financialLoss = getFieldValue("financial-loss");
  const sitesAffected = getFieldValue("site-affected");
  const polygonsAffected = getFieldValue("polygon-affected");
  const nurseriesAffected = getFieldValue("nursery-affected");

  const disturbanceReportData = Array.isArray(sitesAffected)
    ? sitesAffected.map((site: SiteAffected) => {
        const sitePolygons =
          polygonsAffected?.flat().filter((poly: PolygonAffected) => poly?.siteUuid === site?.siteUuid) ?? [];

        return {
          sitesAffected: site?.siteName,
          siteUuid: site?.siteUuid,
          polygonAffected: sitePolygons?.map((poly: PolygonAffected) => poly?.polyName).join(", ")
        };
      })
    : [];

  const nurseriesAffectedData = Array.isArray(nurseriesAffected)
    ? nurseriesAffected.map((nursery: NurseryAffected) => {
        return {
          nurseriesAffected: nursery?.nurseryName,
          nurseryUuid: nursery?.nurseryUuid
        };
      })
    : [];
  return (
    <PageBody>
      <PageRow className="gap-12">
        <PageColumn>
          <PageCard title={t("Reported Data")} gap={8}>
            <LongTextField title={t("Disturbance Type")}>{formatOptions(disturbanceType)}</LongTextField>
            <LongTextField title={t("Disturbance Subtype")}>
              {formatOptions(disturbanceSubtype)?.join(", ")}
            </LongTextField>
            <LongTextField title={t("Extent")}>{extent ? `${extent}%` : null}</LongTextField>
            <LongTextField title={t("People Affected")}>
              {peopleAffected ? Number(peopleAffected)?.toLocaleString() : null}
            </LongTextField>
            <LongTextField title={t("Financial Loss")}>
              {financialLoss ? `$${Number(financialLoss)?.toLocaleString()}` : null}
            </LongTextField>
            <LongTextField title={t("Property Affected")}>{formatOptions(propertyAffected)?.join(", ")}</LongTextField>
            <LongTextField title={t("Disturbance Start Date")}>
              {format(report?.disturbanceStartDate ?? "")}
            </LongTextField>
            <LongTextField title={t("Disturbance End Date")}>{format(report?.disturbanceEndDate ?? "")}</LongTextField>
            <LongTextField title={t("Intensity")}>
              {intensity ? <Intensity intensity={intensity?.toLowerCase() as IntensityEnum} className="mb-2" /> : null}
            </LongTextField>
          </PageCard>
        </PageColumn>

        <PageColumn>
          <PageCard title={t("Description")} gap={8} className="h-full">
            <LongTextField title={t("Description")}>{report?.description}</LongTextField>
            <LongTextField title={t("Action Description")}>{report?.actionDescription}</LongTextField>
          </PageCard>
        </PageColumn>
      </PageRow>
      <PageRow>
        <PageColumn>
          <PageCard title={t("Sites Affected")} gap={8}>
            <Table
              data={disturbanceReportData}
              columns={sitesAffectedColumns}
              hasPagination={false}
              invertSelectPagination={false}
              variant={VARIANT_TABLE_AIRTABLE_DASHBOARD}
            />
          </PageCard>
          {!hideNurseries && (
            <PageCard title={t("Nurseries Affected")} gap={8}>
              <Table
                data={nurseriesAffectedData}
                columns={nurseriesAffectedColumns}
                hasPagination={false}
                invertSelectPagination={false}
                variant={VARIANT_TABLE_AIRTABLE_DASHBOARD}
              />
            </PageCard>
          )}
        </PageColumn>
      </PageRow>
      <br />
      <br />
    </PageBody>
  );
};

export default DisturbanceReportOverviewTab;

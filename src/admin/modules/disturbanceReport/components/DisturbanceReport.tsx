import { useT } from "@transifex/react";
import { useMemo } from "react";

import { formatEntryValue } from "@/admin/apiProvider/utils/entryFormat";
import Table from "@/components/elements/Table/Table";
import { VARIANT_TABLE_AIRTABLE_DASHBOARD } from "@/components/elements/Table/TableVariants";
import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import { useGetFormEntries } from "@/components/extensive/WizardForm/FormSummaryRow";
import { TextVariants } from "@/types/common";

import DownloadMediaItem from "./DownloadMediaItem";
import Intensity from "./Intensity";
import { DisturbanceReportData } from "./MockedData";

interface DisturbanceReportProps {
  id: string;
  index: number;
  values?: Record<string, any>;
  formSteps?: any[];
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
}) => {
  return (
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
};

const DisturbanceReport = (props: DisturbanceReportProps) => {
  const { values = {}, formSteps = [] } = props;
  const t = useT();
  const entries = useGetFormEntries({
    step: {
      title: "Disturbance Report",
      fields: formSteps.flatMap(step => step.fields ?? [])
    },
    values,
    type: "disturbance-reports"
  });

  const entriesMap = useMemo(() => {
    const map = new Map();
    formSteps.forEach(step => {
      step.fields?.forEach((field: any) => {
        if (field?.linked_field_key) {
          const entry = entries.find(e => e.title === field.label);
          if (entry) {
            map.set(field.linked_field_key, entry.value);
          }
        }
      });
    });
    return map;
  }, [entries, formSteps]);

  const FIELD_KEYS = {
    DISTURBANCE_TYPE: "dis-rep-disturbance-type",
    DISTURBANCE_SUBTYPE: "dis-rep-disturbance-subtype",
    INTENSITY: "dis-rep-intensity",
    EXTENT: "dis-rep-extent",
    PROPERTY_AFFECTED: "dis-rep-property-affected",
    PEOPLE_AFFECTED: "dis-rep-people-affected",
    DATE_OF_DISTURBANCE: "dis-rep-date-of-disturbance",
    MONETARY_DAMAGE: "dis-rep-monetary-damage",
    DESCRIPTION: "dis-rep-description",
    ACTION_DESCRIPTION: "dis-rep-action-description",
    MEDIA_ASSETS: "dis-rep-media-assets"
  };

  // TODO: Uncomment this when we have the labels
  // const getFieldLabel = (linkedFieldKey: string) => {
  //   const field = formSteps[0]?.fields?.find((f: any) => f.linked_field_key === linkedFieldKey);
  //   return field?.label || linkedFieldKey;
  // };

  const disturbanceType = entriesMap.get(FIELD_KEYS.DISTURBANCE_TYPE);
  const disturbanceSubtype = entriesMap.get(FIELD_KEYS.DISTURBANCE_SUBTYPE);
  const intensity = entriesMap.get(FIELD_KEYS.INTENSITY);
  const extent = entriesMap.get(FIELD_KEYS.EXTENT);
  const propertyAffected = entriesMap.get(FIELD_KEYS.PROPERTY_AFFECTED);
  const peopleAffected = entriesMap.get(FIELD_KEYS.PEOPLE_AFFECTED);
  const dateOfDisturbance = entriesMap.get(FIELD_KEYS.DATE_OF_DISTURBANCE);
  const monetaryDamage = entriesMap.get(FIELD_KEYS.MONETARY_DAMAGE);
  const description = entriesMap.get(FIELD_KEYS.DESCRIPTION);
  const actionDescription = entriesMap.get(FIELD_KEYS.ACTION_DESCRIPTION);

  const getMediaAssets = () => {
    for (const step of formSteps) {
      const field = step?.fields?.find((f: any) => f?.linked_field_key === FIELD_KEYS.MEDIA_ASSETS);
      if (field) {
        return values[field.name] ?? null;
      }
    }
    return null;
  };
  const mediaAssets = getMediaAssets();

  const columns = [
    {
      accessorKey: "sites_affected",
      header: "Sites Affected",
      cell: ({ getValue }: any) => (
        <Text variant="text-14-light" className="flex items-center gap-2 leading-none text-blueCustom-900">
          {getValue()}
          <Icon name={IconNames.LINK_PA} className="h-4 w-4 text-darkCustom-300 hover:text-primary" />
        </Text>
      ),
      enableSorting: false,
      meta: { width: "50%" }
    },
    {
      accessorKey: "polygon_affected",
      header: "Polygons Affected",
      enableSorting: false,
      meta: { width: "50%" }
    }
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <Text variant="text-20-bold" className="leading-none" />
        <div className="grid grid-cols-3 gap-x-4 gap-y-6">
          <TextEntry value={disturbanceType} label={t("Disturbance Type")} />
          <TextEntry
            value={disturbanceSubtype}
            label={t("Disturbance Subtype")}
            classNameContainer="col-span-2 flex flex-col gap-2"
          />
          <div className="flex flex-col gap-2">
            <Text variant="text-14-light" className="leading-none text-darkCustom-300">
              {t("Intensity")}
            </Text>
            {intensity ? (
              <Intensity className="text-blueCustom-900" intensity={intensity?.toLowerCase()} />
            ) : (
              <Text variant="text-14" className="leading-none text-blueCustom-900">
                {t("Answer Not Provided")}
              </Text>
            )}
          </div>
          <TextEntry value={extent} label={t("Extent")} />
          <TextEntry value={peopleAffected} label={t("People Affected")} />
          <TextEntry
            value={propertyAffected}
            label={t("Property Affected")}
            classNameContainer="col-span-3 flex flex-col gap-2"
          />
          <TextEntry value={dateOfDisturbance} label={t("Date of Disturbance")} />
          <TextEntry value={monetaryDamage} label={t("Monetary Damage")} />
        </div>
      </div>
      <Table
        data={DisturbanceReportData}
        columns={columns}
        hasPagination={false}
        invertSelectPagination={false}
        variant={VARIANT_TABLE_AIRTABLE_DASHBOARD}
      />
      <TextEntry value={actionDescription} label={t("Action Description")} className="text-blueCustom-900" />
      <TextEntry value={description} label={t("Description")} className="text-blueCustom-900" />

      <div className="flex flex-col gap-4">
        <Text variant="text-14-light" className="leading-none text-darkCustom-300">
          {t("Download Media Assets")}
        </Text>
        {mediaAssets && Array.isArray(mediaAssets) && mediaAssets.length > 0 ? (
          <div className="grid grid-cols-3 gap-2">
            {mediaAssets.map((media: any, mediaIndex: number) => (
              <DownloadMediaItem key={mediaIndex} name={media.title || `Media-${mediaIndex + 1}`} src={media.url} />
            ))}
          </div>
        ) : (
          <Text variant="text-14" className="leading-none text-blueCustom-900">
            {t("Answer Not Provided")}
          </Text>
        )}
      </div>
    </div>
  );
};

export default DisturbanceReport;

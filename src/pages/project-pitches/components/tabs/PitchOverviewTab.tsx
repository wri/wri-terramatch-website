import { useT } from "@transifex/react";
import { Fragment, useEffect, useState } from "react";

import Accordion from "@/components/elements/Accordion/Accordion";
import Button from "@/components/elements/Button/Button";
import FilePreviewCard from "@/components/elements/FilePreviewCard/FilePreviewCard";
import { useMap } from "@/components/elements/Map-mapbox/hooks/useMap";
import { MapContainer } from "@/components/elements/Map-mapbox/Map";
import SectionBody from "@/components/elements/Section/SectionBody";
import SectionEntryRow from "@/components/elements/Section/SectionEntryRow";
import SectionHeader from "@/components/elements/Section/SectionHeader";
import SelectImageList from "@/components/elements/SelectImageList/SelectImageList";
import Text from "@/components/elements/Text/Text";
import List from "@/components/extensive/List/List";
import { getCapacityBuildingNeedOptions } from "@/constants/options/capacityBuildingNeeds";
import { getCountriesOptions } from "@/constants/options/countries";
import { getLandTenureOptions } from "@/constants/options/landTenure";
import { sustainableDevelopmentGoalsOptions } from "@/constants/options/sustainableDevelopmentGoals";
import { FORM_POLYGONS } from "@/constants/statuses";
import { useModalContext } from "@/context/modal.provider";
import { fetchGetV2TerrafundPolygonBboxUuid, useGetV2TerrafundProjectPolygon } from "@/generated/apiComponents";
import { ProjectPitchRead } from "@/generated/apiSchemas";
import { useDate } from "@/hooks/useDate";
import PitchEditModal from "@/pages/project-pitches/components/PitchEditModal";
import TabContainer from "@/pages/project-pitches/components/tabs/TabContainer";
import { UploadedFile } from "@/types/common";
import { notEmpty } from "@/utils/array";
import { formatOptionsList } from "@/utils/options";
interface PitchOverviewTabProps {
  pitch: ProjectPitchRead;
}

const PitchOverviewTab = ({ pitch }: PitchOverviewTabProps) => {
  const t = useT();

  const { openModal } = useModalContext();
  const { format } = useDate();
  const mapFunctions = useMap();
  const onEdit = () => openModal("pitchEditModal", <PitchEditModal pitch={pitch} />);
  const [polygonBbox, setPolygonBbox] = useState<any>(null);
  const [polygonDataMap, setPolygonDataMap] = useState<any>({});

  const { data: projectPolygon } = useGetV2TerrafundProjectPolygon(
    {
      queryParams: {
        entityType: "project-pitch",
        uuid: pitch.uuid ?? ""
      }
    },
    {
      enabled: !!pitch.uuid
    }
  );

  const setBbboxAndZoom = async () => {
    if (projectPolygon?.project_polygon?.poly_uuid) {
      const bbox = await fetchGetV2TerrafundPolygonBboxUuid({
        pathParams: { uuid: projectPolygon.project_polygon.poly_uuid }
      });
      const bounds: any = bbox.bbox;
      setPolygonBbox(bounds);
    }
  };

  useEffect(() => {
    const getDataProjectPolygon = async () => {
      if (projectPolygon?.project_polygon) {
        setBbboxAndZoom();
        setPolygonDataMap({ [FORM_POLYGONS]: [projectPolygon?.project_polygon?.poly_uuid] });
      } else {
        setPolygonDataMap({ [FORM_POLYGONS]: [] });
      }
    };
    getDataProjectPolygon();
  }, [projectPolygon]);

  return (
    <TabContainer>
      <Button className="my-8" onClick={onEdit}>
        {t("Edit Pitch")}
      </Button>
      <Accordion title={t("Objectives")} defaultOpen className="mb-15 w-full bg-white shadow">
        <SectionBody>
          <SectionEntryRow title={t("Objectives")} isEmpty={!pitch.project_objectives}>
            <Text variant="text-heading-100">{pitch.project_objectives}</Text>
          </SectionEntryRow>

          <SectionEntryRow title={t("Country")} isEmpty={!notEmpty(pitch.project_country)}>
            <Text variant="text-heading-100">
              {formatOptionsList(getCountriesOptions(t), pitch.project_country || [])}
            </Text>
          </SectionEntryRow>

          <SectionEntryRow title={t("County/District")} isEmpty={!pitch.project_county_district}>
            <Text variant="text-heading-100">{pitch.project_county_district}</Text>
          </SectionEntryRow>

          <SectionEntryRow title={t("Project Budget")} isEmpty={!pitch.project_budget}>
            <Text variant="text-heading-100">{`${pitch.project_budget} USD`}</Text>
          </SectionEntryRow>

          <SectionEntryRow title={t("Detailed Project Budget")} isEmpty={!pitch.detailed_project_budget}>
            <FilePreviewCard file={pitch.detailed_project_budget as UploadedFile} />
          </SectionEntryRow>
        </SectionBody>

        <SectionHeader title={t("Potential Environmental impact:")} className="mb-8 mt-20" />
        <SectionBody>
          <SectionEntryRow title={t("Proposed number of hectares to be restored")} isEmpty={!pitch.total_hectares}>
            <Text variant="text-heading-100">{`${pitch.total_hectares} ha.`}</Text>
          </SectionEntryRow>

          <SectionEntryRow title={t("Proposed number of trees to be grown")} isEmpty={!pitch.total_trees}>
            <Text variant="text-heading-100">{pitch.total_trees?.toLocaleString()}</Text>
          </SectionEntryRow>
        </SectionBody>

        <SectionHeader title={t("Potential Social impact:")} className="mb-8 mt-20" />
        <SectionBody>
          <SectionEntryRow title={t("Total expected new jobs")} isEmpty={!pitch.num_jobs_created}>
            <Text variant="text-heading-100">{pitch.num_jobs_created}</Text>
          </SectionEntryRow>
        </SectionBody>
      </Accordion>

      <Accordion title={t("Proposed Project Area")} defaultOpen className="mb-15 w-full bg-white shadow">
        <SectionBody>
          <Text variant="text-heading-300">{t("Geospatial polygon of your proposed restoration area.")}</Text>
          <MapContainer
            polygonsData={polygonDataMap}
            bbox={polygonBbox}
            hasControls={false}
            showPopups={false}
            showLegend={false}
            mapFunctions={mapFunctions}
          />

          <SectionEntryRow title={t("Description of Project Area")} isEmpty={!pitch.proj_area_description}>
            <Text variant="text-heading-100">{pitch.proj_area_description}</Text>
          </SectionEntryRow>
        </SectionBody>
      </Accordion>

      <Accordion title={t("Timeline")} defaultOpen className="mb-15 w-full bg-white shadow">
        <SectionBody>
          <SectionEntryRow title={t("Start Date")} isEmpty={!pitch.expected_active_restoration_start_date}>
            <Text variant="text-heading-100">{format(pitch.expected_active_restoration_start_date)}</Text>
          </SectionEntryRow>

          <SectionEntryRow title={t("End Date")} isEmpty={!pitch.expected_active_restoration_end_date}>
            <Text variant="text-heading-100">{format(pitch.expected_active_restoration_end_date)}</Text>
          </SectionEntryRow>

          <SectionEntryRow
            title={t("Key stages of this project’s implementation")}
            isEmpty={!pitch.description_of_project_timeline}
          >
            <Text variant="text-heading-100">{pitch.description_of_project_timeline}</Text>
          </SectionEntryRow>
        </SectionBody>
      </Accordion>

      <Accordion title={t("Land Tenure Strategy")} defaultOpen className="mb-15 w-full bg-white shadow">
        <SectionBody>
          <SectionEntryRow title={t("Land Tenure")} isEmpty={!notEmpty(pitch.land_tenure_proj_area)}>
            <SelectImageList
              options={getLandTenureOptions(t)}
              //@ts-ignore
              selectedValues={pitch.land_tenure_proj_area || []}
            />
          </SectionEntryRow>

          <SectionEntryRow
            title={t("Documentation on project area’s land tenure.")}
            isEmpty={!notEmpty(pitch.proof_of_land_tenure_mou)}
          >
            <List
              as={Fragment}
              itemAs={Fragment}
              items={pitch.proof_of_land_tenure_mou || []}
              render={file => <FilePreviewCard file={file as UploadedFile} />}
            />
          </SectionEntryRow>

          <SectionEntryRow
            title={t("Landholder & Community Engagement Strategy")}
            isEmpty={!pitch.landholder_comm_engage}
          >
            <Text variant="text-heading-100">{pitch.landholder_comm_engage}</Text>
          </SectionEntryRow>
        </SectionBody>
      </Accordion>

      <Accordion title={t("More Information")} defaultOpen className="mb-15 w-full bg-white shadow">
        <SectionBody>
          <SectionEntryRow title={t("Proposed project partner information")} isEmpty={!pitch.proj_partner_info}>
            <Text variant="text-heading-100">{pitch.proj_partner_info}</Text>
          </SectionEntryRow>
          <SectionEntryRow title={t("Risk + Mitigate strategy")} isEmpty={!pitch.proj_success_risks}>
            <Text variant="text-heading-100">{pitch.proj_success_risks}</Text>
          </SectionEntryRow>
          <SectionEntryRow title={t("Report, Monitor, Verification Strategy")} isEmpty={!pitch.monitor_eval_plan}>
            <Text variant="text-heading-100">{pitch.monitor_eval_plan}</Text>
          </SectionEntryRow>

          {/* @ts-ignore */}
          <SectionEntryRow title={t("Sustainable Development Goals")} isEmpty={!notEmpty(pitch.sustainable_dev_goals)}>
            <SelectImageList
              options={sustainableDevelopmentGoalsOptions(t)}
              //@ts-ignore
              selectedValues={pitch.sustainable_dev_goals || []}
            />
          </SectionEntryRow>

          <SectionEntryRow title={t("Additional Documents")} isEmpty={!notEmpty(pitch.additional)}>
            <List
              as={Fragment}
              itemAs={Fragment}
              items={pitch.additional || []}
              render={file => <FilePreviewCard file={file as UploadedFile} />}
            />
          </SectionEntryRow>

          <SectionEntryRow title={t("Capacity Building Needs")} isEmpty={!notEmpty(pitch?.capacity_building_needs)}>
            <Text variant="text-heading-100">
              {formatOptionsList(getCapacityBuildingNeedOptions(t), pitch?.capacity_building_needs ?? [])}
            </Text>
          </SectionEntryRow>
        </SectionBody>
      </Accordion>
    </TabContainer>
  );
};

export default PitchOverviewTab;

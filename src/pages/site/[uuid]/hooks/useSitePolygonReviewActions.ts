import { useCallback, useEffect, useState } from "react";

import { loadSitePolygonByUuid } from "@/connections/SitePolygons";
import type { SitePolygonLightDto } from "@/generated/v3/researchService/researchServiceSchemas";
import Log from "@/utils/log";
import { isSitePolygonApprovable, toReviewAvailabilityPolygon } from "@/utils/sitePolygonReview";

import type { PolygonTableRow } from "../components/PolygonTableRow";
import { mapSitePolygonToTableRow } from "../components/polygonTableRow.utils";

type TranslateFn = (key: string, params?: Record<string, unknown>) => string;

type UseSitePolygonReviewActionsParams = {
  siteUuid: string;
  editPolygonUuid: string;
  selectedRows: PolygonTableRow[];
  findTableSitePolygon: (polygonId: string) => SitePolygonLightDto | undefined;
  approvePolygons: (uuids: string[], names: string[], comment: string) => Promise<void>;
  requestInformationForPolygons: (uuids: string[], names: string[], comment: string) => Promise<void>;
  clearBulkTableSelection: () => void;
  polygonApproveConfirmation: string | null;
  setPolygonApproveConfirmation: (value: string | null) => void;
  polygonRequestInformationConfirmation: string | null;
  setPolygonRequestInformationConfirmation: (value: string | null) => void;
  t: TranslateFn;
};

export const useSitePolygonReviewActions = ({
  siteUuid,
  editPolygonUuid,
  selectedRows,
  findTableSitePolygon,
  approvePolygons,
  requestInformationForPolygons,
  clearBulkTableSelection,
  polygonApproveConfirmation,
  setPolygonApproveConfirmation,
  polygonRequestInformationConfirmation,
  setPolygonRequestInformationConfirmation,
  t
}: UseSitePolygonReviewActionsParams) => {
  const [showApprovePolygonConfirmationModal, setShowApprovePolygonConfirmationModal] = useState(false);
  const [approvePayload, setApprovePayload] = useState<{ polygons: PolygonTableRow[] } | null>(null);
  const [showRequestInformationModal, setShowRequestInformationModal] = useState(false);
  const [requestInformationPayload, setRequestInformationPayload] = useState<{ polygons: PolygonTableRow[] } | null>(
    null
  );

  const handleOpenApprovePolygonModal = useCallback(() => {
    const approvableRows = selectedRows.filter(row => isSitePolygonApprovable(toReviewAvailabilityPolygon(row)));
    if (approvableRows.length === 0) {
      return;
    }
    setApprovePayload({ polygons: approvableRows });
    setShowApprovePolygonConfirmationModal(true);
  }, [selectedRows]);

  const handleOpenRequestInformationModal = useCallback(() => {
    setRequestInformationPayload({ polygons: selectedRows });
    setShowRequestInformationModal(true);
  }, [selectedRows]);

  const handleApprovePolygonConfirmationModalChange = useCallback((open: boolean) => {
    setShowApprovePolygonConfirmationModal(open);
    if (!open) setApprovePayload(null);
  }, []);

  const handleRequestInformationModalChange = useCallback((open: boolean) => {
    setShowRequestInformationModal(open);
    if (!open) setRequestInformationPayload(null);
  }, []);

  const resolveSitePolygonUuidsAndNames = useCallback(
    (rows: PolygonTableRow[]) => {
      const sitePolygonUuids: string[] = [];
      const names: string[] = [];

      rows.forEach(row => {
        const sitePolygon = findTableSitePolygon(row.id);
        if (sitePolygon?.uuid == null || sitePolygon.uuid === "") {
          return;
        }
        sitePolygonUuids.push(sitePolygon.uuid);
        names.push(sitePolygon.name ?? row.polygonName ?? t("Unnamed polygon"));
      });

      return { sitePolygonUuids, names };
    },
    [findTableSitePolygon, t]
  );

  const handleApprovePolygons = useCallback(
    async (comment: string, selectedPolygons: PolygonTableRow[]) => {
      const { sitePolygonUuids, names } = resolveSitePolygonUuidsAndNames(selectedPolygons);

      if (sitePolygonUuids.length === 0) {
        setShowApprovePolygonConfirmationModal(false);
        setApprovePayload(null);
        return;
      }

      try {
        await approvePolygons(sitePolygonUuids, names, comment);
        clearBulkTableSelection();
      } catch (error) {
        Log.error("Failed to approve polygons:", error);
      } finally {
        setShowApprovePolygonConfirmationModal(false);
        setApprovePayload(null);
      }
    },
    [approvePolygons, clearBulkTableSelection, resolveSitePolygonUuidsAndNames]
  );

  const handleConfirmRequestInformation = useCallback(
    async (comment: string) => {
      const { sitePolygonUuids, names } = resolveSitePolygonUuidsAndNames(requestInformationPayload?.polygons ?? []);

      if (sitePolygonUuids.length === 0) {
        setShowRequestInformationModal(false);
        setRequestInformationPayload(null);
        return;
      }

      try {
        await requestInformationForPolygons(sitePolygonUuids, names, comment);
        clearBulkTableSelection();
      } catch (error) {
        Log.error("Failed to request information for polygons:", error);
      } finally {
        setShowRequestInformationModal(false);
        setRequestInformationPayload(null);
      }
    },
    [clearBulkTableSelection, requestInformationForPolygons, requestInformationPayload, resolveSitePolygonUuidsAndNames]
  );

  useEffect(() => {
    if (polygonApproveConfirmation == null) return;
    const confirmationId = polygonApproveConfirmation;
    setPolygonApproveConfirmation(null);

    const polygon = findTableSitePolygon(confirmationId);
    if (polygon != null && isSitePolygonApprovable(polygon)) {
      setApprovePayload({ polygons: [mapSitePolygonToTableRow(polygon, t)] });
      setShowApprovePolygonConfirmationModal(true);
      return;
    }

    void loadSitePolygonByUuid({ entityUuid: siteUuid, polygonId: confirmationId })
      .then(loadedPolygon => {
        if (loadedPolygon != null && isSitePolygonApprovable(loadedPolygon)) {
          setApprovePayload({ polygons: [mapSitePolygonToTableRow(loadedPolygon, t)] });
          setShowApprovePolygonConfirmationModal(true);
        }
      })
      .catch(error => {
        Log.error("Failed to load polygon for approval:", error);
      });
  }, [findTableSitePolygon, polygonApproveConfirmation, setPolygonApproveConfirmation, siteUuid, t]);

  useEffect(() => {
    if (polygonRequestInformationConfirmation == null) return;
    const confirmationId = polygonRequestInformationConfirmation;
    setPolygonRequestInformationConfirmation(null);

    const polygon = findTableSitePolygon(confirmationId);
    if (polygon != null) {
      setRequestInformationPayload({ polygons: [mapSitePolygonToTableRow(polygon, t)] });
      setShowRequestInformationModal(true);
      return;
    }

    void loadSitePolygonByUuid({ entityUuid: siteUuid, polygonId: confirmationId })
      .then(loadedPolygon => {
        if (loadedPolygon != null) {
          setRequestInformationPayload({ polygons: [mapSitePolygonToTableRow(loadedPolygon, t)] });
          setShowRequestInformationModal(true);
        }
      })
      .catch(error => {
        Log.error("Failed to load polygon for request information:", error);
      });
  }, [
    findTableSitePolygon,
    polygonRequestInformationConfirmation,
    setPolygonRequestInformationConfirmation,
    siteUuid,
    t
  ]);

  const handleDrawerRequestApproveModal = useCallback(() => {
    const drawerPolygon = findTableSitePolygon(editPolygonUuid);
    if (drawerPolygon != null && isSitePolygonApprovable(drawerPolygon)) {
      setApprovePayload({ polygons: [mapSitePolygonToTableRow(drawerPolygon, t)] });
      setShowApprovePolygonConfirmationModal(true);
    }
  }, [editPolygonUuid, findTableSitePolygon, t]);

  const handleDrawerRequestInformationModal = useCallback(() => {
    const drawerPolygon = findTableSitePolygon(editPolygonUuid);
    if (drawerPolygon != null) {
      setRequestInformationPayload({ polygons: [mapSitePolygonToTableRow(drawerPolygon, t)] });
      setShowRequestInformationModal(true);
    }
  }, [editPolygonUuid, findTableSitePolygon, t]);

  return {
    showApprovePolygonConfirmationModal,
    approvePayload,
    showRequestInformationModal,
    requestInformationPayload,
    handleOpenApprovePolygonModal,
    handleOpenRequestInformationModal,
    handleApprovePolygonConfirmationModalChange,
    handleRequestInformationModalChange,
    handleApprovePolygons,
    handleConfirmRequestInformation,
    handleDrawerRequestApproveModal,
    handleDrawerRequestInformationModal
  };
};

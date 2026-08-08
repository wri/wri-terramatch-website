import { LinearProgress } from "@mui/material";
import { useT } from "@transifex/react";
import classNames from "classnames";
import { FC, useCallback, useEffect, useRef, useState } from "react";

import Button from "@/components/elements/Button/Button";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import { acknowledgeJobs, useDelayedJobs } from "@/connections/DelayedJob";
import { startIndicatorCalculationResource } from "@/connections/Indicators";
import { pruneSitePolygonsCache } from "@/connections/SitePolygons";
import { DelayedJobDto } from "@/generated/v3/jobService/jobServiceSchemas";
import { StartIndicatorCalculationPathParams } from "@/generated/v3/researchService/researchServiceComponents";
import { useValueChanged } from "@/hooks/useValueChanged";
import ApiSlice from "@/store/apiSlice";
import { getErrorMessageFromPayload } from "@/utils/errors";
import Log from "@/utils/log";

import LinearProgressBar from "../ProgressBar/LinearProgressBar/LinearProgressBar";
import Text from "../Text/Text";
import ToolTip from "../Tooltip/Tooltip";

const listOfPolygonsFixed = (data: Record<string, any> | null) => {
  if (!data?.data) return null;

  let clippedPolygonNames = "";

  if (Array.isArray(data.data)) {
    clippedPolygonNames = data.data
      .map((item: any) => item.attributes?.polyName)
      .filter(Boolean)
      .join(", ");
  } else if (typeof data.data === "object" && data.data.attributes?.polyName) {
    clippedPolygonNames = data.data.attributes.polyName;
  }

  if (clippedPolygonNames) {
    return "Success! The following polygons have been fixed: " + clippedPolygonNames;
  } else {
    return "No polygons were fixed";
  }
};

const INDICATORS_WHERE_EMPTY_RESPONSE_IS_SUCCESS = new Set(["treeCoverLoss", "treeCoverLossFires"]);
const INDICATORS_WITH_NO_DATA_SUMMARY_LINE = new Set([
  "restorationByEcoRegion",
  "restorationByStrategy",
  "restorationByLandUse"
]);

const getIndicatorCalculationValues = (data: Record<string, any> | null) => {
  if (data?.data == null || typeof data.data !== "object" || data.data.totalPolygons == null) {
    return null;
  }

  const slug = typeof data.data.slug === "string" ? data.data.slug : null;
  const countsEmptyResponseAsSuccess = slug != null && INDICATORS_WHERE_EMPTY_RESPONSE_IS_SUCCESS.has(slug);
  const showNoDataLine = slug != null && INDICATORS_WITH_NO_DATA_SUMMARY_LINE.has(slug);
  const processingSuccessful = countsEmptyResponseAsSuccess
    ? (data.data.dataFound ?? 0) + (data.data.noData ?? 0)
    : data.data.dataFound ?? 0;

  const failedDisplay =
    data.data.failureMessage != null
      ? `<strong style="font-weight: 600; color: red;">${data.data.failureMessage}</strong>`
      : (data.data.failed ?? 0) > 0
      ? String(data.data.failed)
      : "-";

  return `
    Total Polygons Processed: ${data.data.totalPolygons} <br />
    Processing Successful: ${processingSuccessful} <br />
    ${
      showNoDataLine ? `No Data Returned: ${data.data.noData ?? 0} <br />` : ""
    }Processing Failed: ${failedDisplay} <br />`;
};

const getFailedPolygonUuidsFromIndicatorPayload = (data: Record<string, any> | null): string[] => {
  const failedPolygonUuids = data?.data?.failedPolygonUuids;
  if (!Array.isArray(failedPolygonUuids)) return [];
  return failedPolygonUuids.filter((uuid): uuid is string => typeof uuid === "string" && uuid.length > 0);
};

const getIndicatorSlugFromPayload = (
  data: Record<string, any> | null
): StartIndicatorCalculationPathParams["slug"] | null => {
  const slug = data?.data?.slug;
  if (typeof slug !== "string" || slug.length === 0) return null;
  return slug as StartIndicatorCalculationPathParams["slug"];
};

const LEGACY_INDICATOR_JOB_NAME = "Indicator Calculation";

const isIndicatorCalculationJob = (job: Pick<DelayedJobDto, "name" | "payload">): boolean =>
  job.name === LEGACY_INDICATOR_JOB_NAME || getIndicatorSlugFromPayload(job.payload) != null;

const getValidationMessages = (data: Record<string, any> | null): string[] => {
  if (data?.included == null) return [];
  const messageGroups: Record<string, string[]> = {};

  data.included.forEach((item: any) => {
    if (item?.attributes?.criteriaList != null) {
      item.attributes.criteriaList.forEach((criteria: any) => {
        if (criteria?.extraInfo?.message != null && criteria?.extraInfo?.sitePolygonName != null) {
          const message = criteria.extraInfo.message;
          const polygonName = criteria.extraInfo.sitePolygonName;

          if (messageGroups[message] == null) {
            messageGroups[message] = [];
          }
          messageGroups[message].push(polygonName);
        }
      });
    }
  });

  const formattedMessages: string[] = [];
  Object.entries(messageGroups).forEach(([message, polygonNames]) => {
    const uniqueNames = Array.from(new Set(polygonNames));
    if (uniqueNames.length === 1) {
      formattedMessages.push(`${message}: ${uniqueNames[0]}`);
    } else {
      formattedMessages.push(`${message} (${uniqueNames.length} polygons): ${uniqueNames.join(", ")}`);
    }
  });

  return formattedMessages;
};

const clearJob = (item: DelayedJobDto) => {
  acknowledgeJobs([item.uuid]);
};

const entityType = (job: DelayedJobDto, t: typeof useT) => {
  if (job.entityType != null) {
    return job.entityType === "projects"
      ? t("Project: ")
      : job.entityType === "sites"
      ? t("Site: ")
      : job.entityType === "nurseries"
      ? t("Nursery: ")
      : job.entityType === "forms"
      ? t("Form: ")
      : job.entityType === "aboutSections"
      ? t("About Section: ")
      : null;
  }
  return job?.name?.includes("Project") ? t("Project: ") : t("Site: ");
};

const JobDetails: FC<{ job: DelayedJobDto }> = ({ job }) => {
  const t = useT();

  return (
    <Text variant="text-14-light" className="text-darkCustom">
      {entityType(job, t)}
      <b>{job.entityName ?? "Unknown"}</b>
    </Text>
  );
};

const FloatNotification: FC = () => {
  const firstRender = useRef(true);
  const t = useT();
  const [openModalNotification, setOpenModalNotification] = useState(false);
  const [isLoaded, { delayedJobs }] = useDelayedJobs();
  const [notAcknowledgedJobs, setNotAcknowledgedJobs] = useState<DelayedJobDto[]>([]);
  const [processedIndicatorJobs, setProcessedIndicatorJobs] = useState<Set<string>>(new Set());
  const [processedValidationJobs, setProcessedValidationJobs] = useState<Set<string>>(new Set());
  const [rerunningFailedJobs, setRerunningFailedJobs] = useState<Set<string>>(new Set());

  const clearJobs = useCallback(() => {
    if (delayedJobs == null) return;
    const acknowledgeIds = delayedJobs
      .filter((job: DelayedJobDto) => job.status !== "pending")
      .map(({ uuid }: DelayedJobDto) => uuid);
    if (acknowledgeIds.length > 0) acknowledgeJobs(acknowledgeIds);
  }, [delayedJobs]);

  useValueChanged(delayedJobs, () => {
    if (delayedJobs == null) return;

    setNotAcknowledgedJobs(delayedJobs);
    if (delayedJobs.length > notAcknowledgedJobs.length && !firstRender.current) {
      setOpenModalNotification(true);
    }
    firstRender.current = false;
  });

  useValueChanged(notAcknowledgedJobs.length, () => {
    if (notAcknowledgedJobs.length === 0) {
      setOpenModalNotification(false);
    }
  });

  // Handle Indicator Calculation job completion notifications
  useEffect(() => {
    if (!delayedJobs || delayedJobs.length === 0) return;

    delayedJobs.forEach(job => {
      if (isIndicatorCalculationJob(job) && !processedIndicatorJobs.has(job.uuid)) {
        const isCompleted = job.status === "succeeded" || job.status === "failed";

        if (isCompleted) {
          setProcessedIndicatorJobs(prev => new Set(prev).add(job.uuid));

          if (job.status === "succeeded") {
            // Prune cache for sitePolygons since indicators are related to polygons
            pruneSitePolygonsCache();
          }
        }
      }
    });
  }, [delayedJobs, processedIndicatorJobs]);

  useEffect(() => {
    if (delayedJobs == null || delayedJobs.length === 0) return;

    delayedJobs.forEach(job => {
      if (job.name === "Polygon Validation" && !processedValidationJobs.has(job.uuid)) {
        const isCompleted = job.status === "succeeded" || job.status === "failed";

        if (isCompleted) {
          setProcessedValidationJobs(prev => new Set(prev).add(job.uuid));

          pruneSitePolygonsCache();
          ApiSlice.pruneCache("validations");
          ApiSlice.pruneIndex("validations", "");
        }
      }
    });
  }, [delayedJobs, processedValidationJobs]);

  const handleRerunFailed = useCallback(async (job: DelayedJobDto) => {
    const slug = getIndicatorSlugFromPayload(job.payload);
    const failedPolygonUuids = getFailedPolygonUuidsFromIndicatorPayload(job.payload);

    if (slug == null || failedPolygonUuids.length === 0) return;

    setRerunningFailedJobs(prev => new Set(prev).add(job.uuid));
    try {
      await startIndicatorCalculationResource({
        slug,
        body: {
          polygonUuids: failedPolygonUuids,
          forceRecalculation: false,
          updateExisting: true
        }
      });
    } catch (error) {
      Log.error("Failed to rerun indicator calculation for failed polygons:", error);
    } finally {
      setRerunningFailedJobs(prev => {
        const updated = new Set(prev);
        updated.delete(job.uuid);
        return updated;
      });
    }
  }, []);

  return (
    <div className="fixed bottom-[3.5rem] right-6 z-50 mobile:bottom-2.5">
      <div className="relative">
        <div
          className={classNames(
            "absolute right-[107%] flex max-h-[61vh] w-[414px] flex-col overflow-hidden rounded-xl bg-white shadow-monitored transition-all duration-300 mobile:w-[300px]",
            { " bottom-[-4px] z-10  opacity-100": openModalNotification },
            { " bottom-[-300px] -z-10 !h-0  opacity-0": !openModalNotification }
          )}
        >
          <Text
            variant="text-20-bold"
            className="border-b border-grey-350 px-4 py-3.5 leading-[normal] text-blueCustom-900"
          >
            {t("Notifications")}
          </Text>
          <div className="flex flex-col overflow-hidden p-4">
            <div className="mb-2 flex items-center justify-between">
              <Text
                variant="text-12-semibold"
                className="ml-auto cursor-pointer text-primary hover:opacity-80"
                onClick={clearJobs}
              >
                {t("Clear completed")}
              </Text>
            </div>
            <div className="-mr-2 flex flex-1 flex-col gap-3 overflow-auto pr-2">
              {isLoaded &&
                notAcknowledgedJobs &&
                notAcknowledgedJobs.map((item, index) => {
                  const isIndicatorJob = isIndicatorCalculationJob(item);
                  const indicatorCalculationHtml = isIndicatorJob ? getIndicatorCalculationValues(item.payload) : null;
                  const failedPolygonUuids = isIndicatorJob
                    ? getFailedPolygonUuidsFromIndicatorPayload(item.payload)
                    : [];
                  const canRerunFailed = isIndicatorJob && failedPolygonUuids.length > 0;
                  const isRerunFailedLoading = rerunningFailedJobs.has(item.uuid);

                  return (
                    <div key={index} className="rounded-lg border border-grey-350 bg-white p-3 hover:border-primary">
                      <div className="relative mb-1 flex items-center gap-1">
                        <div className="h-2 w-2 rounded-full bg-primary" />
                        <Text variant="text-14-light" className="leading-[normal] text-darkCustom " as={"span"}>
                          {item.name}
                        </Text>
                        {
                          <button className="absolute right-0 hover:text-primary" onClick={() => clearJob(item)}>
                            <ToolTip content={t("Clear")}>
                              <Icon name={IconNames.CLEAR} className="h-3 w-3" />
                            </ToolTip>
                          </button>
                        }
                      </div>
                      <JobDetails job={item} />
                      <div className="mt-1">
                        {item.status === "failed" ? (
                          <Text variant="text-12-semibold" className="text-error-600">
                            {item.payload?.message != null
                              ? t(item.payload.message)
                              : item.payload != null
                              ? t(getErrorMessageFromPayload(item.payload))
                              : t("Failed to complete")}
                          </Text>
                        ) : (
                          <div className="flex items-center gap-2">
                            {item.name === "Polygon Upload" &&
                            (item.processedContent === null || item.totalContent === null) &&
                            item.status === "pending" ? (
                              <div style={{ width: "100%" }}>
                                <LinearProgress
                                  sx={{
                                    height: 9,
                                    borderRadius: 99,
                                    backgroundColor: "#a9e7d6",
                                    "& .MuiLinearProgress-bar": { backgroundColor: "#29c499" }
                                  }}
                                />
                              </div>
                            ) : (
                              <LinearProgressBar
                                value={
                                  item.status === "succeeded"
                                    ? 100
                                    : ((item.processedContent ?? 0) / (item.totalContent ?? 1)) * 100
                                }
                                className="h-2 bg-success-40"
                                color="success-600"
                              />
                            )}
                            <Text variant="text-12-semibold" className="text-black">
                              {item.name === "Polygon Upload"
                                ? item.status === "succeeded"
                                  ? t("Done!")
                                  : ""
                                : item.status === "succeeded"
                                ? t("Done!")
                                : `${Math.round(((item.processedContent ?? 0) / (item.totalContent ?? 1)) * 100)}%`}
                            </Text>
                          </div>
                        )}

                        {item.status === "succeeded" &&
                          item.name === "Polygon Clipping" &&
                          listOfPolygonsFixed(item.payload) && (
                            <Text variant="text-12-light" className="mt-2 text-blueCustom-250 text-opacity-60">
                              {listOfPolygonsFixed(item.payload)}
                            </Text>
                          )}

                        {indicatorCalculationHtml && (
                          <Text
                            variant="text-12-light"
                            className="mt-2 text-blueCustom-250 text-opacity-60"
                            dangerouslySetInnerHTML={{ __html: indicatorCalculationHtml }}
                          />
                        )}

                        {canRerunFailed && (
                          <div className="mt-2">
                            <Button
                              variant="white-page-admin"
                              className="!min-h-8 !h-8 !rounded-md !px-3"
                              disabled={isRerunFailedLoading}
                              onClick={() => {
                                handleRerunFailed(item);
                              }}
                            >
                              <Text variant="text-12-semibold" className="text-primary">
                                {isRerunFailedLoading ? t("Re-running...") : t("Re-run Failed")}
                              </Text>
                            </Button>
                          </div>
                        )}

                        {item.status === "succeeded" && getValidationMessages(item.payload).length > 0 && (
                          <div className="mt-2 flex flex-col gap-1">
                            {getValidationMessages(item.payload).map((message, msgIndex) => (
                              <Text key={msgIndex} variant="text-12-light" className="text-warning-600">
                                {message}
                              </Text>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
        {isLoaded && (notAcknowledgedJobs ?? []).length > 0 && (
          <div className="text-12-bold absolute right-[-4px] top-[-4px] z-20 flex min-h-[20px] min-w-[20px] items-center justify-center rounded-full bg-red-300 leading-[normal] text-white">
            {notAcknowledgedJobs.length}
          </div>
        )}
        <button
          onClick={() => {
            setOpenModalNotification(!openModalNotification);
          }}
          className={classNames(
            "z-10 flex h-13 w-13 items-center justify-center rounded-full border border-grey-950 bg-primary duration-300  hover:scale-105",
            {
              hidden: (notAcknowledgedJobs?.length ?? 0) === 0,
              visible: (notAcknowledgedJobs?.length ?? 0) > 0
            }
          )}
        >
          <Icon
            name={openModalNotification ? IconNames.CLEAR : IconNames.FLOAT_NOTIFICATION}
            className={classNames("text-white", {
              "h-5 w-5": openModalNotification,
              "h-7 w-7": !openModalNotification
            })}
          />
        </button>
      </div>
    </div>
  );
};

export default FloatNotification;

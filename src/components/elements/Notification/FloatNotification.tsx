import { LinearProgress } from "@mui/material";
import { useT } from "@transifex/react";
import classNames from "classnames";
import { useCallback, useEffect, useRef, useState } from "react";
import { When } from "react-if";

import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import { triggerBulkUpdate, useDelayedJobs } from "@/connections/DelayedJob";
import { useMonitoredDataContext } from "@/context/monitoredData.provider";
import { useNotificationContext } from "@/context/notification.provider";
import { DelayedJobData, DelayedJobDto } from "@/generated/v3/jobService/jobServiceSchemas";
import { useValueChanged } from "@/hooks/useValueChanged";
import ApiSlice from "@/store/apiSlice";
import { getErrorMessageFromPayload } from "@/utils/errors";

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

const getIndicatorCalculationMessage = (
  data: Record<string, any> | null,
  totalContent?: number | null
): string | null => {
  if (!data?.data) return null;

  const polygonCount = Array.isArray(data.data) ? data.data.length : data.data ? 1 : 0;
  const total = totalContent ?? polygonCount;

  if (polygonCount > 0) {
    return `Success! Indicators analysis completed for ${polygonCount} of ${total} polygon${total !== 1 ? "s" : ""}.`;
  }

  return null;
};
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
  const newJobsData: DelayedJobData[] = [
    {
      uuid: item.uuid,
      type: "delayedJobs",
      attributes: {
        isAcknowledged: true
      }
    }
  ];
  triggerBulkUpdate(newJobsData);
};

const getSiteNameForJob = (job: DelayedJobDto, cachedSiteNames: Record<string, string>): string => {
  if (job.entityName) {
    return job.entityName;
  }
  if (cachedSiteNames[job.uuid]) {
    return cachedSiteNames[job.uuid];
  }
  return "Unknown";
};
const FloatNotification = () => {
  const firstRender = useRef(true);
  const t = useT();
  const [openModalNotification, setOpenModalNotification] = useState(false);
  const [isLoaded, { delayedJobs }] = useDelayedJobs();
  const [notAcknowledgedJobs, setNotAcknowledgedJobs] = useState<DelayedJobDto[]>([]);
  const [cachedSiteNames, setCachedSiteNames] = useState<Record<string, string>>({});
  const [processedIndicatorJobs, setProcessedIndicatorJobs] = useState<Set<string>>(new Set());
  const { openNotification } = useNotificationContext();
  const { setLoadingAnalysis } = useMonitoredDataContext();

  const clearJobs = useCallback(() => {
    if (delayedJobs == null) return;
    const newJobsData: DelayedJobData[] = delayedJobs
      .filter((job: DelayedJobDto) => job.status !== "pending")
      .map((job: DelayedJobDto) => {
        return {
          uuid: job.uuid,
          type: "delayedJobs",
          attributes: {
            isAcknowledged: true
          }
        };
      });
    triggerBulkUpdate(newJobsData);
  }, [delayedJobs]);

  useValueChanged(delayedJobs, () => {
    if (!delayedJobs) return;

    const newCachedNames = { ...cachedSiteNames };
    delayedJobs.forEach(job => {
      if (job.entityName && job.uuid) {
        newCachedNames[job.uuid] = job.entityName;
      }
    });
    setCachedSiteNames(newCachedNames);

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
      if (job.name === "Indicator Calculation" && !processedIndicatorJobs.has(job.uuid)) {
        const isCompleted = job.status === "succeeded" || job.status === "failed";

        if (isCompleted) {
          setProcessedIndicatorJobs(prev => new Set(prev).add(job.uuid));

          if (job.status === "succeeded") {
            const message = getIndicatorCalculationMessage(job.payload, job.totalContent);
            openNotification(
              "success",
              t("Success! Analysis completed."),
              message || t("The analysis has been completed successfully.")
            );
            setLoadingAnalysis?.(false);
            // Prune cache for sitePolygons since indicators are related to polygons
            ApiSlice.pruneCache("sitePolygons");
            ApiSlice.pruneIndex("sitePolygons", "");
          } else if (job.status === "failed") {
            setLoadingAnalysis?.(false);
            openNotification("error", t("Error! Analysis failed."), t("The analysis has failed. Please try again."));
          }
        }
      }
    });
  }, [delayedJobs, processedIndicatorJobs, openNotification, t, setLoadingAnalysis]);

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
              <Text variant="text-14-light" className="text-blueCustom-250 text-opacity-60">
                {t("Uploads")}
              </Text>
              <Text
                variant="text-12-semibold"
                className="cursor-pointer text-primary hover:opacity-80"
                onClick={clearJobs}
              >
                {t("Clear completed")}
              </Text>
            </div>
            <div className="-mr-2 flex flex-1 flex-col gap-3 overflow-auto pr-2">
              {isLoaded &&
                notAcknowledgedJobs &&
                notAcknowledgedJobs.map((item, index) => (
                  <div key={index} className="rounded-lg border border-grey-350 bg-white p-3 hover:border-primary">
                    <div className="relative mb-1 flex items-center gap-1">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                      <Text variant="text-14-light" className="leading-[normal] text-darkCustom " as={"span"}>
                        {item.name}
                      </Text>
                      {
                        <button className="absolute right-0 hover:text-primary" onClick={() => clearJob(item)}>
                          <ToolTip content={t("Cancel")}>
                            <Icon name={IconNames.CLEAR} className="h-3 w-3" />
                          </ToolTip>
                        </button>
                      }
                    </div>
                    <Text variant="text-14-light" className="text-darkCustom">
                      Site: <b>{getSiteNameForJob(item, cachedSiteNames)}</b>
                    </Text>
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
                ))}
            </div>
          </div>
        </div>
        <When condition={isLoaded && (notAcknowledgedJobs ?? []).length > 0}>
          <div className="text-12-bold absolute right-[-4px] top-[-4px] z-20 flex min-h-[20px] min-w-[20px] items-center justify-center rounded-full bg-red-300 leading-[normal] text-white">
            {notAcknowledgedJobs?.length}
          </div>
        </When>
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

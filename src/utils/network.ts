import { QueryClient } from "@tanstack/react-query";
import { GetServerSidePropsContext } from "next";
import nookies from "nookies";

import Log from "@/utils/log";

/**
 * Prefetch queries in ServerSideProps
 * @param queryClient Tanstack QueryClient
 * @param ctx GetServerSideProps ctx
 * @param queryKey key of the query (found in apiComponents.ts)
 * @param queryFn query function (found in apiComponents.ts)
 */
export const prefetch = async (
  queryClient: QueryClient,
  ctx: GetServerSidePropsContext,
  queryKey: string,
  queryFn: (args: any) => void
): Promise<void> => {
  const { accessToken } = nookies.get(ctx);
  await queryClient.prefetchQuery([queryKey], () => queryFn({ headers: { Authorization: `Bearer ${accessToken}` } }));
};

/**
 * Downloads a file from remote url
 * @param fileUrl File Url to download
 */
export const downloadFile = async (fileUrl: string) => {
  const fileName = fileUrl.split("\\").pop()?.split("/").pop() ?? "";
  try {
    const res = await fetch(fileUrl, {
      method: "GET"
    });
    const blob = await res.blob();
    downloadFileBlob(blob, fileName);
  } catch (err) {
    Log.error("Failed to download file", fileUrl, err);
  }
};

/**
 * Downloads a file from remote url using fileName
 * @param presignedUrl File Url to download
 * @param fileName File Name to download
 */
export const downloadPresignedUrl = async (presignedUrl: string, fileName: string) => {
  try {
    const link = document.createElement("a");
    link.href = presignedUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (err) {
    Log.error("Failed to download file", presignedUrl, err);
  }
};

/**
 * Force Downloads a blob
 * @param fileBlob File Url to download
 */
export const downloadFileBlob = async (blob: Blob, fileName: string) => {
  try {
    const url = window.URL.createObjectURL(new Blob([blob]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName);
    // Append to html link element page
    document.body.appendChild(link);
    // Start download
    link.click();
    // Clean up and remove the link
    link?.parentNode?.removeChild(link);
  } catch (err) {
    Log.error("Failed to download blob", fileName, err);
  }
};

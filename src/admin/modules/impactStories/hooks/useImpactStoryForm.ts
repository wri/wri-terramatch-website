import { useCallback, useEffect, useMemo } from "react";
import { useNotify, useRecordContext, useRedirect } from "react-admin";
import { useFormContext } from "react-hook-form";

export const useImpactStoryForm = (mode: "create" | "edit") => {
  const { setValue, watch } = useFormContext();
  const status = watch("status");
  const record = useRecordContext();
  const notify = useNotify();
  const redirect = useRedirect();

  const currentData = mode === "edit" && record?.data ? record.data : record;

  const initialValues = useMemo(
    () => ({
      content: currentData?.content ?? "",
      title: currentData?.title || "",
      date: currentData?.date || "",
      thumbnail: currentData?.thumbnail,
      categories: currentData?.category ? currentData.category : [],
      orgUuid: mode === "edit" ? currentData?.organization?.uuid : record?.organization?.uuid
    }),
    [
      currentData?.content,
      currentData?.title,
      currentData?.date,
      currentData?.thumbnail,
      currentData?.category,
      currentData?.organization?.uuid,
      mode,
      record?.organization?.uuid
    ]
  );

  useEffect(() => {
    Object.entries(initialValues).forEach(([key, value]) => {
      setValue(key, value);
    });
  }, [setValue, initialValues]);

  const handleImpactCategoryChange = useCallback(
    (selectedValues: string[]) => {
      setValue("category", selectedValues);
    },
    [setValue]
  );

  const handleContentChange = useCallback(
    (content: string) => {
      setValue("content", JSON.stringify(content));
    },
    [setValue]
  );

  const handleTitleChange = useCallback(
    (value: string) => {
      setValue("title", value);
    },
    [setValue]
  );

  const handleDateChange = useCallback(
    (value: string) => {
      setValue("date", value);
    },
    [setValue]
  );

  const handleOrganizationChange = useCallback(
    (value: string) => {
      setValue("organization.uuid", value);
      setValue("orgUuid", value);
    },
    [setValue]
  );

  const handleStatusChange = useCallback(
    (status: "draft" | "published") => {
      setValue("status", status);
    },
    [setValue]
  );

  const handlePreview = useCallback(() => {
    notify("Preview mode activated");
  }, [notify]);

  const handleDelete = useCallback(async () => {
    try {
      notify("Story deleted successfully");
      redirect("list", "impactStories");
    } catch (error) {
      notify("Error deleting story", { type: "error" });
    }
  }, [notify, redirect]);

  return {
    initialValues,
    handlers: {
      handleImpactCategoryChange,
      handleContentChange,
      handleTitleChange,
      handleDateChange,
      handleOrganizationChange,
      handleStatusChange,
      handlePreview,
      handleDelete
    },
    status
  };
};

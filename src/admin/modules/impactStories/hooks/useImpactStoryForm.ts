import { useCallback } from "react";
import { useNotify, useRecordContext, useRedirect } from "react-admin";
import { useFormContext } from "react-hook-form";

export const useImpactStoryForm = (mode: "create" | "edit") => {
  const { setValue, getValues } = useFormContext();
  const record = useRecordContext();
  const notify = useNotify();
  const redirect = useRedirect();

  const currentData = mode === "edit" && record?.data ? record.data : record;
  console.log("currentData", currentData);
  const initialValues = {
    content: currentData?.content ? JSON.parse(currentData.content) : "",
    title: currentData?.title || "",
    date: currentData?.date || "",
    thumbnail: currentData?.thumbnail,
    categories: currentData?.category ? JSON.parse(currentData.category) : "",
    orgUuid: mode === "edit" ? currentData?.organization?.uuid : record?.organization?.uuid
  };

  const handleImpactCategoryChange = useCallback(
    (selectedValues: string[]) => {
      setValue("category", JSON.stringify(selectedValues));
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

  const handleStatusChange = useCallback(
    (status: "draft" | "published") => {
      setValue("status", status);
    },
    [setValue]
  );

  const handlePreview = useCallback(() => {
    const values = getValues();
    notify("Preview mode activated");
    console.log("values", values);
  }, [getValues, notify]);

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
      handleStatusChange,
      handlePreview,
      handleDelete
    }
  };
};

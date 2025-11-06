import { Cell, Row } from "@tanstack/react-table";
import { useT } from "@transifex/react";
import { isEmpty } from "lodash";
import { useRouter } from "next/router";
import React, {
  forwardRef,
  PropsWithChildren,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState
} from "react";
import { useController, UseControllerProps, UseFormReturn } from "react-hook-form";
import { When } from "react-if";
import { useParams } from "react-router-dom";

import { normalizeV2UploadedFiles } from "@/components/elements/Inputs/FileInput/RHFFileInput";
import { fileUploadOptions, prepareFileForUpload, useUploadFile } from "@/connections/Media";
import { currencySymbol, getCurrencyOptions } from "@/constants/options/localCurrency";
import { getMonthOptions } from "@/constants/options/months";
import { useCurrencyContext } from "@/context/currency.provider";
import { useNotificationContext } from "@/context/notification.provider";
import { useOrgFormDetails } from "@/context/wizardForm.provider";
import {
  DeleteV2FilesUUIDResponse,
  useDeleteV2FilesUUID,
  usePatchV2FinancialIndicators
} from "@/generated/apiComponents";
import { isTranslatableError } from "@/generated/v3/utils";
import { useFiles } from "@/hooks/useFiles";
import { useOnMount } from "@/hooks/useOnMount";
import { useValueChanged } from "@/hooks/useValueChanged";
import { OptionValue, UploadedFile } from "@/types/common";
import { getErrorMessages } from "@/utils/errors";

import Text from "../../Text/Text";
import { DataTableProps } from "../DataTable/DataTable";
import Dropdown from "../Dropdown/Dropdown";
import FileInput from "../FileInput/FileInput";
import Input from "../Input/Input";
import InputWrapper from "../InputElements/InputWrapper";
import TextArea from "../textArea/TextArea";
import FinancialTableInput from "./FinancialTableInput";
import {
  CURRENT_RATIO_COLUMNS,
  CurrentRatioData,
  DOCUMENTATION_COLUMNS,
  DocumentationData,
  FinancialRow,
  formatFinancialData,
  ForProfitAnalysisData,
  HandleChangePayload,
  NON_PROFILE_ANALYSIS_COLUMNS,
  NonProfitAnalysisData,
  PROFIT_ANALYSIS_COLUMNS,
  useDebouncedChange
} from "./types";

export interface RHFFinancialIndicatorsDataTableProps
  extends Omit<DataTableProps<any>, "value" | "onChange" | "fieldsProvider" | "addButtonCaption" | "tableColumns">,
    UseControllerProps {
  onChangeCapture?: () => void;
  formHook?: UseFormReturn;
  years?: Array<number>;
  collection?: string;
}

const handleChange = (
  payload: HandleChangePayload,
  setData: React.Dispatch<React.SetStateAction<any>>,
  columnMap: string[],
  selectCurrency?: any
) => {
  const { value, row, cell } = payload;
  const columnKey = columnMap[cell];

  if (!columnKey || row < 0) return;

  setData((prev: any) => {
    const updated = [...prev];
    const currentRow = { ...updated[row], [columnKey]: value };

    const lowerKeys = Object.keys(currentRow).map(k => k.toLowerCase());

    if (lowerKeys.includes("revenue") && lowerKeys.includes("expenses") && lowerKeys.includes("profit")) {
      const revenue = Number(currentRow.revenue ?? 0);
      const expenses = Number(currentRow.expenses ?? 0);
      currentRow.profit = `${currencySymbol(selectCurrency)}${(revenue - expenses).toLocaleString()}`;
    }

    if (lowerKeys.includes("currentassets") && lowerKeys.includes("currentliabilities")) {
      const assets = Number(currentRow.currentAssets ?? 0);
      const liabilities = Number(currentRow.currentLiabilities ?? 0);
      currentRow.currentRatio = liabilities !== 0 ? (assets / liabilities).toLocaleString() : "0";
    }

    updated[row] = currentRow;
    return updated;
  });
};

const getValueFromData = (value: any, fieldName: string, fallbackValue: OptionValue): OptionValue => {
  if (value && Array.isArray(value) && value.length > 0) {
    const firstItem = value[0];
    if (firstItem[fieldName] !== null && firstItem[fieldName] !== undefined) {
      return firstItem[fieldName];
    }
  }
  return fallbackValue;
};

/**
 * @param props PropsWithChildren<RHFFinancialIndicatorsDataTableProps>
 * @returns React Hook Form Ready FinancialIndicator Component
 */
const RHFFinancialIndicatorsDataTable = forwardRef(
  ({ onChangeCapture, ...props }: PropsWithChildren<RHFFinancialIndicatorsDataTableProps>, ref) => {
    const t = useT();
    const router = useRouter();
    const { id } = useParams<"id">();
    const { field } = useController(props);
    const value = field?.value ?? [];
    const { files, addFile, removeFile } = useFiles(true);
    const { years, collection } = props;
    const orgDetails = useOrgFormDetails();

    const [selectCurrency, setSelectCurrency] = useState<OptionValue>(
      getValueFromData(value, "currency", orgDetails?.currency ?? "")
    );
    const [selectFinancialMonth, setSelectFinancialMonth] = useState<OptionValue>(
      getValueFromData(value, "start_month", orgDetails?.startMonth ?? "")
    );
    const [resetTable, setResetTable] = useState(0);
    const { openNotification } = useNotificationContext();
    const { setCurrency } = useCurrencyContext();

    const initialForProfitAnalysisData = useMemo(
      () =>
        years?.map(
          (item): ForProfitAnalysisData => ({
            uuid: null,
            year: item,
            amount: 0,
            revenue: 0,
            expenses: 0,
            profit: `${currencySymbol(selectCurrency)}0`,
            revenueUuid: null,
            expensesUuid: null,
            profitUuid: null
          })
        ),
      [selectCurrency, years]
    );

    const initialNonProfitAnalysisData = useMemo(
      () =>
        years?.map(
          (item): NonProfitAnalysisData => ({
            uuid: null,
            year: item,
            amount: 0,
            budget: 0,
            budgetUuid: null
          })
        ),
      [years]
    );

    const initialCurrentRadioData = useMemo(
      () =>
        years?.map(
          (item): CurrentRatioData => ({
            uuid: null,
            year: item,
            amount: 0,
            currentAssets: 0,
            currentLiabilities: 0,
            currentRatio: `${currencySymbol(selectCurrency)}0`,
            currentAssetsUuid: null,
            currentLiabilitiesUuid: null,
            currentRatioUuid: null
          })
        ),
      [selectCurrency, years]
    );

    const initialDocumentationData = useMemo(
      () =>
        years?.map(
          (item): DocumentationData => ({
            uuid: null,
            year: item,
            documentation: [],
            description: "",
            exchange_rate: null
          })
        ),
      [years]
    );

    const formatted = formatFinancialData(value, years, selectCurrency);
    const [forProfitAnalysisData, setForProfitAnalysisData] = useState(
      !isEmpty(formatted?.profitAnalysisData) ? formatted?.profitAnalysisData : initialForProfitAnalysisData
    );
    const [nonProfitAnalysisData, setNonProfitAnalysisData] = useState(
      !isEmpty(formatted?.nonProfitAnalysisData) ? formatted?.nonProfitAnalysisData : initialNonProfitAnalysisData
    );
    const [currentRadioData, setCurrentRadioData] = useState(
      !isEmpty(formatted?.currentRatioData) ? formatted?.currentRatioData : initialCurrentRadioData
    );
    const [documentationData, setDocumentationData] = useState(
      !isEmpty(formatted?.documentationData) ? formatted?.documentationData : initialDocumentationData
    );

    useValueChanged(selectCurrency, () => {
      setCurrency(selectCurrency);
    });

    // UUID is filled in with override in the call to uploadFile
    const uploadFile = useUploadFile({
      pathParams: { entity: "financialIndicators", collection: "documentation", uuid: "" }
    });

    const { mutate: deleteFile } = useDeleteV2FilesUUID({
      onSuccess(data) {
        setResetTable(prev => prev + 1);
        removeFile((data as { data: DeleteV2FilesUUIDResponse }).data);
        onChangeCapture?.();
      }
    });

    const { mutate: createFinancialData } = usePatchV2FinancialIndicators({
      onSuccess(data) {
        if (data && Array.isArray(data)) {
          const currentData = value;

          const newData = data.filter((responseItem: any) => {
            const exists = currentData.some((currentItem: any) => currentItem.uuid === responseItem.uuid);

            return !exists;
          });

          if (newData.length > 0) {
            const updatedData = [...currentData, ...newData];
            field.onChange(updatedData);
          }
        }
      }
    });

    const onSelectFile = useCallback(
      async (file: File, context: any) => {
        const fileObject: Partial<UploadedFile> = {
          collectionName: "documentation",
          size: file.size,
          fileName: file.name,
          mimeType: file.type,
          rawFile: file,
          uploadState: {
            isLoading: true
          }
        };

        addFile(fileObject);
        setDocumentationData((prev: any) => {
          const updated = [...prev];
          const row = { ...updated[context.rowIndex] };
          const prevFiles = row[context.field] ?? [];

          row[context.field] = [...prevFiles, fileObject];
          updated[context.rowIndex] = row;
          return updated;
        });

        const updateDocumentation = (updateFile: Partial<UploadedFile>) => {
          setDocumentationData(previous =>
            previous?.map(row => {
              row.documentation = row.documentation.map(rowFile =>
                rowFile.fileName === file.name && rowFile.uuid == null ? { ...rowFile, ...updateFile } : rowFile
              );
              return row;
            })
          );
        };
        uploadFile(await prepareFileForUpload(file), {
          ...fileUploadOptions(file, "documentation", {
            onSuccess: successFile => {
              addFile(successFile);
              updateDocumentation(successFile);
              onChangeCapture?.();
            },

            onError: (errorFile, errorMessage) => {
              addFile(errorFile);
              updateDocumentation(errorFile);
              openNotification("error", t("Error uploading file"), errorMessage);
            },

            getErrorMessage: error =>
              isTranslatableError(error)
                ? getErrorMessages(t, error.code, { ...error.variables, label: "Financial Indicator files" }).message
                : t("UPLOAD ERROR: An error occurred during upload. Please try again or upload a smaller file.")
          }),
          urlVariablesOverride: { pathParams: { uuid: context.uuid } }
        });
      },
      [addFile, onChangeCapture, openNotification, t, uploadFile]
    );

    const onDeleteFile = useCallback(
      (file: Partial<UploadedFile>) => {
        if (file.uuid) {
          addFile({
            ...file,
            uploadState: {
              isLoading: false,
              isSuccess: false,
              isDeleting: true
            }
          });
          deleteFile({ pathParams: { uuid: file.uuid } });
        } else if (file.fileName) {
          removeFile(file);
        }
      },
      [addFile, deleteFile, removeFile]
    );

    const handleDeleteFile = useCallback(
      (fileToDelete: Partial<UploadedFile>, context: any) => {
        onDeleteFile(fileToDelete);
        setDocumentationData((prev: any) => {
          const updated = [...prev];
          const row = { ...updated[context.rowIndex] };
          const prevFiles = row[context.field] ?? [];

          row[context.field] = prevFiles.filter((file: Partial<UploadedFile>) => file.uuid !== fileToDelete.uuid);

          updated[context.rowIndex] = row;
          return updated;
        });
      },
      [onDeleteFile]
    );

    const forProfitAnalysisColumns = useMemo(
      () => [
        {
          header: t("Year"),
          accessorKey: "year",
          enableSorting: false,
          meta: {
            width: "15%"
          }
        },
        {
          header: t("Revenue"),
          accessorKey: "revenue",
          enableSorting: false,
          cell: ({ cell, row }: { cell: Cell<FinancialRow, unknown>; row: Row<FinancialRow> }) => {
            const visibleCells = row.getVisibleCells();
            const columnOrderIndex = visibleCells.findIndex(
              (c: Cell<FinancialRow, unknown>) => c.column.id === cell.column.id
            );
            const columnKey = PROFIT_ANALYSIS_COLUMNS[columnOrderIndex];
            const [tempValue, setTempValue] = useState(
              (forProfitAnalysisData?.[row.index] as ForProfitAnalysisData)?.[columnKey] ?? ""
            );

            useDebouncedChange({
              value: tempValue,
              onDebouncedChange: value => {
                handleChange(
                  { value: Number(value), row: row.index, cell: columnOrderIndex },
                  setForProfitAnalysisData,
                  PROFIT_ANALYSIS_COLUMNS,
                  selectCurrency
                );
              }
            });

            return (
              <InputWrapper required={props.required}>
                <div className="border-light flex h-fit items-center justify-between rounded-lg border py-2 px-2.5 hover:border-primary hover:shadow-input">
                  <div className="flex items-center gap-2">
                    {currencySymbol(selectCurrency)}
                    <Input
                      type="number"
                      variant="secondary"
                      className="border-none !p-0"
                      name={`row-${row.index}-${columnKey}`}
                      value={tempValue}
                      onChange={e => {
                        setTempValue(e.target.value);
                        if (e.target.value === "" || isNaN(Number(e.target.value))) {
                          props.formHook?.setError(props.name, { type: "manual", message: "This field is required" });
                          return;
                        }
                        props.formHook?.clearErrors(props.name);
                      }}
                    />
                  </div>
                  <span className="text-13">{selectCurrency}</span>
                </div>
              </InputWrapper>
            );
          }
        },
        {
          header: t("Expenses"),
          accessorKey: "expenses",
          enableSorting: false,
          cell: ({ cell, row }: { cell: Cell<FinancialRow, unknown>; row: Row<FinancialRow> }) => {
            const visibleCells = row.getVisibleCells();
            const columnOrderIndex = visibleCells.findIndex(
              (c: Cell<FinancialRow, unknown>) => c.column.id === cell.column.id
            );
            const columnKey = PROFIT_ANALYSIS_COLUMNS[columnOrderIndex];

            const [tempValue, setTempValue] = useState(
              (forProfitAnalysisData?.[row.index] as ForProfitAnalysisData)?.[columnKey] ?? ""
            );

            useDebouncedChange({
              value: tempValue,
              onDebouncedChange: value => {
                handleChange(
                  { value: Number(value), row: row.index, cell: columnOrderIndex },
                  setForProfitAnalysisData,
                  PROFIT_ANALYSIS_COLUMNS,
                  selectCurrency
                );
              }
            });

            return (
              <InputWrapper required={props.required}>
                <div className="border-light flex h-fit items-center justify-between rounded-lg border py-2 px-2.5 hover:border-primary hover:shadow-input">
                  <div className="flex items-center gap-2">
                    {currencySymbol(selectCurrency)}
                    <Input
                      type="number"
                      variant="secondary"
                      required
                      className="border-none !p-0"
                      name={`row-${row.index}-${columnKey}`}
                      value={tempValue}
                      onChange={e => {
                        setTempValue(e.target.value);
                        if (e.target.value === "" || isNaN(Number(e.target.value))) {
                          props.formHook?.setError(props.name, { type: "manual", message: "This field is required" });
                          return;
                        }
                        props.formHook?.clearErrors(props.name);
                      }}
                    />
                  </div>
                  <span className="text-13">{selectCurrency}</span>
                </div>
              </InputWrapper>
            );
          }
        },
        {
          header: t("Net Profit"),
          accessorKey: "profit",
          enableSorting: false,
          meta: {
            width: "22.5%"
          },
          cell: ({ row }: { row: { original: { profit: string | number } } }) => (
            <Text variant="text-14-semibold">{row.original.profit}</Text>
          )
        }
      ],
      [forProfitAnalysisData, props.formHook, props.name, props.required, selectCurrency, t]
    );

    const nonProfitAnalysisColumns = useMemo(
      () => [
        {
          header: t("Year"),
          accessorKey: "year",
          enableSorting: false,
          meta: {
            width: "15%"
          }
        },
        {
          header: t("Budget"),
          accessorKey: "budget",
          enableSorting: false,
          cell: ({ cell, row }: { cell: Cell<FinancialRow, unknown>; row: Row<FinancialRow> }) => {
            const visibleCells = row.getVisibleCells();
            const columnOrderIndex = visibleCells.findIndex(
              (c: Cell<FinancialRow, unknown>) => c.column.id === cell.column.id
            );
            const columnKey = NON_PROFILE_ANALYSIS_COLUMNS[columnOrderIndex];

            const [tempValue, setTempValue] = useState(
              (nonProfitAnalysisData?.[row.index] as NonProfitAnalysisData)?.[columnKey] ?? ""
            );

            useDebouncedChange({
              value: tempValue,
              onDebouncedChange: value => {
                handleChange(
                  { value: Number(value), row: row.index, cell: columnOrderIndex },
                  setNonProfitAnalysisData,
                  NON_PROFILE_ANALYSIS_COLUMNS,
                  selectCurrency
                );
              }
            });

            return (
              <InputWrapper required={props.required}>
                <div className="border-light flex h-fit items-center justify-between rounded-lg border py-2 px-2.5 hover:border-primary hover:shadow-input">
                  <div className="flex items-center gap-2">
                    {currencySymbol(selectCurrency)}
                    <Input
                      type="number"
                      variant="secondary"
                      className="border-none !p-0"
                      name={`row-${row.index}-${columnKey}`}
                      value={tempValue}
                      onChange={e => {
                        setTempValue(e.target.value);
                        if (e.target.value === "" || isNaN(Number(e.target.value))) {
                          props.formHook?.setError(props.name, { type: "manual", message: "This field is required" });
                          return;
                        }
                        props.formHook?.clearErrors(props.name);
                      }}
                    />
                  </div>
                  <span className="text-13">{selectCurrency}</span>
                </div>
              </InputWrapper>
            );
          }
        }
      ],
      [nonProfitAnalysisData, props.formHook, props.name, props.required, selectCurrency, t]
    );

    const currentRadioColumns = useMemo(
      () => [
        {
          header: t("Year"),
          accessorKey: "year",
          enableSorting: false,
          meta: {
            width: "15%"
          }
        },
        {
          header: t("Current Assets"),
          accessorKey: "currentAssets",
          enableSorting: false,
          cell: ({ cell, row }: { cell: Cell<FinancialRow, unknown>; row: Row<FinancialRow> }) => {
            const visibleCells = row.getVisibleCells();
            const columnOrderIndex = visibleCells.findIndex(
              (c: Cell<FinancialRow, unknown>) => c.column.id === cell.column.id
            );
            const columnKey = CURRENT_RATIO_COLUMNS[columnOrderIndex];

            const [tempValue, setTempValue] = useState(
              (currentRadioData?.[row.index] as CurrentRatioData)?.[columnKey] ?? ""
            );

            useDebouncedChange({
              value: tempValue,
              onDebouncedChange: value => {
                handleChange(
                  { value: Number(value), row: row.index, cell: columnOrderIndex },
                  setCurrentRadioData,
                  CURRENT_RATIO_COLUMNS,
                  selectCurrency
                );
              }
            });

            return (
              <InputWrapper required={props.required}>
                <div className="border-light flex h-fit items-center justify-between rounded-lg border py-2 px-2.5 hover:border-primary hover:shadow-input">
                  <div className="flex items-center gap-2">
                    {currencySymbol(selectCurrency)}
                    <Input
                      type="number"
                      variant="secondary"
                      className="border-none !p-0"
                      name={`row-${row.index}-${columnKey}`}
                      value={tempValue}
                      onChange={e => {
                        setTempValue(e.target.value);
                        if (e.target.value === "" || isNaN(Number(e.target.value))) {
                          props.formHook?.setError(props.name, { type: "manual", message: "This field is required" });
                          return;
                        }
                        props.formHook?.clearErrors(props.name);
                      }}
                    />
                  </div>
                  <span className="text-13">{selectCurrency}</span>
                </div>
              </InputWrapper>
            );
          }
        },
        {
          header: t("Current Liabilities"),
          accessorKey: "currentLiabilities",
          enableSorting: false,
          cell: ({ cell, row }: { cell: Cell<FinancialRow, unknown>; row: Row<FinancialRow> }) => {
            const visibleCells = row.getVisibleCells();
            const columnOrderIndex = visibleCells.findIndex(
              (c: Cell<FinancialRow, unknown>) => c.column.id === cell.column.id
            );
            const columnKey = CURRENT_RATIO_COLUMNS[columnOrderIndex];

            const [tempValue, setTempValue] = useState(
              (currentRadioData?.[row.index] as CurrentRatioData)?.[columnKey] ?? ""
            );

            useDebouncedChange({
              value: tempValue,
              onDebouncedChange: value => {
                handleChange(
                  { value: Number(value), row: row.index, cell: columnOrderIndex },
                  setCurrentRadioData,
                  CURRENT_RATIO_COLUMNS,
                  selectCurrency
                );
              }
            });

            return (
              <InputWrapper required={props.required}>
                <div className="border-light flex h-fit items-center justify-between rounded-lg border py-2 px-2.5 hover:border-primary hover:shadow-input">
                  <div className="flex items-center gap-2">
                    {currencySymbol(selectCurrency)}
                    <Input
                      required
                      type="number"
                      variant="secondary"
                      className="border-none !p-0"
                      name={`row-${row.index}-${columnKey}`}
                      value={tempValue}
                      onChange={e => {
                        setTempValue(e.target.value);
                        if (e.target.value === "" || isNaN(Number(e.target.value))) {
                          props.formHook?.setError(props.name, { type: "manual", message: "This field is required" });
                          return;
                        }
                        props.formHook?.clearErrors(props.name);
                      }}
                    />
                  </div>
                  <span className="text-13">{selectCurrency}</span>
                </div>
              </InputWrapper>
            );
          }
        },
        {
          header: t("Current Ratio"),
          accessorKey: "currentRatio",
          enableSorting: false,
          meta: {
            width: "22.5%"
          },
          cell: ({ row }: { row: { original: { currentRatio: string | number } } }) => (
            <Text variant="text-14-semibold">{row.original.currentRatio}</Text>
          )
        }
      ],
      [currentRadioData, props.formHook, props.name, props.required, selectCurrency, t]
    );

    const documentationColumns = useMemo(
      () => [
        {
          header: t("Year"),
          accessorKey: "year",
          enableSorting: false
        },
        {
          header: t("Description"),
          accessorKey: "description",
          enableSorting: false,
          meta: {
            style: { width: "60%", minWidth: "300px" }
          },
          cell: ({ cell, row }: { cell: Cell<FinancialRow, unknown>; row: Row<FinancialRow> }) => {
            const visibleCells = row.getVisibleCells();
            const columnOrderIndex = visibleCells.findIndex(
              (c: Cell<FinancialRow, unknown>) => c.column.id === cell.column.id
            );
            const columnKey = DOCUMENTATION_COLUMNS[columnOrderIndex];

            const [tempValue, setTempValue] = useState<string>(
              (documentationData?.[row.index]?.[columnKey] as string) ?? ""
            );

            const hasFocus = useRef(false);

            useEffect(() => {
              if (!hasFocus.current) {
                setTempValue((documentationData?.[row.index]?.[columnKey] as string) ?? "");
              }
              // eslint-disable-next-line react-hooks/exhaustive-deps
            }, [documentationData, row.index, columnKey]);

            const handleFocus = () => {
              hasFocus.current = true;
            };

            const handleBlur = () => {
              hasFocus.current = false;
              const previousValue = documentationData?.[row.index]?.[columnKey] ?? "";
              if (tempValue !== previousValue) {
                handleChange(
                  { value: tempValue, row: row.index, cell: columnOrderIndex },
                  setDocumentationData,
                  DOCUMENTATION_COLUMNS
                );
                props.formHook?.reset(props.formHook?.getValues());
                onChangeCapture?.();
              }
            };

            return (
              <TextArea
                name={`row-${row.index}-${columnKey}`}
                className="hover:border-primary hover:shadow-input"
                placeholder="Add description here"
                rows={2}
                value={tempValue}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onChange={e => setTempValue(e.target.value)}
                data-sync-blur="documentation"
              />
            );
          }
        },
        {
          header: t("USD Exchange Rate"),
          accessorKey: "exchange_rate",
          enableSorting: false,
          cell: ({ cell, row }: { cell: Cell<FinancialRow, unknown>; row: Row<FinancialRow> }) => {
            const visibleCells = row.getVisibleCells();
            const columnOrderIndex = visibleCells.findIndex(
              (c: Cell<FinancialRow, unknown>) => c.column.id === cell.column.id
            );
            const columnKey = DOCUMENTATION_COLUMNS[columnOrderIndex];
            const [tempValue, setTempValue] = useState(
              (documentationData?.[row.index]?.[columnKey] as number | string) ?? ""
            );
            const hasFocus = useRef(false);

            useEffect(() => {
              if (!hasFocus.current) {
                setTempValue((documentationData?.[row.index]?.[columnKey] as number) ?? "");
              }
              // eslint-disable-next-line react-hooks/exhaustive-deps
            }, [documentationData, row.index, columnKey]);

            const handleFocus = () => {
              hasFocus.current = true;
            };

            const handleBlur = () => {
              hasFocus.current = false;
              const previousValue = documentationData?.[row.index]?.[columnKey] ?? "";
              if (tempValue !== previousValue) {
                if (tempValue === 0 || tempValue === null || tempValue === "") {
                  handleChange(
                    { value: null, row: row.index, cell: columnOrderIndex },
                    setDocumentationData,
                    DOCUMENTATION_COLUMNS
                  );
                  onChangeCapture?.();
                  return;
                }
                handleChange(
                  { value: tempValue, row: row.index, cell: columnOrderIndex },
                  setDocumentationData,
                  DOCUMENTATION_COLUMNS
                );
                props.formHook?.reset(props.formHook?.getValues());
                onChangeCapture?.();
              }
            };

            return (
              <Input
                type="number"
                name={`row-${row.index}-${columnKey}`}
                className="h-fit min-h-min hover:border-primary hover:shadow-input"
                placeholder="e.g. 6.97"
                value={tempValue === null ? "" : tempValue}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onChange={e => setTempValue(e.target.value)}
                data-sync-blur="documentation"
              />
            );
          }
        },
        {
          header: t("Financial Documents"),
          accessorKey: "documentation",
          enableSorting: false,
          cell: ({ cell, row }: { cell: Cell<FinancialRow, unknown>; row: Row<FinancialRow> }) => {
            const visibleCells = row.getVisibleCells();
            const columnOrderIndex = visibleCells.findIndex(
              (c: Cell<FinancialRow, unknown>) => c.column.id === cell.column.id
            );
            const columnKey = DOCUMENTATION_COLUMNS[columnOrderIndex];
            const rowIndex = row.index;

            const files = normalizeV2UploadedFiles(documentationData?.[rowIndex]?.[columnKey]);

            // Check if this year has documentation entries but no files uploaded
            const hasDocumentationEntry =
              documentationData?.[rowIndex] && documentationData[rowIndex].year === row.original.year;
            const hasFiles = files && files.length > 0;
            const showError = hasDocumentationEntry && !hasFiles;

            const handleSelectFile = async (file: File) => {
              await onSelectFile(file, {
                uuid: row.id,
                collection: "documentation",
                year: row.original.year,
                field: columnKey,
                rowIndex
              });
            };

            return (
              <InputWrapper
                error={
                  showError
                    ? {
                        message: `Document upload is required for year ${row.original.year}. Please upload at least one supporting document.`,
                        type: "manual"
                      }
                    : undefined
                }
              >
                <FileInput
                  key={rowIndex}
                  files={files}
                  onDelete={file =>
                    handleDeleteFile(file, {
                      collection: "documentation",
                      year: row.original.year,
                      field: columnKey,
                      rowIndex: row.index
                    })
                  }
                  onChange={newFiles => newFiles.forEach(handleSelectFile)}
                />
              </InputWrapper>
            );
          }
        }
      ],
      [documentationData, handleDeleteFile, onChangeCapture, onSelectFile, props.formHook, t]
    );

    useEffect(() => {
      setResetTable(prev => prev + 1);
    }, [selectCurrency, files]);

    const isRequestInProgress = useRef(false);
    const lastSentData = useRef<any>(null);

    useOnMount(() => {
      const payload = {
        organisation_id: orgDetails?.uuid,
        profit_analysis_data: forProfitAnalysisData,
        non_profit_analysis_data: nonProfitAnalysisData,
        current_radio_data: currentRadioData,
        documentation_data: documentationData,
        currency: selectCurrency as string,
        start_month: selectFinancialMonth as number,
        financial_report_id: id ?? router.query.uuid
      };

      const isSame = JSON.stringify(payload) === JSON.stringify(lastSentData.current);
      if (orgDetails?.uuid == null || isSame || isRequestInProgress.current) return;

      const sendRequest = async () => {
        isRequestInProgress.current = true;
        try {
          await createFinancialData({ body: payload });
          lastSentData.current = payload;
        } catch (error) {
          console.error("Error in financial data request", error);
        } finally {
          isRequestInProgress.current = false;
        }
      };

      sendRequest();
      if (selectCurrency === orgDetails?.currency) {
        setSelectCurrency(orgDetails?.currency ?? "");
      }
      if (selectFinancialMonth === orgDetails?.startMonth) {
        setSelectFinancialMonth(orgDetails?.startMonth as number);
      }
    });

    const initialized = useRef(false);
    const isFundoFloraNonProfitOrEnterprise = /fundo flora application.*(non[- ]?profit|enterprise)/i.test(
      orgDetails?.title ?? ""
    );

    useValueChanged(value, () => {
      if (!initialized.current && !isEmpty(value)) {
        const formatted = formatFinancialData(value, years, selectCurrency);
        setForProfitAnalysisData(formatted.profitAnalysisData ?? initialForProfitAnalysisData);
        setNonProfitAnalysisData(formatted.nonProfitAnalysisData ?? initialNonProfitAnalysisData);
        setCurrentRadioData(formatted.currentRatioData ?? initialCurrentRadioData);
        setDocumentationData(formatted.documentationData ?? initialDocumentationData);

        if (value && Array.isArray(value) && value.length > 0) {
          const firstItem = value[0];

          if (firstItem.local_currency && firstItem.local_currency !== selectCurrency) {
            setSelectCurrency(firstItem.local_currency);
          }

          if (
            firstItem.start_month !== null &&
            firstItem.start_month !== undefined &&
            firstItem.start_month !== selectFinancialMonth
          ) {
            setSelectFinancialMonth(firstItem.start_month);
          }
        }

        initialized.current = true;
      }
    });

    useEffect(() => {
      if (initialized.current) {
        const payload: Array<{
          collection: string;
          amount: number | null;
          year: number;
          financial_report_id: string | string[] | undefined;
          start_month: OptionValue;
          currency: OptionValue;
          organisation_id: string | undefined;
          uuid: string | null;
          description: string | null;
          documentation: Partial<UploadedFile>[];
          exchange_rate: number | null;
        }> = [];

        if (collection?.includes("profit") && forProfitAnalysisData && forProfitAnalysisData.length > 0) {
          forProfitAnalysisData.forEach(item => {
            const year = Number(item.year);

            payload.push({
              collection: "revenue",
              amount: item.revenue,
              year: year,
              financial_report_id: id ?? router.query.uuid,
              start_month: selectFinancialMonth,
              currency: selectCurrency,
              organisation_id: orgDetails?.uuid,
              uuid: item.revenueUuid ?? null,
              description: null,
              documentation: [],
              exchange_rate: null
            });

            payload.push({
              collection: "expenses",
              amount: item.expenses,
              year: year,
              financial_report_id: id ?? router.query.uuid,
              start_month: selectFinancialMonth,
              currency: selectCurrency,
              organisation_id: orgDetails?.uuid,
              uuid: item.expensesUuid ?? null,
              description: null,
              documentation: [],
              exchange_rate: null
            });

            payload.push({
              collection: "profit",
              amount: item.revenue - item.expenses,
              year: year,
              financial_report_id: id ?? router.query.uuid,
              start_month: selectFinancialMonth,
              currency: selectCurrency,
              organisation_id: orgDetails?.uuid,
              uuid: item.profitUuid ?? null,
              description: null,
              documentation: [],
              exchange_rate: null
            });
          });
        }

        if (collection?.includes("budget") && nonProfitAnalysisData && nonProfitAnalysisData.length > 0) {
          nonProfitAnalysisData.forEach(item => {
            const year = Number(item.year);

            payload.push({
              collection: "budget",
              amount: item.budget,
              year: year,
              financial_report_id: id ?? router.query.uuid,
              start_month: selectFinancialMonth,
              currency: selectCurrency,
              organisation_id: orgDetails?.uuid,
              uuid: item.budgetUuid ?? null,
              description: null,
              documentation: [],
              exchange_rate: null
            });
          });
        }

        if (collection?.includes("current-ratio") && currentRadioData && currentRadioData.length > 0) {
          currentRadioData.forEach(item => {
            const year = Number(item.year);
            if (isNaN(year)) return;

            payload.push({
              collection: "current-assets",
              amount: item.currentAssets,
              year: year,
              financial_report_id: id ?? router.query.uuid,
              start_month: selectFinancialMonth,
              currency: selectCurrency,
              organisation_id: orgDetails?.uuid,
              uuid: item.currentAssetsUuid ?? null,
              description: null,
              documentation: [],
              exchange_rate: null
            });

            payload.push({
              collection: "current-liabilities",
              amount: item.currentLiabilities,
              year: year,
              financial_report_id: id ?? router.query.uuid,
              start_month: selectFinancialMonth,
              currency: selectCurrency,
              organisation_id: orgDetails?.uuid,
              uuid: item.currentLiabilitiesUuid ?? null,
              description: null,
              documentation: [],
              exchange_rate: null
            });

            payload.push({
              collection: "current-ratio",
              amount: Number((item.currentAssets / item.currentLiabilities).toFixed(2)),
              year: year,
              financial_report_id: id ?? router.query.uuid,
              start_month: selectFinancialMonth,
              currency: selectCurrency,
              organisation_id: orgDetails?.uuid,
              uuid: item.currentRatioUuid ?? null,
              description: null,
              documentation: [],
              exchange_rate: null
            });
          });
        }

        if (documentationData && documentationData.length > 0) {
          documentationData.forEach(item => {
            const year = Number(item.year);

            payload.push({
              collection: "description-documents",
              amount: null,
              year: year,
              financial_report_id: id ?? router.query.uuid,
              start_month: selectFinancialMonth,
              currency: selectCurrency,
              organisation_id: orgDetails?.uuid,
              uuid: item.uuid ?? null,
              description: item.description ?? null,
              documentation: item.documentation ?? [],
              exchange_rate: item.exchange_rate
            });
          });
        }

        field.onChange(payload);

        props.formHook?.clearErrors(props.name);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
      forProfitAnalysisData,
      nonProfitAnalysisData,
      currentRadioData,
      documentationData,
      selectCurrency,
      selectFinancialMonth,
      props.formHook,
      props.name,
      initialized,
      id,
      router.query.uuid,
      orgDetails?.uuid,
      collection
    ]);

    const syncDocumentationTable = useCallback(() => {
      const inputs = document.querySelectorAll('[data-sync-blur="documentation"]');
      inputs.forEach(input => {
        (input as HTMLElement).blur();
      });
    }, []);

    useImperativeHandle(ref, () => ({
      syncDocumentationTable
    }));

    return (
      <InputWrapper
        label={props.label}
        required={props.required}
        containerClassName={props.containerClassName}
        description={props.description}
        inputId={id}
        feedbackRequired={props.feedbackRequired}
        error={{ message: props?.formHook?.formState?.errors?.[props.name]?.message as string, type: "manual" }}
      >
        <div className="mb-10 space-y-6">
          <Dropdown
            options={getCurrencyOptions(t)}
            label={t("Local Currency")}
            placeholder={t("USD - US Dollar")}
            value={[selectCurrency]}
            defaultValue={orgDetails?.currency ? [orgDetails?.currency] : [selectCurrency]}
            onChange={e => setSelectCurrency(e?.[0])}
          />
          <Dropdown
            options={getMonthOptions(t)}
            label={t("Financial Year Start Month")}
            placeholder={t("Select Month")}
            value={[selectFinancialMonth]}
            defaultValue={orgDetails?.startMonth ? [orgDetails?.startMonth] : [selectFinancialMonth]}
            onChange={e => setSelectFinancialMonth(e?.[0])}
          />
        </div>
        <When condition={collection?.includes("profit")}>
          <div className="mb-10">
            <FinancialTableInput
              resetTable={resetTable}
              label={t("Profit Analysis")}
              description={t(
                "Revenue is defined as the total amount of money the business earns from selling its goods or services during their financial period, before any expenses are deducted.Expenses are defined as the sum of all the costs the business incurs to operate and generate revenue during their financial period, including taxes."
              )}
              tableColumns={forProfitAnalysisColumns}
              value={forProfitAnalysisData ?? []}
            />
          </div>
        </When>
        <When condition={collection?.includes("budget")}>
          <div className="mb-10">
            <FinancialTableInput
              resetTable={resetTable}
              label={t("Budget Analysis")}
              description={t(
                isFundoFloraNonProfitOrEnterprise
                  ? "The budget represents the total amount of money allocated for the organization's operations and activities during the financial period. It includes all planned expenses for program services, administrative costs, and other operational needs.<br><br>Note that the budget denotes the amount of money managed by your organisation in the given year in Reais."
                  : "The budget represents the total amount of money allocated for the organization's operations and activities during the financial period. It includes all planned expenses for program services, administrative costs, and other operational needs."
              )}
              tableColumns={nonProfitAnalysisColumns}
              value={nonProfitAnalysisData ?? []}
            />
          </div>
        </When>
        <When condition={collection?.includes("current-ratio")}>
          <div className="mb-10">
            <FinancialTableInput
              resetTable={resetTable}
              label={t("Current Ratio")}
              description={t(
                "Current assets are defined as: Cash, accounts receivable, inventory, and other assets that are expected to be converted to cash within one year.Current liabilities are defined as: Accounts payable, short-term debt, and other obligations due within one year.Current ratio is defined as: Current assets divided by current liabilities. A ratio above 1.0 indicates the company can pay its short-term obligations."
              )}
              tableColumns={currentRadioColumns}
              value={currentRadioData ?? []}
            />
          </div>
        </When>
        <div className="mb-10">
          <FinancialTableInput
            resetTable={resetTable}
            label={t("Documentation")}
            description={t(
              isFundoFloraNonProfitOrEnterprise
                ? "Please provide supporting documentation for each year's financial data and add any relevant notes or context about your financial position.<br><br>We prefer financial statements in a spreadsheet format (.csv, .xls, etc.) or .PDF files. Do not submit files in any other format. Budgets must detail your entire organisation's expenses. Audited budgets are preferred, if available, but are not required at this stage.<br><br>Include in the financial statements, if possible: Income Statement (DRE) or Statement of Surplus and Losses (DSP) - in the case of non-profit organisations, Balance Sheet and Cash Flow Statement."
                : "Please provide supporting documentation for each year’s financial data and add any relevant notes or context about your financial position. Please note that these three uploads, one for each year, are required.<br><br>We prefer financial statements in a spreadsheet format (.csv, .xls, etc.) or .PDF files. Do not submit files in any other format. Financial statements must detail your entire organisation's expenses. Audited statements are preferred, if available, but are not required at this stage. "
            )}
            tableColumns={documentationColumns}
            value={documentationData ?? []}
          />
        </div>
      </InputWrapper>
    );
  }
);

export default RHFFinancialIndicatorsDataTable;

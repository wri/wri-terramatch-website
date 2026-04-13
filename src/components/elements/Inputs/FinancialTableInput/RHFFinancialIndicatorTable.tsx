import { Cell, Row } from "@tanstack/react-table";
import { useT } from "@transifex/react";
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
import { useResourceContext } from "react-admin";
import { useController } from "react-hook-form";
import { useParams } from "react-router-dom";

import { useTableData } from "@/components/elements/Inputs/FinancialTableInput/useTableData";
import { deleteMedia, fileUploadOptions, prepareFileForUpload, useUploadFile } from "@/connections/Media";
import { getCurrencyOptions } from "@/constants/options/localCurrency";
import { getMonthOptions } from "@/constants/options/months";
import { useNotificationContext } from "@/context/notification.provider";
import { useOrgFormDetails } from "@/context/wizardForm.provider";
import { isTranslatableError } from "@/generated/v3/utils";
import { useFiles } from "@/hooks/useFiles";
import { UploadedFile } from "@/types/common";
import { toArray } from "@/utils/array";
import { getErrorMessages } from "@/utils/errors";
import {
  formatFinancialAmount,
  getCurrencySymbolPrefix,
  getLocaleForIsoCurrency,
  parseFinancialAmountInput
} from "@/utils/financialReport";

import Text from "../../Text/Text";
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
  FinancialRow,
  ForProfitAnalysisData,
  HandleChangePayload,
  NON_PROFILE_ANALYSIS_COLUMNS,
  NonProfitAnalysisData,
  PROFIT_ANALYSIS_COLUMNS,
  RHFFinancialIndicatorsDataTableProps,
  useDebouncedChange
} from "./types";

type SelectFileContext = {
  uuid: string;
  collection: string;
  year: number;
  field: string;
  rowIndex: number;
};

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
      const iso = String(selectCurrency ?? "");
      const sym = getCurrencySymbolPrefix(iso);
      const profitNum = revenue - expenses;
      const num = formatFinancialAmount(profitNum, iso);
      currentRow.profit = sym ? `${sym} ${num}` : num;
    }

    if (lowerKeys.includes("currentassets") && lowerKeys.includes("currentliabilities")) {
      const assets = Number(currentRow.currentAssets ?? 0);
      const liabilities = Number(currentRow.currentLiabilities ?? 0);
      const iso = String(selectCurrency ?? "");
      currentRow.currentRatio =
        liabilities !== 0 ? (assets / liabilities).toLocaleString(getLocaleForIsoCurrency(iso)) : "0";
    }

    updated[row] = currentRow;
    return updated;
  });
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
    const { files, addFile, removeFile } = useFiles(true);
    const { collection } = props;
    const orgDetails = useOrgFormDetails();
    const resource = useResourceContext();

    const [resetTable, setResetTable] = useState(0);
    const { openNotification } = useNotificationContext();

    const {
      forProfitAnalysisData,
      setForProfitAnalysisData,
      nonProfitAnalysisData,
      setNonProfitAnalysisData,
      currentRatioData,
      setCurrentRatioData,
      documentationData,
      setDocumentationData,
      selectCurrency,
      setSelectCurrency,
      selectFinancialMonth,
      setSelectFinancialMonth
    } = useTableData(props);

    // UUID is filled in with override in the call to uploadFile
    const uploadFile = useUploadFile({
      pathParams: { entity: "financialIndicators", collection: "documentation", uuid: "" }
    });

    const onSelectFile = useCallback(
      async (file: File, context: SelectFileContext) => {
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
        setDocumentationData(prev => {
          const updated = [...prev];
          const row = { ...updated[context.rowIndex] };
          const prevFiles = (row[context.field] ?? []) as UploadedFile[];

          row[context.field] = [...prevFiles, fileObject as UploadedFile];
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
      [addFile, onChangeCapture, openNotification, setDocumentationData, t, uploadFile]
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
          deleteMedia(file.uuid);
        } else if (file.fileName) {
          removeFile(file);
        }
      },
      [addFile, removeFile]
    );

    const handleDeleteFile = useCallback(
      (fileToDelete: Partial<UploadedFile>, context: any) => {
        onDeleteFile(fileToDelete);
        setDocumentationData(prev => {
          const updated = [...prev];
          const row = { ...updated[context.rowIndex] };
          const prevFiles = (row[context.field] ?? []) as UploadedFile[];

          row[context.field] = prevFiles.filter(file => file.uuid !== fileToDelete.uuid);

          updated[context.rowIndex] = row;
          return updated;
        });
      },
      [onDeleteFile, setDocumentationData]
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
            const [tempValue, setTempValue] = useState(() =>
              formatFinancialAmount(
                Number((forProfitAnalysisData?.[row.index] as ForProfitAnalysisData)?.[columnKey] ?? 0),
                String(selectCurrency)
              )
            );

            useDebouncedChange({
              value: tempValue,
              onDebouncedChange: value => {
                const parsed = parseFinancialAmountInput(String(value), String(selectCurrency));
                if (parsed === null && String(value).trim() === "") return;
                if (parsed === null) return;
                handleChange(
                  { value: parsed, row: row.index, cell: columnOrderIndex },
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
                    {getCurrencySymbolPrefix(String(selectCurrency))}
                    <Input
                      type="text"
                      inputMode="decimal"
                      variant="secondary"
                      className="border-none !p-0"
                      name={`row-${row.index}-${columnKey}`}
                      value={tempValue}
                      onChange={e => {
                        setTempValue(e.target.value);
                        if (e.target.value.trim() === "") {
                          props.formHook?.setError(props.name, { type: "manual", message: "This field is required" });
                          return;
                        }
                        const parsed = parseFinancialAmountInput(e.target.value, String(selectCurrency));
                        if (parsed === null) {
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

            const [tempValue, setTempValue] = useState(() =>
              formatFinancialAmount(
                Number((forProfitAnalysisData?.[row.index] as ForProfitAnalysisData)?.[columnKey] ?? 0),
                String(selectCurrency)
              )
            );

            useDebouncedChange({
              value: tempValue,
              onDebouncedChange: value => {
                const parsed = parseFinancialAmountInput(String(value), String(selectCurrency));
                if (parsed === null && String(value).trim() === "") return;
                if (parsed === null) return;
                handleChange(
                  { value: parsed, row: row.index, cell: columnOrderIndex },
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
                    {getCurrencySymbolPrefix(String(selectCurrency))}
                    <Input
                      type="text"
                      inputMode="decimal"
                      variant="secondary"
                      required
                      className="border-none !p-0"
                      name={`row-${row.index}-${columnKey}`}
                      value={tempValue}
                      onChange={e => {
                        setTempValue(e.target.value);
                        if (e.target.value.trim() === "") {
                          props.formHook?.setError(props.name, { type: "manual", message: "This field is required" });
                          return;
                        }
                        const parsed = parseFinancialAmountInput(e.target.value, String(selectCurrency));
                        if (parsed === null) {
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
      [forProfitAnalysisData, props.formHook, props.name, props.required, selectCurrency, setForProfitAnalysisData, t]
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

            const [tempValue, setTempValue] = useState(() =>
              formatFinancialAmount(
                Number((nonProfitAnalysisData?.[row.index] as NonProfitAnalysisData)?.[columnKey] ?? 0),
                String(selectCurrency)
              )
            );

            useDebouncedChange({
              value: tempValue,
              onDebouncedChange: value => {
                const parsed = parseFinancialAmountInput(String(value), String(selectCurrency));
                if (parsed === null && String(value).trim() === "") return;
                if (parsed === null) return;
                handleChange(
                  { value: parsed, row: row.index, cell: columnOrderIndex },
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
                    {getCurrencySymbolPrefix(String(selectCurrency))}
                    <Input
                      type="text"
                      inputMode="decimal"
                      variant="secondary"
                      className="border-none !p-0"
                      name={`row-${row.index}-${columnKey}`}
                      value={tempValue}
                      onChange={e => {
                        setTempValue(e.target.value);
                        if (e.target.value.trim() === "") {
                          props.formHook?.setError(props.name, { type: "manual", message: "This field is required" });
                          return;
                        }
                        const parsed = parseFinancialAmountInput(e.target.value, String(selectCurrency));
                        if (parsed === null) {
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
      [nonProfitAnalysisData, props.formHook, props.name, props.required, selectCurrency, setNonProfitAnalysisData, t]
    );

    const currentRatioColumns = useMemo(
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

            const [tempValue, setTempValue] = useState(() =>
              formatFinancialAmount(
                Number((currentRatioData?.[row.index] as CurrentRatioData)?.[columnKey] ?? 0),
                String(selectCurrency)
              )
            );

            useDebouncedChange({
              value: tempValue,
              onDebouncedChange: value => {
                const parsed = parseFinancialAmountInput(String(value), String(selectCurrency));
                if (parsed === null && String(value).trim() === "") return;
                if (parsed === null) return;
                handleChange(
                  { value: parsed, row: row.index, cell: columnOrderIndex },
                  setCurrentRatioData,
                  CURRENT_RATIO_COLUMNS,
                  selectCurrency
                );
              }
            });

            return (
              <InputWrapper required={props.required}>
                <div className="border-light flex h-fit items-center justify-between rounded-lg border py-2 px-2.5 hover:border-primary hover:shadow-input">
                  <div className="flex items-center gap-2">
                    {getCurrencySymbolPrefix(String(selectCurrency))}
                    <Input
                      type="text"
                      inputMode="decimal"
                      variant="secondary"
                      className="border-none !p-0"
                      name={`row-${row.index}-${columnKey}`}
                      value={tempValue}
                      onChange={e => {
                        setTempValue(e.target.value);
                        if (e.target.value.trim() === "") {
                          props.formHook?.setError(props.name, { type: "manual", message: "This field is required" });
                          return;
                        }
                        const parsed = parseFinancialAmountInput(e.target.value, String(selectCurrency));
                        if (parsed === null) {
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

            const [tempValue, setTempValue] = useState(() =>
              formatFinancialAmount(
                Number((currentRatioData?.[row.index] as CurrentRatioData)?.[columnKey] ?? 0),
                String(selectCurrency)
              )
            );

            useDebouncedChange({
              value: tempValue,
              onDebouncedChange: value => {
                const parsed = parseFinancialAmountInput(String(value), String(selectCurrency));
                if (parsed === null && String(value).trim() === "") return;
                if (parsed === null) return;
                handleChange(
                  { value: parsed, row: row.index, cell: columnOrderIndex },
                  setCurrentRatioData,
                  CURRENT_RATIO_COLUMNS,
                  selectCurrency
                );
              }
            });

            return (
              <InputWrapper required={props.required}>
                <div className="border-light flex h-fit items-center justify-between rounded-lg border py-2 px-2.5 hover:border-primary hover:shadow-input">
                  <div className="flex items-center gap-2">
                    {getCurrencySymbolPrefix(String(selectCurrency))}
                    <Input
                      required
                      type="text"
                      inputMode="decimal"
                      variant="secondary"
                      className="border-none !p-0"
                      name={`row-${row.index}-${columnKey}`}
                      value={tempValue}
                      onChange={e => {
                        setTempValue(e.target.value);
                        if (e.target.value.trim() === "") {
                          props.formHook?.setError(props.name, { type: "manual", message: "This field is required" });
                          return;
                        }
                        const parsed = parseFinancialAmountInput(e.target.value, String(selectCurrency));
                        if (parsed === null) {
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
      [currentRatioData, props.formHook, props.name, props.required, selectCurrency, setCurrentRatioData, t]
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
          accessorKey: "exchangeRate",
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

            const files = toArray(documentationData?.[rowIndex]?.[columnKey] as UploadedFile | UploadedFile[]);

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
      [documentationData, handleDeleteFile, onChangeCapture, onSelectFile, props.formHook, setDocumentationData, t]
    );

    useEffect(() => {
      setResetTable(prev => prev + 1);
    }, [selectCurrency, files]);

    const isFundoFloraNonProfitOrEnterprise = useMemo(
      () => /fundo flora application.*(non[- ]?profit|enterprise)/i.test(orgDetails?.title ?? ""),
      [orgDetails?.title]
    );
    const isNonProfitOrganization = useMemo(() => orgDetails?.type === "non-profit-organization", [orgDetails?.type]);
    const isFinancialReport = useMemo(
      () => resource === "financialReport" || router.query.entityName == "financial-reports",
      [resource, router.query.entityName]
    );

    useEffect(() => {}, [
      forProfitAnalysisData,
      nonProfitAnalysisData,
      currentRatioData,
      documentationData,
      selectCurrency,
      selectFinancialMonth,
      props.formHook,
      props.name,
      id,
      router.query.uuid,
      orgDetails?.uuid,
      collection,
      field
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
        {collection?.includes("profit") && (
          <div className="mb-10">
            <FinancialTableInput
              resetTable={resetTable}
              label={t("Profit Analysis")}
              description={t(
                "Revenue is defined as the total amount of money your organization earns or receives during the financial period, before expenses are deducted. This may include sales income, service fees, grants, contracts, donations, or other sources of income.<br><br>Expenses are defined as the total costs your organization incurs during the financial period to operate and carry out its activities, including staff costs, operational costs, program costs, and taxes (if applicable).<br><br>Profit is defined as revenue minus expenses for the financial period.<br><br>Please ensure the numbers you input in this section match the audited financial statements uploaded below."
              )}
              tableColumns={forProfitAnalysisColumns}
              value={forProfitAnalysisData ?? []}
            />
          </div>
        )}
        {collection?.includes("budget") && (
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
        )}
        {collection?.includes("current-ratio") && (
          <div className="mb-10">
            <FinancialTableInput
              resetTable={resetTable}
              label={t("Current Ratio")}
              description={t(
                "Current assets are defined as: Cash, accounts receivable, inventory, and other assets that are expected to be converted to cash within one year.Current liabilities are defined as: Accounts payable, short-term debt, and other obligations due within one year.Current ratio is defined as: Current assets divided by current liabilities. A ratio above 1.0 indicates the company can pay its short-term obligations."
              )}
              tableColumns={currentRatioColumns}
              value={currentRatioData ?? []}
            />
          </div>
        )}
        <div className="mb-10">
          <FinancialTableInput
            resetTable={resetTable}
            label={t("Documentation")}
            description={t(
              isFinancialReport
                ? "Please upload audited financial statements for each year requested. If audited financial statements are not available for a given year, please contact your Portfolio Manager before submitting an alternative document.<br><br>We prefer financial statements in a spreadsheet format (.csv, .xls, etc.) or PDF files. Please do not submit files in any other format. Financial statements must reflect your organization’s full expenses for the year."
                : isFundoFloraNonProfitOrEnterprise || isNonProfitOrganization
                ? "Please provide audited financial statements for each year’s financial data and add any relevant notes or context about your financial position, especially if there are discrepancies between years. We prefer financial statements in a spreadsheet format (.csv, .xls, etc.) or .PDF files. Do not submit files in any other format. Financial statements must detail your entire organisation's expenses."
                : "Please provide audited financial statements for each year's financial data and add any relevant notes or context about your financial position. If you do not have audited financial records at the time of reporting, you may use unaudited management accounts. However, in the next reporting cycle, you will be required to submit your audited statements."
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

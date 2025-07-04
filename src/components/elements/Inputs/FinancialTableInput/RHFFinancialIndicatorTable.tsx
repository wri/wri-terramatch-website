import { Cell, Row } from "@tanstack/react-table";
import { useT } from "@transifex/react";
import exifr from "exifr";
import { isEmpty } from "lodash";
import _ from "lodash";
import { PropsWithChildren, useEffect, useRef, useState } from "react";
import { useController, UseControllerProps, UseFormReturn } from "react-hook-form";
import { When } from "react-if";

import { getCurrencyOptions } from "@/constants/options/localCurrency";
import { getMonthOptions } from "@/constants/options/months";
import { useNotificationContext } from "@/context/notification.provider";
import {
  useDeleteV2FilesUUID,
  usePatchV2FinancialIndicators,
  usePostV2FileUploadMODELCOLLECTIONUUID
} from "@/generated/apiComponents";
import { OptionValue, UploadedFile } from "@/types/common";
import { getErrorMessages } from "@/utils/errors";
import Log from "@/utils/log";

import Text from "../../Text/Text";
import { DataTableProps } from "../DataTable/DataTable";
import Dropdown from "../Dropdown/Dropdown";
import FileInput from "../FileInput/FileInput";
import Input from "../Input/Input";
import InputWrapper from "../InputElements/InputWrapper";
import TextArea from "../textArea/TextArea";
import FinancialTableInput from "./FinancialTableInput";
import {
  currentRatioColumnsMap,
  CurrentRatioData,
  documentationColumnsMap,
  FinancialRow,
  formatFinancialData,
  ForProfitAnalysisData,
  HandleChangePayload,
  nonProfitAnalysisColumnsMap,
  NonProfitAnalysisData,
  orgSubmission,
  profitAnalysisColumnsMap,
  useDebouncedChange
} from "./types";

export interface RHFFinancialIndicatorsDataTableProps
  extends Omit<DataTableProps<any>, "value" | "onChange" | "fields" | "addButtonCaption" | "tableColumns">,
    UseControllerProps {
  onChangeCapture?: () => void;
  formHook?: UseFormReturn;
  years?: Array<number>;
  model?: string;
  formSubmissionOrg?: orgSubmission;
}

const handleChange = (
  payload: HandleChangePayload,
  setData: React.Dispatch<React.SetStateAction<any>>,
  columnMap: string[],
  currencyInput?: string,
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
      currentRow.profit = `${currencyInput?.[selectCurrency] ?? ""}${(revenue - expenses).toLocaleString()}`;
    }

    if (lowerKeys.includes("currentassets") && lowerKeys.includes("currentliabilities")) {
      const assets = Number(currentRow.currentAssets ?? 0);
      const liabilities = Number(currentRow.currentLiabilities ?? 0);
      const ratio = liabilities !== 0 ? (assets / liabilities).toLocaleString() : "0";
      currentRow.currentRatio = `${currencyInput?.[selectCurrency] ?? ""}${ratio}`;
    }

    updated[row] = currentRow;
    return updated;
  });
};

const currencyInput = {
  USD: "$",
  EUR: "€",
  GBP: "£"
} as any;

/**
 * @param props PropsWithChildren<RHFFinancialIndicatorsDataTableProps>
 * @returns React Hook Form Ready FinancialIndicator Component
 */
const RHFFinancialIndicatorsDataTable = ({
  onChangeCapture,
  ...props
}: PropsWithChildren<RHFFinancialIndicatorsDataTableProps>) => {
  const t = useT();
  const { field } = useController(props);
  const value = field?.value || [];
  const [files, setFiles] = useState<Partial<UploadedFile>[]>();
  const { years, formSubmissionOrg, model } = props;
  const [selectCurrency, setSelectCurrency] = useState<OptionValue>(formSubmissionOrg?.currency ?? "");
  const [selectFinancialMonth, setSelectFinancialMonth] = useState<OptionValue>(formSubmissionOrg?.start_month ?? "");
  const [resetTable, setResetTable] = useState(0);
  const currencyInputValue = currencyInput?.[selectCurrency] ? currencyInput?.[selectCurrency] : "";
  const { openNotification } = useNotificationContext();
  const initialForProfitAnalysisData = years?.map((item, index) => ({
    uuid: null,
    year: item,
    revenue: 0,
    expenses: 0,
    profit: `${currencyInput?.[selectCurrency]} 0`,
    revenueUuid: null,
    expensesUuid: null,
    profitUuid: null
  })) as ForProfitAnalysisData[];

  const initialNonProfitAnalysisData = years?.map((item, index) => ({
    uuid: null,
    year: item,
    budget: 0,
    budgetUuid: null
  })) as NonProfitAnalysisData[];

  const initialCurrentRadioData = years?.map((item, index) => ({
    uuid: null,
    year: item,
    currentAssets: 0,
    currentLiabilities: 0,
    currentRatio: `${currencyInput?.[selectCurrency]} 0`,
    currentAssetsUuid: null,
    currentLiabilitiesUuid: null,
    currentRatioUuid: null
  })) as CurrentRatioData[];

  const initialDocumentationData = years?.map((item, index) => ({
    uuid: null,
    year: item,
    documentation: [],
    description: ""
  })) as any[];

  const formatted = formatFinancialData(value, years, selectCurrency, currencyInput);
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

  const { mutate: upload } = usePostV2FileUploadMODELCOLLECTIONUUID({
    onSuccess(data, variables) {
      //@ts-ignore
      addFileToValue({ ...data.data, rawFile: variables.file, uploadState: { isSuccess: true, isLoading: false } });
      onChangeCapture?.();
    },
    onError(err, variables: any) {
      const file = variables.file;
      let errorMessage = t("UPLOAD ERROR UNKNOWN: An unknown error occurred during upload. Please try again.");

      if (err?.statusCode === 422 && Array.isArray(err?.errors)) {
        const error = err?.errors[0];
        const formError = getErrorMessages(t, error.code, { ...error.variables, label: "Financial Indicator files" });
        errorMessage = formError.message;
      } else if (err?.statusCode === 413 || err?.statusCode === -1) {
        errorMessage = t("UPLOAD ERROR: An error occurred during upload. Please try again or upload a smaller file.");
      }
      openNotification("error", t("Error uploading file"), t(errorMessage));

      addFileToValue({
        collection_name: variables.pathParams.collection,
        size: file?.size,
        file_name: file?.name,
        title: file?.name,
        mime_type: file?.type,
        rawFile: file,
        uploadState: {
          isLoading: false,
          isSuccess: false,
          error: errorMessage
        }
      });
    }
  });

  const { mutate: deleteFile } = useDeleteV2FilesUUID({
    onSuccess(data) {
      setResetTable(prev => prev + 1);
      //@ts-ignore
      removeFileFromValue(data.data);
      onChangeCapture?.();
    }
  });

  const { mutate: createFinanciaData } = usePatchV2FinancialIndicators({
    onSuccess(data) {
      // @ts-ignore
      const _tmp = data ?? [];
      field.onChange(_tmp);
    }
  });

  const addFileToValue = (file: Partial<UploadedFile>) => {
    setFiles(value => {
      if (Array.isArray(value)) {
        const tmp = [...value];

        const index = tmp.findIndex(item => {
          if (!!file.uuid && file.uuid === item.uuid) {
            return true;
          } else if (!!file.rawFile && item.rawFile === file.rawFile) {
            return true;
          } else {
            return false;
          }
        });

        if (index === -1) {
          return [...tmp, file];
        } else {
          tmp.splice(index, 1, file);

          return tmp;
        }
      } else {
        return [file];
      }
    });
  };

  const onSelectFile = async (file: File, context: any) => {
    addFileToValue({
      collection_name: "documentation",
      size: file.size,
      file_name: file.name,
      title: file.name,
      mime_type: file.type,
      rawFile: file,
      uploadState: {
        isLoading: true
      }
    });

    const body = new FormData();
    body.append("upload_file", file);

    try {
      const location = await exifr.gps(file);

      if (location && !isNaN(location.latitude) && !isNaN(location.longitude)) {
        body.append("lat", location.latitude.toString());
        body.append("lng", location.longitude.toString());
      }
    } catch (e) {
      Log.error("Failed to append geotagging information", e);
    }

    upload?.({
      pathParams: { model: "financial-indicators", collection: "documentation", uuid: context.uuid },
      file: file,
      //@ts-ignore
      body
    });
  };

  const removeFileFromValue = (file: Partial<UploadedFile>) => {
    setFiles(value => {
      if (Array.isArray(value)) {
        const tmp = [...value];
        if (file.uuid) {
          _.remove(tmp, v => v.uuid === file.uuid);
        } else {
          _.remove(tmp, v => v.file_name === file.file_name);
        }
        return tmp;
      } else {
        return [];
      }
    });
  };

  const onDeleteFile = (file: Partial<UploadedFile>) => {
    if (file.uuid) {
      addFileToValue({
        ...file,
        uploadState: {
          isLoading: false,
          isSuccess: false,
          isDeleting: true
        }
      });
      deleteFile({ pathParams: { uuid: file.uuid } });
    } else if (file.file_name) {
      removeFileFromValue(file);
    }
  };

  const handleDeleteFile = (fileToDelete: Partial<UploadedFile>, context: any) => {
    onDeleteFile(fileToDelete);
    setDocumentationData((prev: any) => {
      const updated = [...prev];
      const row = { ...updated[context.rowIndex] };
      const prevFiles = row[context.field] ?? [];

      row[context.field] = prevFiles.filter((file: Partial<UploadedFile>) => file.uuid !== fileToDelete.uuid);

      updated[context.rowIndex] = row;
      return updated;
    });
  };

  const onSelectFileWithContext = async (
    file: File,
    context: {
      collection: string;
      year: string | number;
      field: string;
      rowIndex: number;
    }
  ) => {
    const uploaded: Partial<UploadedFile> = {
      collection_name: context.collection,
      size: file.size,
      file_name: file.name,
      title: file.name,
      mime_type: file.type,
      rawFile: file,
      uploadState: {
        isLoading: false,
        isSuccess: true
      }
    };

    setDocumentationData((prev: any) => {
      const updated = [...prev];
      const row = { ...updated[context.rowIndex] };
      const prevFiles = row[context.field] ?? [];

      row[context.field] = [...prevFiles, uploaded];
      updated[context.rowIndex] = row;
      return updated;
    });
  };

  const forProfitAnalysisColumns = [
    {
      header: "Year",
      accessorKey: "year",
      enableSorting: false,
      meta: {
        width: "15%"
      }
    },
    {
      header: "Revenue",
      accessorKey: "revenue",
      enableSorting: false,
      cell: ({ cell, row }: { cell: Cell<FinancialRow, unknown>; row: Row<FinancialRow> }) => {
        const visibleCells = row.getVisibleCells();
        const columnOrderIndex = visibleCells.findIndex(
          (c: Cell<FinancialRow, unknown>) => c.column.id === cell.column.id
        );
        const columnKey = profitAnalysisColumnsMap[columnOrderIndex];
        const [tempValue, setTempValue] = useState(
          (forProfitAnalysisData?.[row.index] as ForProfitAnalysisData)?.[columnKey] ?? ""
        );

        useDebouncedChange({
          value: tempValue,
          onDebouncedChange: value => {
            handleChange(
              { value: Number(value), row: row.index, cell: columnOrderIndex },
              setForProfitAnalysisData,
              profitAnalysisColumnsMap,
              currencyInput,
              selectCurrency
            );
          }
        });

        return (
          <InputWrapper
            error={{ message: props?.formHook?.formState?.errors?.[props.name]?.message as string, type: "manual" }}
          >
            <div className="border-light flex h-fit items-center justify-between rounded-lg border py-2 px-2.5 hover:border-primary hover:shadow-input">
              <div className="flex items-center gap-2">
                {currencyInputValue}
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
      header: "Expenses",
      accessorKey: "expenses",
      enableSorting: false,
      cell: ({ cell, row }: { cell: Cell<FinancialRow, unknown>; row: Row<FinancialRow> }) => {
        const visibleCells = row.getVisibleCells();
        const columnOrderIndex = visibleCells.findIndex(
          (c: Cell<FinancialRow, unknown>) => c.column.id === cell.column.id
        );
        const columnKey = profitAnalysisColumnsMap[columnOrderIndex];

        const [tempValue, setTempValue] = useState(
          (forProfitAnalysisData?.[row.index] as ForProfitAnalysisData)?.[columnKey] ?? ""
        );

        useDebouncedChange({
          value: tempValue,
          onDebouncedChange: value => {
            handleChange(
              { value: Number(value), row: row.index, cell: columnOrderIndex },
              setForProfitAnalysisData,
              profitAnalysisColumnsMap,
              currencyInput,
              selectCurrency
            );
          }
        });

        return (
          <InputWrapper
            error={{ message: props?.formHook?.formState?.errors?.[props.name]?.message as string, type: "manual" }}
          >
            <div className="border-light flex h-fit items-center justify-between rounded-lg border py-2 px-2.5 hover:border-primary hover:shadow-input">
              <div className="flex items-center gap-2">
                {currencyInputValue}
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
      header: "Net Profit",
      accessorKey: "profit",
      enableSorting: false,
      meta: {
        width: "22.5%"
      },
      cell: ({ row }: { row: { original: { profit: string | number } } }) => (
        <Text variant="text-14-semibold">{row.original.profit}</Text>
      )
    }
  ];

  const nonProfitAnalysisColumns = [
    {
      header: "Year",
      accessorKey: "year",
      enableSorting: false,
      meta: {
        width: "15%"
      }
    },
    {
      header: "Budget",
      accessorKey: "budget",
      enableSorting: false,
      cell: ({ cell, row }: { cell: Cell<FinancialRow, unknown>; row: Row<FinancialRow> }) => {
        const visibleCells = row.getVisibleCells();
        const columnOrderIndex = visibleCells.findIndex(
          (c: Cell<FinancialRow, unknown>) => c.column.id === cell.column.id
        );
        const columnKey = nonProfitAnalysisColumnsMap[columnOrderIndex];

        const [tempValue, setTempValue] = useState(
          (nonProfitAnalysisData?.[row.index] as NonProfitAnalysisData)?.[columnKey] ?? ""
        );

        useDebouncedChange({
          value: tempValue,
          onDebouncedChange: value => {
            handleChange(
              { value: Number(value), row: row.index, cell: columnOrderIndex },
              setNonProfitAnalysisData,
              nonProfitAnalysisColumnsMap,
              currencyInput,
              selectCurrency
            );
          }
        });

        return (
          <InputWrapper
            error={{ message: props?.formHook?.formState?.errors?.[props.name]?.message as string, type: "manual" }}
          >
            <div className="border-light flex h-fit items-center justify-between rounded-lg border py-2 px-2.5 hover:border-primary hover:shadow-input">
              <div className="flex items-center gap-2">
                {currencyInputValue}
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
  ];

  const currentRadioColumns = [
    {
      header: "Year",
      accessorKey: "year",
      enableSorting: false,
      meta: {
        width: "15%"
      }
    },
    {
      header: "Assets",
      accessorKey: "currentAssets",
      enableSorting: false,
      cell: ({ cell, row }: { cell: Cell<FinancialRow, unknown>; row: Row<FinancialRow> }) => {
        const visibleCells = row.getVisibleCells();
        const columnOrderIndex = visibleCells.findIndex(
          (c: Cell<FinancialRow, unknown>) => c.column.id === cell.column.id
        );
        const columnKey = currentRatioColumnsMap[columnOrderIndex];

        const [tempValue, setTempValue] = useState(
          (currentRadioData?.[row.index] as CurrentRatioData)?.[columnKey] ?? ""
        );

        useDebouncedChange({
          value: tempValue,
          onDebouncedChange: value => {
            handleChange(
              { value: Number(value), row: row.index, cell: columnOrderIndex },
              setCurrentRadioData,
              currentRatioColumnsMap,
              currencyInput,
              selectCurrency
            );
          }
        });

        return (
          <InputWrapper
            error={{ message: props?.formHook?.formState?.errors?.[props.name]?.message as string, type: "manual" }}
          >
            <div className="border-light flex h-fit items-center justify-between rounded-lg border py-2 px-2.5 hover:border-primary hover:shadow-input">
              <div className="flex items-center gap-2">
                {currencyInputValue}
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
      header: "Liabilities",
      accessorKey: "currentLiabilities",
      enableSorting: false,
      cell: ({ cell, row }: { cell: Cell<FinancialRow, unknown>; row: Row<FinancialRow> }) => {
        const visibleCells = row.getVisibleCells();
        const columnOrderIndex = visibleCells.findIndex(
          (c: Cell<FinancialRow, unknown>) => c.column.id === cell.column.id
        );
        const columnKey = currentRatioColumnsMap[columnOrderIndex];

        const [tempValue, setTempValue] = useState(
          (currentRadioData?.[row.index] as CurrentRatioData)?.[columnKey] ?? ""
        );

        useDebouncedChange({
          value: tempValue,
          onDebouncedChange: value => {
            handleChange(
              { value: Number(value), row: row.index, cell: columnOrderIndex },
              setCurrentRadioData,
              currentRatioColumnsMap,
              currencyInput,
              selectCurrency
            );
          }
        });

        return (
          <InputWrapper
            error={{ message: props?.formHook?.formState?.errors?.[props.name]?.message as string, type: "manual" }}
          >
            <div className="border-light flex h-fit items-center justify-between rounded-lg border py-2 px-2.5 hover:border-primary hover:shadow-input">
              <div className="flex items-center gap-2">
                {currencyInputValue}
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
      header: "Current Ratio",
      accessorKey: "currentRatio",
      enableSorting: false,
      meta: {
        width: "22.5%"
      },
      cell: ({ row }: { row: { original: { currentRatio: string | number } } }) => (
        <Text variant="text-14-semibold">{row.original.currentRatio}</Text>
      )
    }
  ];

  const documentationColumns = [
    {
      header: "Year",
      accessorKey: "year",
      enableSorting: false
    },
    {
      header: "Financial Documents",
      accessorKey: "documentation",
      enableSorting: false,
      cell: ({ cell, row }: { cell: Cell<FinancialRow, unknown>; row: Row<FinancialRow> }) => {
        const visibleCells = row.getVisibleCells();
        const columnOrderIndex = visibleCells.findIndex(
          (c: Cell<FinancialRow, unknown>) => c.column.id === cell.column.id
        );
        const columnKey = documentationColumnsMap[columnOrderIndex];
        const rowIndex = row.index;

        const files = documentationData?.[rowIndex]?.[columnKey] ?? [];

        const handleSelectFile = async (file: File) => {
          await onSelectFile(file, {
            uuid: row.id
          });
          await onSelectFileWithContext(file, {
            collection: "documentation",
            year: row.original.year,
            field: columnKey,
            rowIndex
          });
        };

        return (
          <FileInput
            key={rowIndex}
            files={files as Partial<UploadedFile>[]}
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
        );
      }
    },
    {
      header: "Description",
      accessorKey: "description",
      enableSorting: false,
      cell: ({ cell, row }: { cell: Cell<FinancialRow, unknown>; row: Row<FinancialRow> }) => {
        const visibleCells = row.getVisibleCells();
        const columnOrderIndex = visibleCells.findIndex(
          (c: Cell<FinancialRow, unknown>) => c.column.id === cell.column.id
        );
        const columnKey = documentationColumnsMap[columnOrderIndex];

        const [tempValue, setTempValue] = useState(documentationData?.[row.index]?.[columnKey] ?? "");

        const hasFocus = useRef(false);

        useEffect(() => {
          if (!hasFocus.current) {
            setTempValue(documentationData?.[row.index]?.[columnKey] ?? "");
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
              documentationColumnsMap
            );
            props.formHook?.reset(props.formHook?.getValues());
            onChangeCapture?.();
          }
        };

        return (
          <TextArea
            name={`row-${row.index}-${columnKey}`}
            className="h-fit min-h-min hover:border-primary hover:shadow-input"
            placeholder="Add description here"
            rows={2}
            value={tempValue}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={e => setTempValue(e.target.value)}
          />
        );
      }
    }
  ];

  useEffect(() => {
    setResetTable(prev => prev + 1);
  }, [selectCurrency, files]);

  const isRequestInProgress = useRef(false);
  const lastSentData = useRef<any>(null);

  useEffect(() => {
    const payload = {
      organisation_id: formSubmissionOrg?.uuid,
      profit_analysis_data: forProfitAnalysisData,
      non_profit_analysis_data: nonProfitAnalysisData,
      current_radio_data: currentRadioData,
      documentation_data: documentationData,
      local_currency: selectCurrency as string,
      financial_year_start_month: selectFinancialMonth as number
    };

    const isSame = JSON.stringify(payload) === JSON.stringify(lastSentData.current);
    if (!formSubmissionOrg?.uuid || isSame || isRequestInProgress.current) return;

    const sendRequest = async () => {
      isRequestInProgress.current = true;
      try {
        await createFinanciaData({ body: payload });
        lastSentData.current = payload;
      } catch (error) {
        console.error("Error in financial data request", error);
      } finally {
        isRequestInProgress.current = false;
      }
    };

    if (!props?.formHook?.formState?.errors?.[props.name] && formSubmissionOrg?.uuid) {
      sendRequest();
      if (selectCurrency === formSubmissionOrg?.currency) {
        setSelectCurrency(formSubmissionOrg?.currency ?? "");
      }
      if (selectFinancialMonth === formSubmissionOrg?.start_month) {
        setSelectFinancialMonth(formSubmissionOrg?.start_month as number);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    forProfitAnalysisData,
    nonProfitAnalysisData,
    currentRadioData,
    documentationData,
    selectCurrency,
    selectFinancialMonth,
    formSubmissionOrg?.uuid,
    formSubmissionOrg?.type,
    files
  ]);

  const initialized = useRef(false);
  const isFundoFloraNonProfitOrEnterprise = /fundo flora application.*(non[- ]?profit|enterprise)/i.test(
    formSubmissionOrg?.title ?? ""
  );

  useEffect(() => {
    if (!initialized.current && !isEmpty(value)) {
      const formatted = formatFinancialData(value, years, selectCurrency, currencyInput);
      setForProfitAnalysisData(formatted.profitAnalysisData ?? initialForProfitAnalysisData);
      setNonProfitAnalysisData(formatted.nonProfitAnalysisData ?? initialNonProfitAnalysisData);
      setCurrentRadioData(formatted.currentRatioData ?? initialCurrentRadioData);
      setDocumentationData(formatted.documentationData ?? initialDocumentationData);
      initialized.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <>
      <div className="mb-10 space-y-6">
        <Dropdown
          options={getCurrencyOptions(t)}
          label={t("Local Currency")}
          placeholder={t("USD - US Dollar")}
          value={[selectCurrency]}
          defaultValue={formSubmissionOrg?.currency ? [formSubmissionOrg?.currency] : [selectCurrency]}
          onChange={e => setSelectCurrency(e?.[0])}
        />
        <Dropdown
          options={getMonthOptions(t)}
          label={t("Financial Year Start Month")}
          placeholder={t("Select Month")}
          value={[selectFinancialMonth]}
          defaultValue={formSubmissionOrg?.start_month ? [formSubmissionOrg?.start_month] : [selectFinancialMonth]}
          onChange={e => setSelectFinancialMonth(e?.[0])}
        />
      </div>
      <When condition={model?.includes("profit")}>
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
      <When condition={model?.includes("budget")}>
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
      <When condition={model?.includes("current-ratio")}>
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
              : "Please provide supporting documentation for each year's financial data and add any relevant notes or context about your financial position."
          )}
          tableColumns={documentationColumns}
          value={documentationData ?? []}
        />
      </div>
    </>
  );
};

export default RHFFinancialIndicatorsDataTable;

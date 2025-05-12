import * as yup from "yup";

import FileInput from "@/components/elements/Inputs/FileInput/FileInput";
import Input from "@/components/elements/Inputs/Input/Input";
import TextArea from "@/components/elements/Inputs/textArea/TextArea";
import Text from "@/components/elements/Text/Text";
import { FieldType, FormStepSchema } from "@/components/extensive/WizardForm/types";
export const MOCKED_FINANCIAL_REPORT_TITLE = "Financial Report";

export const STEPS_MOCKED_DATA_FINANCIAL_REPORT: FormStepSchema[] = [
  {
    title: "Financial Collection",
    subtitle:
      "The settings below will affect how your financial data is organized and displayed throughout the dashboard.",
    fields: [
      {
        name: "local_currency",
        label: "Local Currency",
        placeholder: "USD - US Dollar",
        type: FieldType.Dropdown,
        validation: yup.string(),
        fieldProps: {
          options: [
            { title: "USD - US Dollar", value: "USD" },
            { title: "EUR - Euro", value: "EUR" },
            { title: "GBP - British Pound", value: "GBP" }
          ],
          required: false
        }
      },
      {
        name: "financial_year_start_month",
        label: "Financial Year Start Month",
        placeholder: "January",
        type: FieldType.Dropdown,
        validation: yup.string(),
        fieldProps: {
          options: [
            { title: "January", value: "1" },
            { title: "February", value: "2" },
            { title: "March", value: "3" }
          ],
          required: false
        }
      },
      {
        label: "Profit Analysis",
        description:
          "Revenue is defined as the total amount of money the business earns from selling its goods or services during their financial period, before any expenses are deducted.Expenses are defined as the sum of all the costs the business incurs to operate and generate revenue during their financial period, including taxes.",
        name: "dropdown_input",
        placeholder: "Select ...",
        type: FieldType.FinancialTableInput,
        validation: yup.array().required(),
        fieldProps: {
          fields: [
            {
              name: "revenue",
              label: "Revenue",
              type: FieldType.Input,
              validation: yup.number().required(),
              fieldProps: { type: "number" as const }
            },
            {
              name: "expenses",
              label: "Expenses",
              type: FieldType.Input,
              validation: yup.number().required(),
              fieldProps: { type: "number" as const }
            }
          ],
          value: [
            {
              uuid: "1",
              year: 2022,
              revenue: "0",
              expenses: "0",
              netProfit: "$0"
            },
            {
              uuid: "2",
              year: 2023,
              revenue: "0",
              expenses: "0",
              netProfit: "$0"
            },
            {
              uuid: "3",
              year: 2024,
              revenue: "0",
              expenses: "0",
              netProfit: "$0"
            },
            {
              uuid: "4",
              year: 2025,
              revenue: "0",
              expenses: "0",
              netProfit: "$0"
            }
          ],
          tableColumns: [
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
              cell: ({ row }: { row: any }) => (
                <div className="border-light flex h-fit items-center justify-between rounded-lg border py-2 px-2.5 hover:border-primary hover:shadow-input">
                  <div className="flex items-center gap-0">
                    $
                    <Input type="number" variant="secondary" className="border-none !p-0" name={row.original.name} />
                  </div>
                  <span className="text-13">USD</span>
                </div>
              )
            },
            {
              header: "Expenses",
              accessorKey: "expenses",
              enableSorting: false,
              cell: ({ row }: { row: any }) => (
                <div className="border-light flex h-fit items-center justify-between rounded-lg border py-2 px-2.5 hover:border-primary hover:shadow-input">
                  <div className="flex items-center gap-0">
                    $
                    <Input type="number" variant="secondary" className="border-none !p-0" name={row.original.name} />
                  </div>
                  <span className="text-13">USD</span>
                </div>
              )
            },
            {
              header: "Net Profit",
              accessorKey: "netProfit",
              enableSorting: false,
              meta: {
                width: "22.5%"
              },
              cell: ({ row }: { row: any }) => <Text variant="text-14-semibold">{row.original.netProfit}</Text>
            }
          ]
        }
      },
      {
        label: "Current Ratio",
        description:
          "Current assets are defined as: Cash, accounts receivable, inventory, and other assets that are expected to be converted to cash within one year.Current liabilities are defined as: Accounts payable, short-term debt, and other obligations due within one year.Current ratio is defined as: Current assets divided by current liabilities. A ratio above 1.0 indicates the company can pay its short-term obligations.",
        name: "dropdown_input",
        placeholder: "Select ...",
        type: FieldType.FinancialTableInput,
        validation: yup.array().required(),
        fieldProps: {
          fields: [
            {
              name: "currentAssets",
              label: "Current Assets",
              type: FieldType.Input,
              validation: yup.number().required(),
              fieldProps: { type: "number" as const }
            },
            {
              name: "currentLiabilities",
              label: "Current Liabilities",
              type: FieldType.Input,
              validation: yup.number().required(),
              fieldProps: { type: "number" as const }
            }
          ],
          value: [
            {
              uuid: "1",
              year: 2022,
              currentAssets: "0",
              currentLiabilities: "0",
              currentRatio: "$0"
            },
            {
              uuid: "2",
              year: 2023,
              currentAssets: "0",
              currentLiabilities: "0",
              currentRatio: "$0"
            },
            {
              uuid: "3",
              year: 2024,
              currentAssets: "0",
              currentLiabilities: "0",
              currentRatio: "$0"
            },
            {
              uuid: "4",
              year: 2025,
              currentAssets: "0",
              currentLiabilities: "0",
              currentRatio: "$0"
            }
          ],
          tableColumns: [
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
              accessorKey: "assets",
              enableSorting: false,
              cell: ({ row }: { row: any }) => (
                <div className="border-light flex h-fit items-center justify-between rounded-lg border py-2 px-2.5 hover:border-primary hover:shadow-input">
                  <div className="flex items-center gap-0">
                    $
                    <Input type="number" variant="secondary" className="border-none !p-0" name={row.original.name} />
                  </div>
                  <span className="text-13">USD</span>
                </div>
              )
            },
            {
              header: "Liabilities",
              accessorKey: "liabilities",
              enableSorting: false,
              cell: ({ row }: { row: any }) => (
                <div className="border-light flex h-fit items-center justify-between rounded-lg border py-2 px-2.5 hover:border-primary hover:shadow-input">
                  <div className="flex items-center gap-0">
                    $
                    <Input type="number" variant="secondary" className="border-none !p-0" name={row.original.name} />
                  </div>
                  <span className="text-13">USD</span>
                </div>
              )
            },
            {
              header: "Current Ratio",
              accessorKey: "currentRatio",
              enableSorting: false,
              meta: {
                width: "22.5%"
              },
              cell: ({ row }: { row: any }) => <Text variant="text-14-semibold">{row.original.currentRatio}</Text>
            }
          ]
        }
      },
      {
        label: "Documentation",
        description:
          "Please provide supporting documentation for each year's financial data and add any relevant notes or context about your financial position.",
        name: "dropdown_input",
        placeholder: "Select ...",
        type: FieldType.FinancialTableInput,
        validation: yup.array().required(),
        fieldProps: {
          fields: [
            {
              name: "currentAssets",
              label: "Current Assets",
              type: FieldType.Input,
              validation: yup.number().required(),
              fieldProps: { type: "number" as const }
            },
            {
              name: "currentLiabilities",
              label: "Current Liabilities",
              type: FieldType.TextArea,
              validation: yup.string().required(),
              fieldProps: {
                rows: 2
              }
            }
          ],
          value: [
            {
              uuid: "1",
              year: 2022,
              currentAssets: [],
              currentLiabilities: "0",
              currentRatio: "$0",
              status: "Not Set"
            },
            {
              uuid: "2",
              year: 2023,
              currentAssets: [
                {
                  uuid: "1",
                  file_name: "file.pdf",
                  src: "file.pdf",
                  size: 100,
                  mime_type: "application/pdf",
                  extension: "pdf",
                  is_public: true,
                  is_cover: true,
                  status: true,
                  lat: 0,
                  lng: 0,
                  created_at: "2021-01-01",
                  collection_name: "financial_report",
                  title: "file.pdf",
                  type: "application/pdf",
                  url: "file.pdf",
                  raw_url: "file.pdf",
                  uploadState: {
                    isSuccess: true,
                    isError: false,
                    isLoading: false,
                    isPending: false,
                    isUploading: false
                  }
                }
              ],
              currentLiabilities: "0",
              currentRatio: "$0",
              status: "Not Set"
            },
            {
              uuid: "3",
              year: 2024,
              currentAssets: [],
              currentLiabilities: "0",
              currentRatio: "$0",
              status: "Not Set"
            },
            {
              uuid: "4",
              year: 2025,
              currentAssets: [],
              currentLiabilities: "0",
              currentRatio: "$0",
              status: "Not Set"
            }
          ],
          tableColumns: [
            {
              header: "Year",
              accessorKey: "year",
              enableSorting: false
            },
            {
              header: "Financial Documents",
              accessorKey: "currentAssets",
              enableSorting: false,
              cell: ({ row }: { row: any }) => (
                <div>
                  <FileInput files={row.original.currentAssets} />
                </div>
              )
            },
            {
              header: "Description",
              accessorKey: "description",
              enableSorting: false,
              cell: ({ row }: { row: any }) => (
                <TextArea
                  name={row.original.name}
                  className="h-fit min-h-min hover:border-primary hover:shadow-input"
                  placeholder="Add description here"
                  rows={2}
                />
              )
            }
          ]
        }
      }
    ]
  }
];

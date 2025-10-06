import type { Meta, StoryObj } from "@storybook/react";
import { FormProvider, useForm } from "react-hook-form";

import { RHFDisturbanceReportEntries } from "@/components/elements/Inputs/DataTable/RHFDisturbanceReportEntries";
import EntityProvider from "@/context/entity.provider";

const meta: Meta<typeof RHFDisturbanceReportEntries> = {
  title: "Components/Extensive/RHFDisturbanceReportEntries",
  component: RHFDisturbanceReportEntries,
  parameters: { layout: "padded" }
};

export default meta;

type Story = StoryObj<typeof RHFDisturbanceReportEntries>;

export const Default: Story = {
  render: () => {
    const form = useForm({
      defaultValues: {
        disturbanceReportEntries: [
          { name: "disturbance-type", value: "climatic" },
          { name: "disturbance-subtype", value: ["flooding", "fire"] },
          { name: "intensity", value: "low" },
          { name: "extent", value: "21-40" },
          { name: "people-affected", value: 100 },
          { name: "monetary-damage", value: 100000 },
          { name: "date-of-disturbance", value: "2025-01-01" },
          {
            name: "site-affected",
            value: '[{"siteUuid":"cf9808cf-2737-4cd9-9d19-cc2219f6fbe5","siteName":"CES Rioterra - RESEX D"}]'
          },
          {
            name: "polygon-affected",
            value:
              '[[{"polyUuid":"1270c4aa-6121-414d-bcc7-3c02909b72ae","polyName":"3501","siteUuid":"cf9808cf-2737-4cd9-9d19-cc2219f6fbe5"}]]'
          },
          { name: "property-affected", value: ["seedlings", "trees"] }
        ]
      },
      mode: "onTouched"
    });

    // Lightweight fetch mock to avoid hitting real endpoints in Storybook/Storyshots
    if (typeof (globalThis as any).fetch !== "function" || !(globalThis as any).__rhf_dist_mock_fetch__) {
      (globalThis as any).__rhf_dist_mock_fetch__ = true;
      (globalThis as any).fetch = async (input: RequestInfo | URL) => {
        const url = typeof input === "string" ? input : (input as URL).toString();
        if (url.includes("/entities/v3/sites")) {
          return {
            ok: true,
            status: 200,
            json: async () => ({
              data: [{ uuid: "cf9808cf-2737-4cd9-9d19-cc2219f6fbe5", name: "CES Rioterra - RESEX D" }],
              meta: { total: 1 }
            })
          } as any;
        }
        if (url.includes("/research/v3/sitePolygons")) {
          return {
            ok: true,
            status: 200,
            json: async () => ({
              data: [{ uuid: "1270c4aa-6121-414d-bcc7-3c02909b72ae", name: "3501" }],
              meta: { total: 1 }
            })
          } as any;
        }
        return { ok: true, status: 200, json: async () => ({}) } as any;
      };
    }

    return (
      <EntityProvider entityUuid="story-entity" entityName="projects" projectUuid="story-project">
        <FormProvider {...form}>
          <div style={{ padding: 24, background: "#fff" }}>
            <RHFDisturbanceReportEntries
              name="disturbanceReportEntries"
              label="Disturbance Report"
              control={form.control as any}
              formHook={form as any}
              onChangeCapture={() => {}}
            />
          </div>
        </FormProvider>
      </EntityProvider>
    );
  }
};

import { Flex, TableCell, TableRow, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import React, { FC } from "react";

import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import MultiActionButton from "@/redesignComponents/actions/Buttons/MultiActionButton/MultiActionButton";
import MappedTag from "@/redesignComponents/actions/Tags/MappedTag/MappedTag";
import ValidationTag from "@/redesignComponents/actions/Tags/ValidationTag/ValidationTag";
import Accordion from "@/redesignComponents/containers/Accordion/Accordion";
import AccordionHeader from "@/redesignComponents/containers/Accordion/AccordionHeader";
import Table from "@/redesignComponents/dataDisplay/Table/Table";
import Switch from "@/redesignComponents/Forms/Actions/Switch/Switch";
import DatePickerInput from "@/redesignComponents/Forms/Inputs/DateInputs/DatePickerInput/DatePickerInput";
import InputWithUnits from "@/redesignComponents/Forms/Inputs/InputWithUnits";
import SelectInput from "@/redesignComponents/Forms/Inputs/SelectInput";
import TextInput from "@/redesignComponents/Forms/Inputs/TextInput";
import { DownloadIcon, UploadIcon } from "@/redesignComponents/foundations/Icons";
import FloatingActionToolbar from "@/redesignComponents/navigation/Toolbar/FloatingActionToolbar";

interface PolygonEditContentProps {
  // activeTab: string;
}
const PolygonEditContent: FC<PolygonEditContentProps> = () => {
  const t = useT();
  const mockedOptions = [
    {
      label: "Option 1",
      value: "option-1"
    },
    {
      label: "Option 2",
      value: "option-2"
    },
    {
      label: "Option 3",
      value: "option-3"
    }
  ];
  return (
    <Flex className="min-h-0 flex-1 flex-col gap-2">
      <Flex className="min-h-0 flex-1 flex-col gap-2 overflow-auto pr-2">
        <Flex className="h-fit w-full gap-6">
          <Flex className="items-center gap-1">
            <Text textStyle="200" color="neutral.800">
              {t("Submission:")}
            </Text>
            <MappedTag state="information-required" />
          </Flex>
          <Flex className="items-center gap-1">
            <Text textStyle="200" color="neutral.800">
              {t("Validation:")}
            </Text>
            <ValidationTag status="failed" />
          </Flex>
        </Flex>
        <Accordion header={<AccordionHeader title={t("Details")} />} defaultOpen>
          <Flex className="flex-1 flex-col gap-4">
            <TextInput label={t("Polygon Name")} name="polygonName" placeholder={t("Full Polygon Name")} required />
            <DatePickerInput label={t("Label")} required />
            <SelectInput
              items={mockedOptions}
              label={t("Restoration Practice")}
              onChange={function noRefCheck() {}}
              placeholder={t("Select...")}
              required
            />
            <SelectInput
              items={mockedOptions}
              label={t("Target Land Use")}
              onChange={function noRefCheck() {}}
              placeholder={t("Select...")}
              required
            />
            <SelectInput
              items={mockedOptions}
              label={t("Tree Distribution")}
              onChange={function noRefCheck() {}}
              placeholder={t("Select...")}
              required
            />
            <TextInput label={t("Trees Planted")} name="treesPlanted" placeholder={t("Enter Trees Planted")} required />
            <InputWithUnits
              label={t("Estimated Area")}
              onChange={function noRefCheck() {}}
              disabled
              units={[
                {
                  label: t("kg"),
                  value: "kg"
                },
                {
                  label: t("g"),
                  value: "g"
                },
                {
                  label: t("lb"),
                  value: "lb"
                }
              ]}
            />
          </Flex>
        </Accordion>
        <Accordion
          header={<AccordionHeader title={t("Monitoring Plots")} />}
          actions={
            <Button leftIcon={<DownloadIcon />} onClick={function noRefCheck() {}} size="small" variant="secondary">
              {t("Download Monitoring Plots")}
            </Button>
          }
        >
          <Flex className="flex-1 flex-col gap-4">
            <Switch name="showPlotsOnMap" onChange={function noRefCheck() {}}>
              {t("Show Plots on Map")}
            </Switch>
            <Flex className="flex-col gap-7">
              <Text>
                {t(
                  "These monitoring plots mark the specific areas where tree counts are conducted to track natural regeneration over time."
                )}
              </Text>
              <Text>
                {t("Download the monitoring plots to help your team locate and monitor the areas during field visits.")}
              </Text>
            </Flex>
          </Flex>
        </Accordion>
        <Accordion
          header={<AccordionHeader title={t("Geotagged Photos")} />}
          actions={
            <Button leftIcon={<UploadIcon />} onClick={function noRefCheck() {}} size="small" variant="secondary">
              {t("Upload Geotagged Photos")}
            </Button>
          }
        >
          <Flex className="flex-1 flex-col gap-4">
            <Flex className="items-center gap-1">
              <Text textStyle="400-bold" color="neutral.900">{`X ${t("Photos")}`}</Text>
              <Text color="neutral.900">{t("available")}</Text>
              <ValidationTag status="failed" />
            </Flex>
            <Switch name="showPhotosOnMap" onChange={function noRefCheck() {}}>
              {t("Show Photos on Map")}
            </Switch>
          </Flex>
        </Accordion>
        <Accordion header={t("Versions")}>
          <Table<{ id: string; versionName: string; date: string; state: string }>
            columns={[
              {
                key: "versionName",
                label: "Version Name"
              },
              {
                key: "date",
                label: "Date"
              },
              {
                key: "state",
                label: "State"
              }
            ]}
            data={[
              {
                id: "version-1",
                versionName: "Version Name",
                date: "01/01/2021",
                state: "Active"
              },
              {
                id: "version-2",
                versionName: "Version Name",
                date: "01/01/2021",
                state: "Active"
              },

              {
                id: "version-3",
                versionName: "Version Name",
                date: "01/01/2021",
                state: "Active"
              }
            ]}
            renderRow={row => (
              <TableRow key={row.id}>
                <TableCell>
                  <Text>{row.versionName}</Text>
                </TableCell>
                <TableCell>
                  {/* Format to DD/MM/YYYY */}
                  <Text>{row.date}</Text>
                </TableCell>
                <TableCell>
                  <MultiActionButton
                    mainActionLabel={row.state}
                    mainActionOnClick={function noRefCheck() {}}
                    otherActions={[
                      {
                        label: t("Active"),
                        onClick: function noRefCheck() {},
                        value: "active"
                      },
                      {
                        label: t("Inactive"),
                        onClick: function noRefCheck() {},
                        value: "inactive"
                      }
                    ]}
                    size="small"
                    variant="secondary"
                  />
                </TableCell>
              </TableRow>
            )}
          />
        </Accordion>
      </Flex>
      <Flex className="w-full justify-center">
        <FloatingActionToolbar
          className="bg-theme-neutral-200"
          items={[
            { label: t("Delete"), onClick: () => {}, labelColor: "error.500" },
            { label: t("Download"), onClick: () => {} },
            { label: t("Submit"), onClick: () => {} }
          ]}
        />
      </Flex>
    </Flex>
  );
};

export default PolygonEditContent;

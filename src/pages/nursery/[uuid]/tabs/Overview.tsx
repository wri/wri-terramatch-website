import { Box, Flex, Link, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";

import LongTextField from "@/components/elements/Field/LongTextField";
import TextField from "@/components/elements/Field/TextField";
import About from "@/components/extensive/PageElements/About/About";
import PageBody from "@/components/extensive/PageElements/Body/PageBody";
import PageCard from "@/components/extensive/PageElements/Card/PageCard";
import PageColumn from "@/components/extensive/PageElements/Column/PageColumn";
import PageItem from "@/components/extensive/PageElements/PageItem/PageItem";
import PageRow from "@/components/extensive/PageElements/Row/PageRow";
import TreeSpeciesTable from "@/components/extensive/Tables/TreeSpeciesTable";
import { usePlantTotalCount } from "@/components/extensive/Tables/TreeSpeciesTable/hooks";
import { useDate } from "@/hooks/useDate";
import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import TagSubmission from "@/redesignComponents/actions/Tags/TagSubmission/TagSubmission";
import MetricCard from "@/redesignComponents/dataDisplay/Metrics/MetricCard";
import { EditIcon, SeedlingsIcon } from "@/redesignComponents/foundations/Icons";
import ChevronRightIcon from "@/redesignComponents/foundations/Icons/ChevronRightIcon";
import { ProgressSteps } from "@/redesignComponents/status/ProgressIndicator/ProgressSteps";
import { StepProps } from "@/redesignComponents/status/ProgressIndicator/types";
interface NurseryOverviewTabProps {
  nursery: any;
}

const NurseryOverviewTab = ({ nursery }: NurseryOverviewTabProps) => {
  const { format } = useDate();
  const totalNurserySeedlings = usePlantTotalCount({
    entity: "nurseries",
    entityUuid: nursery?.uuid,
    collection: "nursery-seedling"
  });
  const t = useT();

  const nurserySetUpStatus = "approved";

  const exampleSteps: StepProps[] = [
    {
      index: 1,
      status: "completed",
      label: "Label",
      actions: (
        <Button type="button" variant="borderless" size="small" leftIcon={<EditIcon boxSize={3} />} onClick={() => {}}>
          {t("Edit")}
        </Button>
      )
    },
    {
      index: 2,
      status: "completed",
      label: "Label",
      actions: (
        <Button type="button" variant="borderless" size="small" leftIcon={<EditIcon boxSize={3} />} onClick={() => {}}>
          {t("Edit")}
        </Button>
      )
    },
    {
      index: 3,
      status: "completed",
      label: "Label",
      actions: (
        <Button type="button" variant="borderless" size="small" leftIcon={<EditIcon boxSize={3} />} onClick={() => {}}>
          {t("Edit")}
        </Button>
      )
    },
    {
      index: 4,
      status: "error",
      label: "Label",
      actions: (
        <Button type="button" variant="borderless" size="small" leftIcon={<EditIcon boxSize={3} />} onClick={() => {}}>
          {t("Edit")}
        </Button>
      )
    },
    {
      index: 5,
      status: "active",
      label: "Label",
      actions: (
        <Button type="button" variant="borderless" size="small" leftIcon={<EditIcon boxSize={3} />} onClick={() => {}}>
          {t("Edit")}
        </Button>
      )
    },
    {
      index: 6,
      status: "available",
      label: "Label",
      actions: (
        <Button type="button" variant="borderless" size="small" leftIcon={<EditIcon boxSize={3} />} onClick={() => {}}>
          {t("Edit")}
        </Button>
      )
    },
    {
      index: 7,
      status: "available",
      label: "Label",
      actions: (
        <Button type="button" variant="borderless" size="small" leftIcon={<EditIcon boxSize={3} />} onClick={() => {}}>
          {t("Edit")}
        </Button>
      )
    }
  ];

  return (
    <PageBody>
      <Flex direction="column" gap={5} paddingX={6} paddingBottom={4}>
        <Flex gap={7}>
          <PageItem
            title={t("Key Indicators")}
            flexProps={{ maxWidth: "26%" }}
            buttonProps={{
              variant: "secondary",
              size: "small",
              children: t("View Progress & Goals"),
              rightIcon: <ChevronRightIcon />,
              onClick: () => {}
            }}
          >
            <MetricCard
              title={t("About Nurseries")}
              variant="donutChart"
              progress={50}
              goal={100}
              icon={<SeedlingsIcon boxSize={6} />}
              tooltipContent={t("Nursery Information")}
              color="secondary.500"
            />
          </PageItem>
          <PageItem title="Nursery Information" flexProps={{ maxWidth: "41%" }}>
            <About
              description={
                <Text textStyle="300" as="span">
                  <strong>{t("Nurseries")}</strong>&nbsp;
                  {t(
                    "are the lifeblood of your tree planting project. Whenever your project builds a new nursery or expands an existing one to supply your sites, create a nursery profile on TerraMatch. If your project uses nurseries managed by others, or relies only on direct seeding or assisted natural regeneration, you do not need to add any nursery profiles. If you have challenges or need assistance, please reach out to your project manager or "
                  )}
                  <Link
                    href="mailto:info@terramatch.org?subject=Support%20Request%20for%20Nursery%20Profile"
                    fontWeight="bold"
                    target="_blank"
                  >
                    <Text as="span" textStyle="200-bold">
                      info@terramatch.org
                    </Text>
                  </Link>
                </Text>
              }
              links={[
                {
                  title: t("Use the TerraFund Profile Creation Checklists"),
                  link: ""
                },
                {
                  title: t("Create a Nursery Profile"),
                  link: ""
                }
              ]}
            />
          </PageItem>
          <PageItem
            flexProps={{ maxWidth: "33%", overflow: "hidden" }}
            title={t("Nursery Set Up")}
            tag={<TagSubmission state={nurserySetUpStatus} />}
            buttonProps={{
              variant: "primary",
              size: "small",
              children: nurserySetUpStatus === "approved" ? t("Edit") : t("Continue Editing"),
              rightIcon: <ChevronRightIcon />,
              onClick: () => {}
            }}
          >
            <Box backgroundColor="neutral.100" padding={5} borderRadius={1}>
              <ProgressSteps steps={exampleSteps} />
            </Box>
          </PageItem>
        </Flex>
      </Flex>
      <PageRow>
        <PageColumn>
          <PageCard title={t("Nursery Information")} gap={8}>
            <LongTextField title={t("Planting Contribution")}>{nursery?.plantingContribution}</LongTextField>
          </PageCard>
        </PageColumn>

        <PageColumn>
          <PageCard title={t("Nursery Details")} gap={4}>
            <TextField label={t("Nursery name")} value={nursery?.name} />
            <TextField label={t("Nursery type")} value={nursery?.nurseryType} />
            <TextField label={t("Nursery start date")} value={format(nursery?.startDate)} />
            <TextField label={t("Nursery end date")} value={format(nursery?.endDate)} />
            <TextField label={t("Last updated")} value={format(nursery?.updatedAt)} />
            <TextField label={t("Seedlings or Young Trees to be Grown")} value={nursery?.seedlingGrown} />
          </PageCard>
          <PageCard
            title={"Saplings to be Grown"}
            headerChildren={
              <div className="flex items-center gap-2">
                <span className="text-18 font-semibold text-primary">
                  {totalNurserySeedlings.toLocaleString?.() ?? 0}
                </span>
              </div>
            }
          >
            <TreeSpeciesTable entityUuid={nursery?.uuid} entity="nurseries" collection="nursery-seedling" />
          </PageCard>
        </PageColumn>
      </PageRow>
    </PageBody>
  );
};

export default NurseryOverviewTab;

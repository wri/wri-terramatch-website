import { Box, Flex, Link, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { useRouter } from "next/router";

import About from "@/components/extensive/PageElements/About/About";
import PageBody from "@/components/extensive/PageElements/Body/PageBody";
import PageItem from "@/components/extensive/PageElements/PageItem/PageItem";
import { usePlantTotalCount } from "@/components/extensive/Tables/TreeSpeciesTable/hooks";
import { NurseryFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { isEntityAwaitingApproval } from "@/helpers/entity";
import { useGetEditEntityHandler } from "@/hooks/entity/useGetEditEntityHandler";
import EntitySetUpSection from "@/pages/project/[uuid]/tabs/EntitySetUpSection";
import TagSubmission from "@/redesignComponents/actions/Tags/TagSubmission/TagSubmission";
import { TagSubmissionState } from "@/redesignComponents/actions/Tags/TagSubmission/TagSubmission.type";
import MetricCard from "@/redesignComponents/dataDisplay/Metrics/MetricCard";
import { SeedlingsIcon } from "@/redesignComponents/foundations/Icons";
import ChevronRightIcon from "@/redesignComponents/foundations/Icons/ChevronRightIcon";
interface NurseryOverviewTabProps {
  nursery: NurseryFullDto;
}

const mapStatusToTagStateNursery = (status: string | null | undefined): { type: TagSubmissionState } | undefined => {
  switch (status) {
    case "draft":
      return {
        type: "draft"
      };
    case "started":
      return {
        type: "draft"
      };
    case "awaiting-approval":
      return { type: "pending-approval" };
    case "needs-more-information":
      return {
        type: "information-required"
      };
    case "approved":
      return {
        type: "approved"
      };
    default:
      return undefined;
  }
};

const NurseryOverviewTab = ({ nursery }: NurseryOverviewTabProps) => {
  const router = useRouter();
  const { handleEdit } = useGetEditEntityHandler({
    entityName: "nurseries",
    entityUUID: nursery.uuid,
    entityStatus: nursery.status ?? "draft",
    updateRequestStatus: nursery.updateRequestStatus ?? "no-update"
  });
  const totalNurserySeedlings = usePlantTotalCount({
    entity: "nurseries",
    entityUuid: nursery?.uuid,
    collection: "nursery-seedling"
  });
  const t = useT();

  const goToTab = (tab: string) => {
    router.push({ pathname: router.pathname, query: { ...router.query, tab: tab } }, undefined, {
      shallow: true
    });
  };

  const goToContinueEditingTab = () => {
    if (isEntityAwaitingApproval(nursery?.status, nursery?.updateRequestStatus)) {
      handleEdit();
    } else {
      router.push(`/entity/nurseries/edit/${nursery.uuid}`, undefined, {
        shallow: true
      });
    }
  };

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
              children: "View Progress & Goals",
              rightIcon: <ChevronRightIcon />,
              onClick: () => goToTab("progress-and-goals")
            }}
          >
            <MetricCard
              title={t("Seedlings Grown")}
              variant="donutChart"
              progress={nursery?.seedlingGrown ?? 0}
              goal={totalNurserySeedlings}
              icon={<SeedlingsIcon boxSize={6} />}
              tooltipContent={t("Number of seedlings grown for this project.")}
              color="secondary.500"
            />
          </PageItem>
          <PageItem title="About Nurseries" flexProps={{ maxWidth: "41%" }}>
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
                  link: "https://terramatchsupport.zendesk.com/hc/en-us/articles/45890074377755-Checklists-Tips-for-TerraFund-Project-Nursery-and-Site-Establishment"
                },
                {
                  title: t("Create a Nursery Profile"),
                  link: "https://terramatchsupport.zendesk.com/hc/en-us/articles/12512665359899-How-to-Create-a-Nursery-Profile"
                }
              ]}
            />
          </PageItem>
          <PageItem
            flexProps={{ maxWidth: "33%", overflow: "hidden" }}
            title={t("Nursery Set Up")}
            tag={(() => {
              const tagState = mapStatusToTagStateNursery(nursery?.status);

              return nursery?.status != null ? <TagSubmission state={tagState?.type as TagSubmissionState} /> : null;
            })()}
            buttonProps={{
              variant: "primary",
              size: "small",
              children: nursery?.status === "approved" ? t("Edit") : t("Continue Editing"),
              rightIcon: <ChevronRightIcon />,
              onClick: goToContinueEditingTab
            }}
          >
            <Box backgroundColor="neutral.100" padding={5} borderRadius={1}>
              <EntitySetUpSection entity={nursery} type="nurseries" />
            </Box>
          </PageItem>
        </Flex>
      </Flex>

      <br />
      <br />
    </PageBody>
  );
};

export default NurseryOverviewTab;

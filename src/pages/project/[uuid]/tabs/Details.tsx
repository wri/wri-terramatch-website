import { Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import Link from "next/link";

import ButtonField from "@/components/elements/Field/ButtonField";
import PageBody from "@/components/extensive/PageElements/Body/PageBody";
import { Framework, useFrameworkContext } from "@/context/framework.provider";
import { ProjectFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import Accordion from "@/redesignComponents/containers/Accordion/Accordion";
import AccordionHeader from "@/redesignComponents/containers/Accordion/AccordionHeader";
import { Edit } from "@/redesignComponents/foundations/Icons";

interface ProjectDetailsTabProps {
  project: ProjectFullDto;
}

const EditButton = ({ onClick }: { onClick: () => void }) => (
  <Button variant="secondary" size="small" leftIcon={<Edit boxSize={4} />} onClick={onClick}>
    Edit
  </Button>
);

const ProjectDetailTab = ({ project }: ProjectDetailsTabProps) => {
  const t = useT();
  const { framework } = useFrameworkContext();

  const downloadButtons: JSX.Element[] = [];
  if (framework === Framework.PPC) {
    project.file.forEach(({ url, fileName }) => {
      if (url != null) {
        downloadButtons.push(
          <ButtonField
            key={url}
            label={t("Files")}
            subtitle={fileName}
            subtitleClassName="break-words whitespace-normal max-w-[450px]"
            buttonProps={{ as: Link, children: t("Download"), href: url, download: true }}
            style={{ marginBottom: "10px" }}
          />
        );
      }
    });
    project.otherAdditionalDocuments.forEach(({ url, fileName }) => {
      if (url != null) {
        downloadButtons.push(
          <ButtonField
            key={url}
            label={t("Other Documents")}
            subtitle={fileName}
            subtitleClassName="break-words whitespace-normal max-w-[450px]"
            buttonProps={{ as: Link, children: t("Download"), href: url, download: true }}
            style={{ marginBottom: "10px" }}
          />
        );
      }
    });
  } else if (framework === Framework.TF_LANDSCAPES) {
    project.proofOfLandTenureMou.forEach(({ url, fileName }) => {
      if (url != null) {
        downloadButtons.push(
          <ButtonField
            key={url}
            label={t("Land Tenure MOU")}
            subtitle={fileName}
            subtitleClassName="break-words whitespace-normal max-w-[450px]"
            buttonProps={{ as: Link, children: t("Download"), href: url, download: true }}
          />
        );
      }
    });
  }

  return (
    <PageBody>
      <Flex flexDirection="column" gap={2}>
        <Accordion
          header={<AccordionHeader title="Project Overview" status="success" />}
          actions={<EditButton onClick={() => console.log("Edit clicked")} />}
        >
          <Flex flexDirection="column" gap={3}>
            <Flex direction="column" gap={1}>
              <Text fontSize="14px" lineHeight="20px" color="primary.900" fontWeight="bold">
                Project name:
              </Text>
              <Text fontSize="16px" lineHeight="24px" color="neutral.900">
                Project Name
              </Text>
            </Flex>
            <Flex direction="column" gap={1}>
              <Text fontSize="14px" lineHeight="20px" color="primary.900" fontWeight="bold">
                Continent:
              </Text>
              <Text fontSize="16px" lineHeight="24px" color="neutral.900">
                Continent
              </Text>
            </Flex>
            <Flex direction="column" gap={1}>
              <Text fontSize="14px" lineHeight="20px" color="primary.900" fontWeight="bold">
                Country:
              </Text>
              <Text fontSize="16px" lineHeight="24px" color="neutral.900">
                Country
              </Text>
            </Flex>
            <Flex direction="column" gap={1}>
              <Text fontSize="14px" lineHeight="20px" color="primary.900" fontWeight="bold">
                Objectives:
              </Text>
              <Text fontSize="16px" lineHeight="24px" color="neutral.900">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse vestibulum in lorem in rutrum.
                Vestibulum in dictum turpis, id congue augue. Aliquam aliquam turpis iaculis bibendum fermentum. Nam
                pretium viverra ante, vel posuere arcu porttitor quis. Pellentesque a porttitor purus, a molestie orci.
                Quisque sodales porttitor leo nec dignissim. Morbi tincidunt leo tincidunt rutrum tristique. Mauris quis
                cursus sapien, vitae pellentesque mauris.{" "}
              </Text>
              <br />
              <Text fontSize="16px" lineHeight="24px" color="neutral.900">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse vestibulum in lorem in rutrum.
                Vestibulum in dictum turpis, id congue augue. Aliquam aliquam turpis iaculis bibendum fermentum. Nam
                pretium viverra ante, vel posuere arcu porttitor quis. Pellentesque a porttitor purus, a molestie orci.
                Quisque sodales porttitor leo nec dignissim. Morbi tincidunt leo tincidunt rutrum tristique. Mauris quis
                cursus sapien, vitae pellentesque mauris.{" "}
              </Text>
              <br />
              <Text fontSize="16px" lineHeight="24px" color="neutral.900">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse vestibulum in lorem in rutrum.
                Vestibulum in dictum turpis, id congue augue. Aliquam aliquam turpis iaculis bibendum fermentum. Nam
                pretium viverra ante, vel posuere arcu porttitor quis. Pellentesque a porttitor purus, a molestie orci.
                Quisque sodales porttitor leo nec dignissim. Morbi tincidunt leo tincidunt rutrum tristique. Mauris quis
                cursus sapien, vitae pellentesque mauris.{" "}
              </Text>
            </Flex>
          </Flex>
        </Accordion>
        <Accordion
          header={<AccordionHeader title="Tree Restoration Goals" status="success" />}
          actions={<EditButton onClick={() => console.log("Edit clicked")} />}
        >
          <div>content</div>
        </Accordion>
        <Accordion
          header={<AccordionHeader title="Land Restoration Goals" status="success" />}
          actions={<EditButton onClick={() => console.log("Edit clicked")} />}
        >
          <div>content</div>
        </Accordion>
        <Accordion
          header={<AccordionHeader title="Sitting Strategy" badge="2 require attention" status="error" />}
          actions={<EditButton onClick={() => console.log("Edit clicked")} />}
        >
          <div>content</div>
        </Accordion>
        <Accordion
          header={<AccordionHeader title="Nursery Strategy" />}
          actions={<EditButton onClick={() => console.log("Edit clicked")} />}
        >
          <div>content</div>
        </Accordion>
        <Accordion
          header={<AccordionHeader title="Socioeconomic Objectives" />}
          actions={<EditButton onClick={() => console.log("Edit clicked")} />}
        >
          <div>content</div>
        </Accordion>
        <Accordion
          header={<AccordionHeader title="Community Engagement" />}
          actions={<EditButton onClick={() => console.log("Edit clicked")} />}
        >
          <div>content</div>
        </Accordion>
      </Flex>
    </PageBody>
  );
};

export default ProjectDetailTab;

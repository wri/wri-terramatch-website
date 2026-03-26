import { Grid } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import classNames from "classnames";
import { Else, If, Then } from "react-if";
import type * as yup from "yup";

import { formatEntryValue } from "@/admin/apiProvider/utils/entryFormat";
import Text from "@/components/elements/Text/Text";
import { FormSummaryProps } from "@/components/extensive/WizardForm/FormSummary";
import { useGetFormEntries } from "@/components/extensive/WizardForm/FormSummaryRow/getFormEntries";
import { Framework, toFramework, useFramework } from "@/context/framework.provider";
import { useFieldsProvider, useFormEntities } from "@/context/wizardForm.provider";
import AttachFileItem from "@/pages/project/[uuid]/components/AttachFileItem";
import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import Accordion from "@/redesignComponents/containers/Accordion/Accordion";
import AccordionHeader from "@/redesignComponents/containers/Accordion/AccordionHeader";
import { EditIcon } from "@/redesignComponents/foundations/Icons";
import { EntityName } from "@/types/common";

import List from "../../List/List";
import GalleryEntryItem from "../../PageElements/PageContent/components/GalleryEntryItem";
import { isTrackingType } from "../../TrackingCollapseGrid/types";
import { useFormStepsWithValidation } from "../useFormStepsWithValidation";
import { ParsedFile, parseFilesFromHtml } from "./parseFilesFromHtml";

const MEDIA_EXTENSIONS = new Set(["jpg", "jpeg", "png", "gif", "webp", "svg", "mp4", "mov", "avi", "webm", "mkv"]);

const isMediaFile = (fileType: string) => MEDIA_EXTENSIONS.has(fileType.toLowerCase());

const renderPhotosAndVideos = (entry: any): JSX.Element | null => {
  if (typeof entry.value !== "string") return null;
  const images = parseFilesFromHtml(entry.value);
  if (images.length === 0) return <Text variant="text-body-500">-</Text>;
  return (
    <Grid templateColumns="repeat(4, minmax(0, 1fr))" gap={2}>
      {images.map(file => (
        <GalleryEntryItem
          key={file.fileUrl}
          src={file.fileUrl}
          name={file.fileType ? `${file.fileName}.${file.fileType}` : file.fileName}
          url={""}
        />
      ))}
    </Grid>
  );
};

const renderAdditionalDocumentation = (entry: any): JSX.Element | null => {
  if (typeof entry.value !== "string") return null;

  const files = parseFilesFromHtml(entry.value);
  if (files.length === 0) return null;

  const mediaFiles = files.filter(f => isMediaFile(f.fileType));
  const documentFiles = files.filter(f => !isMediaFile(f.fileType));

  return (
    <>
      {mediaFiles.length > 0 && (
        <Grid templateColumns="repeat(4, minmax(0, 1fr))" gap={2}>
          {mediaFiles.map((file: ParsedFile) => (
            <GalleryEntryItem
              key={file.fileUrl}
              src={file.fileUrl}
              name={file.fileType ? `${file.fileName}.${file.fileType}` : file.fileName}
              url={""}
            />
          ))}
        </Grid>
      )}
      {documentFiles.length > 0 && (
        <Grid templateColumns="repeat(2, minmax(0, 1fr))" gap={4}>
          {documentFiles.map((file: ParsedFile) => (
            <AttachFileItem
              key={file.fileUrl}
              fileName={file.fileName}
              onClick={() => window.open(file.fileUrl, "_blank")}
              fileType={file.fileType}
            />
          ))}
        </Grid>
      )}
    </>
  );
};

const customEntryRenderers: Record<string, (entry: any) => JSX.Element | null> = {
  "Additional Documentation": renderAdditionalDocumentation,
  "If you have any additional documentation on your site you would like to share, please add it below.":
    renderAdditionalDocumentation,
  "Photos and videos": renderPhotosAndVideos
};

const getFieldsRequiringAttentionCount = (
  validation: yup.ObjectSchema<Record<string, unknown>>,
  values: Record<string, unknown> | undefined
): number => {
  if (values == null) return 0;
  try {
    validation.validateSync(values, { abortEarly: false });
    return 0;
  } catch (err: unknown) {
    const yupError = err as { inner?: unknown[] };
    return yupError.inner?.length ?? 0;
  }
};

export interface FormSummaryRowProps extends FormSummaryProps {
  type?: EntityName;
  stepId: string;
  index: number;
  nullText?: string;
}

const FormSummaryRow = ({ stepId, index, ...props }: FormSummaryRowProps) => {
  const t = useT();
  const fieldsProvider = useFieldsProvider();
  const { title } = fieldsProvider.step(stepId) ?? {};
  const frameworkKey = useFramework();
  const framework = toFramework(frameworkKey) as Framework;
  const stepsWithValidation = useFormStepsWithValidation(fieldsProvider, framework);
  const validation = stepsWithValidation[index].validation;
  const valid = props.values == null || validation.isValidSync(props.values);
  const fieldsRequiringAttention = getFieldsRequiringAttentionCount(validation, props.values);
  const entities = useFormEntities();
  const entries = useGetFormEntries({ stepId, ...props, entity: entities[0] });
  return (
    <Accordion
      variant="primary"
      header={
        <AccordionHeader
          title={title ?? ""}
          badge={
            !valid && fieldsRequiringAttention > 0
              ? t("{count} requires attention", { count: fieldsRequiringAttention })
              : undefined
          }
          status={valid ? "complete" : "error"}
        />
      }
      actions={
        props.onEdit ? (
          <Button variant="secondary" size="small" leftIcon={<EditIcon />} onClick={() => props.onEdit?.(index)}>
            {t("Edit")}
          </Button>
        ) : undefined
      }
    >
      <List
        className="flex flex-col gap-4"
        items={entries}
        render={entry => {
          const CustomRenderer = customEntryRenderers[entry.title as keyof typeof customEntryRenderers];

          if (CustomRenderer) {
            return <CustomRenderer {...entry} />;
          }

          return (
            <>
              <div
                className={classNames("flex items-start gap-12 transition-all delay-300 duration-300", {
                  "w-full flex-col": isTrackingType(entry.value?.props?.type)
                })}
              >
                <Text variant="text-body-500" className=" flex-1">
                  {entry.title}
                </Text>
                <div
                  className={classNames("flex-1", {
                    "w-full !min-w-full": isTrackingType(entry.value?.props?.type)
                  })}
                >
                  <If condition={typeof entry.value === "string" || typeof entry.value === "number"}>
                    <Then>
                      <Text variant="text-body-300" className="flex-1" containHtml>
                        {formatEntryValue(entry.value)}
                      </Text>
                    </Then>
                    <Else>
                      <div
                        className={classNames("", {
                          "w-full !min-w-full": isTrackingType(entry.value?.props?.type)
                        })}
                      >
                        {formatEntryValue(entry.value)}
                      </div>
                    </Else>
                  </If>
                </div>
              </div>
            </>
          );
        }}
      />
    </Accordion>
  );
};

export default FormSummaryRow;

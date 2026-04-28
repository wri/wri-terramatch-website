import { Box } from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useT } from "@transifex/react";
import classNames from "classnames";
import { Dictionary } from "lodash";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { useForm, UseFormProps, UseFormReturn } from "react-hook-form";
import { twMerge } from "tailwind-merge";

import AdminLinkWrapper from "@/components/elements/AdminLinkWrapper/AdminLinkWrapper";
import Tabs, { TabItem } from "@/components/elements/Tabs/Default/Tabs";
import { FormStep } from "@/components/extensive/WizardForm/FormStep";
import { useFormNavigation } from "@/components/extensive/WizardForm/useFormNavigation";
import { useFormStepsWithValidation } from "@/components/extensive/WizardForm/useFormStepsWithValidation";
import FrameworkProvider, { Framework, toFramework } from "@/context/framework.provider";
import { useModalContext } from "@/context/modal.provider";
import WizardFormProvider, {
  FormFieldsProvider,
  FormModel,
  FormModelsDefinition,
  OrgFormDetails,
  ProjectFormDetails,
  useFieldsProvider
} from "@/context/wizardForm.provider";
import { ErrorWrapper } from "@/generated/apiFetcher";
import { entityLinkHeaderMap, mapEntityTitle, mapStatusToTagState } from "@/helpers/entityFormLinkHeader";
import { useDebounce } from "@/hooks/useDebounce";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { useOnMount } from "@/hooks/useOnMount";
import { useReportingWindow } from "@/hooks/useReportingWindow";
import { useValueChanged } from "@/hooks/useValueChanged";
import PageHeader from "@/redesignComponents/content/headers/PageHeaders/PageHeader";
import { ProjectIcon } from "@/redesignComponents/foundations/Icons/NavigationSections/ProjectIcon";
import ToolbarObject from "@/redesignComponents/navigation/Toolbar/ToolbarObject";
import InlineMessage from "@/redesignComponents/status/InlineMessage/InlineMessage";
import Log from "@/utils/log";

import { ModalId } from "../Modal/ModalConst";
import { hasFeedbackInStep } from "./feedbackUtils";
import { FormFooter } from "./FormFooter";
import { FormSummaryOptions } from "./FormSummary";
import SaveAndCloseModal, { SaveAndCloseModalProps } from "./modals/SaveAndCloseModal";
import SummaryItem from "./SummaryItem";
import { downloadAnswersCSV } from "./utils";

export type WizardFormEntity = {
  uuid?: string | null;
  frameworkKey?: string | null;
  dueAt?: string | null;
  status?: string | null;
  title?: string | null;
  name?: string | null;
  organisationName?: string | null;
  organisationUuid?: string | null;
  fundingProgrammeName?: string | null;
  projectName?: string | null;
  projectUuid?: string | null;
  taskUuid?: string | null;
  feedback?: string | null;
  feedbackFields?: string[] | null;
};

export interface WizardFormProps {
  fieldsProvider: FormFieldsProvider;
  models: FormModelsDefinition;
  orgDetails?: OrgFormDetails;
  projectDetails?: ProjectFormDetails;

  framework: Framework;

  defaultValues?: any;
  onStepChange?: (values: any) => void;
  onChange?: (values: Dictionary<any>, isCloseAndSave?: boolean) => void;
  onSubmit?: (values: any) => void;
  onBackFirstStep: () => void;
  onCloseForm?: () => void;

  formStatus?: "saving" | "saved";
  title?: string;
  subtitle?: string;
  errors?: ErrorWrapper<null>;
  summaryOptions?: FormSummaryOptions & {
    downloadButtonText?: string;
  };

  header?: {
    hide?: boolean;
  };

  // Footer
  nextButtonText?: string;
  submitButtonText?: string;
  submitButtonDisable?: boolean;
  backButtonText?: string;
  hideBackButton?: boolean;
  hideSaveAndCloseButton?: boolean;

  saveAndCloseModal?: SaveAndCloseModalProps;

  disableAutoProgress?: boolean;
  disableInitialAutoProgress?: boolean;

  initialStepIndex?: number;
  roundedCorners?: boolean;
  className?: string;
  cancelEditForm?: () => void;
  redirectEntityPage?: string;

  adminListPath?: string;
  entity?: WizardFormEntity;
}

function WizardForm(props: WizardFormProps) {
  const { entity } = props;
  const t = useT();
  const modal = useModalContext();
  const { selectedStepIndex, setSelectedStepIndex } = useFormNavigation(props.fieldsProvider);
  const steps = useFormStepsWithValidation(props.fieldsProvider, props.framework);
  const selectedSection = selectedStepIndex < 0 ? undefined : steps[selectedStepIndex];
  const isAdmin = useIsAdmin();
  const reportingWindow = useReportingWindow(toFramework(entity?.frameworkKey), entity?.dueAt!);
  const taskTitle = t("Reporting Task {window}", { window: reportingWindow });
  const fieldsProvider = useFieldsProvider();

  const lastIndex = props.summaryOptions ? steps.length : steps.length - 1;
  const formHook: UseFormReturn = useForm(
    useMemo(
      (): UseFormProps => ({
        defaultValues: props.defaultValues,
        mode: "onTouched",
        resolver: selectedSection?.validation == null ? undefined : yupResolver(selectedSection.validation)
      }),
      [props.defaultValues, selectedSection?.validation]
    )
  );

  useValueChanged(selectedStepIndex, () => {
    // Force validation on all fields when the step changes
    if (selectedStepIndex >= 0) formHook.trigger();
  });

  const formHasError = useRef(false);
  formHasError.current = Object.values(formHook.formState.errors ?? {}).length > 0;

  const hasErrorInAnyStep = steps.some(({ validation }) => !validation.isValidSync(formHook.getValues()));

  Log.debug("Form Values", formHook.watch());
  Log.debug("Form Errors", formHook.formState.errors);

  const { onChange } = props;
  const _onChange = useDebounce(
    useCallback(() => {
      if (!formHasError.current) onChange?.(formHook.getValues());
    }, [formHook, onChange]),
    // Send an update to the server at most once per second
    1000
  );

  const onSubmitStep = useCallback(
    (data: any) => {
      if (selectedStepIndex < lastIndex) {
        // Step changes through 0 - last step
        if (!props.disableAutoProgress) {
          // Disable auto step progress if disableAutoProgress was passed
          setSelectedStepIndex(n => n + 1);
        }
        let values = formHook.getValues();
        values = { ...values };
        props.onChange?.(values, true);
        props.onStepChange?.(data);
        formHook.reset(values);
        formHook.clearErrors();
      } else {
        // Step changes on last step
        if (props.onSubmit == null) return props.onStepChange?.(data);
        props.onSubmit(data);
      }
    },
    [formHook, lastIndex, props, selectedStepIndex, setSelectedStepIndex]
  );

  const onClickSaveAndClose = useCallback(() => {
    let values = formHook.getValues();
    values = { ...values };

    props.onChange?.(values, true);
    formHook.reset(values);
    modal.openModal(
      ModalId.SAVE_AND_CLOSE_MODAL,
      <SaveAndCloseModal
        {...props.saveAndCloseModal}
        onConfirm={props.saveAndCloseModal?.onConfirm || props.onCloseForm || props.onBackFirstStep}
      />
    );
  }, [formHook, modal, props]);

  const onClickSaveAndExit = useCallback(() => {
    if (isAdmin) {
      let values = formHook.getValues();
      values = { ...values };

      props.onChange?.(values, true);
      formHook.reset(values);
      props.onSubmit?.(values);
      return;
    }

    onClickSaveAndClose();
  }, [formHook, isAdmin, onClickSaveAndClose, props]);

  const onClickSaveChanges = useCallback(() => {
    if (isAdmin) {
      formHook.handleSubmit(onSubmitStep)();
      return;
    }
    onClickSaveAndClose();
  }, [onClickSaveAndClose, isAdmin, formHook, onSubmitStep]);

  useEffect(() => {
    if (props.errors != null) {
      formHook.clearErrors();
      props.errors.errors?.forEach(error => {
        formHook.setError(error.source, {
          message: error.detail,
          type: error.code
        });
      });
    }
    formHook.reset(formHook.getValues());
  }, [formHook, props.errors]);

  useOnMount(() => {
    // We linked directly to a step; stay on that step.
    if (selectedStepIndex >= 0) return;

    if (props.disableAutoProgress || props.disableInitialAutoProgress) {
      // We don't auto progress, so either use the initial step or default to 0;
      setSelectedStepIndex(props.initialStepIndex ?? 0);
      return;
    }

    // Find the first invalid step or go straight to the last step.
    const stepIndex = steps.findIndex(({ validation }) => !validation.isValidSync(props.defaultValues));
    setSelectedStepIndex(stepIndex < 0 ? lastIndex : stepIndex);
  });

  useLayoutEffect(() => {
    document.getElementById("step")?.scrollTo({ top: 0 });
  }, [selectedStepIndex]);

  const isEntityApproved = entity?.status == "approved";
  const formModel = props?.models as FormModel;
  const renderStep = useCallback(
    (stepId: string, title: string | null, index: number) => (
      <div
        className={classNames("h-full overflow-auto pr-[12px]", {
          "h-[calc(100vh-354px)] md:h-[calc(100vh-355px)] lg:h-[calc(100vh-355px)]": isAdmin
        })}
      >
        {index === 0 && title === "Site Overview" && (
          <div className="w-full bg-white pt-8 pl-20">
            <InlineMessage
              size="full-width"
              label={t("Note")}
              caption={t(
                "To edit your site polygons, close this form and edit directly on the new map interface located at the bottom of the site landing page."
              )}
              variant="info-grey"
            />
          </div>
        )}
        <FormStep id="step" stepId={stepId} formHook={formHook} onChange={_onChange} />
        <FormFooter
          className={classNames(
            "absolute right-0 left-0 z-20 shadow-[0_-2px_6px_-1px_rgba(0,0,0,0.10)]",
            isAdmin ? "bottom-0" : "bottom-[0px]"
          )}
          cancelButtonProps={undefined}
          primaryButtonProps={{
            children: t(`${selectedStepIndex === lastIndex ? "Submit" : "Next"}`),
            disabled: hasErrorInAnyStep && selectedStepIndex === lastIndex,
            onClick: formHook.handleSubmit(onSubmitStep, onSubmitStep)
          }}
          secondaryButtonProps={
            formModel?.model != "organisations"
              ? {
                  children: t("Save and Exit"),
                  onClick: () => {
                    if (isAdmin) {
                      formHook.handleSubmit(onSubmitStep, onSubmitStep);
                      props.onSubmit?.(formHook.getValues());
                    } else {
                      onClickSaveAndClose();
                    }
                  }
                }
              : {
                  children: t("Save and Exit"),
                  onClick: () => {
                    props.onSubmit?.(formHook.getValues());
                  }
                }
          }
          tertiaryButtonProps={{
            children: t("Download"),
            onClick: () => downloadAnswersCSV(fieldsProvider, formHook.getValues())
          }}
        />
      </div>
    ),
    [
      t,
      formHook,
      _onChange,
      selectedStepIndex,
      lastIndex,
      isAdmin,
      onClickSaveAndClose,
      props,
      onSubmitStep,
      hasErrorInAnyStep,
      formModel?.model,
      fieldsProvider
    ]
  );

  const stepsVisited = useRef<number[]>([]);
  const stepTabItems = useMemo(
    (): TabItem[] =>
      steps.map(({ id, title, validation }, index) => {
        const hasFeedback = hasFeedbackInStep(props.fieldsProvider, id, entity?.feedbackFields);

        const state: TabItem["state"] = hasFeedback
          ? "error"
          : validation.isValidSync(formHook.getValues())
          ? stepsVisited.current.includes(index)
            ? "complete"
            : "unstarted"
          : "error";
        return {
          title: t(`{title}`, { title }),
          state,
          renderBody: () => {
            if (!stepsVisited.current.includes(index)) stepsVisited.current.push(index);
            return renderStep(id, title ?? null, index);
          }
        };
      }),
    [entity?.feedbackFields, formHook, props.fieldsProvider, renderStep, steps, t]
  );

  const summaryItem = useMemo(
    (): TabItem => ({
      title: t(`{title}`, { title: props.summaryOptions?.title }),
      renderBody: () => {
        const submitButtonDisable =
          props.submitButtonDisable ||
          steps.find(({ validation }) => !validation.isValidSync(formHook.getValues())) != null;
        return (
          <SummaryItem
            title={props.summaryOptions?.title!}
            subtitle={props.summaryOptions?.subtitle}
            formHook={formHook}
            downloadButtonText={props.summaryOptions?.downloadButtonText}
            setSelectedStepIndex={setSelectedStepIndex}
            onSubmitStep={onSubmitStep}
            submitButtonDisable={submitButtonDisable}
            models={props.models}
            enableSaveChangesButton={isEntityApproved}
            saveChanges={() => onClickSaveChanges()}
            onSaveAndExit={onClickSaveAndExit}
            feedback={entity?.feedback}
            feedbackFields={entity?.feedbackFields}
          />
        );
      }
    }),
    [
      t,
      props.summaryOptions?.title,
      props.summaryOptions?.subtitle,
      props.summaryOptions?.downloadButtonText,
      props.submitButtonDisable,
      props.models,
      steps,
      formHook,
      setSelectedStepIndex,
      onSubmitStep,
      isEntityApproved,
      onClickSaveChanges,
      onClickSaveAndExit,
      entity?.feedback,
      entity?.feedbackFields
    ]
  );

  const tabItems: TabItem[] = props.summaryOptions == null ? stepTabItems : [...stepTabItems, summaryItem];

  const orgDetails = useMemo(
    (): OrgFormDetails => ({ title: props.title, ...props.orgDetails }),
    [props.orgDetails, props.title]
  );

  const isSubmissionModel = Array.isArray(props?.models) && props?.models?.length > 1;

  const linkHeaderMap = useMemo(() => {
    if (isSubmissionModel) {
      return [
        ...(entity
          ? [
              {
                label: `${entity?.organisationName} - ${entity?.fundingProgrammeName}`,
                link: props.redirectEntityPage ?? "/my-projects"
              }
            ]
          : []),
        { label: t("Edit"), link: `/form/submission/${entity?.uuid ?? ""}` }
      ];
    } else if (formModel?.model == "organisations") {
      return [{ label: t("Edit"), link: `/organization/create?uuid=${entity?.uuid ?? ""}` }];
    } else if (formModel?.model) {
      return entityLinkHeaderMap({
        isAdmin,
        model: formModel.model,
        uuid: formModel.uuid ?? props?.entity?.uuid,
        redirectEntityPage: props.redirectEntityPage,
        adminListPath: props.adminListPath,
        entity: entity,
        firstLinkIcon: <ProjectIcon className="!text-theme-primary-900" />,
        t,
        taskTitle
      })[formModel.model];
    }
    return [];
  }, [props, t, entity, isSubmissionModel, taskTitle, isAdmin, formModel?.model, formModel?.uuid]);

  const pageHeaderTitle = useMemo(() => {
    if (isSubmissionModel) {
      return entity?.organisationName != null || entity?.fundingProgrammeName != null
        ? `${entity?.organisationName ?? ""} - ${entity?.fundingProgrammeName ?? ""}`
        : t("Unnamed Application");
    } else {
      return mapEntityTitle(entity?.title ?? entity?.name ?? null, formModel?.model ?? "", t);
    }
  }, [formModel?.model, t, entity, isSubmissionModel]);

  return selectedStepIndex < 0 ? null : (
    <div className={classNames("relative", { "h-full": !isAdmin })}>
      <FrameworkProvider frameworkKey={props.framework}>
        <WizardFormProvider
          models={props.models}
          fieldsProvider={props.fieldsProvider}
          orgDetails={orgDetails}
          projectDetails={props.projectDetails}
        >
          <div className={twMerge("flex h-full w-full flex-col", props.className)}>
            {entity != null && (
              <Box background={"neutral.200"} className={classNames("sticky top-0 z-20 pb-1")}>
                {!isAdmin && <ToolbarObject breadcrumbs={{ links: linkHeaderMap, linkRouter: AdminLinkWrapper }} />}
                <div className="bg-theme-neutral-300 pt-[1px]">
                  <PageHeader
                    title={pageHeaderTitle}
                    label={t("Set Up Status:")}
                    tag={
                      mapStatusToTagState(entity?.status) ? { state: mapStatusToTagState(entity?.status)! } : undefined
                    }
                  />
                </div>
              </Box>
            )}
            <Tabs
              onChangeSelected={setSelectedStepIndex}
              selectedIndex={selectedStepIndex}
              tabItems={tabItems}
              itemOption={{}}
              carouselOptions={{
                slidesPerView: 3
              }}
            />
          </div>
        </WizardFormProvider>
      </FrameworkProvider>
    </div>
  );
}

export default WizardForm;

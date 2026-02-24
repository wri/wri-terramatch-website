import { Box, Link } from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useT } from "@transifex/react";
import classNames from "classnames";
import { Dictionary } from "lodash";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { forwardRef } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { twMerge } from "tailwind-merge";

import Tabs, { TabItem } from "@/components/elements/Tabs/Default/Tabs";
import Text from "@/components/elements/Text/Text";
import { FormStep } from "@/components/extensive/WizardForm/FormStep";
import { useFormNavigation } from "@/components/extensive/WizardForm/useFormNavigation";
import { useFormStepsWithValidation } from "@/components/extensive/WizardForm/useFormStepsWithValidation";
import FrameworkProvider, { Framework, toFramework } from "@/context/framework.provider";
import { useModalContext } from "@/context/modal.provider";
import WizardFormProvider, {
  FormFieldsProvider,
  FormModelsDefinition,
  OrgFormDetails,
  ProjectFormDetails
} from "@/context/wizardForm.provider";
import { ErrorWrapper } from "@/generated/apiFetcher";
import { entityLinkHeaderMap, mapEntityTitle, mapStatusToTagState } from "@/helpers/entityFormLinkHeader";
import { useDebounce } from "@/hooks/useDebounce";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { useOnMount } from "@/hooks/useOnMount";
import { useReportingWindow } from "@/hooks/useReportingWindow";
import { useValueChanged } from "@/hooks/useValueChanged";
import PageHeader from "@/redesignComponents/content/headers/PageHeaders/PageHeader";
import { ChevronRight } from "@/redesignComponents/foundations/Icons/ChevronRight";
import { Project } from "@/redesignComponents/foundations/Icons/Project";
import ToolbarObject from "@/redesignComponents/navigation/Toolbar/ToolbarObject";
import Log from "@/utils/log";

import { ModalId } from "../Modal/ModalConst";
import { FormFooter } from "./FormFooter";
import { FormSummaryOptions } from "./FormSummary";
import SaveAndCloseModal, { SaveAndCloseModalProps } from "./modals/SaveAndCloseModal";
import SummaryItem from "./SummaryItem";
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
  redirectEntityPage: string;

  entity?: any;
  entityLoading?: boolean;
}

// Wrapper component to handle both relative routes (Next.js Link) and full URLs (window.location)
const AdminLinkWrapper = forwardRef<HTMLAnchorElement, { to?: string; children?: React.ReactNode; className?: string }>(
  ({ to, children, className, ...props }, ref) => {
    const isFullUrl = to?.startsWith("http://") || to?.startsWith("https://");

    if (isFullUrl) {
      return (
        <a
          ref={ref}
          href={to}
          className={className}
          onClick={e => {
            e.preventDefault();
            if (to) window.location.href = to;
          }}
          {...props}
        >
          {children}
        </a>
      );
    }

    return (
      <Link ref={ref} href={to || "#"} className={className} {...props}>
        {children}
      </Link>
    );
  }
);

AdminLinkWrapper.displayName = "AdminLinkWrapper";

function WizardForm(props: WizardFormProps) {
  const { entity, entityLoading } = props;
  const t = useT();
  const modal = useModalContext();
  const { selectedStepIndex, setSelectedStepIndex } = useFormNavigation(props.fieldsProvider);
  const steps = useFormStepsWithValidation(props.fieldsProvider, props.framework);
  const selectedSection = selectedStepIndex < 0 ? undefined : steps[selectedStepIndex];
  const isAdmin = useIsAdmin();
  const reportingWindow = useReportingWindow(toFramework(entity?.frameworkKey), entity?.dueAt as string);
  const taskTitle = t("Reporting Task {window}", { window: reportingWindow });

  const lastIndex = props.summaryOptions ? steps.length : steps.length - 1;
  const formHook: UseFormReturn = useForm(
    useMemo(
      () =>
        selectedSection?.validation != null
          ? {
              resolver: yupResolver(selectedSection?.validation),
              defaultValues: props.defaultValues,
              mode: "onTouched"
            }
          : { mode: "onTouched" },
      [props.defaultValues, selectedSection?.validation]
    )
  );

  useValueChanged(selectedStepIndex, () => {
    // Force validation on all fields when the step changes
    if (selectedStepIndex >= 0) formHook.trigger();
  });

  const formHasError = useRef(false);
  formHasError.current = Object.values(formHook.formState.errors ?? {}).length > 0;

  Log.debug("Form Values", formHook.watch());
  Log.debug("Form Errors", formHook.formState.errors);

  const { onChange } = props;
  const _onChange = useDebounce(
    useCallback(() => !formHasError.current && onChange?.(formHook.getValues()), [formHook, onChange]),
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

  useValueChanged(props.defaultValues, () => {
    if (props.defaultValues != null) {
      for (const [key, value] of Object.entries(props.defaultValues)) {
        formHook.setValue(key, value);
      }
    }
  });

  useLayoutEffect(() => {
    document.getElementById("step")?.scrollTo({ top: 0 });
  }, [selectedStepIndex]);

  const renderStep = useCallback(
    (stepId: string, title: string | null, index: number) => (
      <div className="overflow-auto sm:h-[calc(100vh-218px)] md:h-[calc(100vh-256px)] lg:h-[calc(100vh-268px)]">
        {index === 0 && title === "Site Overview" && (
          <div className="w-full bg-white px-16 pt-8">
            <div className="rounded-lg bg-tertiary-80 p-6">
              <Text variant="text-16-bold" className="text-white">
                {t(
                  `Note: To edit your site polygons, close this form and edit directly on the new map interface located at the bottom of the site landing page.`
                )}
              </Text>
            </div>
          </div>
        )}
        <FormStep id="step" stepId={stepId} formHook={formHook} onChange={_onChange} className="pb-24" />
        <FormFooter
          className={classNames(
            "absolute right-0 left-0 z-20 shadow-[0_-2px_6px_-1px_rgba(0,0,0,0.10)]",
            isAdmin ? "bottom-0" : "bottom-[0px]"
          )}
          ButtonLeft={{
            children: "Cancel",
            onClick: () => {
              if (isAdmin) {
                props.onSubmit?.(formHook.getValues());
              } else {
                props.cancelEditForm?.();
              }
            }
          }}
          ButtonPrimary={{
            children: "Next",
            onClick: formHook.handleSubmit(onSubmitStep, onSubmitStep)
          }}
          ButtonSecondary={{
            children: "Save and Exit",
            onClick: () => {
              if (isAdmin) {
                formHook.handleSubmit(onSubmitStep, onSubmitStep);
                props.onSubmit?.(formHook.getValues());
              } else {
                onClickSaveAndClose();
              }
            }
          }}
          ButtonTertiary={
            !props.hideBackButton
              ? {
                  children: "Previous",
                  leftIcon: <ChevronRight className="rotate-180" />,
                  onClick: () => {
                    if (selectedStepIndex > 0) {
                      setSelectedStepIndex(n => n - 1);
                    } else {
                      props.onBackFirstStep();
                    }
                  }
                }
              : {}
          }
        />
      </div>
    ),
    [t, formHook, _onChange, selectedStepIndex, setSelectedStepIndex, isAdmin, onClickSaveAndClose, props, onSubmitStep]
  );

  const stepsVisited = useRef<number[]>([]);
  const stepTabItems = useMemo(
    (): TabItem[] =>
      steps.map(({ id, title, validation }, index) => {
        const state: TabItem["state"] = validation.isValidSync(formHook.getValues())
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
    [formHook, renderStep, steps, t]
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
      onSubmitStep
    ]
  );

  const tabItems: TabItem[] = props.summaryOptions == null ? stepTabItems : [...stepTabItems, summaryItem];

  const orgDetails = useMemo(
    (): OrgFormDetails => ({ title: props.title, ...props.orgDetails }),
    [props.orgDetails, props.title]
  );

  const isSubmissionModel = props.models?.[0]?.model == "organisations" && props.models?.[1]?.model == "projectPitches";

  const linkHeaderMap = useMemo(() => {
    if (isSubmissionModel) {
      return [
        ...(entity
          ? [{ label: `${entity?.organisationName} - ${entity?.fundingProgrammeName}`, link: props.redirectEntityPage }]
          : []),
        { label: t("Edit"), link: `/form/submission/${entity?.uuid ?? ""}` }
      ];
    } else if (props?.models?.model == "organisations") {
      return [{ label: t("Edit"), link: `/organization/create?uuid=${entity?.uuid ?? ""}` }];
    } else {
      return entityLinkHeaderMap({
        isAdmin,
        model: props.models?.model,
        uuid: props.models?.uuid ?? props?.entity?.uuid,
        redirectEntityPage: props.redirectEntityPage,
        entity: entity,
        firstLinkIcon: <Project className="!text-theme-primary-900" />,
        t,
        taskTitle
      })[props.models?.model];
    }
  }, [props, t, entity, isSubmissionModel, taskTitle, isAdmin]);

  const pageHeaderTitle = useMemo(() => {
    if (isSubmissionModel) {
      return entity?.organisationName || entity?.fundingProgrammeName
        ? `${entity?.organisationName} - ${entity?.fundingProgrammeName}`
        : t("Unnamed Application");
    } else {
      return mapEntityTitle(entity?.title ?? entity?.name, props.models?.model, t);
    }
  }, [props.models, t, entity, isSubmissionModel]);

  return selectedStepIndex < 0 ? null : (
    <div className="relative">
      <FrameworkProvider frameworkKey={props.framework}>
        <WizardFormProvider
          models={props.models}
          fieldsProvider={props.fieldsProvider}
          orgDetails={orgDetails}
          projectDetails={props.projectDetails}
        >
          <div className={twMerge("flex w-full flex-col", props.className)}>
            {entityLoading && (
              <Box className={classNames("sticky z-20 px-1", isAdmin ? "top-0" : "top-[70px]")}>
                <ToolbarObject breadcrumbs={{ links: linkHeaderMap, linkRouter: Link }} />
                <PageHeader
                  title={pageHeaderTitle}
                  label="Set Up Status:"
                  tag={
                    mapStatusToTagState(entity?.status) ? { state: mapStatusToTagState(entity?.status)! } : undefined
                  }
                />
              </Box>
            )}
            <Tabs
              onChangeSelected={setSelectedStepIndex}
              selectedIndex={selectedStepIndex}
              tabItems={tabItems}
              rounded={props.roundedCorners}
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

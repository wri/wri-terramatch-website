import { yupResolver } from "@hookform/resolvers/yup";
import { useT } from "@transifex/react";
import { memo, useEffect, useLayoutEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { When } from "react-if";
import { twMerge } from "tailwind-merge";

import Tabs, { TabItem } from "@/components/elements/Tabs/Default/Tabs";
import Text from "@/components/elements/Text/Text";
import { FormStep } from "@/components/extensive/WizardForm/FormStep";
import { FormStepSchema } from "@/components/extensive/WizardForm/types";
import { useModalContext } from "@/context/modal.provider";
import { ErrorWrapper } from "@/generated/apiFetcher";
import { useDebounce } from "@/hooks/useDebounce";
import Log from "@/utils/log";

import { ModalId } from "../Modal/ModalConst";
import { FormFooter } from "./FormFooter";
import { WizardFormHeader } from "./FormHeader";
import FormSummary, { FormSummaryOptions } from "./FormSummary";
import SaveAndCloseModal, { SaveAndCloseModalProps } from "./modals/SaveAndCloseModal";
import { downloadAnswersCSV, getSchema } from "./utils";

export interface WizardFormProps {
  steps: FormStepSchema[];
  defaultValues?: any;
  onStepChange?: (values: any, step: FormStepSchema) => void;
  onChange?: (values: any, isCloseAndSave?: boolean) => void;
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

  tabOptions?: {
    disableFutureTabs?: boolean;
    markDone?: boolean;
  };

  saveAndCloseModal?: SaveAndCloseModalProps;

  disableAutoProgress?: boolean;
  disableInitialAutoProgress?: boolean;

  initialStepIndex?: number;
  roundedCorners?: boolean;
  className?: string;
}

function WizardForm(props: WizardFormProps) {
  const t = useT();
  const modal = useModalContext();
  const [selectedStepIndex, setSelectedStepIndex] = useState(props.initialStepIndex ?? 0);
  const selectedStep = props.steps?.[selectedStepIndex];
  const selectedValidationSchema = selectedStep ? getSchema(selectedStep.fields) : undefined;
  const lastIndex = props.summaryOptions ? props.steps.length : props.steps.length - 1;
  const formHook = useForm(
    selectedValidationSchema
      ? {
          resolver: yupResolver(selectedValidationSchema),
          defaultValues: props.defaultValues,
          mode: "onTouched"
        }
      : { mode: "onTouched" }
  );

  useEffect(() => {
    // Force validation on all fields when the step changes
    formHook.trigger();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedStep]);

  const formHasError = Object.values(formHook.formState.errors || {}).filter(item => !!item).length > 0;

  Log.debug("Form Steps", props.steps);
  Log.debug("Form Values", formHook.watch());
  Log.debug("Form Errors", formHook.formState.errors);

  const onChange = useDebounce(() => !formHasError && props.onChange?.(formHook.getValues()));

  const onSubmitStep = (data: any) => {
    if (selectedStepIndex < lastIndex) {
      //Step changes through 0 - last step
      if (!props.disableAutoProgress) {
        //Disable auto step progress if disableAutoProgress was passed
        setSelectedStepIndex(n => n + 1);
      }
      props.onChange?.(formHook.getValues());
      props.onStepChange?.(data, selectedStep);
      formHook.clearErrors();
    } else {
      //Step changes on last step
      if (!props.onSubmit) return props.onStepChange?.(data, selectedStep);
      props.onSubmit?.(data);
    }
  };

  const onClickSaveAndClose = () => {
    props.onChange?.(formHook.getValues(), true);
    modal.openModal(
      ModalId.SAVE_AND_CLOSE_MODAL,
      <SaveAndCloseModal
        {...props.saveAndCloseModal}
        onConfirm={props.saveAndCloseModal?.onConfirm || props.onCloseForm || props.onBackFirstStep}
      />
    );
  };

  useEffect(() => {
    if (props.errors) {
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

  useEffect(() => {
    if (props.disableAutoProgress || props.disableInitialAutoProgress) return;

    const stepIndex = props.steps.findIndex(step => !getSchema(step.fields).isValidSync(props.defaultValues));

    // If none of the steps has an invalid field, use the last step
    setSelectedStepIndex(stepIndex < 0 ? lastIndex : stepIndex);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (props.defaultValues) {
      for (const [key, value] of Object.entries(props.defaultValues)) {
        formHook.setValue(key, value);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.defaultValues]);

  useLayoutEffect(() => {
    document.getElementById("step")?.scrollTo({ top: 0 });
  }, [selectedStepIndex]);

  const stepTabItems = props.steps.map((step, index) => ({
    title:
      step.tabTitle ??
      t(`Step {number}<br/> <p className="text-14-light">{title} </p>`, { number: index + 1, title: step.title }),
    done: props.tabOptions?.markDone && index < selectedStepIndex,
    disabled: props.tabOptions?.disableFutureTabs && index > selectedStepIndex,
    body: (
      <div className="h-[calc(100vh-287px)] overflow-auto">
        {index === 0 && step.title === "Site Overview" && (
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
        <FormStep
          id="step"
          formHook={formHook}
          fields={step.fields}
          title={step.title}
          subtitle={step.subtitle}
          onChange={onChange}
        >
          <FormFooter
            className="mt-12"
            backButtonProps={
              !props.hideBackButton
                ? {
                    children: props.backButtonText || t("Back"),
                    onClick: () => {
                      if (selectedStepIndex > 0) {
                        setSelectedStepIndex(n => n - 1);
                      } else {
                        props.onBackFirstStep();
                      }
                    }
                  }
                : undefined
            }
            submitButtonProps={{
              children:
                selectedStepIndex < lastIndex
                  ? props.nextButtonText ?? t("Save and continue")
                  : props.submitButtonText ?? t("Submit"),
              onClick: formHook.handleSubmit(onSubmitStep),
              disabled: (selectedStepIndex === lastIndex && props.submitButtonDisable) || formHasError
            }}
          />
        </FormStep>
      </div>
    )
  }));

  const summaryItem = {
    title: t(`Step {number}<br/> {title}`, { number: lastIndex + 1, title: props.summaryOptions?.title }),
    done: props.tabOptions?.markDone && props.steps.length < selectedStepIndex,
    disabled: props.tabOptions?.disableFutureTabs && props.steps.length > selectedStepIndex,
    body: (
      <FormStep
        id="step"
        formHook={formHook}
        title={props.summaryOptions?.title!}
        subtitle={props.summaryOptions?.subtitle}
        onChange={onChange}
        actionButtonProps={
          props.summaryOptions?.downloadButtonText
            ? {
                children: props.summaryOptions?.downloadButtonText,
                onClick: () => downloadAnswersCSV(props.steps, formHook.getValues())
              }
            : undefined
        }
        className="h-[calc(100vh-287px)] overflow-auto"
      >
        <FormSummary values={formHook.getValues()} steps={props.steps} onEdit={setSelectedStepIndex} />
        <FormFooter
          className="mt-14"
          backButtonProps={{
            children: t("Back"),
            onClick: () => setSelectedStepIndex(n => n - 1)
          }}
          submitButtonProps={{
            children: t("Submit"),
            onClick: formHook.handleSubmit(onSubmitStep),
            disabled: props.submitButtonDisable
          }}
        />
      </FormStep>
    )
  };

  const tebItems: TabItem[] = props.summaryOptions ? [...stepTabItems, summaryItem] : stepTabItems;

  return (
    <div>
      <When condition={!props.header?.hide}>
        <WizardFormHeader
          currentStep={selectedStepIndex + 1}
          numberOfSteps={tebItems.length}
          formStatus={props.formStatus}
          errorMessage={props.errors && t("Something went wrong")}
          onClickSaveAndCloseButton={!props.hideSaveAndCloseButton ? onClickSaveAndClose : undefined}
          title={props.title}
          subtitle={props.subtitle}
        />
      </When>
      <div className={twMerge("mx-auto mt-0 max-w-[82vw] px-6 py-10 xl:px-0", props.className)}>
        <Tabs
          onChangeSelected={setSelectedStepIndex}
          selectedIndex={selectedStepIndex}
          tabItems={tebItems}
          rounded={props.roundedCorners}
          tabListClassName="h-[calc(100vh-285px)] overflow-auto"
          itemOption={{}}
          carouselOptions={{
            slidesPerView: 3
          }}
        />
      </div>
    </div>
  );
}

export default memo(WizardForm);

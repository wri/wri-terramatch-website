import React from 'react';
import PropTypes from 'prop-types';
import FormInput from '../formInput/FormInput';
import FORM_TYPES from '../formInput/FormInputTypes';
import VideoPreview from "../videoPreview/VideoPreview";
import { useTranslation } from 'react-i18next';
import { Button } from 'tsc-chameleon-component-library';

const FormElement = (props) => {
  const { field, errors, model, onFieldChange } = props;
  const { t } = useTranslation();

  const fieldErrors = errors[field.modelKey];

  switch (field.type) {
    case FORM_TYPES.seperator:
      return (<div className="c-form__seperator">
                <span className="u-text-uppercase u-text-bold c-form__seperator-label">
                  {t(field.label, field.labelOptions)}
                </span>
             </div>);
   case FORM_TYPES.button:
     return (<div className="u-margin-vertical-small">
              <Button click={(e) => field.onClick(e, props)} className={field.className}>
                {t(field.label, field.labelOptions)}
              </Button>
            </div>);
   case FORM_TYPES.textDescription:
     return (<div className="c-form__text-description u-margin-vertical-small">
               <span>
                 {t(field.text)}
               </span>
            </div>);
    case FORM_TYPES.videoPreview:
      return (<VideoPreview
          className="u-margin-vertical-small"
          subtext={t(field.label)}
          src={`${process.env.PUBLIC_URL}/video/${field.src}`}
          />
      );
    case 'newPassword':
    const repeatError = errors['repeat_password'];
    const repeatErrorMessage = repeatError ? t(`errors.repeat_password.${repeatError[0].code}`) : '';
      return (
        <div>
          <FormInput
            id={field.modelKey}
            label={t(field.label)}
            placeholder={t(field.label)}
            type={FORM_TYPES.password}
            onChange={(e) => onFieldChange(e, field)}
            value={model[field.modelKey]}
            autoComplete="new-password"
            required={field.required}
            errors={fieldErrors}
            showLabel={field.showLabel}
          />
          <FormInput
            id={`${field.modelKey}-repeat`}
            label={t('signup.repeatPassword')}
            placeholder={t('signup.repeatPassword')}
            type={FORM_TYPES.password}
            onChange={(e) => onFieldChange(e, {...field, modelKey: 'repeatPassword'})}
            value={model['repeatPassword']}
            autoComplete="new-password"
            required={field.required}
            errorText={repeatErrorMessage}
          />
        </div>
      );
    case FORM_TYPES.externalLink:
      return (<a href={field.link}
                 target="_blank"
                 rel="noopener noreferrer"
                 className="u-line-height-large u-link u-text-bold u-text-uppercase">
                  {t(field.label)}
              </a>)
    default:
      const hasSuccess = Boolean(field.uploadState && field.uploadState.lastSuccessTime && !field.uploadState.errors);
      return (<FormInput
        id={field.key ? field.key : field.modelKey}
        label={t(field.label, field.labelOptions)}
        helpLabel={t(field.help)}
        helpLink={field.helpLink}
        placeholder={field.placeholder ? t(field.placeholder) : t(field.label)}
        type={field.type}
        key={field.modelKey}
        onChange={(e) => onFieldChange(e, field)}
        value={field.valueFunc ? field.valueFunc(model) : model[field.modelKey]}
        defaultValue={field.defaultValue}
        required={field.requiredFunc ? field.requiredFunc(model) : field.required}
        errors={fieldErrors}
        shouldSplitError={field.shouldSplitError}
        showLabel={field.showLabel}
        asyncLabel={field.asyncLabel}
        asyncValue={field.asyncValue}
        resource={field.resource}
        responseIsString={field.responseIsString}
        data={field.data}
        accept={field.accept}
        fileName={field.fileName}
        success={hasSuccess}
        busy={field.uploadState && field.uploadState.isFetching}
        isSquare={field.isSquare}
        isGrid={field.isGrid}
        translate={field.translate}
        onKeyDown={field.onKeyDown}
        min={field.min}
        max={field.max}
        step={field.step}
        hasName={field.hasName}
        addMoreLabel={t(field.addMoreLabel)}
        fileNameLabel={t(field.nameLabel)}
        autoComplete={field.autocomplete}
        onAddItem={field.onAddItem}
        disabled={field.disabled}
        hidden={field.hiddenFunc ? field.hiddenFunc(model) : field.hidden}
        modelName={field.modelKey}
        isHtmlLabel={field.isHtmlLabel}
        isClearable={field.isClearable}
        filterData={field.filterData ? (item) => {
          return field.filterData(item, model);
        }: null}
        maxDate={field.maxDate}
        uploadMessage={field.uploadMessage}
        modelContext={model}
        className={field.className}
        maxLength={field.maxLength}
        unknownErrorKey={field.unknownErrorKey}
        sortAlphabetical={field.sortAlphabetical}
      />);
  }
}

FormElement.propTypes = {
  field: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  model: PropTypes.object.isRequired,
  onFieldChange: PropTypes.func
};

FormElement.defaultProps = {
  onFieldChange: () => {}
}

export default FormElement;

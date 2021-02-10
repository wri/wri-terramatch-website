import React, { useEffect, useState } from 'react';
import FormWalkthrough from '../../components/formWalkthrough/FormWalkthrough';
import { steps as createOrganisationSteps } from './createOrganisationSteps';
import { gaEvent, getRawResponseErrors } from '../../helpers';

export default (props) => {
  const { createOrganisation,
    createOrganisationState,
    uploadOrganisationAvatarState,
    uploadOrganisationCoverState,
    clearCreateOrganisation,
    dispatchMethod
  } = props;

  const [ steps, setSteps ] = useState(createOrganisationSteps);

  const createOrganisationSuccess = {
    title: 'createOrganisation.successTitle',
    text: 'createOrganisation.success',
    linkText: 'createOrganisation.successLinkText',
    link: '/addTeamMember',
    altLink: '/addDocumentAwards',
    altLinkText: 'common.skip'
  };

  const onFormSubmit = (model) => {
    clearCreateOrganisation()
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      for (let j = 0; j < step.fields.length; j++) {
        const field = step.fields[j];
        if (field.modelKey && !model[field.modelKey]) {
          model[field.modelKey] = null;
        }
      }
    }
    let modelCopy = {...model};

    modelCopy.avatar = uploadOrganisationAvatarState.data.id;
    modelCopy.cover_photo = uploadOrganisationCoverState.data.id;
    modelCopy.video = null;
    createOrganisation(modelCopy);
  };

  const [ errors, setErrors ] = useState([]);

  useEffect(() => {
    setSteps(s => {
      for (let i = 0; i < s.length; i++) {
        const step = s[i];
        for (let j = 0; j < step.fields.length; j++) {
          const field = step.fields[j];
          switch (field.modelKey) {
            case 'avatar':
              field.uploadState = uploadOrganisationAvatarState
              break;
            case 'cover_photo':
              field.uploadState = uploadOrganisationCoverState
              break;
            default:
              break;
          }
        }
      }
      return [...s];
    })
  }, [uploadOrganisationAvatarState, uploadOrganisationCoverState]);

  useEffect(() => {
    let newErrors = [];

    newErrors = [...newErrors, ...getRawResponseErrors(createOrganisationState)];

    newErrors = [...newErrors, ...getRawResponseErrors(uploadOrganisationAvatarState).map(error => {
      return {
        ...error,
        source: "avatar"
      }
    })];

    newErrors = [...newErrors, ...getRawResponseErrors(uploadOrganisationCoverState).map(error => {
      return {
        ...error,
        source: "cover_photo"
      }
    })];

    setErrors(newErrors);
  }, [ createOrganisationState,
       uploadOrganisationAvatarState,
       uploadOrganisationCoverState,
       setErrors
     ]);

  useEffect(() => {
    if (createOrganisationState.lastSuccessTime > 0) {
      gaEvent({
        category: 'Organisation creation',
        action: 'User completed'
      });
    }
  }, [createOrganisationState]);

  return (
    <section className="u-whole-page u-flex u-flex--centered u-flex--justify-centered">
      <FormWalkthrough
        modelName="OrganisationCreate"
        steps={steps}
        successOptions={createOrganisationSuccess}
        onSubmit={onFormSubmit}
        onValidate={() => {}}
        isFetching={createOrganisationState.isFetching}
        isSuccess={!!createOrganisationState.data}
        errors={errors}
        dispatchMethod={dispatchMethod}
        gaCategory='Organisation Creation'
      />
    </section>
  );
};

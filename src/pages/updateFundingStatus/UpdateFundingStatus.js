import React, { useState, useEffect } from 'react';
import FormWalkthrough from '../../components/formWalkthrough/FormWalkthrough';
import getSteps from './steps';
import UpdateSuccess from './Success';

const UpdateFundingStatus = (props) => {
  const {
    updatePitchVisibility,
    updatePitchVisibilityState,
    updateOfferVisibility,
    updateOfferVisibilityState,
    clearState,
    history
  } = props;

  const { id } = props.match.params;
  const isFunding = props.location.pathname.includes('funding');

  // passed via react-router-dom
  // saves another API call
  const defaultVisibility = props.location.visibility;

  const [ steps ] = useState(getSteps(isFunding, defaultVisibility));
  const [ isSuccess, setIsSuccess ] = useState(false);
  const [ showSuccess, setShowSuccess ] = useState(false);

  useEffect(() => {
    if (updatePitchVisibilityState.lastSuccessTime > 0 ||
        updateOfferVisibilityState.lastSuccessTime > 0) {
      clearState();
      setIsSuccess(true);
    }
  }, [updatePitchVisibilityState, updateOfferVisibilityState, clearState]);

  const onSubmit = (model) => {
    if (isFunding) {
      updateOfferVisibility(id, model.status);
    } else {
      updatePitchVisibility(id, model.status);
    }

    if (model.status === 'fully_invested_funded') {
      // show success after submit
      setShowSuccess(true);
    }
  };

  const returnLink = isFunding ? `/profile/funding/${id}` : `/profile/projects/${id}`;

  const updateInterestSuccess = {
    title: 'projectStatus.title',
    linkText: 'common.close',
    link: returnLink,
    noPage: !showSuccess,
    children: UpdateSuccess,
    childProps: {
      isFunding: isFunding
    }
  };

  return (
    <section className="u-whole-page u-flex u-flex--centered u-flex--justify-centered">
      <FormWalkthrough
        steps={steps}
        onSubmit={onSubmit}
        onCancel={() => history.push(returnLink)}
        isFetching={false}
        errors={[]}
        isSuccess={isSuccess}
        successOptions={updateInterestSuccess}
      />
    </section>
  );
};

export default UpdateFundingStatus;
